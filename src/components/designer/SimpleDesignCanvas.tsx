"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Trash2,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle as TriangleIcon,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Save,
  Download,
  Layers,
  PaintBucket,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tanımlar ve tipler
type CanvasDimensions = {
  width: number;
  height: number;
};

interface FabricEvent {
  e: Event;
  target?: any;
  selected?: any[];
}

// Varsayılan değerler
const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Trebuchet MS",
  "Verdana",
];

const paperSizes = [
  { name: "A4", width: 595, height: 842 },
  { name: "A5", width: 420, height: 595 },
  { name: "Kare (20x20 cm)", width: 567, height: 567 },
  { name: "Mektup", width: 612, height: 792 },
];

const commonColors = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080'
];

export default function SimpleDesignCanvas() {
  // Refs ve state tanımları
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [zoom, setZoom] = useState(100);
  const [canvasSize, setCanvasSize] = useState<CanvasDimensions>(paperSizes[0]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fabricLoaded, setFabricLoaded] = useState(false);
  const [fabricLib, setFabricLib] = useState<any>(null);

  // Fabric.js kütüphanesini yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('fabric').then(module => {
        setFabricLib(module);
        setFabricLoaded(true);
      }).catch(err => {
        console.error('Failed to load Fabric.js:', err);
      });
    }
  }, []);

  // Tarihçe fonksiyonu
  const addToHistory = useCallback((canvasObj: any) => {
    if (!canvasObj) return;

    const json = canvasObj.toJSON();
    const newHistory = [...history.slice(0, historyIndex + 1), JSON.stringify(json)];

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Canvas'ı başlat
  useEffect(() => {
    if (canvasRef.current && fabricLoaded && fabricLib && !canvas) {
      const newCanvas = new fabricLib.fabric.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: 'white'
      });

      // Nesne seçimi olaylarını dinle
      newCanvas.on('selection:created', function(e: FabricEvent) {
        if (e.selected && e.selected.length > 0) {
          setSelectedObject(e.selected[0]);
        }
      });

      newCanvas.on('selection:updated', function(e: FabricEvent) {
        if (e.selected && e.selected.length > 0) {
          setSelectedObject(e.selected[0]);
        }
      });

      newCanvas.on('selection:cleared', function() {
        setSelectedObject(null);
      });

      // Değişiklikleri takip et
      newCanvas.on('object:modified', function() {
        addToHistory(newCanvas);
      });

      newCanvas.on('object:added', function() {
        addToHistory(newCanvas);
      });

      setCanvas(newCanvas);

      // İlk durumu tarihçeye ekle
      setTimeout(() => {
        addToHistory(newCanvas);
      }, 100);
    }

    return () => {
      canvas?.dispose();
    };
  }, [canvasSize.width, canvasSize.height, fabricLoaded, fabricLib, canvas, addToHistory]);

  // Canvas boyutunu değiştir
  useEffect(() => {
    if (canvas) {
      canvas.setWidth(canvasSize.width);
      canvas.setHeight(canvasSize.height);
      canvas.renderAll();
    }
  }, [canvasSize, canvas]);

  // Zoom değiştiğinde canvas'ı güncelle
  useEffect(() => {
    if (canvas) {
      canvas.setZoom(zoom / 100);
      canvas.renderAll();
    }
  }, [zoom, canvas]);

  // İşlev tanımlamaları
  const undo = () => {
    if (historyIndex > 0 && canvas) {
      const newIndex = historyIndex - 1;
      canvas.loadFromJSON(history[newIndex], canvas.renderAll.bind(canvas));
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && canvas) {
      const newIndex = historyIndex + 1;
      canvas.loadFromJSON(history[newIndex], canvas.renderAll.bind(canvas));
      setHistoryIndex(newIndex);
    }
  };

  const changePaperSize = (size: string) => {
    const newSize = paperSizes.find(s => s.name === size);
    if (newSize && canvas) {
      setCanvasSize(newSize);
    }
  };

  const addText = () => {
    if (!canvas || !fabricLib) return;

    const text = new fabricLib.fabric.IText('Metin Ekleyin', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    setSelectedObject(text);
    addToHistory(canvas);
  };

  const addImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !fabricLib || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (f) => {
      const data = f.target?.result;
      if (!data) return;

      fabricLib.fabric.Image.fromURL(data.toString(), (img: any) => {
        // Görüntüyü canvas'a sığacak şekilde ölçekle
        const maxWidth = canvas.getWidth() * 0.8;
        const maxHeight = canvas.getHeight() * 0.8;

        if (img.width && img.height) {
          if (img.width > maxWidth || img.height > maxHeight) {
            const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
            img.scale(scaleFactor);
          }
        }

        canvas.add(img);
        canvas.setActiveObject(img);
        setSelectedObject(img);
        addToHistory(canvas);
      });
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // Dosya seçiciyi sıfırla
  };

  // Şekil ekleme fonksiyonları
  const addShape = (type: string) => {
    if (!canvas || !fabricLib) return;

    let shape;

    switch (type) {
      case 'square':
        shape = new fabricLib.fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: '#3498db',
        });
        break;
      case 'circle':
        shape = new fabricLib.fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: '#e74c3c',
        });
        break;
      case 'triangle':
        shape = new fabricLib.fabric.Triangle({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: '#2ecc71',
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    setSelectedObject(shape);
    addToHistory(canvas);
  };

  const deleteSelected = () => {
    if (!canvas || !canvas.getActiveObject()) return;

    canvas.remove(canvas.getActiveObject());
    setSelectedObject(null);
    addToHistory(canvas);
  };

  const customizeText = (property: string, value: string | number) => {
    if (!canvas || !selectedObject) return;

    if (selectedObject.type !== 'i-text' && selectedObject.type !== 'text') return;

    selectedObject.set(property, value);
    canvas.renderAll();
    addToHistory(canvas);
  };

  const changeObjectColor = (color: string) => {
    if (!canvas || !selectedObject) return;

    selectedObject.set('fill', color);
    canvas.renderAll();
    addToHistory(canvas);
  };

  const downloadDesign = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1
    });

    const link = document.createElement('a');
    link.download = 'baski-tasarim.png';
    link.href = dataURL;
    link.click();
  };

  // Katman değişiklikleri
  const bringForward = () => {
    if (!canvas || !selectedObject) return;
    canvas.bringForward(selectedObject);
    canvas.renderAll();
    addToHistory(canvas);
  };

  const sendBackward = () => {
    if (!canvas || !selectedObject) return;
    canvas.sendBackward(selectedObject);
    canvas.renderAll();
    addToHistory(canvas);
  };

  // Yükleniyor ekranı
  if (!fabricLoaded || !fabricLib) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Tasarım aracı yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Render
  return (
    <div className="flex flex-col h-full">
      {/* Üst Araç Çubuğu */}
      <div className="bg-white border-b p-2 flex flex-wrap md:flex-nowrap items-center gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto mb-2 md:mb-0">
          <Select onValueChange={changePaperSize} defaultValue={paperSizes[0].name}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kağıt Boyutu" />
            </SelectTrigger>
            <SelectContent>
              {paperSizes.map((size) => (
                <SelectItem key={size.name} value={size.name}>{size.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(prev => Math.max(10, prev - 10))}
              disabled={zoom <= 10}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(prev => Math.min(200, prev + 10))}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="shapes" className="w-full">
            <TabsList className="mb-2 justify-start">
              <TabsTrigger value="shapes">Şekiller</TabsTrigger>
              <TabsTrigger value="tools">Araçlar</TabsTrigger>
              <TabsTrigger value="history">Geçmiş</TabsTrigger>
            </TabsList>

            <TabsContent value="shapes" className="mt-0">
              <div className="flex flex-wrap items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => addShape('square')}>
                        <Square className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Kare Ekle</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => addShape('circle')}>
                        <Circle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Daire Ekle</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => addShape('triangle')}>
                        <TriangleIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Üçgen Ekle</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={addText}>
                        <Type className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Metin Ekle</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={addImage}>
                        <ImageIcon className="h-4 w-4" />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Görsel Ekle</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-0">
              <div className="flex flex-wrap items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={deleteSelected}
                        disabled={!selectedObject}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Seçili Öğeyi Sil</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={bringForward}
                        disabled={!selectedObject}
                      >
                        <Layers className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Öne Getir</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={sendBackward}
                        disabled={!selectedObject}
                      >
                        <Layers className="h-4 w-4 rotate-180" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Arkaya Gönder</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={downloadDesign}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Tasarımı İndir</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="flex flex-wrap items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={undo}
                        disabled={historyIndex <= 0}
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Geri Al</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                      >
                        <Redo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>İleri Al</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-shrink-0 w-full md:w-auto flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Sepete Ekle
          </Button>
        </div>
      </div>

      {/* Seçili Nesne Özellikleri */}
      {selectedObject && (
        <div className="bg-gray-50 border-b p-2 overflow-hidden">
          <div className="flex flex-wrap gap-4">
            {/* Text özellikleri */}
            {(selectedObject.type === 'i-text' || selectedObject.type === 'text') && (
              <>
                <div className="flex items-center gap-2">
                  <Label>Font:</Label>
                  <Select
                    value={selectedObject.get('fontFamily') || 'Arial'}
                    onValueChange={(value) => customizeText('fontFamily', value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Font Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label>Boyut:</Label>
                  <div className="w-24">
                    <Slider
                      value={[selectedObject.get('fontSize') || 20]}
                      min={8}
                      max={72}
                      step={1}
                      onValueChange={(value) => customizeText('fontSize', value[0])}
                    />
                  </div>
                  <span className="text-sm">{selectedObject.get('fontSize') || 20}pt</span>
                </div>
              </>
            )}

            {/* Renk */}
            <div className="flex items-center gap-2">
              <Label>Renk:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-10 h-10 p-0">
                    <div
                      className="w-full h-full rounded-sm"
                      style={{ backgroundColor: selectedObject.get('fill') || '#000000' }}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid grid-cols-5 gap-2">
                    {commonColors.map((color) => (
                      <Button
                        key={color}
                        variant="outline"
                        className="w-10 h-10 p-0"
                        style={{ backgroundColor: color }}
                        onClick={() => changeObjectColor(color)}
                      />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="color-picker">Özel Renk:</Label>
                    <Input
                      id="color-picker"
                      type="color"
                      value={selectedObject.get('fill') || '#000000'}
                      onChange={(e) => changeObjectColor(e.target.value)}
                      className="mt-1 w-full"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Dönüş açısı */}
            <div className="flex items-center gap-2">
              <Label>Dönüş:</Label>
              <div className="w-24">
                <Slider
                  value={[selectedObject.get('angle') || 0]}
                  min={0}
                  max={360}
                  step={5}
                  onValueChange={(value) => {
                    selectedObject.set('angle', value[0]);
                    canvas.renderAll();
                    addToHistory(canvas);
                  }}
                />
              </div>
              <span className="text-sm">{selectedObject.get('angle') || 0}°</span>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Alanı */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4">
        <div className="mx-auto relative shadow-lg" style={{
          width: canvasSize.width,
          height: canvasSize.height,
          transform: `scale(${zoom/100})`,
          transformOrigin: 'center top',
          margin: '0 auto'
        }}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
