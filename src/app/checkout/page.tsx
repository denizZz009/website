"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, ShoppingBag, CreditCard, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Separate component for checkout content to use with Suspense
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Get product_id and quantity from URL
  const productId = searchParams?.get("product_id");
  const quantity = searchParams?.get("quantity") || "1";

  // Checkout handler
  const handleCheckout = async () => {
    if (!productId) {
      toast.error("Ürün bilgisi eksik");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.orders.checkout(
        parseInt(productId),
        parseInt(quantity)
      );

      if (response.status === "success" && response.checkout_url) {
        setIsRedirecting(true);
        toast.success("Ödeme sayfasına yönlendiriliyorsunuz...");
        // Redirect to the payment gateway
        window.location.href = response.checkout_url;
      } else {
        throw new Error(response.message || "Ödeme işlemi başlatılırken bir hata oluştu");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Ödeme işlemi başlatılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // If no product ID is provided, show error and redirect to cart
  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
        <div className="w-full max-w-md px-8 py-12 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Ürün Bilgisi Eksik</h1>
          <p className="text-gray-300 mb-6">
            Ödeme sayfasına erişmek için geçerli bir ürün bilgisi gereklidir.
          </p>
          <Link href="/sepet">
            <Button className="bg-white text-black hover:bg-white/90">
              Sepete Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Sipariş Özeti
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Ürün ID</span>
                  <span className="text-white">{productId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Miktar</span>
                  <span className="text-white">{quantity}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-blue-300 font-medium mb-3">Ödeme Bilgilendirmesi</h3>
              <p className="text-blue-100 text-sm">
                Ödeme işlemi için güvenli ödeme sağlayıcısı Shopier'e yönlendirileceksiniz.
                Ödeme tamamlandıktan sonra sitemize otomatik olarak geri döndürüleceksiniz.
              </p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Ödeme İşlemi
              </h2>

              <Button
                onClick={handleCheckout}
                disabled={isLoading || isRedirecting}
                className="w-full bg-white text-black hover:bg-white/90 mt-6"
                size="lg"
              >
                {isLoading || isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isRedirecting ? "Yönlendiriliyor..." : "İşleniyor..."}
                  </>
                ) : (
                  "Ödeme Sayfasına Git"
                )}
              </Button>

              <div className="mt-6 text-center">
                <Link href="/sepet" className="text-gray-400 hover:text-white text-sm">
                  Sepete Geri Dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
        <div className="w-full max-w-md px-8 py-12 text-center">
          <Loader2 className="h-16 w-16 text-white animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Yükleniyor</h1>
          <p className="text-gray-400">Ödeme bilgileri hazırlanıyor...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
