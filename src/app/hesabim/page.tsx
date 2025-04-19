"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ShoppingBag,
  Heart,
  User,
  CreditCard,
  LogOut,
  Settings,
  ChevronRight,
  MapPin,
  Truck,
  Package,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuthContext } from "@/components/layout/AuthProvider";
import AuthWrapper from "@/components/layout/AuthWrapper";

// Örnek sipariş verileri
const orderHistory = [
  {
    id: "ORD-5523",
    date: "2023-12-01",
    total: "₺350,00",
    status: "Tamamlandı",
    items: [
      { name: "Premium Mat Kağıt - A4 (250g)", quantity: 2, price: "₺240,00" },
      { name: "Tekstil Transfer Kağıdı - A4", quantity: 1, price: "₺110,00" }
    ]
  },
  {
    id: "ORD-5489",
    date: "2023-11-15",
    total: "₺180,00",
    status: "Kargoda",
    items: [
      { name: "Parlak Fotoğraf Kağıdı - A4 (200g)", quantity: 1, price: "₺150,00" },
      { name: "Özel Tasarım Baskı", quantity: 1, price: "₺30,00" }
    ]
  },
  {
    id: "ORD-5432",
    date: "2023-10-28",
    total: "₺520,00",
    status: "Tamamlandı",
    items: [
      { name: "Premium Kanvas - 30x40cm", quantity: 1, price: "₺350,00" },
      { name: "Tekstil Transfer Kağıdı - A4", quantity: 1, price: "₺170,00" }
    ]
  }
];

