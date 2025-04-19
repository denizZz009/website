"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  PlusCircle,
  Search,
  ChevronDown,
  ArrowUpRight,
  Banknote,
  Package,
  Tags,
  Edit,
  Trash,
  FileEdit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simüle edilmiş sipariş verileri
const recentOrders = [
  { id: "ORD-5523", customer: "Ayşe Yılmaz", date: "2023-12-01", total: "₺350.00", status: "Tamamlandı" },
  { id: "ORD-5522", customer: "Mehmet Kaya", date: "2023-11-30", total: "₺220.00", status: "Baskıda" },
  { id: "ORD-5521", customer: "Zeynep Demir", date: "2023-11-29", total: "₺150.00", status: "Tamamlandı" },
  { id: "ORD-5520", customer: "Ali Öztürk", date: "2023-11-29", total: "₺450.00", status: "Hazırlanıyor" },
  { id: "ORD-5519", customer: "Selin Yıldırım", date: "2023-11-28", total: "₺180.00", status: "Tamamlandı" },
];

const statsData = [
  { name: "Toplam Sipariş", value: "245", trend: "+12%", trendUp: true },
  { name: "Toplam Ciro", value: "₺18,650", trend: "+8%", trendUp: true },
  { name: "Aktif Müşteri", value: "124", trend: "+5%", trendUp: true },
  { name: "Ortalama Sipariş", value: "₺76", trend: "-2%", trendUp: false },
];

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: ''
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    image: '',
    description: ''
  });

  // Form input değişiklikleri
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Kimlik doğrulama kontrolü (basit bir simülasyon)
   // useEffect(() => {
     // const checkAuth = async () => {
       // try {
        // Check if user is authenticated and an admin
        //  const response = await fetch('/api/auth/me');
         // const data = await response.json();

         // if (data.authenticated && data.user.isAdmin) {
           // setIsAuthenticated(true);
         // } else {
           // setIsAuthenticated(false);
         // }
       // } catch (error) {
        //  console.error('Auth check error:', error);
        //  setIsAuthenticated(false);
      // } finally {
         // setIsLoading(false);
       // }
     // };

     // checkAuth();
   // }, []);

