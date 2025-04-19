"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Component with useSearchParams wrapped in suspense
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const token = searchParams?.get("token");

  // If token exists in URL, we're in reset mode, otherwise we're in request mode
  const isResetMode = !!token;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Lütfen e-posta adresinizi girin");
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(email);

      if (!result.success) {
        throw new Error(result.error);
      }

      setResetRequested(true);
      toast.success(result.message || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi");
    } catch (error) {
      console.error('Password reset request error:', error);
      toast.error(error instanceof Error ? error.message : "Şifre sıfırlama isteği gönderilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Lütfen yeni şifrenizi girin");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token as string, newPassword);

      if (!result.success) {
        throw new Error(result.error);
      }

      setResetComplete(true);
      toast.success(result.message || "Şifreniz başarıyla sıfırlandı");
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error instanceof Error ? error.message : "Şifre sıfırlanırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (resetComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
        <div className="w-full max-w-md px-8 py-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Şifre Sıfırlama Başarılı!</h1>
          <p className="text-gray-300 mb-8">Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.</p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="bg-white text-black hover:bg-white/90"
          >
            Giriş Yap
          </Button>
        </div>
      </div>
    );
  }

  if (resetRequested) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
        <div className="w-full max-w-md px-8 py-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">E-posta Gönderildi!</h1>
          <p className="text-gray-300 mb-8">
            Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="bg-white text-black hover:bg-white/90"
          >
            Giriş Sayfasına Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isResetMode ? "Şifre Sıfırlama" : "Şifremi Unuttum"}
          </h1>
          <p className="text-gray-400">
            {isResetMode
              ? "Lütfen yeni şifrenizi girin"
              : "Şifrenizi sıfırlamak için e-posta adresinizi girin"
            }
          </p>
        </div>

        <form
          onSubmit={isResetMode ? handleResetPassword : handleRequestReset}
          className="space-y-6"
        >
          {!isResetMode ? (
            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="new-password">Yeni Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">Şifreniz en az 6 karakter olmalıdır.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isResetMode ? "Şifre Sıfırlanıyor..." : "Gönderiliyor..."}
              </>
            ) : (
              isResetMode ? "Şifremi Sıfırla" : "Sıfırlama Bağlantısı Gönder"
            )}
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              <Link href="/auth/login" className="text-white hover:underline">
                Giriş sayfasına dön
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main component with suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
        <div className="w-full max-w-md px-8 py-12 text-center">
          <Loader2 className="h-16 w-16 text-white animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Yükleniyor</h1>
          <p className="text-gray-400">Sayfa yükleniyor...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
