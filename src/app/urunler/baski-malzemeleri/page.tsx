import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Baskı Malzemeleri | BaskıDesign",
  description: "Yüksek kaliteli baskı kağıtları, kanvas ve diğer baskı malzemeleri. Tasarımlarınızı en iyi şekilde hayata geçirin.",
};

// Örnek ürün verileri
const products = [
  {
    id: 1,
    name: "Premium Mat Kağıt - A4 (250g)",
    description: "Parlama yapmayan, yüksek kaliteli 250g mat kağıt. Fotoğraf ve sanat baskıları için ideal.",
    price: "₺120,00",
    pricePerSheet: "₺12,00",
    sheets: "10 adet",
    image: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=2787&auto=format&fit=crop",
    category: "baski-malzemeleri",
    badges: ["Yeni", "Popüler"],
  },
  {
    id: 2,
    name: "Parlak Fotoğraf Kağıdı - A4 (200g)",
    description: "Canlı renkleri ve keskin detayları ortaya çıkaran profesyonel fotoğraf kağıdı.",
    price: "₺150,00",
    pricePerSheet: "₺15,00",
    sheets: "10 adet",
    image: "https://images.unsplash.com/photo-1607008483726-a5ceb6200201?q=80&w=2787&auto=format&fit=crop",
    category: "baski-malzemeleri",
    badges: ["En Çok Satan"],
  },
  {
    id: 3,
    name: "Tekstil Transfer Kağıdı - A4",
    description: "T-shirt ve kumaşlara uygulama için özel tasarlanmış transfer kağıdı. Beyaz ve açık renkli kumaşlar için.",
    price: "₺200,00",
    pricePerSheet: "₺20,00",
    sheets: "10 adet",
    image: "https://images.unsplash.com/photo-1563784462386-044fd95e9852?q=80&w=2864&auto=format&fit=crop",
    category: "baski-malzemeleri",
    badges: [],
  },
  {
    id: 4,
    name: "Premium Kanvas - 30x40cm",
    description: "Sanat çalışmalarınız için yüksek kaliteli kanvas baskı malzemesi. Germe çıtası dahildir.",
    price: "₺350,00",
    pricePerSheet: null,
    sheets: "1 adet",
    image: "https://images.unsplash.com/photo-1579965342575-16428a7c8881?q=80&w=2960&auto=format&fit=crop",
    category: "baski-malzemeleri",
    badges: ["Premium"],
  },
  {
    id: 5,
    name: "Yüksek Parlaklıkta Fotoğraf Kağıdı - A3 (250g)",
    description: "Ultra parlak yüzeyli, canlı renkler ve derin siyahlar için ideal profesyonel fotoğraf kağıdı.",
    price: "₺250,00",
    pricePerSheet: "₺25,00",
    sheets: "10 adet",
    image: "https://images.unsplash.com/photo-1614849963640-9cc74b2a988b?q=80&w=2960&auto=format&fit=crop",
    category: "baski-malzemeleri",
    badges: [],
  },
  {
    id: 6,
    name: "Kraft Kağıt - A4 (120g)",
    description: "Doğal, çevre dostu kraft kağıt. Rustik görünümlü baskılar ve paketleme için idealdir.",
    price: "₺100,00",
    pricePerSheet: "₺10,00",
    sheets: "10 adet",
    image: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=2876&auto=format&fit=crop",
    category: "baski-malzemeleri",
    badges: ["Eko-Dostu"],
  },
  {
    id: 7,
    name: "Yarı Mat Fotoğraf Kağıdı - A4 (240g)",
    description: "Parlamayı azaltan, detayları koruyan yarı mat yüzey. Profesyonel fotoğraf baskıları için.",
    price: "₺180,00",
    pricePerSheet: "₺18,00",
    sheets: "10 adet",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2940&auto=format&fit=crop",
    category: "baski-malzemeleri",
    badges: [],
  },
  {
    id: 8,
    name: "Koyu Tekstil Transfer Kağıdı - A4",
    description: "Koyu renkli kumaşlar için özel geliştirilmiş transfer kağıdı. Beyaz mürekkep içerir.",
    price: "₺220,00",
    pricePerSheet: "₺22,00",
    sheets: "10 adet",
    image: "https://images.unsplash.com/photo-1618035881605-dfe8d7eb387b?q=80&w=2564&auto=format&fit=crop",
    category: "baski-malzemeleri",
    badges: ["Özel"],
  },
];

export default function BaskiMalzemeleriPage() {
  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      {/* Kategori Başlık */}
      <div className="bg-black border-b border-white/10 text-white py-14">
        <div className="container mx-auto px-4">
          <Link href="/urunler" className="inline-flex items-center text-white/90 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tüm Kategoriler
          </Link>
          <h1 className="text-4xl font-bold">Baskı Malzemeleri</h1>
        </div>
      </div>

      {/* Filtreleme ve Sıralama */}
      <div className="bg-black border-b border-white/10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="inline-flex items-center border-white/20 bg-black text-white hover:bg-white/10">
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
              </Button>

              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] border-white/20 bg-black text-white">
                  <SelectValue placeholder="Kağıt Türü" />
                </SelectTrigger>
                <SelectContent className="bg-black border border-white/20 text-white">
                  <SelectItem value="all">Tüm Türler</SelectItem>
                  <SelectItem value="mat">Mat Kağıtlar</SelectItem>
                  <SelectItem value="parlak">Parlak Kağıtlar</SelectItem>
                  <SelectItem value="tekstil">Tekstil Transfer</SelectItem>
                  <SelectItem value="kanvas">Kanvas</SelectItem>
                  <SelectItem value="kraft">Kraft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-2">Sırala:</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px] border-white/20 bg-black text-white">
                  <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent className="bg-black border border-white/20 text-white">
                  <SelectItem value="featured">Öne Çıkanlar</SelectItem>
                  <SelectItem value="price-asc">Fiyat (Düşükten Yükseğe)</SelectItem>
                  <SelectItem value="price-desc">Fiyat (Yüksekten Düşüğe)</SelectItem>
                  <SelectItem value="newest">En Yeniler</SelectItem>
                  <SelectItem value="bestseller">En Çok Satanlar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/urunler/${product.category}/${product.id}`}
              className="block"
            >
              <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow bg-black border border-white/10">
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {product.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="bg-white text-black">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription className="line-clamp-2 text-gray-400">{product.description}</CardDescription>
                  <div className="flex items-center justify-between mt-4">
                    <div className="font-bold text-lg text-white">{product.price}</div>
                    <div className="text-sm text-gray-400">{product.sheets}</div>
                  </div>
                  {product.pricePerSheet && (
                    <div className="text-sm text-gray-400">
                      {product.pricePerSheet}/adet
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-white/20 bg-black text-white hover:bg-white/10">
                    Ürün Detayı
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
