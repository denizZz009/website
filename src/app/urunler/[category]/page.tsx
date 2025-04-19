import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Sample categories data - using the same product structure as in product detail
const productCategories = [
  "baski-malzemeleri"
];

export function generateStaticParams() {
  // Create params for each category
  return productCategories.map(category => ({
    category
  }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category;

  return (
    <div className="min-h-screen pt-16">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <Link href="/urunler" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tüm Ürünler
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {category === "baski-malzemeleri" ? "Baskı Malzemeleri" : category}
        </h1>

        <Link href={`/urunler/${category}/1`}>
          <div className="p-4 border rounded-md hover:bg-gray-50">
            Ürün Detayına Git
          </div>
        </Link>
      </div>
    </div>
  );
}
