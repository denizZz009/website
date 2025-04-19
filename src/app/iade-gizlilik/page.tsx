import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "İade ve Gizlilik Politikası | Galerizo",
  description: "İade şartları, ödeme güvenliği ve kişisel verilerin korunması hakkında bilgiler Galerizo güvencesiyle.",
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      {/* Hero Bölümü */}
      <div className="bg-black border-b border-white/10 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">İade ve Gizlilik Politikası</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Alışverişlerinizde güvende olmanız için iade koşulları ve gizlilik politikamız
          </p>
        </div>
      </div>

      {/* İçerik */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Yan Menü - Mobil için gizli */}
          <div className="hidden md:block">
            <div className="sticky top-24 space-y-4">
              <h3 className="font-bold text-lg mb-4 text-white">İçindekiler</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#iade-politikasi" className="text-gray-400 hover:text-white transition-colors line-hover">
                    İade Politikası
                  </a>
                </li>
                <li>
                  <a href="#odeme-guvenligi" className="text-gray-400 hover:text-white transition-colors line-hover">
                    Ödeme Güvenliği
                  </a>
                </li>
                <li>
                  <a href="#kisisel-veriler" className="text-gray-400 hover:text-white transition-colors line-hover">
                    Kişisel Verilerin Korunması
                  </a>
                </li>
                <li>
                  <a href="#cerezler" className="text-gray-400 hover:text-white transition-colors line-hover">
                    Çerezler
                  </a>
                </li>
                <li>
                  <a href="#sss" className="text-gray-400 hover:text-white transition-colors line-hover">
                    Sıkça Sorulan Sorular
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="md:col-span-3">
            <section id="iade-politikasi" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">İade Politikası</h2>

              <p className="text-gray-400 mb-4">
                Galerizo olarak müşteri memnuniyetine büyük önem veriyoruz. Aşağıdaki koşullar dahilinde, siparişlerinizi kolayca iade edebilirsiniz.
              </p>

              <div className="bg-black border border-white/10 p-6 rounded-lg mb-6">
                <h3 className="font-bold mb-4 text-white">İade Koşulları</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Ürünler, teslim tarihinden itibaren 14 gün içinde iade edilebilir.</li>
                  <li>İade edilecek ürünlerin kullanılmamış, yıpranmamış ve orijinal paketinde olması gerekmektedir.</li>
                  <li>Kişiselleştirilmiş baskılar, özel tasarım ürünler ve üzerine baskı yapılmış ürünler, üretim hatası olmadığı sürece iade edilemez.</li>
                  <li>Ürün iadesi için müşteri hizmetleri ile iletişime geçmeniz gerekmektedir.</li>
                </ul>
              </div>
            </section>

            <hr className="my-8 border-white/10" />

            <section id="odeme-guvenligi" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Ödeme Güvenliği</h2>

              <p className="text-gray-400 mb-4">
                Galerizo olarak, müşterilerimizin kişisel ve ödeme bilgilerinin güvenliği bizim için en büyük önceliktir. Bu nedenle, en son teknoloji güvenlik protokollerini kullanıyoruz.
              </p>

              <div className="bg-black border border-white/10 p-6 rounded-lg mb-6">
                <h3 className="font-bold mb-4 text-white">Güvenlik Önlemlerimiz</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Tüm ödeme işlemleri 256-bit SSL şifreleme ile korunmaktadır.</li>
                  <li>Kredi kartı bilgileriniz sistemimizde saklanmaz, sadece işlem anında güvenli ödeme altyapımız tarafından işlenir.</li>
                  <li>Ödeme sayfalarımız PCI DSS uyumludur ve düzenli olarak güvenlik testlerinden geçirilmektedir.</li>
                  <li>3D Secure ödeme altyapısı ile ekstra güvenlik katmanı sağlanmaktadır.</li>
                </ul>
              </div>
            </section>

            <section id="kisisel-veriler" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Kişisel Verilerin Korunması</h2>

              <p className="text-gray-400 mb-4">
                Galerizo olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, kişisel verilerinizin güvenliğine büyük önem veriyoruz. Verileriniz yasalara uygun olarak işlenmekte ve korunmaktadır.
              </p>

              <div className="bg-black border border-white/10 p-6 rounded-lg mb-6">
                <h3 className="font-bold mb-4 text-white">Veri İşleme Prensipleri</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Kişisel verileriniz sadece sipariş işleme, müşteri hizmetleri ve yasal yükümlülüklerimiz için kullanılmaktadır.</li>
                  <li>Verileriniz hiçbir koşulda izinsiz üçüncü taraflarla paylaşılmaz.</li>
                  <li>Kişisel verilerinize erişim, şirketimiz içinde sadece işin gerektirdiği yetkili kişilerle sınırlıdır.</li>
                  <li>Verileriniz, veri saklama politikamız doğrultusunda gerekli süreler dışında tutulmamaktadır.</li>
                  <li>Verilerinizle ilgili bilgi edinme, düzeltme veya silme taleplerinizi her zaman müşteri hizmetlerimiz aracılığıyla iletebilirsiniz.</li>
                </ul>
              </div>
            </section>

            <hr className="my-8 border-white/10" />

            <section id="cerezler" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Çerezler</h2>

              <p className="text-gray-400 mb-4">
                Web sitemizde en iyi deneyimi sağlamak için çerezleri kullanmaktayız. Çerezler, internet sitesi ziyaretiniz sırasında tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır.
              </p>

              <div className="bg-black border border-white/10 p-6 rounded-lg mb-6">
                <h3 className="font-bold mb-4 text-white">Çerez Kullanım Amaçlarımız</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><strong>Gerekli Çerezler:</strong> Sitemizin doğru çalışması için gerekli temel çerezlerdir.</li>
                  <li><strong>Performans Çerezleri:</strong> Ziyaretçilerin siteyi nasıl kullandığını analiz etmemize ve site performansını iyileştirmemize yardımcı olur.</li>
                  <li><strong>İşlevsellik Çerezleri:</strong> Dil seçiminiz, sepetiniz ve oturum bilgileriniz gibi tercihlerinizi hatırlamak için kullanılır.</li>
                  <li><strong>Hedefleme/Reklam Çerezleri:</strong> İlgi alanlarınıza ve tercihlerinize uygun içerik ve reklamları sunmamızı sağlar.</li>
                </ul>

                <p className="mt-4 text-gray-400">Tarayıcı ayarlarınızı değiştirerek çerezleri engelleyebilir veya uyarı alabilirsiniz. Ancak, bu durumda sitemizin bazı özelliklerinin düzgün çalışmayabileceğini hatırlatmak isteriz.</p>
              </div>
            </section>

            <hr className="my-8 border-white/10" />

            <section id="sss" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Sıkça Sorulan Sorular</h2>

              <div className="space-y-6">
                <div className="bg-black border border-white/10 p-6 rounded-lg">
                  <h3 className="font-bold mb-2 text-white">Siparişim ne kadar sürede teslim edilir?</h3>
                  <p className="text-gray-400">
                    Standart teslimat süresi 3-5 iş günüdür. Ekspres teslimat seçeneği ile siparişiniz 1-2 iş günü içerisinde teslim edilir. Kişiselleştirilmiş ürünlerde üretim süresi eklenebilir.
                  </p>
                </div>

                <div className="bg-black border border-white/10 p-6 rounded-lg">
                  <h3 className="font-bold mb-2 text-white">Ürün iadesi nasıl yapılır?</h3>
                  <p className="text-gray-400">
                    Ürün iadesi için öncelikle müşteri hizmetlerimizle iletişime geçmeniz gerekmektedir. Size özel bir iade kodu oluşturulacak ve ürünü nasıl göndermeniz gerektiği konusunda bilgilendirileceksiniz. İade koşullarımız hakkında detaylı bilgiyi "İade Politikası" bölümünde bulabilirsiniz.
                  </p>
                </div>

                <div className="bg-black border border-white/10 p-6 rounded-lg">
                  <h3 className="font-bold mb-2 text-white">Sipariş takibi nasıl yapılır?</h3>
                  <p className="text-gray-400">
                    Siparişinizin durumunu, hesabınızdaki "Siparişlerim" bölümünden takip edebilirsiniz. Ayrıca, siparişiniz hazırlandığında ve kargoya verildiğinde size e-posta ile bilgilendirme yapılacaktır. Kargo takip numarası da bu e-postada yer alacaktır.
                  </p>
                </div>

                <div className="bg-black border border-white/10 p-6 rounded-lg">
                  <h3 className="font-bold mb-2 text-white">Ödeme seçenekleri nelerdir?</h3>
                  <p className="text-gray-400">
                    Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçenekleriyle ödeme yapabilirsiniz. Tüm kredi kartlarına taksit imkanı sunulmaktadır. Ayrıntılı bilgi için ödeme sayfasını ziyaret edebilirsiniz.
                  </p>
                </div>

                <div className="bg-black border border-white/10 p-6 rounded-lg">
                  <h3 className="font-bold mb-2 text-white">Beden değişimi yapabilir miyim?</h3>
                  <p className="text-gray-400">
                    Evet, ürünlerimizde beden değişimi yapabilirsiniz. Ürünün kullanılmamış ve orijinal etiketleri çıkarılmamış olması gerekmektedir. Beden değişimi için müşteri hizmetlerimizle iletişime geçmeniz yeterlidir.
                  </p>
                </div>
              </div>
            </section>

            <Link href="/">
              <Button className="bg-white text-black hover:bg-white/90">
                Ana Sayfaya Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
