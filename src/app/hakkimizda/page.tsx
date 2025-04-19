import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Hakkımızda | Galerizo",
  description: "Galerizo olarak uygun fiyatlı premium marka tişörtler sunuyoruz. Hikayemizi, vizyonumuzu ve misyonumuzu keşfedin.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      {/* Hero Bölümü */}
      <div className="bg-black border-b border-white/10 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Galerizo'ın hikayesi, vizyonu ve misyonu hakkında bilgi edinin
          </p>
        </div>
      </div>

      {/* Hikaye Bölümü */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6 text-white">Hikayemiz</h2>
              <p className="text-gray-400 mb-4">
                Galerizo, 2023 yılında İstanbul'da kurulmuş, kalite ve şıklığı uygun fiyatlarla bir araya getirmeyi amaçlayan yenilikçi bir giyim markasıdır.
              </p>
              <p className="text-gray-400 mb-4">
                Kurucularımız, yıllardır tekstil ve moda sektöründe çalışan profesyonellerdir. Türkiye'deki tüketicilerin premium markalara erişimindeki fiyat engelini fark ederek, dünya çapında ünlü markaların orijinal ürünlerini uygun fiyata sunabilecek bir platform oluşturma fikriyle yola çıktılar.
              </p>
              <p className="text-gray-400 mb-4">
                İlk günden bu yana amacımız, Tommy Hilfiger, Calvin Klein, EA7, Mavi, Columbia, Hermes gibi dünyaca ünlü markaların tişörtlerini piyasa fiyatlarının çok altında, ancak aynı kalitede müşterilerimize sunmak olmuştur.
              </p>
            </div>
            <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden order-1 md:order-2 border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                alt="Galerizo Hikayesi"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vizyonumuz ve Misyonumuz */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-black p-8 rounded-lg shadow-sm border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-white">Vizyonumuz</h2>
              <p className="text-gray-400 mb-4">
                Türkiye'nin en güvenilir ve uygun fiyatlı premium marka tişört tedarikçisi olmak. Herkesin kaliteli markaları uygun fiyata giyebileceği bir giyim ekosistemi yaratmak.
              </p>
              <p className="text-gray-400">
                Moda ve kaliteyi erişilebilir kılarak, müşterilerimizin kendilerini iyi hissetmelerini ve şık görünmelerini sağlamak, bu konudaki en büyük motivasyonumuz.
              </p>
            </div>

            <div className="bg-black p-8 rounded-lg shadow-sm border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-white">Misyonumuz</h2>
              <p className="text-gray-400 mb-4">
                %100 orijinal premium marka tişörtleri piyasa fiyatlarının çok altında sunarak, kaliteli giyimi herkes için erişilebilir kılmak.
              </p>
              <p className="text-gray-400 mb-4">
                Müşteri memnuniyetini her zaman en üst seviyede tutarak, satış sonrası destek ve kolay iade seçenekleri ile güvenilir bir alışveriş deneyimi sunmak.
              </p>
              <p className="text-gray-400">
                Sürdürülebilir ve etik kaynaklardan temin edilen ürünleri tercih ederek, çevreye ve topluma karşı sorumluluklarımızı yerine getirmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ekibimiz */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Ekibimiz</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Ekip Üyeleri */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 border border-white/20">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop"
                  alt="Ahmet Yılmaz - Kurucu ve CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">Ahmet Yılmaz</h3>
              <p className="text-gray-400">Kurucu ve CEO</p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 border border-white/20">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop"
                  alt="Ayşe Demir - Tedarik Zinciri Müdürü"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">Ayşe Demir</h3>
              <p className="text-gray-400">Tedarik Zinciri Müdürü</p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 border border-white/20">
                <Image
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop"
                  alt="Mehmet Kaya - E-Ticaret Direktörü"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">Mehmet Kaya</h3>
              <p className="text-gray-400">E-Ticaret Direktörü</p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 border border-white/20">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop"
                  alt="Zeynep Öztürk - Pazarlama Direktörü"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">Zeynep Öztürk</h3>
              <p className="text-gray-400">Pazarlama Direktörü</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="py-16 bg-black border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Premium Markaları Keşfedin</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
            Tommy Hilfiger, Calvin Klein, EA7, Mavi, Columbia, Hermes ve daha fazla marka tişörtleri uygun fiyatlarla Galerizo'da.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/urunler">
              <Button className="bg-white text-black hover:bg-white/90" size="lg">
                Alışverişe Başla
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/kategoriler">
              <Button variant="outline" className="border-white/20 bg-black text-white hover:bg-white/10" size="lg">
                Kategorileri Keşfet
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
