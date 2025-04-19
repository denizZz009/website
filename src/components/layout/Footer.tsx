"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white">Galerizo</h3>
            <p className="text-gray-400">
              Premium markalar, uygun fiyatlar. Kaliteli tişörtleri herkes için erişilebilir kılıyoruz.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <MapPin className="h-4 w-4 text-white" />
                <span>İstanbul, Türkiye</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-white" />
                <span>+90 212 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-white" />
                <span>info@galerizo.com</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1 h-1 mr-2 bg-white rounded-full"></span>
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  href="/urunler"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1 h-1 mr-2 bg-white rounded-full"></span>
                  Markalar
                </Link>
              </li>
              <li>
                <Link
                  href="/kategoriler"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1 h-1 mr-2 bg-white rounded-full"></span>
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link
                  href="/yeni-gelenler"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1 h-1 mr-2 bg-white rounded-full"></span>
                  Yeni Gelenler
                </Link>
              </li>
              <li>
                <Link
                  href="/hakkimizda"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1 h-1 mr-2 bg-white rounded-full"></span>
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/iade-gizlilik"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1 h-1 mr-2 bg-white rounded-full"></span>
                  İade & Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white">Ödeme Seçenekleri</h3>
            <div className="flex flex-wrap gap-2">
              <div className="py-1 px-2 bg-black border border-white/20 rounded-md transition-colors hover:border-white/50">Visa</div>
              <div className="py-1 px-2 bg-black border border-white/20 rounded-md transition-colors hover:border-white/50">Mastercard</div>
              <div className="py-1 px-2 bg-black border border-white/20 rounded-md transition-colors hover:border-white/50">PayPal</div>
              <div className="py-1 px-2 bg-black border border-white/20 rounded-md transition-colors hover:border-white/50">Havale</div>
              <div className="py-1 px-2 bg-black border border-white/20 rounded-md transition-colors hover:border-white/50">Kapıda Ödeme</div>
            </div>
            <div className="bg-black/40 border border-white/10 p-3 text-sm text-gray-400">
              <p>
                Tüm ödemeleriniz 256-bit SSL ile güvenle şifrelenmiştir.
              </p>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white">Bültenimize Abone Olun</h3>
            <p className="text-gray-400">
              Yeni gelen ürünler, kampanyalar ve indirimlerden haberdar olmak için bültenimize abone olun.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 rounded-md border border-white/20 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-white/50 focus:outline-none"
              />
              <Button className="bg-white text-black hover:bg-white/90">Abone Ol</Button>
            </div>
          </motion.div>
        </div>

        {/* Social Media and Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500 text-center md:text-right italic mb-1">
              "Şıklığın Yeni Adresi <span className="text-yellow-400 font-bold">Galerizo</span>!"
            </p>
            <p className="text-sm text-gray-400 text-center md:text-right">
              © {year} <span className="text-white font-medium">Galerizo</span>. Tüm Hakları Saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
