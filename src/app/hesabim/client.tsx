"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  CheckCircle,
  Edit,
  Save,
  X,
  Loader2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuthContext } from "@/components/layout/AuthProvider";
import AuthWrapper from "@/components/layout/AuthWrapper";
import { api } from "@/lib/api";

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

export default function AccountClient() {
  return (
    <AuthWrapper requireAuth={true} fallback={<NotAuthenticatedFallback />}>
      <AccountPageContent />
    </AuthWrapper>
  );
}

function AccountPageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const { user, logout, updateProfile, changePassword } = useAuthContext();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || "+90 555 123 4567",
    address: user?.address || "Merkez Mah. Atatürk Cad. No: 123 Daire: 5 Kadıköy/İstanbul",
    profileImage: null
  });

  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Load user profile
  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.username,
        email: user.email,
        phone: user.phone || "+90 555 123 4567",
        address: user.address || "Merkez Mah. Atatürk Cad. No: 123 Daire: 5 Kadıköy/İstanbul",
        profileImage: null
      });
    }
  }, [user]);

  // Load orders from API
  useEffect(() => {
    if (activeTab === "orders" && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await api.orders.getUserOrders();

      if (response.status === "success" && response.orders) {
        setOrders(response.orders);
      } else {
        // Boş sipariş listesi göster
        setOrders([]);
        toast.error("Siparişler yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Boş sipariş listesi göster
      setOrders([]);
      toast.error("Siparişler yüklenirken bir hata oluştu");
    } finally {
      setIsLoadingOrders(false);
    }
  };

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

  const handleProfileUpdate = async () => {
    if (!user) return;

    // Call API to update user profile
    const result = await updateProfile({
      username: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      address: userProfile.address
    });

    if (result.success) {
      toast.success(result.message || "Profil başarıyla güncellendi");
      setIsEditingProfile(false);

      if (result.requiresVerification) {
        toast.info("E-posta adresinizi doğrulamak için lütfen gelen kutunuzu kontrol edin.");
      }
    } else {
      toast.error(result.error || "Profil güncellenirken bir hata oluştu");
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    try {
      setIsSubmittingPassword(true);

      // Call API to change password
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        toast.success(result.message || "Şifre değişikliği için e-posta adresinize bir doğrulama bağlantısı gönderildi.");
        setIsPasswordDialogOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(result.error || "Şifre değiştirilirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Şifre değiştirilirken bir hata oluştu");
    } finally {
      setIsSubmittingPassword(false);
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
                  <h2 className="font-bold">{userProfile.name}</h2>
                  <p className="text-sm text-gray-400">{userProfile.email}</p>
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

                {isLoadingOrders ? (
                  <div className="text-center py-10">
                    <Loader2 className="h-12 w-12 mx-auto text-gray-500 mb-4 animate-spin" />
                    <p className="text-gray-400 mb-4">Siparişleriniz yükleniyor...</p>
                  </div>
                ) : orders.length === 0 ? (
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
                    {orders.map((order) => (
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

            {/* Profil Bilgileri */}
            {activeTab === "profile" && (
              <div className="bg-black border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Profil Bilgileri</h2>
                <div className="space-y-6">
                  {isEditingProfile ? (
                    <>
                      <div>
                        <h3 className="text-sm text-gray-400 mb-2">Ad Soyad</h3>
                        <Input
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-400 mb-2">E-posta Adresi</h3>
                        <Input
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-400 mb-2">Telefon</h3>
                        <Input
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                        />
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-400 mb-2">Adres</h3>
                        <Input
                          value={userProfile.address}
                          onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                        />
                      </div>

                      <Button
                        onClick={handleProfileUpdate}
                        className="bg-white text-black hover:bg-white/90 w-full sm:w-auto"
                      >
                        Bilgilerimi Güncelle
                      </Button>
                      <Button
                        onClick={() => setIsEditingProfile(false)}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        İptal
                      </Button>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm text-gray-400 mb-2">Ad Soyad</h3>
                        <div className="font-medium">{userProfile.name}</div>
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-400 mb-2">E-posta Adresi</h3>
                        <div className="font-medium">{userProfile.email}</div>
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-400 mb-2">Telefon</h3>
                        <div className="font-medium">{userProfile.phone}</div>
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-400 mb-2">Adres</h3>
                        <div className="font-medium">{userProfile.address}</div>
                      </div>

                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Düzenle
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Hesap Ayarları */}
            {activeTab === "settings" && (
              <div className="bg-black border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Hesap Ayarları</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div>
                      <h3 className="font-medium">Şifre Değiştir</h3>
                      <p className="text-sm text-gray-400">Hesap güvenliğiniz için şifrenizi düzenli olarak değiştirin</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                      onClick={() => setIsPasswordDialogOpen(true)}
                    >
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

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="bg-black border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Şifre Değiştir</DialogTitle>
            <DialogDescription className="text-gray-400">
              Hesap güvenliğiniz için şifrenizi düzenli olarak değiştirin.
              Değişiklik yapıldıktan sonra e-posta adresinize doğrulama linki gönderilecektir.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mevcut Şifre</label>
              <Input
                type="password"
                className="bg-black border-white/20"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Yeni Şifre</label>
              <Input
                type="password"
                className="bg-black border-white/20"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
              <p className="text-xs text-gray-400">Şifreniz en az 8 karakter olmalıdır.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Yeni Şifre (Tekrar)</label>
              <Input
                type="password"
                className="bg-black border-white/20"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              className="border-white/20 hover:bg-white/10"
              onClick={() => setIsPasswordDialogOpen(false)}
            >
              İptal
            </Button>
            <Button
              className="bg-white text-black hover:bg-white/90"
              onClick={handlePasswordChange}
              disabled={isSubmittingPassword}
            >
              {isSubmittingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Şifre Değiştir
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
