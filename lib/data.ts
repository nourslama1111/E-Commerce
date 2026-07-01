import type { Product } from "@/models/types";

export const products: Product[] = [
  // Apparel
  {
    id: "1",
    name: "Classic Tee",
    description: "Everyday essential in 100% organic cotton. Relaxed fit, pre-washed for softness.",
    price: 29.99,
    image: "",
    category: "Apparel",
    inStock: true,
    rating: 4.6,
    reviewCount: 214,
  },
  {
    id: "2",
    name: "Wool Sweater",
    description: "Mid-weight merino wool. Warm without bulk — ideal for layering.",
    price: 89.99,
    image: "",
    category: "Apparel",
    inStock: true,
    rating: 4.8,
    reviewCount: 93,
  },
  {
    id: "3",
    name: "Linen Shirt",
    description: "Breathable Belgian linen with a slightly oversized cut. Stone-washed finish.",
    price: 64.99,
    image: "",
    category: "Apparel",
    inStock: false,
    rating: 4.4,
    reviewCount: 57,
  },
  // Accessories
  {
    id: "4",
    name: "Leather Wallet",
    description: "Full-grain vegetable-tanned leather. Slim profile, holds up to 8 cards.",
    price: 59.99,
    image: "",
    category: "Accessories",
    inStock: true,
    rating: 4.7,
    reviewCount: 182,
  },
  {
    id: "5",
    name: "Minimalist Watch",
    description: "36mm brushed steel case, sapphire crystal glass, Japanese quartz movement.",
    price: 149.99,
    image: "",
    category: "Accessories",
    inStock: true,
    rating: 4.9,
    reviewCount: 310,
  },
  {
    id: "6",
    name: "Polarized Sunglasses",
    description: "Acetate frames with scratch-resistant polarized lenses. UV400 protection.",
    price: 74.99,
    image: "",
    category: "Accessories",
    inStock: true,
    rating: 4.3,
    reviewCount: 67,
  },
  // Bags
  {
    id: "7",
    name: "Canvas Tote",
    description: "12oz heavyweight canvas. Reinforced handles and an interior zip pocket.",
    price: 44.99,
    image: "",
    category: "Bags",
    inStock: false,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    id: "8",
    name: "Leather Backpack",
    description: "Full-grain leather with padded 15\" laptop sleeve and antique brass hardware.",
    price: 229.99,
    image: "",
    category: "Bags",
    inStock: true,
    rating: 4.8,
    reviewCount: 76,
  },
  {
    id: "9",
    name: "Waxed Duffel",
    description: "Water-resistant waxed canvas with leather trim. 40L capacity.",
    price: 159.99,
    image: "",
    category: "Bags",
    inStock: true,
    rating: 4.6,
    reviewCount: 44,
  },
  // Home
  {
    id: "10",
    name: "Ceramic Mug",
    description: "Hand-thrown stoneware, 12oz. Dishwasher safe. Each piece slightly unique.",
    price: 24.99,
    image: "",
    category: "Home",
    inStock: true,
    rating: 4.7,
    reviewCount: 203,
  },
  {
    id: "11",
    name: "Merino Throw",
    description: "100% merino wool, 130×180cm. Naturally temperature-regulating.",
    price: 119.99,
    image: "",
    category: "Home",
    inStock: true,
    rating: 4.9,
    reviewCount: 88,
  },
  {
    id: "12",
    name: "Soy Candle Set",
    description: "Set of 3 hand-poured soy candles. 40-hour burn time each, subtle botanical scents.",
    price: 39.99,
    image: "",
    category: "Home",
    inStock: false,
    rating: 4.5,
    reviewCount: 156,
  },
];

export const categories = ["Apparel", "Accessories", "Bags", "Home"] as const;
export type CategoryName = (typeof categories)[number];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(count = 3): Product[] {
  return products.filter((p) => p.inStock).slice(0, count);
}
