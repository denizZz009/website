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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  PaintBucket,
  RotateCw,
  Move,
  Edit
} from "lucide-react";
import { motion } from "framer-motion";
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
import {
  FabricCanvas,
  FabricObject,
  FabricIText,
  FabricLib,
  FabricImage,
  FabricEvent
} from "./fabric-types";

type CanvasDimensions = {
  width: number;
  height: number;
};

const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Trebuchet MS",
  "Verdana",
  "Comic Sans MS",
  "Impact",
  "Tahoma",
];

// Sık kullanılan renkler
const commonColors = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080',
  '#800000', '#808000', '#008000', '#800080', '#008080',
  '#000080', '#ff9900', '#99cc00', '#339966', '#33cccc',
  '#3366ff', '#800080', '#969696', '#ff5050', '#ffcc00'
];

// Farklı kağıt boyutları
const paperSizes = [
  { name: "A4", width: 595, height: 842 },
  { name: "A5", width: 420, height: 595 },
  { name: "A3", width: 842, height: 1191 },
  { name: "Kare (20x20 cm)", width: 567, height: 567 },
  { name: "Kart (10x15 cm)", width: 283, height: 425 },
  { name: "Poster (50x70 cm)", width: 1417, height: 1984 },
  { name: "Mektup", width: 612, height: 792 },
];

export default function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [zoom, setZoom] = useState(100);
  const [canvasSize, setCanvasSize] = useState<CanvasDimensions>(paperSizes[0]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fabricLoaded, setFabricLoaded] = useState(false);
  const [fabricLib, setFabricLib] = useState<FabricLib | null>(null);
  const [activeTab, setActiveTab] = useState("shapes");

  // Fabric.js kütüphanesini dinamik olarak import et
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('fabric').then(module => {
        setFabricLib(module as unknown as FabricLib);
        setFabricLoaded(true);
      }).catch(err => {
        console.error('Failed to load Fabric.js:', err);
      });
    }
  }, []);

  // Tarihçe eklemek için fonksiyonu useEffect dışında tanımla
  const addToHistory = useCallback((canvasObj: FabricCanvas) => {
    if (!canvasObj) return;

    const json = canvasObj.toJSON();
    const newHistory = [...history.slice(0, historyIndex + 1), JSON.stringify(json)];

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Canvas başlatma
  useEffect(() => {
    if (canvasRef.current && fabricLoaded && fabricLib && !canvas) {
      const newCanvas = new fabricLib.fabric.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: 'white',
        selection: true,
        preserveObjectStacking: true
      });

      // Nesne seçimi olayını dinle
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

      // Canvas değişiklikleri takip et (tarihçe için)
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
