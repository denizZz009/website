"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "@/components/layout/AuthProvider";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Koyu temayı aktif hale getir
  useEffect(() => {
    // Bu sadece istemci tarafında hydration sonrası çalışır
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <AuthProvider>
      <div>
        {children}
      </div>
      <Toaster />
      <SonnerToaster richColors position="top-right" theme="dark" />
    </AuthProvider>
  );
}
