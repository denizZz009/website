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

// Sample products data for Parfümler
const parfumProducts = [
  {
    id: 101,
    name: "CK One Unisex Parfüm",
    description: "Calvin Klein'ın efsanevi unisex parfümü, 100ml EDT",
    price: "₺1.299,00",
    originalPrice: "₺2.199,00",
    discount: "41%",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2080&auto=format&fit=crop",
    brand: "calvin-klein",
    isNew: false,
    sizes: ["50ml", "100ml", "200ml"]
  },
  {
    id: 102,
    name: "Terre d'Hermès Parfüm",
    description: "Hermes'in çarpıcı erkek parfümü, 75ml EDP",
    price: "₺3.499,00",
    originalPrice: "₺4.899,00",
    discount: "29%",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1972&auto=format&fit=crop",
    brand: "hermes",
    isNew: true,
    sizes: ["75ml", "125ml"]
  }
];

export default function PerfumesPage() {
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden border-b border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1615634260168-859d242dcb65?q=80&w=2070&auto=format&fit=crop"
          alt="Parfümler"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Parfümler</h1>
          <p className="text-lg max-w-2xl">Premium markaların en etkileyici kokuları, özel fiyatlarla Galerizo'da</p>
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
            <Badge className="bg-blue-600">{parfumProducts.length} Ürün</Badge>
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
                    <input type="checkbox" id="brand-calvin-klein" className="mr-2" />
                    <label htmlFor="brand-calvin-klein" className="text-sm">Calvin Klein</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="brand-hermes" className="mr-2" />
                    <label htmlFor="brand-hermes" className="text-sm">Hermes</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Cinsiyet</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="gender-all" className="mr-2" />
                    <label htmlFor="gender-all" className="text-sm">Tümü</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="gender-erkek" className="mr-2" />
                    <label htmlFor="gender-erkek" className="text-sm">Erkek</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="gender-kadin" className="mr-2" />
                    <label htmlFor="gender-kadin" className="text-sm">Kadın</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="gender-unisex" className="mr-2" />
                    <label htmlFor="gender-unisex" className="text-sm">Unisex</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Boyut</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="size-50ml" className="mr-2" />
                    <label htmlFor="size-50ml" className="text-sm">50ml</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="size-75ml" className="mr-2" />
                    <label htmlFor="size-75ml" className="text-sm">75ml</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="size-100ml" className="mr-2" />
                    <label htmlFor="size-100ml" className="text-sm">100ml</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="size-125ml" className="mr-2" />
                    <label htmlFor="size-125ml" className="text-sm">125ml</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="size-200ml" className="mr-2" />
                    <label htmlFor="size-200ml" className="text-sm">200ml</label>
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
          {parfumProducts.map((product) => (
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
