"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Merve Yılmaz",
    title: "Tasarımcı",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
    rating: 5,
    comment: "Tommy Hilfiger tişörtümü çok uygun bir fiyata Galerizo'dan aldım. Kalitesi mükemmel ve kesinlikle orijinal. Tam beden ölçülerine uygun ve teslimat da çok hızlıydı."
  },
  {
    id: 2,
    name: "Kerem Demir",
    title: "Yazılım Geliştirici",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop",
    rating: 5,
    comment: "EA7 tişörtlerinin normalde ne kadar pahalı olduğunu biliyorum. Galerizo'de yarı fiyatına buldum ve kalitesinden çok memnun kaldım. Kesinlikle tavsiye ediyorum."
  },
  {
    id: 3,
    name: "Zeynep Şahin",
    title: "Pazarlama Uzmanı",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2564&auto=format&fit=crop",
    rating: 4,
    comment: "Mavi marka 3 tane tişört aldım, hepsi de kaliteli ve orijinal. Bu kadar uygun fiyata bu kaliteyi bulamayacağımı düşünüyordum. Galerizo'yu herkese öneriyorum."
  },
  {
    id: 4,
    name: "Ali Öztürk",
    title: "Yönetici",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop",
    rating: 5,
    comment: "Mavi marka 3 tane tişört aldım, hepsi de kaliteli ve orijinal. Bu kadar uygun fiyata bu kaliteyi bulamayacağımı düşünüyordum. Galerizo'yu herkese öneriyorum."
  },
  {
    id: 5,
    name: "Selin Yıldırım",
    title: "Öğrenci",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    rating: 5,
    comment: "Mavi marka 3 tane tişört aldım, hepsi de kaliteli ve orijinal. Bu kadar uygun fiyata bu kaliteyi bulamayacağımı düşünüyordum. Galerizo'yu herkese öneriyorum."
  }
];

export default function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Müşterilerimizin Yorumları
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Binlerce memnun müşterimizden bazılarının deneyimleri
          </motion.p>
        </div>

        {/* Testimonials Carousel */}
        <Carousel
          ref={carouselRef}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="py-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full bg-black border border-white/10 text-white">
                    <CardContent className="p-6">
                      {/* Stars */}
                      <div className="flex mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating ? "text-white fill-white" : "text-gray-700"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-gray-400 mb-6">&ldquo;{testimonial.comment}&rdquo;</p>

                      {/* Person */}
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{testimonial.name}</h4>
                          <p className="text-sm text-gray-400">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="static relative transform-none translate-y-0 bg-black text-white border-white/20 hover:bg-white/10" />
            <CarouselNext className="static relative transform-none translate-y-0 bg-black text-white border-white/20 hover:bg-white/10" />
          </div>
        </Carousel>

        {/* Rating Summary */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-8 w-8 mx-1 text-white fill-white"
              />
            ))}
          </div>
          <p className="text-xl font-bold mb-2 text-white">4.9 / 5 Ortalama Puan</p>
          <p className="text-gray-400">10,000+ mutlu müşteri</p>
        </motion.div>
      </div>
    </section>
  );
}
