import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductDetailView from "./ProductDetailView";

// Sample products data
const products = {
  "baski-malzemeleri": [
    {
      id: 1,
      name: "Premium Mat Kağıt - A4 (250g)",
      description: "Parlama yapmayan, yüksek kaliteli 250g mat kağıt. Fotoğraf ve sanat baskıları için ideal.",
      fullDescription: `Premium Mat Kağıt, yüksek kaliteli baskılarınız için mükemmel bir seçimdir. 250g/m² ağırlığındaki bu A4 boyutlu mat kağıt, parlama yapmayan yüzeyi sayesinde fotoğraf ve sanat baskıları için idealdir.

Bu kağıt türü profesyonel fotoğrafçılar, sanatçılar ve grafik tasarımcılar tarafından tercih edilmektedir. Özellikle sergilenecek eserler, portfolyo görselleri ve yüksek kaliteli baskılar için mükemmel sonuçlar verir.

Asit içermeyen yapısı sayesinde uzun ömürlü baskılar elde edebilir, renklerin canlılığını uzun süre koruyabilirsiniz.

Paket içeriği: 10 adet A4 boyutunda (210mm x 297mm) 250g/m² ağırlığında premium mat kağıt.`,
      price: "₺120,00",
      pricePerSheet: "₺12,00",
      sheets: "10 adet",
      images: [
        "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=2787&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2880&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=2880&auto=format&fit=crop",
      ],
      category: "baski-malzemeleri",
      badges: ["Yeni", "Popüler"],
      stock: 100,
      reviews: 42,
      rating: 4.8,
      specifications: [
        { name: "Boyut", value: "A4 (210mm x 297mm)" },
        { name: "Ağırlık", value: "250g/m²" },
        { name: "Yüzey", value: "Mat" },
        { name: "Kalınlık", value: "0.25mm" },
        { name: "Miktar", value: "10 adet" },
        { name: "Renk", value: "Beyaz" },
        { name: "Parlaklık", value: "%94" },
        { name: "Opaklık", value: "%98" },
      ],
      relatedProducts: [2, 3, 4, 7]
    },
    {
      id: 2,
      name: "Parlak Fotoğraf Kağıdı - A4 (200g)",
      description: "Yüksek parlaklıkta, canlı renkli baskılar için 200g fotoğraf kağıdı.",
      fullDescription: "Detaylı ürün açıklaması burada...",
      price: "₺150,00",
      images: ["https://images.unsplash.com/photo-1607008483726-a5ceb6200201?q=80&w=2787&auto=format&fit=crop"],
      category: "baski-malzemeleri",
      stock: 75,
      reviews: 28,
      rating: 4.6,
      specifications: [
        { name: "Boyut", value: "A4 (210mm x 297mm)" },
        { name: "Ağırlık", value: "200g/m²" },
        { name: "Yüzey", value: "Parlak" }
      ]
    },
    {
      id: 3,
      name: "Tekstil Transfer Kağıdı - A4",
      description: "Tişört ve diğer tekstil ürünleri için ısı transferli baskı kağıdı.",
      fullDescription: "Detaylı ürün açıklaması burada...",
      price: "₺200,00",
      images: ["https://images.unsplash.com/photo-1563784462386-044fd95e9852?q=80&w=2864&auto=format&fit=crop"],
      category: "baski-malzemeleri",
      stock: 50,
      reviews: 35,
      rating: 4.7,
      specifications: [
        { name: "Boyut", value: "A4 (210mm x 297mm)" },
        { name: "Transferler", value: "Açık Renkli Tekstiller" }
      ]
    },
    {
      id: 4,
      name: "Premium Kanvas - 30x40cm",
      description: "Sanat eserleri ve fotoğraflar için yüksek kaliteli kanvas malzeme.",
      fullDescription: "Detaylı ürün açıklaması burada...",
      price: "₺300,00",
      images: ["https://images.unsplash.com/photo-1579965342575-16428a7c8881?q=80&w=2960&auto=format&fit=crop"],
      category: "baski-malzemeleri",
      stock: 30,
      reviews: 22,
      rating: 4.9,
      specifications: [
        { name: "Boyut", value: "30x40cm" },
        { name: "Malzeme", value: "100% Pamuklu Kanvas" }
      ]
    }
  ]
};

// Flatten products for easier access
const allProducts = Object.values(products).flat();

// Add generateStaticParams for static site generation
export function generateStaticParams() {
  // Create params for each product
  return allProducts.map(product => ({
    category: product.category,
    productId: product.id.toString()
  }));
}

export default function ProductDetailPage({ params }: { params: { category: string, productId: string } }) {
  const category = params.category;
  const productId = parseInt(params.productId);

  // Find product from URL parameters
  const product = allProducts.find(
    p => p.id === productId && p.category === category
  );

  // If product not found
  if (!product) {
    return (
      <div className="min-h-screen pt-24 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Ürün Bulunamadı</h1>
        <p className="mb-8">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/urunler">
          <Button>Tüm Ürünlere Dön</Button>
        </Link>
      </div>
    );
  }

  // Render using the ProductDetailView component
  return <ProductDetailView product={product} category={category} />;
}
