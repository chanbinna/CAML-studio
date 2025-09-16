// app/shop/products.ts
export type Category = "CERAMIC" | "WOOD" | "LACQUER" | "GLASS" | "ARTS & CRAFTS";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  category: Category;
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "product1",
    name: "Product 1",
    price: 131.5,
    image: "/product1.png",
    color: "Antique Silver",
    size: "Ø 10 h 8 (cm)",
    category: "CERAMIC",   
  },
  {
    id: "p2",
    slug: "product2",
    name: "Product 2",
    price: 132.0,
    image: "/product2.png",
    color: "Antique Silver",
    size: "Ø 10 h 8 (cm)",
    category: "WOOD",
  },
  {
    id: "p3",
    slug: "product3",
    name: "Product 3",
    price: 135.0,
    image: "/product3.png",
    color: "Antique Silver",
    size: "Ø 10 h 8 (cm)",
    category: "GLASS",
  },
  {
    id: "p4",
    slug: "product4",
    name: "Product 4",
    price: 136.0,
    image: "/product4.png",
    color: "Antique Silver",
    size: "Ø 10 h 8 (cm)",
    category: "LACQUER",
  },
  {
    id: "p5",
    slug: "product5",
    name: "Product 5",
    price: 133.0,
    image: "/product1.png",
    color: "Antique Silver",
    size: "Ø 10 h 8 (cm)",
    category: "ARTS & CRAFTS",
  },
  {
    id: "p6",
    slug: "product6",
    name: "Product 6",
    price: 136.0,
    image: "/product2.png",
    color: "Antique Silver",
    size: "Ø 10 h 8 (cm)",
    category: "CERAMIC",
  },
];