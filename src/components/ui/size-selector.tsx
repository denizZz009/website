"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

type SizeSelectorProps = {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAddToCart: (product: any, size: string) => void;
};

export function SizeSelector({ isOpen, onClose, product, onAddToCart }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Lütfen bir beden seçin");
      return;
    }

    setIsAdding(true);

    // Simüle edilmiş ekleme gecikmesi (gerçek uygulamada API çağrısı olabilir)
    setTimeout(() => {
      onAddToCart(product, selectedSize);
      setIsAdding(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black text-white border border-white/20 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Beden Seçin</DialogTitle>
          <DialogDescription className="text-gray-400">
            {product?.name || "Ürün"} için beden seçimi yapın.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 py-4">
          {sizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={selectedSize === size ? "default" : "outline"}
              className={
                selectedSize === size
                  ? "bg-white text-black hover:bg-white/90"
                  : "border-white/20 hover:bg-white/10 hover:text-white"
              }
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>

        <div className="py-2">
          <p className="text-sm text-gray-400">
            Not: Beden değişimi için müşteri hizmetlerimizle iletişime geçebilirsiniz.
          </p>
        </div>

        <DialogFooter className="pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            İptal
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-white text-black hover:bg-white/90"
          >
            {isAdding ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                Ekleniyor...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Sepete Ekle
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