useEffect(() => {
    // Auth check kaldırıldı - local test için
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);


  // Admin panelinden çıkış
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success("Çıkış yapıldı");
      router.push("/");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Çıkış yapılırken bir hata oluştu");
    }
  };

  // Yeni ürün ekleme
  const addNewProduct = async () => {
    try {
      // Validate required fields
      if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
        toast.error("Lütfen tüm zorunlu alanları doldurun.");
        return;
      }

      // Format the data
      const productData = {
        name: newProduct.name,
        categoryId: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        description: newProduct.description || "Ürün açıklaması bulunmuyor.",
        image: newProduct.image || "https://via.placeholder.com/300",
      };

      // Call the API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ürün eklenirken bir hata oluştu');
      }

      toast.success("Yeni ürün başarıyla eklendi");
      setShowProductForm(false);
      setNewProduct({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: ''
      });

      // Reload products (in a real app, we'd fetch products again)
      // For now, we're just simulating it
    } catch (error) {
      console.error('Add product error:', error);
      toast.error(error instanceof Error ? error.message : "Ürün eklenirken bir hata oluştu");
    }
  };

  // Yeni kategori ekleme
  const addNewCategory = async () => {
    try {
      // Validate required fields
      if (!newCategory.name || !newCategory.slug) {
        toast.error("Lütfen tüm zorunlu alanları doldurun.");
        return;
      }

      // Format the data
      const categoryData = {
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description || "Kategori açıklaması bulunmuyor.",
        image: newCategory.image || "https://via.placeholder.com/300",
      };

      // Call the API
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kategori eklenirken bir hata oluştu');
      }

      toast.success("Yeni kategori başarıyla eklendi");
      setShowCategoryForm(false);
      setNewCategory({
        name: '',
        slug: '',
        image: '',
        description: ''
      });

      // Reload categories (in a real app, we'd fetch categories again)
      // For now, we're just simulating it
    } catch (error) {
      console.error('Add category error:', error);
      toast.error(error instanceof Error ? error.message : "Kategori eklenirken bir hata oluştu");
    }
  };

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapmamış ise
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-md p-8">
          <h1 className="text-2xl font-bold mb-4">Erişim Engellendi</h1>
          <p className="text-gray-400 mb-6">Bu sayfaya erişmek için yönetici girişi yapmanız gerekmektedir.</p>
          <Link href="/auth/login">
            <Button className="bg-white text-black hover:bg-white/90">
              Giriş Yap
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Yan Menü */}
      <div className="w-64 border-r border-white/10 p-6 hidden md:block">
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-1">Galerizo</h1>
          <p className="text-xs text-gray-400">Yönetici Paneli</p>
        </div>

        <nav className="space-y-1">
          <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-white/10 rounded-lg">
            <BarChart3 className="h-5 w-5" />
            <span>Genel Bakış</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
            <ShoppingBag className="h-5 w-5" />
            <span>Siparişler</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
            <PlusCircle className="h-5 w-5" />
            <span>Ürün Ekle</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
            <Users className="h-5 w-5" />
            <span>Kullanıcılar</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
            <Banknote className="h-5 w-5" />
            <span>Raporlar</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
            <Settings className="h-5 w-5" />
            <span>Ayarlar</span>
          </a>
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="p-4 rounded-lg border border-white/10 mb-4 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-300">Yardım merkezi</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-white/20 hover:bg-white/10 flex items-center justify-center gap-2 py-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Çıkış Yap</span>
          </Button>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Yönetim Paneli</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-8">
              <p className="text-gray-400">Galerizo yönetici panelinize hoş geldiniz</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Ürün, sipariş veya müşteri ara..."
                className="pl-10 md:w-64 bg-black border-white/20"
              />
            </div>
            <Button
              className="bg-white text-black hover:bg-white/90 flex items-center gap-2"
              onClick={() => setShowProductForm(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Yeni Ürün</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-black/40 border border-white/10">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Ürünler
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Kategoriler
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Siparişler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <div key={index} className="bg-black border border-white/10 p-6 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">{stat.name}</p>
                  <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <div className={`flex items-center text-xs font-medium ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend}
                      <ArrowUpRight className={`h-3 w-3 ml-0.5 ${stat.trendUp ? '' : 'rotate-180'}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Son Siparişler */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Son Siparişler</h2>
                <Button variant="outline" className="text-sm border-white/20 hover:bg-white/10">
                  Tüm Siparişler <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 bg-black border border-white/10 rounded-lg">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Müşteri</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Toplam</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Tamamlandı' ? 'bg-green-900/30 text-green-400' :
                            order.status === 'Baskıda' ? 'bg-blue-900/30 text-blue-400' :
                            'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button variant="ghost" size="sm" className="hover:bg-white/10 text-gray-400 hover:text-white">
                            Detaylar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Ürün Yönetimi</h2>
                <Button
                  className="bg-white text-black hover:bg-white/90 flex items-center gap-2"
                  onClick={() => setShowProductForm(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Yeni Ürün Ekle</span>
                </Button>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-white/10 bg-black border border-white/10 rounded-lg">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ürün Adı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fiyat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Tommy Hilfiger Logo Tişört</td>
                      <td className="px-6 py-4 whitespace-nowrap">Tişörtler</td>
                      <td className="px-6 py-4 whitespace-nowrap">₺349,00</td>
                      <td className="px-6 py-4 whitespace-nowrap">42</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Calvin Klein Essential Tişört</td>
                      <td className="px-6 py-4 whitespace-nowrap">Tişörtler</td>
                      <td className="px-6 py-4 whitespace-nowrap">₺299,00</td>
                      <td className="px-6 py-4 whitespace-nowrap">28</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Mavi Jeans Basic Tişört</td>
                      <td className="px-6 py-4 whitespace-nowrap">Tişörtler</td>
                      <td className="px-6 py-4 whitespace-nowrap">₺199,00</td>
                      <td className="px-6 py-4 whitespace-nowrap">65</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {showProductForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                  <div className="bg-black border border-white/20 p-6 rounded-lg max-w-lg w-full">
                    <h2 className="text-xl font-bold mb-4">Yeni Ürün Ekle</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ürün Adı</label>
                        <Input
                          className="bg-black border-white/20"
                          placeholder="Ürün adını girin"
                          name="name"
                          value={newProduct.name}
                          onChange={handleProductInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Kategori</label>
                        <select
                          className="w-full p-2 rounded-md bg-black border border-white/20"
                          name="category"
                          value={newProduct.category}
                          onChange={handleProductInputChange}
                        >
                          <option value="">Kategori Seçin</option>
                          <option value="tshirt">Tişörtler</option>
                          <option value="pants">Pantolonlar</option>
                          <option value="shoes">Ayakkabılar</option>
                          <option value="accessories">Aksesuarlar</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Fiyat (₺)</label>
                          <Input
                            className="bg-black border-white/20"
                            type="number"
                            placeholder="0.00"
                            name="price"
                            value={newProduct.price}
                            onChange={handleProductInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Stok Miktarı</label>
                          <Input
                            className="bg-black border-white/20"
                            type="number"
                            placeholder="0"
                            name="stock"
                            value={newProduct.stock}
                            onChange={handleProductInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ürün Açıklaması</label>
                        <textarea
                          className="w-full p-2 rounded-md bg-black border border-white/20 min-h-24"
                          placeholder="Ürün açıklamasını girin"
                          name="description"
                          value={newProduct.description}
                          onChange={handleProductInputChange}
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ürün Görseli URL</label>
                        <Input
                          className="bg-black border-white/20"
                          placeholder="https://..."
                          name="image"
                          value={newProduct.image}
                          onChange={handleProductInputChange}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6 space-x-3">
                      <Button
                        variant="ghost"
                        onClick={() => setShowProductForm(false)}
                        className="hover:bg-white/10"
                      >
                        İptal
                      </Button>
                      <Button
                        className="bg-white text-black hover:bg-white/90"
                        onClick={addNewProduct}
                      >
                        Ürünü Ekle
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Kategori Yönetimi</h2>
                <Button
                  className="bg-white text-black hover:bg-white/90 flex items-center gap-2"
                  onClick={() => setShowCategoryForm(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Yeni Kategori Ekle</span>
                </Button>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-white/10 bg-black border border-white/10 rounded-lg">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Kategori Adı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ürün Sayısı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">URL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Tişörtler</td>
                      <td className="px-6 py-4 whitespace-nowrap">48</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">/urunler/tisortler</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Ayakkabılar</td>
                      <td className="px-6 py-4 whitespace-nowrap">36</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">/urunler/ayakkabilar</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Gözlükler</td>
                      <td className="px-6 py-4 whitespace-nowrap">12</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">/urunler/gozlukler</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {showCategoryForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                  <div className="bg-black border border-white/20 p-6 rounded-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">Yeni Kategori Ekle</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Kategori Adı</label>
                        <Input
                          className="bg-black border-white/20"
                          placeholder="Kategori adını girin"
                          name="name"
                          value={newCategory.name}
                          onChange={handleCategoryInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">URL (slug)</label>
                        <Input
                          className="bg-black border-white/20"
                          placeholder="kategori-slug"
                          name="slug"
                          value={newCategory.slug}
                          onChange={handleCategoryInputChange}
                        />
                        <p className="text-xs text-gray-400 mt-1">Örn: "tisortler", "ayakkabilar"</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Görsel URL</label>
                        <Input
                          className="bg-black border-white/20"
                          placeholder="https://..."
                          name="image"
                          value={newCategory.image}
                          onChange={handleCategoryInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Açıklama</label>
                        <textarea
                          className="w-full p-2 rounded-md bg-black border border-white/20 min-h-20"
                          placeholder="Kategori açıklamasını girin"
                          name="description"
                          value={newCategory.description}
                          onChange={handleCategoryInputChange}
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6 space-x-3">
                      <Button
                        variant="ghost"
                        onClick={() => setShowCategoryForm(false)}
                        className="hover:bg-white/10"
                      >
                        İptal
                      </Button>
                      <Button
                        className="bg-white text-black hover:bg-white/90"
                        onClick={addNewCategory}
                      >
                        Kategori Ekle
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Sipariş Yönetimi</h2>
                <div className="flex space-x-2">
                  <select className="bg-black border border-white/20 rounded-md p-2 text-sm">
                    <option value="all">Tüm Siparişler</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="pending">Beklemede</option>
                    <option value="processing">İşleniyor</option>
                  </select>
                  <Button variant="outline" className="text-sm border-white/20 hover:bg-white/10">
                    Filtrele
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 bg-black border border-white/10 rounded-lg">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Müşteri</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Toplam</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Tamamlandı' ? 'bg-green-900/30 text-green-400' :
                            order.status === 'Baskıda' ? 'bg-blue-900/30 text-blue-400' :
                            'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 p-1 h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 h-8">
                              Detaylar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
