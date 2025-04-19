"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthContext } from "@/components/layout/AuthProvider";
import AuthWrapper from "@/components/layout/AuthWrapper";

export default function LoginClient() {
  return (
    <AuthWrapper
      requireAuth={false}
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            <p className="text-white">Yükleniyor...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </AuthWrapper>
  );
}

function LoginContent() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to account page
  if (isAuthenticated) {
    router.push("/hesabim");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Lütfen e-posta ve şifrenizi girin");
      return;
    }

    setIsLoading(true);

    try {
      // We use email for both username and email since our PHP backend accepts either
      const result = await login(email, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Giriş başarılı!");
      router.push("/hesabim"); // Redirect to account page on successful login
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Giriş yapılırken bir hata oluştu";

      // Set specific error messages for common errors
      if (errorMessage.includes("incorrect") || errorMessage.includes("yanlış")) {
        setError("E-posta adresi veya şifre yanlış");
      } else if (errorMessage.includes("not found") || errorMessage.includes("bulunamadı")) {
        setError("Bu e-posta adresi ile kayıtlı bir hesap bulunamadı");
      } else if (errorMessage.includes("confirm") || errorMessage.includes("onay")) {
        setError("Lütfen önce e-posta adresinizi onaylayın");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Giriş Yap</h1>
          <p className="text-gray-400">
            Hesabınıza giriş yaparak tasarımlarınızı yönetin ve siparişlerinizi takip edin
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-900 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta Adresi veya Kullanıcı Adı</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="text"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 ${error && !email ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Şifre</Label>
              <Link
                href="/auth/reset-password"
                className="text-xs text-gray-400 hover:text-white underline"
              >
                Şifremi Unuttum
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 ${error && !password ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Giriş Yapılıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="px-4 text-xs text-gray-400">VEYA</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Henüz bir hesabınız yok mu?{" "}
              <Link href="/auth/register" className="text-white hover:underline">
                Hemen Kaydolun
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
