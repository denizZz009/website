"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { SizeSelector } from "@/components/ui/size-selector";

const brandTshirts = [
  {
    id: 1,
    name: "Tommy Hilfiger Logo Tişört",
    description: "Tommy Hilfiger logolu, %100 pamuklu premium erkek tişört",
    price: "₺349,00",
    originalPrice: "₺749,00",
    discount: "53%",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop",
    brand: "tommy-hilfiger",
    isNew: true,
  },
  {
    id: 2,
    name: "Calvin Klein Essential Tişört",
    description: "Calvin Klein minimal logolu, slim fit erkek tişört",
    price: "₺299,00",
    originalPrice: "₺599,00",
    discount: "50%",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop",
    brand: "calvin-klein",
  },
  {
    id: 3,
    name: "EA7 Emporio Armani Logolu Tişört",
    description: "EA7 logolu, spor ve günlük kullanıma uygun premium tişört",
    price: "₺599,00",
    originalPrice: "₺1.199,00",
    discount: "50%",
    image: "https://images.unsplash.com/photo-1627910016961-ee310ef0231c?q=80&w=1976&auto=format&fit=crop",
    brand: "ea7",
    isNew: true,
  },
  {
    id: 4,
    name: "Mavi Jeans Basic Tişört",
    description: "Mavi Jeans imzalı, yüksek kaliteli pamuklu basic tişört",
    price: "₺199,00",
    originalPrice: "₺399,00",
    discount: "50%",
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=1974&auto=format&fit=crop",
    brand: "mavi",
  },
];

const newArrivals = [
  {
    id: 5,
    name: "Columbia Outdoor Tişört",
    description: "Columbia imzalı, outdoor aktiviteler için tasarlanmış nefes alabilen tişört",
    price: "₺499,00",
    originalPrice: "₺899,00",
    discount: "44%",
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1969&auto=format&fit=crop",
    brand: "columbia",
    isNew: true,
  },
  {
    id: 6,
    name: "Hermes Premium Tişört",
    description: "Hermes imzalı, lüks detaylara sahip pamuklu erkek tişört",
    price: "₺899,00",
    originalPrice: "₺1.899,00",
    discount: "53%",
    image: "https://images.unsplash.com/photo-1593726826726-0ff29138438d?q=80&w=1974&auto=format&fit=crop",
    brand: "hermes",
    isNew: true,
  },
  {
    id: 7,
    name: "Tommy Hilfiger Bayrağı Tişört",
    description: "Tommy Hilfiger bayrak logolu, slim fit erkek tişört",
    price: "₺399,00",
    originalPrice: "₺849,00",
    discount: "53%",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop",
    brand: "tommy-hilfiger",
    isNew: true,
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
  },
];

export default function FeaturedProducts() {
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Beden seçimi için dialog aç
  const openSizeDialog = (product, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    setSelectedProduct(product);
    setSizeDialogOpen(true);
  };

  // Sepete ekleme fonksiyonu
  const addToCart = (product, size) => {
    // Fiyatı sayısal değere çevirme
    const priceText = product.price.replace("₺", "").replace(".", "").replace(",", ".");
    const price = parseFloat(priceText);

    // Sepet verisini localStorage'dan al
    let cart = [];
    try {
      const existingCart = localStorage.getItem('cart');
      if (existingCart) {
        cart = JSON.parse(existingCart);
      }

      // Ürün nesnesi oluştur
      const cartItem = {
        id: product.id,
        name: product.name,
        price: price,
        image: product.image,
        size: size,  // Beden bilgisini ekle
        quantity: 1
      };

      // Ürün zaten sepette mi kontrol et (aynı ürün ve aynı beden)
      const existingItemIndex = cart.findIndex(item =>
        item.id === product.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        // Ürün zaten sepette, miktarını artır
        cart[existingItemIndex].quantity += 1;
        toast.success(`${product.name} (${size}) sepetinizde güncellendi`);
      } else {
        // Yeni ürün, sepete ekle
        cart.push(cartItem);
        toast.success(`${product.name} (${size}) sepete eklendi`);
      }

      // Güncellenmiş sepeti localStorage'a kaydet
      localStorage.setItem('cart', JSON.stringify(cart));

      // Custom event trigger
      document.dispatchEvent(new Event('cartUpdated'));

    } catch (error) {
      console.error('Sepete eklerken hata oluştu:', error);
      toast.error('Sepete eklenirken bir hata oluştu');
    }
  };

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Premium Tişörtler
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Tommy Hilfiger, Calvin Klein, EA7 ve daha fazla dünyaca ünlü markaların orijinal tişörtleri uygun fiyatlarla Galerizo'da.
          </motion.p>
        </div>

        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-10 grid-cols-2 bg-black/40 border border-white/10">
            <TabsTrigger value="popular" className="data-[state=active]:bg-black data-[state=active]:text-white">Popüler Markalar</TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-black data-[state=active]:text-white">Yeni Gelenler</TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {brandTshirts.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow bg-black border border-white/10 text-white">
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
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
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{product.name}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-400">{product.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg text-white">{product.price}</div>
                        <div className="text-sm text-gray-400 line-through">{product.originalPrice}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-white text-black hover:bg-white/90"
                          onClick={(e) => openSizeDialog(product, e)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Sepete Ekle
                        </Button>
                        <Link href={`/urunler/${product.brand}/${product.id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-white/20 bg-black text-white hover:bg-white/10 h-9 w-9"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-12 text-center">
              <Link href="/urunler">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  Tüm Markaları Keşfet
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="new">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {newArrivals.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow bg-black border border-white/10 text-white">
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
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
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{product.name}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-400">{product.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg text-white">{product.price}</div>
                        <div className="text-sm text-gray-400 line-through">{product.originalPrice}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-white text-black hover:bg-white/90"
                          onClick={(e) => openSizeDialog(product, e)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Sepete Ekle
                        </Button>
                        <Link href={`/urunler/${product.brand}/${product.id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-white/20 bg-black text-white hover:bg-white/10 h-9 w-9"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-12 text-center">
              <Link href="/yeni-gelenler">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  Tüm Yeni Gelenler
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Beden Seçimi Dialog */}
      <SizeSelector
        isOpen={sizeDialogOpen}
        onClose={() => setSizeDialogOpen(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
      />
    </section>
  );
}