// Not authenticated fallback
const NotAuthenticatedFallback = () => (
  <div className="min-h-screen pt-20 bg-black text-white flex items-center justify-center">
    <div className="max-w-md text-center px-4">
      <div className="mb-6">
        <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Giriş Yapılmadı</h1>
        <p className="text-gray-400 mb-6">
          Hesap bilgilerinizi görüntülemek ve siparişlerinizi takip etmek için lütfen giriş yapın.
        </p>
      </div>
      <div className="space-y-4">
        <Link href="/auth/login">
          <Button className="w-full bg-white text-black hover:bg-white/90">
            Giriş Yap
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button variant="outline" className="w-full border-white/20 bg-black text-white hover:bg-white/10">
            Hesap Oluştur
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

// Import client component with no SSR
const AccountClient = dynamic(() => import("./client"), { ssr: false });

export default function AccountPage() {
  return <AccountClient />;
}

function AccountPageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { user, logout } = useAuthContext();

  // Kullanıcı bilgileri
  const userProfile = user ? {
    name: user.username,
    email: user.email,
    phone: "+90 555 123 4567", // Demo data - would come from API in real app
    address: "Merkez Mah. Atatürk Cad. No: 123 Daire: 5 Kadıköy/İstanbul", // Demo data
    profileImage: null
  } : null;

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Başarıyla çıkış yapıldı");
      router.push("/");
    } else {
      toast.error(result.error || "Çıkış yapılırken bir hata oluştu");
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-black text-white pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Hesabım</h1>
        <p className="text-gray-400 mb-8">Siparişlerinizi takip edin ve hesap bilgilerinizi güncelleyin.</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Yan menü */}
          <div className="lg:col-span-1">
            <div className="bg-black border border-white/10 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="font-bold">{userProfile?.name}</h2>
                  <p className="text-sm text-gray-400">{userProfile?.email}</p>
                </div>
              </div>

              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-md transition ${
                      activeTab === "orders" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Siparişlerim</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-md transition ${
                      activeTab === "wishlist" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Favori Ürünlerim</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-md transition ${
                      activeTab === "profile" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Profil Bilgileri</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("payment")}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-md transition ${
                      activeTab === "payment" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Ödeme Yöntemleri</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-2 py-2 px-3 rounded-md transition ${
                      activeTab === "settings" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Hesap Ayarları</span>
                  </button>
                </li>
              </ul>

              <Separator className="my-6 bg-white/10" />

              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </div>

          {/* Ana içerik */}
          <div className="lg:col-span-3">
            {/* Siparişlerim */}
            {activeTab === "orders" && (
              <div className="bg-black border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Siparişlerim</h2>

                {orderHistory.length === 0 ? (
                  <div className="text-center py-10">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Henüz bir siparişiniz yok</h3>
                    <p className="text-gray-400 mb-4">Ürünleri keşfedin ve ilk siparişinizi oluşturun.</p>
                    <Link href="/urunler">
                      <Button className="bg-white text-black hover:bg-white/90">
                        Ürünleri Keşfet
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div
                        key={order.id}
                        className="border border-white/10 rounded-lg overflow-hidden"
                      >
                        {/* Sipariş Özeti */}
                        <div className="p-4 flex flex-wrap gap-4 justify-between items-center">
                          <div>
                            <h3 className="font-medium flex items-center">
                              <span className="text-white">{order.id}</span>
                              <span
                                className={`ml-3 text-xs px-2 py-1 rounded-full ${
                                  order.status === 'Tamamlandı' ? 'bg-green-900/30 text-green-400' :
                                  order.status === 'Kargoda' ? 'bg-blue-900/30 text-blue-400' :
                                  'bg-yellow-900/30 text-yellow-400'
                                }`}
                              >
                                {order.status}
                              </span>
                            </h3>
                            <p className="text-sm text-gray-400">Sipariş Tarihi: {order.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold">{order.total}</div>
                              <div className="text-xs text-gray-400">
                                {order.items.length} Ürün
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 hover:bg-white/10"
                              onClick={() => toggleOrderDetails(order.id)}
                            >
                              {expandedOrder === order.id ? "Gizle" : "Detaylar"}
                              <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${
                                expandedOrder === order.id ? 'rotate-90' : ''
                              }`} />
                            </Button>
                          </div>
                        </div>

                        {/* Sipariş Detayları */}
                        {expandedOrder === order.id && (
                          <div className="border-t border-white/10 p-4 bg-white/5">
                            <h4 className="font-medium mb-3 text-sm">Sipariş Detayları</h4>
                            <div className="space-y-2 mb-4">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <div>
                                    <span className="text-white">{item.name}</span>
                                    <span className="text-gray-400 ml-2">x{item.quantity}</span>
                                  </div>
                                  <div className="font-medium">{item.price}</div>
                                </div>
                              ))}
                            </div>

                            {/* Sipariş Durumu */}
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    order.status === 'Tamamlandı' || order.status === 'Kargoda'
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'bg-gray-800 text-gray-400'
                                  }`}>
                                    <Package className="h-3 w-3" />
                                  </div>
                                  <div>
                                    <div className="font-medium">Sipariş Hazırlanıyor</div>
                                    <div className="text-xs text-gray-400">
                                      {order.status !== 'Hazırlanıyor'
                                        ? `${order.date} tarihinde tamamlandı`
                                        : 'İşleme alındı'}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    order.status === 'Kargoda' || order.status === 'Tamamlandı'
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'bg-gray-800 text-gray-400'
                                  }`}>
                                    <Truck className="h-3 w-3" />
                                  </div>
                                  <div>
                                    <div className="font-medium">Kargoya Verildi</div>
                                    <div className="text-xs text-gray-400">
                                      {order.status === 'Kargoda' || order.status === 'Tamamlandı'
                                        ? 'Kargo takip numarası: TR1234567890'
                                        : 'Bekleniyor'}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    order.status === 'Tamamlandı'
                                      ? 'bg-green-500/20 text-green-400'
                                      : 'bg-gray-800 text-gray-400'
                                  }`}>
                                    <CheckCircle className="h-3 w-3" />
                                  </div>
                                  <div>
                                    <div className="font-medium">Teslim Edildi</div>
                                    <div className="text-xs text-gray-400">
                                      {order.status === 'Tamamlandı'
                                        ? 'Teslimat tamamlandı'
                                        : 'Bekleniyor'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Butonlar */}
                            <div className="mt-4 flex gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 hover:bg-white/10"
                              >
                                Kargo Takip
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 hover:bg-white/10"
                              >
                                Fatura İndir
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favori Ürünlerim */}
            {activeTab === "wishlist" && (
              <div className="bg-black border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Favori Ürünlerim</h2>
                <div className="text-center py-10">
                  <Heart className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Favori listeniz boş</h3>
                  <p className="text-gray-400 mb-4">Ürünler sayfasından favori ürünlerinizi seçebilirsiniz.</p>
                  <Link href="/urunler">
                    <Button className="bg-white text-black hover:bg-white/90">
                      Ürünleri Keşfet
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Profil Bilgileri */}
            {activeTab === "profile" && (
              <div className="bg-black border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Profil Bilgileri</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Ad Soyad</h3>
                    <div className="font-medium">{userProfile?.name}</div>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">E-posta Adresi</h3>
                    <div className="font-medium">{userProfile?.email}</div>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Telefon</h3>
                    <div className="font-medium">{userProfile?.phone}</div>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Adres</h3>
                    <div className="font-medium">{userProfile?.address}</div>
                  </div>

                  <Button
                    className="bg-white text-black hover:bg-white/90 w-full sm:w-auto"
                  >
                    Bilgilerimi Güncelle
                  </Button>
                </div>
              </div>
            )}

            {/* Diğer sekmeler için benzer yapı kullanılabilir */}
            {activeTab === "payment" && (
              <div className="bg-black border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Ödeme Yöntemleri</h2>
                <div className="text-center py-10">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Henüz bir ödeme yöntemi eklenmedi</h3>
                  <p className="text-gray-400 mb-4">Güvenli alışveriş için ödeme yöntemi ekleyebilirsiniz.</p>
                  <Button className="bg-white text-black hover:bg-white/90">
                    Ödeme Yöntemi Ekle
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-black border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Hesap Ayarları</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div>
                      <h3 className="font-medium">Şifre Değiştir</h3>
                      <p className="text-sm text-gray-400">Hesap güvenliğiniz için şifrenizi düzenli olarak değiştirin</p>
                    </div>
                    <Button variant="outline" className="border-white/20 hover:bg-white/10">
                      Değiştir
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div>
                      <h3 className="font-medium">E-posta Bildirimleri</h3>
                      <p className="text-sm text-gray-400">Kampanya ve indirimlerden haberdar olun</p>
                    </div>
                    <Button variant="outline" className="border-white/20 hover:bg-white/10">
                      Düzenle
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div>
                      <h3 className="font-medium text-red-400">Hesabı Sil</h3>
                      <p className="text-sm text-gray-400">Hesabınızı kalıcı olarak silin</p>
                    </div>
                    <Button variant="outline" className="border-red-800/50 text-red-400 hover:bg-red-900/20">
                      Hesabı Sil
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
