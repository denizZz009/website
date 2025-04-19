"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, LogIn, ChevronDown, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import Image from "next/image"; // Import the Image component

const menuItems = [
  { name: "Ana Sayfa", href: "/" },
  {
    name: "Kategoriler",
    href: "/urunler",
    submenu: [
      { name: "Tişörtler", href: "/urunler/tisortler" },
      { name: "Parfümler", href: "/urunler/parfumler" },
      { name: "Ayakkabılar", href: "/urunler/ayakkabilar" },
      { name: "Gözlükler", href: "/urunler/gozlukler" }
    ]
  },
  {
    name: "Tişörtler",
    href: "/urunler/tisortler",
    submenu: [
      { name: "Tommy Hilfiger", href: "/urunler/tommy-hilfiger" },
      { name: "Calvin Klein", href: "/urunler/calvin-klein" },
      { name: "EA7", href: "/urunler/ea7" },
      { name: "Mavi", href: "/urunler/mavi" },
      { name: "Columbia", href: "/urunler/columbia" },
      { name: "Hermes", href: "/urunler/hermes" },
      { name: "Tüm Markalar", href: "/urunler" },
    ]
  },
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "İade & Gizlilik", href: "/iade-gizlilik" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Use the auth hook to get authentication state
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  // Client-side kullanılacak kodlar için mounted kontrolü
  useEffect(() => {
    setMounted(true);

    // Restore dynamic cart count calculation
    const updateCartItemCount = () => {
      try {
        const cart = localStorage.getItem('cart');
        if (cart) {
          const cartItems = JSON.parse(cart);
          const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
          setCartItemCount(itemCount);
        } else {
          setCartItemCount(0);
        }
      } catch (e) {
        console.error("Cart count error:", e);
        setCartItemCount(0);
      }
    };

    updateCartItemCount();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    // Listen for storage changes to update cart count when modified from another page
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        updateCartItemCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Add a custom event listener to detect cart changes within the same page
    const handleCartUpdate = () => updateCartItemCount();
    document.addEventListener('cartUpdated', handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success("Başarıyla çıkış yapıldı");
        router.push("/");
      } else {
        toast.error(result.error || "Çıkış yapılırken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Çıkış yapılırken bir hata oluştu");
    }
  };

  const renderUserMenu = () => {
    if (!mounted) return null;

    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <User className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1 bg-black/95 border-white/10 text-white">
            <div className="p-2 border-b border-white/10">
              <p className="font-medium">{user?.username}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/hesabim" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Hesabım</span>
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Paneli</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={() => router.push('/auth/login')}
      >
        <LogIn className="h-5 w-5 text-white" />
      </Button>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-md py-2"
          : "bg-black py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo - Galerizo Branding */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/galerizo-logo.png"
            alt="Galerizo Logo"
            width={220}
            height={60}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {menuItems.map((item) => {
              if (item.submenu) {
                return (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuTrigger
                      className={cn(
                        "glow-effect transition-colors",
                        pathname.startsWith(item.href)
                          ? "bg-white/10"
                          : ""
                      )}
                    >
                      {item.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-black">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white glow-effect",
                                  pathname === subItem.href ? "bg-white/5" : ""
                                )}
                              >
                                <div className="text-sm font-medium leading-none text-white">{subItem.name}</div>
                                <div className="line-clamp-2 text-xs text-gray-400 mt-1">
                                  Çeşitli ürünleri görüntüleyin ve sipariş verin.
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }

              return (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "glow-effect transition-colors relative overflow-hidden",
                        pathname === item.href
                          ? "before:absolute before:inset-0 before:border-b before:border-white"
                          : ""
                      )}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Cart, Login and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          {renderUserMenu()}

          <Link href="/sepet">
            <Button
              variant="ghost"
              size="icon"
              className="relative glow-effect transition-transform hover:scale-110 h-10 w-10 flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {mounted && cartItemCount > 0 && (
                <div
                  className="absolute -top-1 -right-1 bg-white text-black rounded-full flex items-center justify-center"
                  style={{
                    minWidth: '14px',
                    height: '14px',
                    padding: '0 2px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    transform: 'translate(0, 0)'
                  }}
                >
                  {cartItemCount}
                </div>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden glow-effect"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-t border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block py-2 text-base font-medium transition-all glow-effect",
                        pathname === item.href
                          ? "text-white pl-2 border-l border-white"
                          : "text-gray-300"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.submenu && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pl-4 mt-2 space-y-2"
                      >
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={cn(
                                "block py-1 text-sm transition-all glow-effect",
                                pathname === subItem.href
                                  ? "text-white pl-2 border-l border-white"
                                  : "text-gray-400"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </li>
                ))}

                {/* Mobil Menüde Giriş Butonu */}
                {mounted && !isAuthenticated && (
                  <li className="mt-4 pt-4 border-t border-gray-800">
                    <Link
                      href="/auth/login"
                      className="flex items-center py-2 text-base font-medium text-white glow-effect"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Giriş Yap
                    </Link>
                  </li>
                )}

                {/* Mobil Menüde Hesabım Butonu */}
                {mounted && isAuthenticated && (
                  <li className="mt-4 pt-4 border-t border-gray-800">
                    <Link
                      href="/hesabim"
                      className="flex items-center py-2 text-base font-medium text-white glow-effect"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Hesabım
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center py-2 text-base font-medium text-white glow-effect mt-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 mr-2" />
                        Yönetici Paneli
                      </Link>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
