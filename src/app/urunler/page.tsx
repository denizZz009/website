import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Kategoriler | Galerizo",
  description: "Premium markaların ürünlerini uygun fiyatlarla bulabileceğiniz Galerizo mağazası.",
};

// Ürün kategorileri
const categories = [
  {
    id: "tisortler",
    title: "Tişörtler",
    description: "Tommy Hilfiger, Calvin Klein, EA7 ve daha birçok premium markadan tişörtler",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2064&auto=format&fit=crop",
  },
  {
    id: "parfumler",
    title: "Parfümler",
    description: "En popüler markaların erkek ve kadın parfümleri",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2080&auto=format&fit=crop",
  },
  {
    id: "ayakkabilar",
    title: "Ayakkabılar",
    description: "Spor ayakkabılar, günlük ayakkabılar ve daha fazlası",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "gozlukler",
    title: "Gözlükler",
    description: "Güneş gözlükleri ve optik gözlük çeşitleri",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1980&auto=format&fit=crop",
  },
];

// Markalar
const brands = [
  {
    id: "tommy-hilfiger",
    title: "Tommy Hilfiger",
    description: "Klasik Amerikan stili",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "calvin-klein",
    title: "Calvin Klein",
    description: "Modern, minimal tasarımlar",
    image: "https://images.unsplash.com/photo-1565693413579-8a73cb8db0ea?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "ea7",
    title: "EA7",
    description: "Spor ve performans odaklı",
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "mavi",
    title: "Mavi",
    description: "Rahat ve şık günlük giyim",
    image: "https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=1965&auto=format&fit=crop",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      {/* Hero Başlık */}
      <div className="py-20 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Kategoriler</h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-300">
            Premium markaların en kaliteli ürünlerini uygun fiyatlarla bulabileceğiniz Galerizo koleksiyonu
          </p>
        </div>
      </div>

      {/* Kategoriler */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Ürün Kategorileri</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/urunler/${category.id}`}
              className="block"
            >
              <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow bg-gray-900 border-white/10 text-white">
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="pt-6">
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription className="mt-2 text-gray-300">{category.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Görüntüle
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Markalar */}
      <div className="container mx-auto px-4 py-16 border-t border-white/10">
        <h2 className="text-3xl font-bold mb-12 text-center">Popüler Markalar</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/urunler/${brand.id}`}
              className="block"
            >
              <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow bg-gray-900 border-white/10 text-white">
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={brand.image}
                    alt={brand.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="pt-6">
                  <CardTitle>{brand.title}</CardTitle>
                  <CardDescription className="mt-2 text-gray-300">{brand.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Marka Ürünleri
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Öne Çıkan Bilgi */}
      <div className="bg-gray-950 py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">İndirimli Ürünler</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
            Premium markaların ürünlerini %70'e varan indirimlerle satın alın.
          </p>
          <Link href="/urunler/indirimli">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              İndirimleri Keşfet
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
