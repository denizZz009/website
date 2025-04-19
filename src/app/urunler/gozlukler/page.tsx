"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Sample products data for Gözlükler
const gozlukProducts = [
  {
    id: 301,
    name: "Ray-Ban Wayfarer Güneş Gözlüğü",
    description: "Ray-Ban ikonik Wayfarer model unisex güneş gözlüğü",
    price: "₺2.499,00",
    originalPrice: "₺3.499,00",
    discount: "29%",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1980&auto=format&fit=crop",
    brand: "gozlukler",
    isNew: false
  }
];

export default function GlassesPage() {
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden border-b border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2070&auto=format&fit=crop"
          alt="Gözlükler"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Gözlükler</h1>
          <p className="text-lg max-w-2xl">Premium markaların en şık güneş gözlükleri, özel fiyatlarla Galerizo'da</p>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-white/20 bg-black text-white hover:bg-white/10"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtreler
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            <Badge className="bg-blue-600">{gozlukProducts.length} Ürün</Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-sm mr-2 text-gray-400">Sırala:</span>
              <Select defaultValue={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px] bg-black border-white/20 text-white">
                  <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent className="bg-black border border-white/20 text-white">
                  <SelectItem value="featured">Öne Çıkanlar</SelectItem>
                  <SelectItem value="price-low">Fiyat (Düşükten Yükseğe)</SelectItem>
                  <SelectItem value="price-high">Fiyat (Yüksekten Düşüğe)</SelectItem>
                  <SelectItem value="newest">En Yeniler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 border border-white/10 rounded-md bg-black">
              <div>
                <h3 className="font-medium mb-2">Marka</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="brand-all" className="mr-2" />
                    <label htmlFor="brand-all" className="text-sm">Tümü</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="brand-rayban" className="mr-2" />
                    <label htmlFor="brand-rayban" className="text-sm">Ray-Ban</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="brand-gucci" className="mr-2" />
                    <label htmlFor="brand-gucci" className="text-sm">Gucci</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="brand-prada" className="mr-2" />
                    <label htmlFor="brand-prada" className="text-sm">Prada</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tür</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="type-all" className="mr-2" />
                    <label htmlFor="type-all" className="text-sm">Tümü</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="type-sunglasses" className="mr-2" />
                    <label htmlFor="type-sunglasses" className="text-sm">Güneş Gözlüğü</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="type-optical" className="mr-2" />
                    <label htmlFor="type-optical" className="text-sm">Optik Gözlük</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Çerçeve Şekli</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="frame-all" className="mr-2" />
                    <label htmlFor="frame-all" className="text-sm">Tümü</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="frame-rectangular" className="mr-2" />
                    <label htmlFor="frame-rectangular" className="text-sm">Dikdörtgen</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="frame-round" className="mr-2" />
                    <label htmlFor="frame-round" className="text-sm">Yuvarlak</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="frame-aviator" className="mr-2" />
                    <label htmlFor="frame-aviator" className="text-sm">Aviator</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="frame-wayfarer" className="mr-2" />
                    <label htmlFor="frame-wayfarer" className="text-sm">Wayfarer</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="price-0-1000" className="mr-2" />
                    <label htmlFor="price-0-1000" className="text-sm">0 - 1000 TL</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-1000-2000" className="mr-2" />
                    <label htmlFor="price-1000-2000" className="text-sm">1000 - 2000 TL</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-2000-3000" className="mr-2" />
                    <label htmlFor="price-2000-3000" className="text-sm">2000 - 3000 TL</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-3000+" className="mr-2" />
                    <label htmlFor="price-3000+" className="text-sm">3000 TL ve üzeri</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" className="mr-2 border-white/20 bg-black text-white hover:bg-white/10">
                Filtreleri Temizle
              </Button>
              <Button>
                Uygula
              </Button>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gozlukProducts.map((product) => (
            <Link key={product.id} href={`/urunler/${product.brand}/${product.id}`}>
              <div className="group border border-white/10 rounded-lg overflow-hidden bg-black hover:border-white/30 transition-all">
                <div className="relative h-[300px] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                      -{product.discount}
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
                      Yeni
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-1">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">{product.price}</span>
                      <span className="ml-2 text-sm text-gray-400 line-through">{product.originalPrice}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
