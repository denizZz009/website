"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Printer, Download, Mail, Home, Share, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // E-posta bildirim değişkenleri
  const [email, setEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Animasyon durumunu başlat
    setIsAnimating(true);

    // Generate random order ID
    const randomOrderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    setOrderId(randomOrderId);

    // Get cart items before clearing
    if (typeof window !== 'undefined') {
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);

          // Calculate subtotal
          const calculatedSubtotal = parsedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
          setSubtotal(calculatedSubtotal);

          // Clear cart
          localStorage.removeItem("cart");
        }
      } catch (error) {
        console.error("Error processing cart:", error);
      }
    }

    // Simüle edilmiş toplam
    setOrderTotal("₺" + subtotal.toLocaleString('tr-TR'));

    // Bugünün tarihi
    const date = new Date();
    setOrderDate(date.toLocaleDateString('tr-TR'));

    // 5 saniye sonra animasyonu durdur
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [subtotal]);

  // Çemberin dönüş animasyonu
  const circleAnimation = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  // İç içe olan çemberin animasyonu
  const checkAnimation = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.5,
        ease: "easeInOut"
      }
    }
  };

  // E-posta ile sipariş detaylarını gönder
  const sendOrderDetails = () => {
    if (!email) return;

    setSendingEmail(true);

    // Simüle edilmiş e-posta gönderimi (gerçek uygulamada API çağrısı yapılır)
    setTimeout(() => {
      setSendingEmail(false);
      setEmailSent(true);
      toast.success("Sipariş detayları e-posta adresinize gönderildi.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* Başarı animasyonu */}
        <div className="mb-8 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 relative mx-auto w-24 h-24"
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 50 50"
            >
              <motion.circle
                cx="25"
                cy="25"
                r="23"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <motion.circle
                cx="25"
                cy="25"
                r="23"
                fill="none"
                stroke="white"
                strokeWidth="2"
                variants={circleAnimation}
                initial="hidden"
                animate={isAnimating ? "visible" : "hidden"}
              />
              <motion.path
                d="M16 25 L22 32 L34 18"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={checkAnimation}
                initial="hidden"
                animate={isAnimating ? "visible" : "hidden"}
              />
            </svg>
          </motion.div>

          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ödeme Başarılı!
          </motion.h1>

          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Siparişiniz alındı ve işleme alındı. Teşekkürler!
          </motion.p>
        </div>

        {/* Sipariş Bilgileri */}
        <motion.div
          className="bg-black border border-white/10 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Sipariş Bilgileri</h2>
            <span className="text-xs bg-white/10 px-2 py-1 rounded">Tamamlandı</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Sipariş ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Tarih</p>
              <p className="font-medium">{orderDate}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Toplam</p>
              <p className="font-medium">{orderTotal}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Ödeme Yöntemi</p>
              <p className="font-medium">Kredi Kartı</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Tahmini Teslim Tarihi</span>
              <span className="font-medium">3-5 İş Günü</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-1">
                <div className="w-2 h-2 bg-white rounded-full mt-1"></div>
                <div className="flex-1 h-1 bg-white/20 mx-1 mt-1.5">
                  <div className="w-1/3 h-1 bg-white"></div>
                </div>
                <div className="w-2 h-2 bg-white/20 rounded-full mt-1"></div>
              </div>
              <span className="ml-2 text-xs text-gray-400">Hazırlanıyor</span>
            </div>
          </div>
        </motion.div>

        {/* Sipariş Özeti */}
        <motion.div
          className="bg-black border border-white/10 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-4 text-white">Sipariş Özeti</h2>

          <div className="divide-y divide-white/10">
            {cartItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-3">
                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-800">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">
                    {item.size && `Beden: ${item.size}`}
                    {item.color && ` • Renk: ${item.color}`}
                    {` • Adet: ${item.quantity}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">
                    ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-4 pt-4">
            <div className="flex justify-between text-gray-400">
              <span>Toplam</span>
              <span className="font-bold text-white">₺{subtotal.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        </motion.div>

        {/* Butonlar */}
        <div className="flex flex-col space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button
              className="w-full bg-white text-black hover:bg-white/90 flex items-center justify-center"
              onClick={() => window.location.href = "/hesabim"}
            >
              <Printer className="mr-2 h-4 w-4" />
              Fatura İndir
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 flex items-center justify-center"
              onClick={() => window.location.href = "/hesabim"}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Siparişlerim
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfaya Dön
              </Button>
            </Link>
          </motion.div>

          {/* E-posta bildirim seçeneği */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <div className="mb-2">
              <p className="text-sm font-medium mb-2">Sipariş bilgilerini e-posta ile alın</p>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black border-white/20 text-white focus:border-white/50"
                  disabled={sendingEmail || emailSent}
                />
                <Button
                  onClick={sendOrderDetails}
                  disabled={!email || sendingEmail || emailSent}
                  className={`flex items-center whitespace-nowrap ${emailSent ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
                >
                  {sendingEmail ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Gönderiliyor
                    </span>
                  ) : emailSent ? (
                    <span className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Gönderildi
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Gönder
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Sipariş detaylarınızı ve takip bilgilerinizi içeren bir e-posta alacaksınız.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Sipariş e-posta onayı */}
        <motion.p
          className="text-xs text-gray-400 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <Mail className="h-3 w-3 inline-block mr-1" />
          Sipariş onayı sisteme kayıtlı e-posta adresinize otomatik olarak gönderildi.
        </motion.p>
      </div>
    </div>
  );
}
