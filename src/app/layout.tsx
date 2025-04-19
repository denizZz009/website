import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galerizo - Ucuz ve Kaliteli Giyim",
  description: "Tommy Hilfiger, Calvin Klein, EA7, Mavi, Columbia, Hermes ve daha fazla marka tişört ve giyim ürünleri uygun fiyatlarla",
  metadataBase: new URL('https://galerizo.com'),
  icons: {
    icon: '/images/galerizo-logo.png',
    apple: '/images/galerizo-logo.png',
  },
  keywords: "Galerizo, premium markalar, Tommy Hilfiger, Calvin Klein, EA7, Mavi, Columbia, tişört, giyim, uygun fiyat, kaliteli giyim",
  authors: [{ name: "Galerizo Fashion" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "Galerizo - Premium Markalar Uygun Fiyatlar",
    description: "Dünyaca ünlü markaların orijinal ürünlerini uygun fiyatlarla Galerizo'da keşfedin.",
    siteName: "Galerizo",
    images: [
      {
        url: "/images/galerizo-logo.png",
        width: 800,
        height: 600,
        alt: "Galerizo Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ClientBody>
          <div className="flex flex-col min-h-screen bg-black">
            <Header />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </ClientBody>
      </body>
    </html>
  );
}
