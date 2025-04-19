"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  RefreshCw,
  PenSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Initial empty cart
const initialCartItems = [];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Get cart data from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Toplam tutarı hesapla
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 30; // 500 TL ve üzeri siparişlerde ücretsiz kargo
  const total = subtotal - discount + shipping;

  // Toplam ürün sayısını hesapla
  const totalItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Ürün miktarını değiştir
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);

    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      // Özel cartUpdated olayını tetikle
      document.dispatchEvent(new Event('cartUpdated'));
    }
  };

  // Ürünü sepetten kaldır
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);

    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      // Özel cartUpdated olayını tetikle
      document.dispatchEvent(new Event('cartUpdated'));
    }

    toast.success("Ürün sepetten kaldırıldı");
  };

  // Kupon kodu uygula
  const applyCoupon = () => {
    setIsApplyingCoupon(true);

    // Kupon kodu kontrolü simülasyonu
    setTimeout(() => {
      if (couponCode.toUpperCase() === "INDIRIM10") {
        const discountAmount = Math.round(subtotal * 0.1); // %10 indirim
        setDiscount(discountAmount);
        toast.success("İndirim kuponu uygulandı");
      } else {
        toast.error("Geçersiz kupon kodu");
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  // Sepet boşsa
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="p-4 mb-6">
            <ShoppingCart className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-white">Sepetiniz Boş</h1>
            <p className="text-gray-400 mb-8">
              Sepetinizde henüz ürün bulunmuyor. Ürün keşfetmeye başlayarak alışverişe başlayabilirsiniz.
            </p>
            <div className="flex justify-center">
              <Link href="/urunler">
                <Button className="w-full bg-white text-black hover:bg-white/90">
                  Ürünleri Keşfet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-black border-b border-white/10 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Alışveriş Sepeti</h1>
          <p className="text-gray-400">
            {cartItems.length} çeşit, toplam {totalItemCount} ürün
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sepet Ürünleri */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col sm:flex-row gap-4 bg-black p-4 rounded-lg border border-white/10"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <h3 className="font-medium text-white truncate">{item.name}</h3>
                      <div className="font-bold text-white">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        {item.size && (
                          <span className="text-sm text-gray-400 mr-3">
                            Beden: <span className="text-white">{item.size}</span>
                          </span>
                        )}
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-white/20 bg-black text-white hover:bg-white/10"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center text-white">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-white/20 bg-black text-white hover:bg-white/10"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isCustomDesign && (
                          <Link href="/tasarla">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-white/20 bg-black text-white hover:bg-white/10"
                            >
                              <PenSquare className="h-3 w-3 mr-2" />
                              Düzenle
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-white hover:text-white hover:bg-white/10"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Kaldır
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/urunler" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-black text-white hover:bg-white/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Alışverişe Devam Et
                </Button>
              </Link>
              {/* "Tasarım Oluştur" butonu kaldırıldı */}
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div>
            <div className="bg-black p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-4 text-white">Sipariş Özeti</h2>

              {/* Sepetteki ürünlerin özeti */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-300 truncate">
                      {item.name}
                      {item.size && <span className="text-gray-400"> - {item.size}</span>}
                      <span className="text-gray-400 ml-1">x{item.quantity}</span>
                    </span>
                    <span className="text-white ml-2 whitespace-nowrap">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ara Toplam</span>
                  <span className="text-white">₺{subtotal.toLocaleString('tr-TR')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-white">
                    <span>İndirim</span>
                    <span>-₺{discount.toLocaleString('tr-TR')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Kargo</span>
                  <span className="text-white">{shipping === 0 ? "Ücretsiz" : `₺${shipping.toLocaleString('tr-TR')}`}</span>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex justify-between font-bold text-lg text-white">
                  <span>Toplam</span>
                  <span>₺{total.toLocaleString('tr-TR')}</span>
                </div>
              </div>

              {/* Kupon Kodu */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-white">İndirim Kuponu</h3>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Kupon kodu girin"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-black border-white/20 text-white placeholder:text-gray-500 focus:border-white/50"
                  />
                  <Button
                    variant="outline"
                    onClick={applyCoupon}
                    disabled={isApplyingCoupon || !couponCode}
                    className="border-white/20 bg-black text-white hover:bg-white/10"
                  >
                    Uygula
                  </Button>
                </div>
              </div>

              {/* Ödeme Butonu - Simple HTML link for maximum compatibility */}
              <a
                href="/odeme"
                className="w-full bg-white text-black hover:bg-white/90 p-3 rounded-md flex items-center justify-center font-medium no-underline block"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Ödeme Sayfasına Git
              </a>

              {/* Güvenlik Bilgisi */}
              <div className="mt-4 text-sm text-gray-400 text-center">
                <p>Tüm ödemeler güvenli SSL bağlantısı ile gerçekleştirilir.</p>
                <p className="mt-2">
                  Sipariş vermeden önce{" "}
                  <Link href="/iade-gizlilik" className="text-white hover:underline">
                    iade politikamızı
                  </Link>{" "}
                  incelemenizi öneririz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
