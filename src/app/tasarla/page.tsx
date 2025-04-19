"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Printer,
  PaintBucket,
  Type,
  Image as ImageIcon,
  Download,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Trash2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Kağıt boyutları (piksel cinsinden, 300dpi varsayarak)
const PAPER_SIZES = {
  "A3": { width: 3508, height: 4961 },
  "A4": { width: 2480, height: 3508 },
  "A5": { width: 1748, height: 2480 },
  "10x15": { width: 1181, height: 1772 },
  "US Letter": { width: 2550, height: 3300 },
  "Kare (20x20)": { width: 2362, height: 2362 },
};

export default function DesignPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState("#FFFFFF");
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "text" | "image">("pen");
  const [text, setText] = useState("");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [paperSize, setPaperSize] = useState<keyof typeof PAPER_SIZES>("A4");
  const [canvasScale, setCanvasScale] = useState(0.4); // Canvas'ın görünüm ölçeği
  const [uploadedImage, setUploadedImage] = useState<{
    element: HTMLImageElement | null;
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    isResizing: boolean;
    isDragging: boolean;
  }>({
    element: null,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    scale: 1,
    isResizing: false,
    isDragging: false
  });

  // Canvas'ı başlat
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Canvas boyutunu kağıt boyutuna göre ayarla
    const paperDimensions = PAPER_SIZES[paperSize];
    canvas.width = paperDimensions.width;
    canvas.height = paperDimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas'ı temiz siyah ile doldur
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // İlk boş durumu kaydet
    const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialState]);
    setHistoryIndex(0);

    // Yüklenen görseli canvas'a çiz
    redrawCanvas();
  }, [paperSize]);

  // Canvas'ı yeniden çiz
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || historyIndex < 0 || !history[historyIndex]) return;

    // Son durumu yükle
    ctx.putImageData(history[historyIndex], 0, 0);

    // Eğer yüklenmiş bir görsel varsa, çiz
    if (uploadedImage.element) {
      ctx.drawImage(
        uploadedImage.element,
        uploadedImage.x,
        uploadedImage.y,
        uploadedImage.width * uploadedImage.scale,
        uploadedImage.height * uploadedImage.scale
      );
    }
  };

  // Çizim başlatma
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    // Ölçeklemeyi hesaba kat
    const x = (e.clientX - rect.left) / canvasScale;
    const y = (e.clientY - rect.top) / canvasScale;

    // Görsel taşıma/yeniden boyutlandırma kontrolü
    if (uploadedImage.element) {
      const imgRight = uploadedImage.x + (uploadedImage.width * uploadedImage.scale);
      const imgBottom = uploadedImage.y + (uploadedImage.height * uploadedImage.scale);

      // Fare görselin içinde mi?
      if (
        x >= uploadedImage.x &&
        x <= imgRight &&
        y >= uploadedImage.y &&
        y <= imgBottom
      ) {
        // Köşeye yakın mı (yeniden boyutlandırma)
        const cornerSize = 20;
        if (
          x >= imgRight - cornerSize &&
          x <= imgRight &&
          y >= imgBottom - cornerSize &&
          y <= imgBottom
        ) {
          setUploadedImage({
            ...uploadedImage,
            isResizing: true
          });
        } else {
          // Taşıma
          setUploadedImage({
            ...uploadedImage,
            isDragging: true
          });
        }
        return;
      }
    }

    if (tool === "pen") {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    } else if (tool === "text" && text) {
      ctx.font = `${brushSize * 3}px Arial`;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      saveState();
    }
  };

  // Çizim yapma
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    // Ölçeklemeyi hesaba kat
    const x = (e.clientX - rect.left) / canvasScale;
    const y = (e.clientY - rect.top) / canvasScale;

    // Görsel taşıma/yeniden boyutlandırma
    if (uploadedImage.element) {
      if (uploadedImage.isResizing) {
        // Yeniden boyutlandırma
        const newWidth = x - uploadedImage.x;
        const aspectRatio = uploadedImage.height / uploadedImage.width;
        const newHeight = newWidth * aspectRatio;

        const newScale = newWidth / uploadedImage.width;

        if (newScale > 0.1) { // Min ölçek kontrolü
          setUploadedImage({
            ...uploadedImage,
            scale: newScale
          });
          redrawCanvas();
        }
        return;
      } else if (uploadedImage.isDragging) {
        // Taşıma
        setUploadedImage({
          ...uploadedImage,
          x: x - (uploadedImage.width * uploadedImage.scale / 2),
          y: y - (uploadedImage.height * uploadedImage.scale / 2)
        });
        redrawCanvas();
        return;
      }
    }

    if (!isDrawing || tool !== "pen") return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Çizimi bitirme
  const endDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }

    // Görsel işlemleri bitir
    if (uploadedImage.isResizing || uploadedImage.isDragging) {
      setUploadedImage({
        ...uploadedImage,
        isResizing: false,
        isDragging: false
      });
      saveState();
    }
  };

  // Durumu kaydetme (geri alma için)
  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Geri alma
  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const newIndex = historyIndex - 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  // İleri alma
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const newIndex = historyIndex + 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  // Tasarımı kaydetme
  const saveDesign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsLoading(true);

    try {
      const image = canvas.toDataURL("image/png");

      // Gerçek bir uygulama için burada sunucuya gönderme işlemi olacak
      // Şimdilik indirme işlemi yapalım
      const link = document.createElement('a');
      link.href = image;
      link.download = 'baski-tasarim.png';
      link.click();

      toast.success("Tasarımınız kaydedildi!");
    } catch (error) {
      toast.error("Tasarım kaydedilirken bir hata oluştu");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Görsel ekleme
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Görseli ortala ve canvas boyutuna göre ölçekle
        const maxWidth = canvas.width * 0.8;
        const maxHeight = canvas.height * 0.8;

        let imgWidth = img.width;
        let imgHeight = img.height;

        // Eğer görsel çok büyükse ölçekle
        if (imgWidth > maxWidth || imgHeight > maxHeight) {
          const widthRatio = maxWidth / imgWidth;
          const heightRatio = maxHeight / imgHeight;
          const ratio = Math.min(widthRatio, heightRatio);

          imgWidth *= ratio;
          imgHeight *= ratio;
        }

        setUploadedImage({
          element: img,
          x: (canvas.width - imgWidth) / 2,
          y: (canvas.height - imgHeight) / 2,
          width: imgWidth,
          height: imgHeight,
          scale: 1,
          isResizing: false,
          isDragging: false
        });

        redrawCanvas();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Dosya seçiciyi sıfırla (yeniden seçim yapabilmek için)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Görseli sil
  const removeImage = () => {
    setUploadedImage({
      element: null,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      scale: 1,
      isResizing: false,
      isDragging: false
    });
    redrawCanvas();
  };

  // Ölçeği değiştir
  const changeScale = (newScale: number) => {
    setCanvasScale(newScale);
  };

  // Sepete Ekle
  const addToCart = () => {
    toast.success("Tasarımınız sepete eklendi!");
    // Gerçek uygulamada burada sepet mantığını implement edeceksiniz
  };

  return (
    <div className="min-h-screen pt-16 bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Baskı Tasarım Aracı</h1>
        <p className="text-gray-400 mb-6">
          Kullanıcı dostu tasarım aracımızla özel baskılarınızı oluşturun ve sepete ekleyin.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-3">
            <div className="bg-black border border-white/10 rounded-lg shadow-lg overflow-hidden flex flex-col">
              {/* Araç Çubuğu */}
              <div className="bg-black border-b border-white/10 p-3 flex flex-wrap gap-2">
                <Button
                  variant={tool === "pen" ? "default" : "outline"}
                  onClick={() => setTool("pen")}
                  className={`flex items-center gap-2 ${tool === "pen" ? "bg-white text-black" : "border-white/20 text-white hover:bg-white/10"}`}
                >
                  <PaintBucket className="h-4 w-4" />
                  <span>Fırça</span>
                </Button>

                <Button
                  variant={tool === "text" ? "default" : "outline"}
                  onClick={() => setTool("text")}
                  className={`flex items-center gap-2 ${tool === "text" ? "bg-white text-black" : "border-white/20 text-white hover:bg-white/10"}`}
                >
                  <Type className="h-4 w-4" />
                  <span>Metin</span>
                </Button>

                <Button
                  variant={tool === "image" ? "default" : "outline"}
                  onClick={() => {
                    setTool("image");
                    fileInputRef.current?.click();
                  }}
                  className={`flex items-center gap-2 ${tool === "image" ? "bg-white text-black" : "border-white/20 text-white hover:bg-white/10"}`}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Görsel</span>
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Geri / İleri Butonları */}
                <Button
                  variant="outline"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Undo className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Redo className="h-4 w-4" />
                </Button>

                {/* Yakınlaştırma/Uzaklaştırma */}
                <Button
                  variant="outline"
                  onClick={() => changeScale(Math.max(0.1, canvasScale - 0.1))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => changeScale(Math.min(1, canvasScale + 0.1))}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>

                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
                    onClick={() => canvasRef.current?.toBlob(blob => {
                      if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'baski-tasarim.png';
                        link.click();
                      }
                    })}
                  >
                    <Download className="h-4 w-4" />
                    <span>İndir</span>
                  </Button>

                  <Button
                    className="flex items-center gap-2 bg-white text-black hover:bg-white/90"
                    onClick={saveDesign}
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4" />
                    <span>{isLoading ? "Kaydediliyor..." : "Kaydet"}</span>
                  </Button>
                </div>
              </div>

              {/* Araç özellikleri */}
              <div className="bg-black border-b border-white/10 p-3 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Label htmlFor="color" className="text-xs uppercase text-gray-400">Renk:</Label>
                  <input
                    type="color"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="size" className="text-xs uppercase text-gray-400">Boyut:</Label>
                  <input
                    type="range"
                    id="size"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-xs text-white">{brushSize}px</span>
                </div>

                {tool === "text" && (
                  <div className="flex items-center gap-2 flex-1">
                    <Label htmlFor="text" className="text-xs uppercase text-gray-400">Metin:</Label>
                    <Input
                      id="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Metni girin..."
                      className="max-w-xs"
                    />
                  </div>
                )}

                {uploadedImage.element && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      className="border-red-800/40 text-red-400 hover:bg-red-950/20 flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Görseli Sil</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Çizim alanı */}
              <div
                className="flex-1 flex items-center justify-center bg-slate-900 relative overflow-auto p-4"
                style={{ minHeight: '500px' }}
              >
                <div className="relative" style={{ transform: `scale(${canvasScale})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}>
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    className="shadow-lg bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black border border-white/10 rounded-lg shadow-lg p-4 mb-4">
              <h3 className="text-lg font-bold mb-4">Kağıt Ayarları</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="paperSize" className="mb-2 block text-gray-400">Kağıt Boyutu</Label>
                  <Select
                    value={paperSize}
                    onValueChange={(value) => setPaperSize(value as keyof typeof PAPER_SIZES)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Kağıt Boyutu Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PAPER_SIZES).map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-gray-400">Görünüm Ölçeği: {Math.round(canvasScale * 100)}%</Label>
                  <Slider
                    value={[canvasScale * 100]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={(value) => setCanvasScale(value[0] / 100)}
                    className="mb-2"
                  />
                  <div className="flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCanvasScale(0.3)}
                      className="flex-1 border-white/20 hover:bg-white/10"
                    >
                      <Minimize className="h-3 w-3 mr-1" /> Küçült
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCanvasScale(1)}
                      className="flex-1 border-white/20 hover:bg-white/10"
                    >
                      <Maximize className="h-3 w-3 mr-1" /> Büyüt
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Tasarımınız</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Tasarımınızı tamamladıktan sonra sepete ekleyebilir veya kaydedebilirsiniz.
                </p>

                <Button
                  className="w-full bg-white text-black hover:bg-white/90 mb-2"
                  onClick={addToCart}
                >
                  Sepete Ekle
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={saveDesign}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white/10 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-bold mb-4">BaskıDesign tasarım aracı kullanımı:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Fırça aracıyla serbest çizim yapın</li>
            <li>Metin aracıyla yazı ekleyin</li>
            <li>Görsel aracıyla resim yükleyin</li>
            <li>Görsellerinizi sürükleyip taşıyabilir ve köşelerinden yeniden boyutlandırabilirsiniz</li>
            <li>Kağıt boyutunu değiştirerek çalışma alanınızı düzenleyebilirsiniz</li>
            <li>Tasarımınızı indirin veya kaydedin</li>
            <li>Karmaşık tasarımlar için destek ekibimizle iletişime geçin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
