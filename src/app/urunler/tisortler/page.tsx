"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Filter, Tag, Search, SlidersHorizontal, ArrowUpDown, ShoppingCart, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { SizeSelector } from "@/components/ui/size-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";

const brands = [
  { name: "Tommy Hilfiger", href: "/urunler/tommy-hilfiger", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=320&auto=format&fit=crop" },
  { name: "Calvin Klein", href: "/urunler/calvin-klein", image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=320&auto=format&fit=crop" },
  { name: "EA7", href: "/urunler/ea7", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=320&auto=format&fit=crop" },
  { name: "Mavi", href: "/urunler/mavi", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=320&auto=format&fit=crop" },
  { name: "Columbia", href: "/urunler/columbia", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=320&auto=format&fit=crop" },
  { name: "Hermes", href: "/urunler/hermes", image: "https://images.unsplash.com/photo-1588099768523-f4e6a5300d5e?q=80&w=320&auto=format&fit=crop" },
];

// Fallback product list when API fails
const tshirts = [
  {
    id: 1,
    name: "Tommy Hilfiger Slim Fit",
    price: 799.90,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=400&auto=format&fit=crop",
    brand: "Tommy Hilfiger",
    href: "/urunler/tommy-hilfiger/1"
  },
  {
    id: 2,
    name: "Calvin Klein Logo Baskılı",
    price: 699.90,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop",
    brand: "Calvin Klein",
    href: "/urunler/calvin-klein/2"
  },
  {
    id: 3,
    name: "EA7 Spor Tişört",
    price: 899.90,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=400&auto=format&fit=crop",
    brand: "EA7",
    href: "/urunler/ea7"
  },
  {
    id: 4,
    name: "Mavi Basic Tişört",
    price: 299.90,
    image: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?q=80&w=400&auto=format&fit=crop",
    brand: "Mavi",
    href: "/urunler/mavi"
  },
  {
    id: 5,
    name: "Columbia Outdoor",
    price: 599.90,
    image: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?q=80&w=400&auto=format&fit=crop",
    brand: "Columbia",
    href: "/urunler/columbia"
  },
  {
    id: 6,
    name: "Hermes Lüks Tişört",
    price: 1999.90,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400&auto=format&fit=crop",
    brand: "Hermes",
    href: "/urunler/hermes"
  }
];

// Sort options
const sortOptions = [
  { id: "name_asc", name: "İsme Göre (A-Z)" },
  { id: "name_desc", name: "İsme Göre (Z-A)" },
  { id: "price_asc", name: "Fiyat (Artan)" },
  { id: "price_desc", name: "Fiyat (Azalan)" },
  { id: "newest", name: "En Yeniler" }
];

// Price range filter options
const priceRanges = [
  { id: "all", name: "Tümü" },
  { id: "0-300", name: "0₺ - 300₺" },
  { id: "300-500", name: "300₺ - 500₺" },
  { id: "500-1000", name: "500₺ - 1000₺" },
  { id: "1000+", name: "1000₺ ve üzeri" }
];

export default function TShirtsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>(tshirts);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("all");
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API first
        const response = await api.products.getAll();
        if (response.status === "success" && response.products) {
          // Filter only t-shirts here (or use a specific endpoint if available)
          const tshirtProducts = response.products.filter(p =>
            p.category_id === 1 || // Assuming category_id 1 is for t-shirts
            p.description?.toLowerCase().includes("tişört") ||
            p.name?.toLowerCase().includes("tişört")
          );
          setProducts(tshirtProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to static data
        setProducts(tshirts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting every time the dependencies change
  useEffect(() => {
    const getFilteredAndSortedProducts = () => {
      let filtered = [...products];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply brand filter
      if (filterBrands.length > 0) {
        filtered = filtered.filter(product =>
          filterBrands.includes(product.brand)
        );
      }

      // Apply price range filter
      if (priceRange !== "all") {
        if (priceRange === "1000+") {
          filtered = filtered.filter(product => parseFloat(product.price) >= 1000);
        } else {
          const [min, max] = priceRange.split("-").map(Number);
          filtered = filtered.filter(product =>
            parseFloat(product.price) >= min && parseFloat(product.price) <= max
          );
        }
      }

      // Apply sorting
      switch (sortBy) {
        case "name_asc":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name_desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "price_asc":
          filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case "price_desc":
          filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case "newest":
          // Assuming the ID represents newness (higher ID = newer)
          filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
      }

      return filtered;
    };

    setFilteredProducts(getFilteredAndSortedProducts());
  }, [products, searchTerm, filterBrands, priceRange, sortBy]);

  const toggleBrandFilter = (brand: string) => {
    setFilterBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const openSizeDialog = (product: any, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    setSelectedProduct(product);
    setSizeDialogOpen(true);
  };

  const addToCart = (product: any, size: string) => {
    let cart = [];
    try {
      const existingCart = localStorage.getItem('cart');
      if (existingCart) {
        cart = JSON.parse(existingCart);
      }

      const existingItemIndex = cart.findIndex((item: any) =>
        item.id === product.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
        toast.success(`${product.name} (${size}) sepetinizde güncellendi (${cart[existingItemIndex].quantity} adet)`, {
          duration: 1500
        });
      } else {
        cart.push({
          ...product,
          size: size,
          quantity: 1
        });
        toast.success(`${product.name} (${size}) sepete eklendi`, {
          duration: 1500
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      document.dispatchEvent(new Event('cartUpdated'));

    } catch (error) {
      console.error('Sepete eklerken hata oluştu:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-20 pb-6 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/urunler" className="hover:text-white">Ürünler</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">Tişörtler</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Tişörtler</h1>
          <p className="text-gray-400 mt-2">Marka ve stil seçenekleriyle şık tişört koleksiyonumuz</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tişört veya marka ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-white/20 text-white"
            />
          </div>
          <div className="flex space-x-2">
            <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrele
                  {(filterBrands.length > 0 || priceRange !== "all") && (
                    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {filterBrands.length + (priceRange !== "all" ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border border-white/20 text-white p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Markalar</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div
                        key={brand.name}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                        onClick={() => toggleBrandFilter(brand.name)}
                      >
                        <div className={`w-4 h-4 border ${filterBrands.includes(brand.name) ? 'bg-primary border-primary' : 'border-gray-500'} flex items-center justify-center rounded-sm`}>
                          {filterBrands.includes(brand.name) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span>{brand.name}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/10" />

                  <h3 className="font-medium">Fiyat Aralığı</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <div
                        key={range.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                        onClick={() => setPriceRange(range.id)}
                      >
                        <div className={`w-4 h-4 rounded-full border ${priceRange === range.id ? 'border-primary' : 'border-gray-500'} flex items-center justify-center`}>
                          {priceRange === range.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <span>{range.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        setFilterBrands([]);
                        setPriceRange("all");
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Temizle
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-white/90"
                      onClick={() => setFilterPopoverOpen(false)}
                    >
                      Uygula
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sırala
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black border border-white/20 text-white">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    className={`cursor-pointer ${sortBy === option.id ? 'bg-white/10' : ''}`}
                    onClick={() => setSortBy(option.id)}
                  >
                    {option.name}
                    {sortBy === option.id && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Popüler Tişört Markaları</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand, index) => (
              <Link key={brand.name} href={brand.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative h-40 overflow-hidden rounded-lg border border-white/10 group"
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-medium">{brand.name}</h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10 my-8" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {searchTerm || filterBrands.length > 0 || priceRange !== "all"
                ? "Filtrelenmiş Ürünler"
                : "Öne Çıkan Tişörtler"}
            </h2>
            <p className="text-sm text-gray-400">{filteredProducts.length} ürün</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-white/10 rounded-lg">
              <Search className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Ürün Bulunamadı</h3>
              <p className="text-gray-400 mb-4">Arama kriterlerine uygun ürün bulunamadı.</p>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  setSearchTerm("");
                  setFilterBrands([]);
                  setPriceRange("all");
                }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-black border border-white/10 rounded-lg overflow-hidden group hover:shadow-lg"
                  onClick={(e) => openSizeDialog(product, e)}
                >
                  <div className="relative h-64 overflow-hidden cursor-pointer">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="default"
                        className="bg-white text-black hover:bg-white/90"
                        onClick={(e) => openSizeDialog(product, e)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Sepete Ekle
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-white">{product.name}</h3>
                        <p className="text-sm text-gray-400">{product.brand}</p>
                      </div>
                      <span className="font-bold text-white">₺{product.price.toLocaleString('tr-TR')}</span>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <Button
                        className="flex-1 bg-white text-black hover:bg-white/90"
                        onClick={(e) => openSizeDialog(product, e)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Sepete Ekle
                      </Button>
                      <Link href={product.href} onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" className="ml-2 border-white/20 hover:bg-white/10">
                          <Tag className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SizeSelector
        isOpen={sizeDialogOpen}
        onClose={() => setSizeDialogOpen(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
      />
    </div>
  );
}
