"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RefreshCw,
  CreditCard,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Product data
const product = {
  id: 2,
  name: "Calvin Klein Essential Tişört",
  description: "Calvin Klein minimal logolu, slim fit erkek tişört",
  fullDescription: "Bu Calvin Klein Essential tişört, modern ve minimalist tasarımıyla günlük şıklık arayanlar için ideal bir seçimdir. Göğüs kısmında klasik Calvin Klein logosu bulunan bu tişört, yüksek kaliteli pamuklu kumaşı ve slim fit kesimi ile vücuda mükemmel uyum sağlar. Dayanıklı yapısı ve solmayan renkleriyle uzun süre ilk günkü görünümünü korur. Farklı renkler ve bedenlerle her tarza ve vücut tipine uygun seçenekler sunar.",
  price: "₺299,00",
  originalPrice: "₺599,00",
  discount: "50%",
  images: [
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=1974&auto=format&fit=crop"
  ],
  brand: "calvin-klein",
  colors: ["Beyaz", "Siyah", "Gri"],
  sizes: ["S", "M", "L", "XL"],
  reviews: 36,
  rating: 4.7,
  stock: 24,
  specifications: [
    { name: "Kumaş", value: "%95 Pamuk %5 Elastan" },
    { name: "Yaka", value: "Yuvarlak Yaka" },
    { name: "Kol", value: "Kısa Kol" },
    { name: "Kalıp", value: "Slim Fit" },
    { name: "Renk", value: "Beyaz" },
    { name: "Yıkama", value: "30°C'de yıkanabilir" },
    { name: "Üretim", value: "Türkiye" }
  ]
};

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Beyaz");
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const addToCart = () => {
    try {
      // Get existing cart or initialize empty array
      let cartItems = [];
      if (typeof window !== 'undefined') {
        const existingCart = localStorage.getItem("cart");
        cartItems = existingCart ? JSON.parse(existingCart) : [];

        // Check if product is already in cart
        const existingItemIndex = cartItems.findIndex(item =>
          item.id === product.id && item.color === selectedColor && item.size === selectedSize
        );

        if (existingItemIndex >= 0) {
          // Update quantity if product already exists
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new product to cart
          cartItems.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: parseInt(product.price.replace(/[^\d]/g, '')),
            quantity: quantity,
            image: product.images[0],
            color: selectedColor,
            size: selectedSize
          });
        }

        // Save back to storage
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }

      // Show success message
      toast.success("Ürün sepete eklendi", {
        description: `${quantity} adet ${product.name} sepetinize eklendi.`,
        action: {
          label: "Sepete Git",
          onClick: () => window.location.href = "/sepet"
        }
      });
    } catch (error) {
      console.error("Cart operation failed:", error);
      toast.error("Sepete eklenirken bir hata oluştu");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success("Ürün favorilere eklendi");
    } else {
      toast.success("Ürün favorilerden çıkarıldı");
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      {/* Breadcrumb */}
      <div className="bg-gray-950 py-4 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-400">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/urunler" className="hover:text-white">Markalar</Link>
            <span className="mx-2">/</span>
            <Link href="/urunler/calvin-klein" className="hover:text-white">Calvin Klein</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg mb-4 border border-white/10">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.discount && (
                <Badge className="absolute top-4 right-4 bg-red-600 text-white">
                  -{product.discount}
                </Badge>
              )}
            </div>
            <div className="flex gap-4 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Görsel ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex justify-between items-start">
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
                  <span className="text-sm text-gray-400">
                    ({product.reviews} değerlendirme)
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/10 hover:bg-white/5"
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/10 hover:bg-white/5"
                >
                  <Share2 className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
            </div>

            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold mr-3">{product.price}</span>
              <span className="text-gray-400 text-lg line-through">{product.originalPrice}</span>
              <Badge className="ml-3 bg-red-600 text-white">
                {product.discount} İndirim
              </Badge>
            </div>

            <p className="text-gray-400 mb-6">
              {product.description}
            </p>

            <div className="space-y-6 mb-6">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium mb-3">Renk: <span className="text-white">{selectedColor}</span></h3>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        selectedColor === color ? "border-primary" : "border-white/20"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full border border-white/20 ${
                          color === "Beyaz" ? "bg-white" :
                          color === "Siyah" ? "bg-black" :
                          color === "Gri" ? "bg-gray-500" :
                          "bg-gray-200"
                        }`}
                      >
                        {selectedColor === color && (
                          <Check className={`h-4 w-4 ${color === "Beyaz" ? "text-black" : "text-white"}`} />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex justify-between mb-3">
                  <h3 className="text-sm font-medium">Beden: <span className="text-white">{selectedSize}</span></h3>
                  <button className="text-sm text-gray-400 hover:text-white underline">Beden Tablosu</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 rounded border text-sm font-medium ${
                        selectedSize === size
                          ? "border-primary bg-white/10"
                          : "border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium mb-3">Adet:</h3>
                <div className="flex items-center">
                  <button
                    className="w-10 h-10 border border-white/20 rounded-l flex items-center justify-center hover:bg-white/5"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className="w-12 h-10 border-t border-b border-white/20 flex items-center justify-center">
                    {quantity}
                  </div>
                  <button
                    className="w-10 h-10 border border-white/20 rounded-r flex items-center justify-center hover:bg-white/5"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                  <span className="ml-4 text-sm text-gray-400">
                    {product.stock} adet stokta
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Button
                className="flex-1 h-12 bg-white text-black hover:bg-white/90 glow-effect"
                onClick={addToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Sepete Ekle
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 border-white/20 hover:bg-white/5"
              >
                Hemen Satın Al
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="flex flex-col gap-3 p-4 bg-gray-950 rounded-lg border border-white/10">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">2-4 İş Günü İçinde Kargo</p>
                  <p className="text-xs text-gray-400">500 TL üzeri ücretsiz kargo</p>
                </div>
              </div>
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">30 Gün İçinde Ücretsiz İade</p>
                  <p className="text-xs text-gray-400">Kolayca iade edebilirsiniz</p>
                </div>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Güvenli Ödeme</p>
                  <p className="text-xs text-gray-400">Tüm kredi kartları desteklenmektedir</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-black border border-white/10">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Ürün Detayları
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Özellikler
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Değerlendirmeler
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="text-gray-400">
              <div className="prose prose-invert max-w-none">
                <p className="mb-4">{product.fullDescription}</p>
                <p>Calvin Klein, 1968 yılında Calvin Klein ve yakın arkadaşı Barry Schwartz tarafından kurulmuş Amerikalı moda evidir. Modern, minimalist tasarım anlayışı ve zamansız şıklığıyla tanınan Calvin Klein, günümüzde dünyanın en büyük moda markalarından biridir.</p>
              </div>
            </TabsContent>

            <TabsContent value="specs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-white/10 rounded-md">
                    <span className="font-medium">{spec.name}</span>
                    <span className="text-gray-400">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="text-center p-8">
                <h3 className="text-xl font-bold mb-2">Ürün Değerlendirmeleri</h3>
                <p className="text-gray-400">Bu ürün için toplam {product.reviews} değerlendirme bulunmaktadır.</p>
                <div className="flex justify-center items-center gap-1 my-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold">{product.rating}</span>
                </div>
                <Button className="mt-4">
                  Değerlendirme Yaz
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
