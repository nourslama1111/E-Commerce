import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Required when self-hosting (not on Vercel, where it's auto-detected).
  trustHost: true,
  // Credentials logins can't be tracked as database sessions (Auth.js only
  // persists sessions for providers it can verify itself), so the session
  // is a signed JWT instead. The Prisma adapter above still owns the User
  // table and would take over Session/Account storage if an OAuth
  // provider is added later.
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user?.password) return null;

        const valid = await verifyPassword(password, user.password);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // The JWT type augmentation in next-auth.d.ts doesn't get picked up
      // by this callback's inferred param type (a known Auth.js v5 beta
      // typing gap), so the custom fields we stashed in the jwt() callback
      // below come through as `unknown` here.
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
  },
});
