"use client";

import ProductDetailClient from "./client";

type Product = {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  price: string;
  pricePerSheet?: string;
  sheets?: string;
  images: string[];
  category: string;
  badges?: string[];
  stock: number;
  reviews: number;
  rating: number;
  specifications: Array<{ name: string; value: string }>;
  relatedProducts?: number[];
};

type ProductDetailViewProps = {
  product: Product;
  category: string;
};

export default function ProductDetailView(props: ProductDetailViewProps) {
  return <ProductDetailClient {...props} />;
}
