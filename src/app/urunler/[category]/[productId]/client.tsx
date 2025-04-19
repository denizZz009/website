"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Minus,
  FileText,
  Truck,
  Star,
  ShoppingCart,
  PenSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

type ProductDetailClientProps = {
  product: Product;
  category: string;
};

export default function ProductDetailClient({ product, category }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Handle quantity changes
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <Link href={`/urunler/${category}`} className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Baskı Malzemeleri
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badges && product.badges.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                  {product.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary text-white">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                    index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                  } cursor-pointer`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Görsel ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} değerlendirme)
              </span>
            </div>

            <div className="text-2xl font-bold mb-4">
              {product.price}
            </div>

            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="mr-4">
                  <span className="block text-sm font-medium mb-1">Miktar:</span>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={incrementQuantity}
                      disabled={product.stock <= quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium mb-1">Stok Durumu:</span>
                  <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                    {product.stock > 0 ? `Stokta (${product.stock})` : "Tükendi"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button className="flex-1 h-12" onClick={() => window.alert("Ürün sepete eklendi!")}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Sepete Ekle
                </Button>
                <Link href="/tasarla" className="flex-1">
                  <Button variant="outline" className="w-full h-12">
                    <PenSquare className="mr-2 h-5 w-5" />
                    Tasarım Oluştur
                  </Button>
                </Link>
              </div>

              <div className="flex items-center text-sm text-muted-foreground gap-4">
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>2-4 Gün İçinde Kargo</span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Fatura Dahil</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product description with tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Ürün Açıklaması</TabsTrigger>
              <TabsTrigger value="specifications">Teknik Özellikler</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                {product.fullDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="pt-6">
              <div className="grid gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-2 py-2 border-b">
                    <span className="font-medium">{spec.name}</span>
                    <span>{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
