// Fabric.js için tip tanımlamaları
export interface FabricCanvasOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  selection?: boolean;
  preserveObjectStacking?: boolean;
}

export interface FabricObjectOptions {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  opacity?: number;
  selectable?: boolean;
  hasControls?: boolean;
  hasBorders?: boolean;
  lockMovementX?: boolean;
  lockMovementY?: boolean;
  lockRotation?: boolean;
  lockScalingX?: boolean;
  lockScalingY?: boolean;
  originX?: 'left' | 'center' | 'right';
  originY?: 'top' | 'center' | 'bottom';
}

export interface FabricTextOptions extends FabricObjectOptions {
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  underline?: boolean;
  overline?: boolean;
  linethrough?: boolean;
  textBackgroundColor?: string;
}

export interface FabricImageOptions extends FabricObjectOptions {
  crossOrigin?: string;
}

export interface FabricEvent {
  e: Event;
  target?: any;
  selected?: any[];
}

export interface FabricCanvas {
  add: (object: any) => FabricCanvas;
  remove: (object: any) => FabricCanvas;
  renderAll: () => FabricCanvas;
  getActiveObject: () => any;
  setActiveObject: (object: any) => FabricCanvas;
  getWidth: () => number;
  getHeight: () => number;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  clear: () => FabricCanvas;
  dispose: () => void;
  toDataURL: (options?: any) => string;
  loadFromJSON: (json: string, callback?: Function, reviver?: Function) => void;
  toJSON: (propertiesToInclude?: string[]) => object;
  on: (eventName: string, handler: Function) => void;
  off: (eventName: string, handler: Function) => void;
  bringForward: (object: any) => FabricCanvas;
  sendBackward: (object: any) => FabricCanvas;
  bringToFront: (object: any) => FabricCanvas;
  sendToBack: (object: any) => FabricCanvas;
  discardActiveObject: () => FabricCanvas;
}

export interface FabricObject {
  set: (key: string | Record<string, any>, value?: any) => FabricObject;
  get: (key: string) => any;
  scale: (value: number) => FabricObject;
  setCoords: () => void;
  toObject: (propertiesToInclude?: string[]) => object;
  type: string;
}

export interface FabricImage extends FabricObject {
  width: number;
  height: number;
}

export interface FabricText extends FabricObject {
  text: string;
  fontSize: number;
  fontFamily: string;
}

export interface FabricIText extends FabricText {
  enterEditing: () => void;
  exitEditing: () => void;
  selectAll: () => void;
}

export interface FabricLib {
  fabric: {
    Canvas: new (element: HTMLCanvasElement | string, options?: FabricCanvasOptions) => FabricCanvas;
    IText: new (text: string, options?: FabricTextOptions) => FabricIText;
    Textbox: new (text: string, options?: FabricTextOptions) => FabricIText;
    Rect: new (options?: FabricObjectOptions) => FabricObject;
    Circle: new (options?: FabricObjectOptions) => FabricObject;
    Triangle: new (options?: FabricObjectOptions) => FabricObject;
    Ellipse: new (options?: FabricObjectOptions) => FabricObject;
    Line: new (points: number[], options?: FabricObjectOptions) => FabricObject;
    Polygon: new (points: Array<{x: number, y: number}>, options?: FabricObjectOptions) => FabricObject;
    Image: {
      fromURL: (url: string, callback: (image: FabricImage) => void, options?: FabricImageOptions) => void;
    };
  };
}
