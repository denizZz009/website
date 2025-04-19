"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Şıklık ve Rahatlık Bir Arada",
    description: "Tommy Hilfiger, Calvin Klein, EA7 ve daha birçok premium markadan tişörtler, uygun fiyatlarla Galerizo'da.",
    cta: "Koleksiyonu Keşfet",
    ctaLink: "/urunler",
    icon: <ShoppingBag className="h-12 w-12 text-white" />
  },
  {
    title: "Uygun Fiyata Kaliteli Markalar",
    description: "Orijinal ve kaliteli markaları, piyasanın çok altında fiyatlarla sizlere sunuyoruz. Galerizo farkıyla ucuz ve kaliteli giyim.",
    cta: "Hemen İncele",
    ctaLink: "/urunler",
    icon: <Tag className="h-12 w-12 text-white" />
  },
  {
    title: "Yeni Sezon Koleksiyonlar",
    description: "Mavi, Columbia, Hermes ve daha fazla markaya ait en yeni sezon ürünler Galerizo'da sizi bekliyor.",
    cta: "Yeni Gelenlere Göz At",
    ctaLink: "/yeni-gelenler",
    icon: <TrendingUp className="h-12 w-12 text-white" />
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Otomatik slayt geçişi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] bg-black overflow-hidden">
      {/* Slogan */}
      <div className="absolute top-0 left-0 right-0 bg-white/10 backdrop-blur-sm z-20 py-2 border-b border-white/20">
        <div className="container mx-auto text-center">
          <p className="text-white font-bold text-lg md:text-xl italic">
            "Şıklığın Yeni Adresi <span className="text-yellow-400">Galerizo</span>!"
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl text-white">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                y: index === currentSlide ? 0 : 20,
              }}
              transition={{ duration: 0.5 }}
              className={`${index === currentSlide ? "block" : "hidden"}`}
            >
              <div className="flex items-center mb-6">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="mr-4"
                >
                  {slide.icon}
                </motion.div>
                <motion.h1
                  className="text-4xl md:text-6xl font-bold relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.title.split(" ")[0]}{" "}
                  <span className="opacity-80">
                    {slide.title.split(" ").slice(1).join(" ")}
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 h-1 bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </motion.h1>
              </div>
              <motion.p
                className="text-lg md:text-xl mb-10 text-gray-300 bg-white/5 backdrop-blur-sm p-4 border border-white/10 rounded-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {slide.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-x-4"
              >
                <Link href={slide.ctaLink}>
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 glow-effect"
                  >
                    {slide.cta}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/markalar">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/10 glow-effect"
                  >
                    Tüm Markalar
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Slider Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-12" : "bg-white/30 w-3"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/20 hover:border-white/50 glow-effect"
        aria-label="Previous slide"
      >
        <ChevronRight className="h-6 w-6 rotate-180" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/20 hover:border-white/50 glow-effect"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
}
