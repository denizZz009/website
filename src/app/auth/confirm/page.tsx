"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";

// Inner component for confirm email content
function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = searchParams?.get("token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setErrorMessage("Onay kodu eksik. Lütfen e-posta içindeki bağlantıyı tam olarak tıklayın.");
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await api.auth.confirmEmail(token);

        if (response.status === "success") {
          setIsConfirmed(true);
          toast.success(response.message || "E-posta adresiniz başarıyla onaylandı!");
        } else {
          setErrorMessage(response.message || "E-posta onaylanırken bir hata oluştu");
          toast.error(response.message || "E-posta onaylanırken bir hata oluştu");
        }
      } catch (error) {
        console.error("Confirmation error:", error);
        setErrorMessage(error instanceof Error ? error.message : "Onay işlemi sırasında bir hata oluştu");
        toast.error(error instanceof Error ? error.message : "Onay işlemi sırasında bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
      <div className="w-full max-w-md px-8 py-12 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-white animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">E-posta Onaylanıyor</h1>
            <p className="text-gray-400">Lütfen bekleyin, e-posta adresinizi onaylıyoruz...</p>
          </div>
        ) : isConfirmed ? (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">E-posta Onaylandı!</h1>
            <p className="text-gray-400 mb-8">E-posta adresiniz başarıyla onaylanmıştır. Artık giriş yapabilirsiniz.</p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="bg-white text-black hover:bg-white/90"
            >
              Giriş Yap
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Onay Hatası</h1>
            <p className="text-gray-400 mb-4">{errorMessage}</p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-white text-black hover:bg-white/90"
              >
                Giriş Sayfasına Dön
              </Button>
              <Button
                onClick={() => router.push("/auth/register")}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Yeni Hesap Oluştur
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
        <div className="w-full max-w-md px-8 py-12 text-center">
          <Loader2 className="h-16 w-16 text-white animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Yükleniyor</h1>
          <p className="text-gray-400">Onay işlemi hazırlanıyor...</p>
        </div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  );
}
