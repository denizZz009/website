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

// Sample products data for Calvin Klein
const calvinKleinProducts = [
  {
    id: 2,
    name: "Calvin Klein Essential Tişört",
    description: "Calvin Klein minimal logolu, slim fit erkek tişört",
    price: "₺299,00",
    originalPrice: "₺599,00",
    discount: "50%",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop",
    brand: "calvin-klein",
    colors: ["Beyaz", "Siyah", "Gri"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 8,
    name: "Calvin Klein Jeans Logolu Tişört",
    description: "Calvin Klein Jeans logolu, rahat kesim unisex tişört",
    price: "₺329,00",
    originalPrice: "₺649,00",
    discount: "49%",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1974&auto=format&fit=crop",
    brand: "calvin-klein",
    isNew: true,
    colors: ["Beyaz", "Siyah", "Mavi"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 21,
    name: "Calvin Klein Modern Fit Tişört",
    description: "Calvin Klein modern fit, pamuklu erkek tişört",
    price: "₺319,00",
    originalPrice: "₺629,00",
    discount: "49%",
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=1974&auto=format&fit=crop",
    brand: "calvin-klein",
    colors: ["Siyah", "Beyaz", "Lacivert"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 22,
    name: "Calvin Klein Kadın Crop Tişört",
    description: "Calvin Klein crop kesim, logolu kadın tişört",
    price: "₺279,00",
    originalPrice: "₺579,00",
    discount: "52%",
    image: "https://images.unsplash.com/photo-1578966857993-e8bbae501d7a?q=80&w=1974&auto=format&fit=crop",
    brand: "calvin-klein",
    isNew: true,
    colors: ["Beyaz", "Siyah", "Pembe"],
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 23,
    name: "Calvin Klein Performance Tişört",
    description: "Calvin Klein performans serisi, spor tişört",
    price: "₺369,00",
    originalPrice: "₺699,00",
    discount: "47%",
    image: "https://images.unsplash.com/photo-1564379447452-811195b638de?q=80&w=1974&auto=format&fit=crop",
    brand: "calvin-klein",
    colors: ["Siyah", "Gri", "Mavi"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 24,
    name: "Calvin Klein Classic Polo Tişört",
    description: "Calvin Klein klasik polo yaka erkek tişört",
    price: "₺399,00",
    originalPrice: "₺799,00",
    discount: "50%",
    image: "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=1974&auto=format&fit=crop",
    brand: "calvin-klein",
    colors: ["Siyah", "Beyaz", "Lacivert", "Kırmızı"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
];

export default function CalvinKleinPage() {
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden border-b border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2070&auto=format&fit=crop"
          alt="Calvin Klein Collection"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Calvin Klein</h1>
          <p className="text-lg max-w-2xl">Minimalist tasarım ve modern şıklığın simgesi, uygun fiyatlarla Galerizo'da</p>
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
            <Badge className="bg-blue-600">6 Ürün</Badge>
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
                <h3 className="font-medium mb-2">Kategori</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="category-all" className="mr-2" />
                    <label htmlFor="category-all" className="text-sm">Tümü</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="category-basic" className="mr-2" />
                    <label htmlFor="category-basic" className="text-sm">Basic Tişörtler</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="category-polo" className="mr-2" />
                    <label htmlFor="category-polo" className="text-sm">Polo Yakalar</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="category-crop" className="mr-2" />
                    <label htmlFor="category-crop" className="text-sm">Crop Tişörtler</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Renk</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="color-white" className="mr-2" />
                    <label htmlFor="color-white" className="text-sm">Beyaz</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="color-black" className="mr-2" />
                    <label htmlFor="color-black" className="text-sm">Siyah</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="color-grey" className="mr-2" />
                    <label htmlFor="color-grey" className="text-sm">Gri</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="color-navy" className="mr-2" />
                    <label htmlFor="color-navy" className="text-sm">Lacivert</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Beden</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="size-xs" className="mr-2" />
                    <label htmlFor="size-xs" className="text-sm">XS</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="size-s" className="mr-2" />
                    <label htmlFor="size-s" className="text-sm">S</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="size-m" className="mr-2" />
                    <label htmlFor="size-m" className="text-sm">M</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="size-l" className="mr-2" />
                    <label htmlFor="size-l" className="text-sm">L</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="size-xl" className="mr-2" />
                    <label htmlFor="size-xl" className="text-sm">XL</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="price-0-300" className="mr-2" />
                    <label htmlFor="price-0-300" className="text-sm">0 - 300 TL</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-300-400" className="mr-2" />
                    <label htmlFor="price-300-400" className="text-sm">300 - 400 TL</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-400-500" className="mr-2" />
                    <label htmlFor="price-400-500" className="text-sm">400 - 500 TL</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="price-500+" className="mr-2" />
                    <label htmlFor="price-500+" className="text-sm">500 TL ve üzeri</label>
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
          {calvinKleinProducts.map((product) => (
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
