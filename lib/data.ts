// Seed data only — not used at runtime after seeding.

export const seedCategories = [
  { name: "Apparel",     slug: "apparel",     description: "Clothing and wearables for every occasion." },
  { name: "Accessories", slug: "accessories", description: "Finish any look with the right accessory." },
  { name: "Bags",        slug: "bags",        description: "Carry everything in style." },
  { name: "Home",        slug: "home",        description: "Elevate your living space." },
];

// categoryName is resolved to a real categoryId at seed time.
export const seedProducts = [
  // Apparel
  {
    name: "Classic Tee",
    description: "Everyday essential in 100% organic cotton. Relaxed fit, pre-washed for softness.",
    price: 29.99,
    image: "https://picsum.photos/seed/classic-tee/600/600",
    categoryName: "Apparel",
    inStock: true,
  },
  {
    name: "Wool Sweater",
    description: "Mid-weight merino wool. Warm without bulk — ideal for layering.",
    price: 89.99,
    image: "https://picsum.photos/seed/wool-sweater/600/600",
    categoryName: "Apparel",
    inStock: true,
  },
  {
    name: "Linen Shirt",
    description: "Breathable Belgian linen with a slightly oversized cut. Stone-washed finish.",
    price: 64.99,
    image: "https://picsum.photos/seed/linen-shirt/600/600",
    categoryName: "Apparel",
    inStock: false,
  },
  // Accessories
  {
    name: "Leather Wallet",
    description: "Full-grain vegetable-tanned leather. Slim profile, holds up to 8 cards.",
    price: 59.99,
    image: "https://picsum.photos/seed/leather-wallet/600/600",
    categoryName: "Accessories",
    inStock: true,
  },
  {
    name: "Minimalist Watch",
    description: "36mm brushed steel case, sapphire crystal glass, Japanese quartz movement.",
    price: 149.99,
    image: "https://picsum.photos/seed/minimalist-watch/600/600",
    categoryName: "Accessories",
    inStock: true,
  },
  {
    name: "Polarized Sunglasses",
    description: "Acetate frames with scratch-resistant polarized lenses. UV400 protection.",
    price: 74.99,
    image: "https://picsum.photos/seed/polarized-sunglasses/600/600",
    categoryName: "Accessories",
    inStock: true,
  },
  // Bags
  {
    name: "Canvas Tote",
    description: "12oz heavyweight canvas. Reinforced handles and an interior zip pocket.",
    price: 44.99,
    image: "https://picsum.photos/seed/canvas-tote/600/600",
    categoryName: "Bags",
    inStock: false,
  },
  {
    name: "Leather Backpack",
    description: "Full-grain leather with padded 15\" laptop sleeve and antique brass hardware.",
    price: 229.99,
    image: "https://picsum.photos/seed/leather-backpack/600/600",
    categoryName: "Bags",
    inStock: true,
  },
  {
    name: "Waxed Duffel",
    description: "Water-resistant waxed canvas with leather trim. 40L capacity.",
    price: 159.99,
    image: "https://picsum.photos/seed/waxed-duffel/600/600",
    categoryName: "Bags",
    inStock: true,
  },
  // Home
  {
    name: "Ceramic Mug",
    description: "Hand-thrown stoneware, 12oz. Dishwasher safe. Each piece slightly unique.",
    price: 24.99,
    image: "https://picsum.photos/seed/ceramic-mug/600/600",
    categoryName: "Home",
    inStock: true,
  },
  {
    name: "Merino Throw",
    description: "100% merino wool, 130×180cm. Naturally temperature-regulating.",
    price: 119.99,
    image: "https://picsum.photos/seed/merino-throw/600/600",
    categoryName: "Home",
    inStock: true,
  },
  {
    name: "Soy Candle Set",
    description: "Set of 3 hand-poured soy candles. 40-hour burn time each, subtle botanical scents.",
    price: 39.99,
    image: "https://picsum.photos/seed/soy-candle-set/600/600",
    categoryName: "Home",
    inStock: false,
  },
];
