"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Info,
  AlertCircle
} from "lucide-react";
import { useAuthContext } from "@/components/layout/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthWrapper from "@/components/layout/AuthWrapper";
import dynamic from "next/dynamic";

// Import client component with no SSR
const RegisterClient = dynamic(() => import("./client"), { ssr: false });

export default function RegisterPage() {
  return <RegisterClient />;
}

function RegisterContent() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuthContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to account page
  if (isAuthenticated) {
    router.push("/hesabim");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(username, email, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      setRegistered(true);
      setRegistrationMessage(result.message || "Kayıt başarılı! Lütfen e-posta adresinizi onaylayın.");
      toast.success("Kayıt başarılı!", {
        description: "Lütfen e-posta adresinize gelen onay bağlantısına tıklayınız."
      });
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : "Kayıt yapılırken bir hata oluştu";

      // Set specific error messages for common errors
      if (errorMessage.includes("already exists") || errorMessage.includes("zaten kayıtlı")) {
        setError("Bu e-posta adresi veya kullanıcı adı zaten kayıtlı");
      } else if (errorMessage.includes("valid email") || errorMessage.includes("geçerli e-posta")) {
        setError("Lütfen geçerli bir e-posta adresi girin");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-black">
        <div className="w-full max-w-md px-8 py-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Kayıt Başarılı!</h1>
          <p className="text-gray-300 mb-6">{registrationMessage}</p>
          <Info className="w-8 h-8 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-8">
            E-posta onayı tamamlandıktan sonra hesabınıza giriş yapabilirsiniz.
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
          <h1 className="text-3xl font-bold text-white mb-2">Hesap Oluştur</h1>
          <p className="text-gray-400">
            Hızlıca kaydolun ve alışverişe başlayın
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
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                placeholder="kullanici_adi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`pl-10 ${error && !username ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta Adresi</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 ${error && !email ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 ${error && (!password || password.length < 6) ? 'border-red-500' : ''}`}
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
                className={`pl-10 ${error && (!confirmPassword || confirmPassword !== password) ? 'border-red-500' : ''}`}
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
                Kaydediliyor...
              </>
            ) : (
              "Kayıt Ol"
            )}
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Zaten bir hesabınız var mı?{" "}
              <Link href="/auth/login" className="text-white hover:underline">
                Giriş Yap
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
