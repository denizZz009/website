"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Shirt,
  Tag,
  Box,
  Truck,
  CreditCard,
  ShieldCheck,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <BadgeCheck className="h-10 w-10" />,
    title: "Orijinal Ürünler",
    description: "Tommy Hilfiger, Calvin Klein, EA7 ve diğer premium markaların %100 orijinal ürünleri."
  },
  {
    icon: <Tag className="h-10 w-10" />,
    title: "Uygun Fiyatlar",
    description: "Piyasanın çok altında fiyatlarla premium markaları sizlere sunuyoruz."
  },
  {
    icon: <Shirt className="h-10 w-10" />,
    title: "Yüksek Kalite",
    description: "Yüksek kaliteli kumaş ve üretim teknikleri ile uzun ömürlü tişörtler."
  },
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Geniş Model Seçeneği",
    description: "Polo yaka, v yaka, slim fit, oversize ve daha fazla model seçeneği."
  },
  {
    icon: <Truck className="h-10 w-10" />,
    title: "Hızlı Teslimat",
    description: "Siparişleriniz özenle paketlenerek hızlı bir şekilde kapınıza teslim edilir."
  },
  {
    icon: <ShieldCheck className="h-10 w-10" />,
    title: "Güvenli Alışveriş",
    description: "Güvenli ödeme altyapımız ve kolay iade politikamız ile güvenle alışveriş yapın."
  }
];

const process = [
  {
    number: "01",
    title: "Seçim Yapın",
    description: "Beğendiğiniz marka ve modeli seçin."
  },
  {
    number: "02",
    title: "Sepete Ekleyin",
    description: "Bedenini seçerek sepetinize ekleyin."
  },
  {
    number: "03",
    title: "Sipariş Verin",
    description: "Ödemenizi güvenle yapın ve siparişinizi tamamlayın."
  },
  {
    number: "04",
    title: "Teslim Alın",
    description: "Hızlı kargo ile ürününüz kapınıza gelsin."
  }
];

export default function BrandFeatures() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Features Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Neden Galerizo?
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Premium markaların tişörtlerini uygun fiyata satın alabileceğiniz tek adres. Kalite ve şıklığı ucuza sunuyoruz.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-black border border-white/10 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-white mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Brand Showcase */}
        <div className="mb-20 relative">
          <motion.div
            className="relative h-[500px] bg-black border border-white/10 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop"
              alt="Premium Marka Tişörtler"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-black/40 flex items-center">
              <div className="p-10 text-white max-w-lg">
                <h3 className="text-3xl font-bold mb-4">Premium Markalar, Uygun Fiyatlar</h3>
                <p className="mb-6 text-gray-300">
                  Tommy Hilfiger, Calvin Klein, EA7, Mavi, Columbia, Hermes ve daha fazla dünyaca ünlü markanın tişörtleri Galerizo farkıyla sizleri bekliyor.
                </p>
                <Link href="/urunler">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90">
                    Şimdi Alışverişe Başla
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Process Section */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Nasıl Çalışır?
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Alışveriş yapmak çok kolay
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((step, index) => (
            <motion.div
              key={index}
              className="text-center relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-black text-xl font-bold mb-4">
                {step.number}
              </div>
              {index < process.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-[calc(50%-2rem)] h-[2px] bg-white/20">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-t-2 border-r-2 border-white/20"></div>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/urunler">
            <Button size="lg" className="mr-4 bg-white text-black hover:bg-white/90">
              Alışverişe Başla
            </Button>
          </Link>
          <Link href="/hakkimizda">
            <Button size="lg" variant="outline" className="border-white/20 bg-black text-white hover:bg-white/10">
              Hakkımızda
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
