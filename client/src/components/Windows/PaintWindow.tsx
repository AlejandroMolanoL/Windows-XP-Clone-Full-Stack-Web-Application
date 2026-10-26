// client/src/components/Windows/PaintWindow.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { PaintIcon } from '../Icons/XpIcons';
import {
  FreeSelectIcon,
  RectSelectIcon,
  EraserIcon,
  FillBucketIcon,
  ColorPickerIcon,
  MagnifierIcon,
  PencilIcon,
  BrushIcon,
  AirbrushIcon,
  TextIcon,
  LineIcon,
  CurveIcon,
  RectIcon,
  PolygonIcon,
  EllipseIcon,
  RoundedRectIcon
} from './PaintIcons';

interface PaintWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
}

export type PaintTool =
  | 'free_select'
  | 'select'
  | 'eraser'
  | 'fill'
  | 'picker'
  | 'magnifier'
  | 'pencil'
  | 'brush'
  | 'airbrush'
  | 'text'
  | 'line'
  | 'curve'
  | 'rect'
  | 'polygon'
  | 'ellipse'
  | 'rounded_rect';

export type ShapeFillMode = 'outline' | 'outline_fill' | 'fill_only';

// Los 28 colores clásicos de Windows XP Paint
const XP_PALETTE_ROW_1 = [
  '#000000',
  '#808080',
  '#800000',
  '#808000',
  '#008000',
  '#008080',
  '#000080',
  '#800080',
  '#808040',
  '#004040',
  '#0080ff',
  '#004080',
  '#8000ff',
  '#804000'
];

const XP_PALETTE_ROW_2 = [
  '#ffffff',
  '#c0c0c0',
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#ffff80',
  '#00ff80',
  '#80ffff',
  '#8080ff',
  '#ff0080',
  '#ff8040'
];

const WindowContainer = styled.div<{ $isMinimized: boolean; $isMaximized: boolean; $zIndex: number }>`
  position: absolute;
  width: ${({ $isMaximized }) => ($isMaximized ? '100%' : '780px')};
  height: ${({ $isMaximized }) => ($isMaximized ? 'calc(100vh - 30px)' : '540px')};
  background-color: #ece9d8;
  border: 3px solid #0055ea;
  border-top-left-radius: ${({ $isMaximized }) => ($isMaximized ? '0' : '6px')};
  border-top-right-radius: ${({ $isMaximized }) => ($isMaximized ? '0' : '6px')};
  box-shadow: 2px 4px 15px rgba(0, 0, 0, 0.45);
  display: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'flex')};
  flex-direction: column;
  z-index: ${({ $zIndex }) => $zIndex};
  font-family: 'Tahoma', 'Geneva', sans-serif;
  user-select: none;
  box-sizing: border-box;
  overflow: hidden;

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const TitleBar = styled.div`
  height: 26px;
  background: linear-gradient(
    to bottom,
    #0058e6 0%,
    #3a8bfb 15%,
    #0055ea 50%,
    #0045be 100%
  );
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 0 6px;
  color: #ffffff;
  cursor: move;
  flex-shrink: 0;
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  font-size: 11px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
`;

const WindowButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const WinBtn = styled.button<{ $type?: 'close' }>`
  width: 19px;
  height: 19px;
  border-radius: 3px;
  border: 1px solid #ffffff;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 10px;
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);

  background: ${({ $type }) =>
    $type === 'close'
      ? 'linear-gradient(to bottom, #f27254 0%, #e04322 45%, #c72c0b 100%)'
      : 'linear-gradient(to bottom, #428eff 0%, #2062cc 50%, #0e4499 100%)'};

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.85);
  }
`;

const MenuBar = styled.div`
  display: flex;
  align-items: center;
  height: 22px;
  background-color: #ece9d8;
  border-bottom: 1px solid #aca899;
  padding: 0 4px;
  font-size: 11px;
  position: relative;
  flex-shrink: 0;
`;

const MenuItem = styled.div`
  padding: 2px 6px;
  color: #000;
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    background-color: #316ac5;
    color: #ffffff;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 22px;
  background-color: #ffffff;
  border: 1px solid #7f9db9;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  padding: 2px 0;
  z-index: 50;
  min-width: 150px;
`;

const DropdownItem = styled.div<{ $disabled?: boolean }>`
  padding: 4px 16px 4px 20px;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  color: ${({ $disabled }) => ($disabled ? '#888' : '#000')};

  &:hover {
    ${({ $disabled }) =>
      !$disabled &&
      `
      background-color: #316ac5;
      color: #ffffff;
    `}
  }
`;

/* Área de trabajo central (Caja de herramientas a la izquierda + Lienzo al centro) */
const Workspace = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  background-color: #ece9d8;
  overflow: hidden;
`;

/* Barra de herramientas izquierda */
const ToolBox = styled.div`
  width: 58px;
  background-color: #ece9d8;
  border-right: 1px solid #aca899;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 3px;
  gap: 6px;
  flex-shrink: 0;
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 24px);
  grid-template-rows: repeat(8, 24px);
  gap: 2px;
`;

const ToolButton = styled.button<{ $active: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $active }) => ($active ? '#ffffff' : '#ece9d8')};
  border: 1px solid;
  border-color: ${({ $active }) =>
    $active
      ? '#7f9db9 #ffffff #ffffff #7f9db9'
      : '#ffffff #7f9db9 #7f9db9 #ffffff'};
  box-shadow: ${({ $active }) =>
    $active ? 'inset 1px 1px 1px rgba(0,0,0,0.2)' : 'none'};
  outline: none;
  cursor: pointer;
  padding: 0;

  &:active {
    border-color: #7f9db9 #ffffff #ffffff #7f9db9;
    box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.2);
  }
`;

/* Caja de opciones dinámicas debajo de la cuadrícula de herramientas */
const ToolOptionsBox = styled.div`
  width: 50px;
  height: 64px;
  background-color: #ece9d8;
  border: 2px solid;
  border-color: #7f9db9 #ffffff #ffffff #7f9db9;
  box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;
  gap: 2px;
`;

const OptionItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
  padding: 2px;
  background-color: ${({ $selected }) => ($selected ? '#0a246a' : 'transparent')};
  color: ${({ $selected }) => ($selected ? '#ffffff' : '#000000')};

  &:hover {
    background-color: ${({ $selected }) => ($selected ? '#0a246a' : '#d2d0c2')};
  }
`;

/* Área del Lienzo scrollable */
const CanvasContainer = styled.div`
  flex: 1;
  background-color: #808080;
  overflow: auto;
  padding: 8px;
  display: flex;
  position: relative;
`;

const CanvasWrapper = styled.div`
  position: relative;
  background-color: #ffffff;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  margin: auto;
`;

const StyledCanvas = styled.canvas`
  display: block;
  background-color: #ffffff;
  cursor: crosshair;
  image-rendering: pixelated;
`;

/* Barra de Paleta de Colores en la parte inferior */
const PaletteSection = styled.div`
  height: 48px;
  background-color: #ece9d8;
  border-top: 1px solid #aca899;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 12px;
  flex-shrink: 0;
`;

/* Cuadro de doble color (Primario y Secundario) */
const DualColorBox = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  background-color: #ece9d8;
  border: 2px solid;
  border-color: #7f9db9 #ffffff #ffffff #7f9db9;
  flex-shrink: 0;
`;

const ColorIndicator = styled.div<{ $color: string; $isSecondary?: boolean }>`
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: ${({ $color }) => $color};
  border: 1px solid #000000;
  top: ${({ $isSecondary }) => ($isSecondary ? '10px' : '4px')};
  left: ${({ $isSecondary }) => ($isSecondary ? '10px' : '4px')};
  z-index: ${({ $isSecondary }) => ($isSecondary ? '1' : '2')};
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
`;

/* Cuadrícula de colores de la paleta */
const PaletteGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PaletteRow = styled.div`
  display: flex;
  gap: 2px;
`;

const PaletteColorSwatch = styled.div<{ $color: string }>`
  width: 15px;
  height: 15px;
  background-color: ${({ $color }) => $color};
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  cursor: pointer;

  &:hover {
    border-color: #000;
  }
`;

/* Barra de Estado inferior */
const StatusBar = styled.div`
  height: 20px;
  background-color: #ece9d8;
  border-top: 1px solid #aca899;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  font-size: 11px;
  color: #000000;
  flex-shrink: 0;
`;

const StatusPanel = styled.div`
  padding: 1px 6px;
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  height: 16px;
  display: flex;
  align-items: center;
`;

/* Barra flotante para la herramienta de texto */
const TextFormatBar = styled.div`
  position: absolute;
  top: 10px;
  left: 70px;
  background-color: #ece9d8;
  border: 2px solid #0055ea;
  border-radius: 4px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 100;
  font-size: 11px;
`;

export const PaintWindow: React.FC<PaintWindowProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  zIndex
}) => {
  // Arrastre y tamaño de la ventana
  const [position, setPosition] = useState({ x: 120, y: 50 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 120, posY: 50 });

  // Menús
  const [activeMenu, setActiveMenu] = useState<'file' | 'edit' | 'image' | 'help' | null>(null);

  // Herramientas y colores
  const [currentTool, setCurrentTool] = useState<PaintTool>('pencil');
  const [primaryColor, setPrimaryColor] = useState<string>('#000000');
  const [secondaryColor, setSecondaryColor] = useState<string>('#ffffff');

  // Opciones de herramientas
  const [brushSize, setBrushSize] = useState<number>(4);
  const [brushShape, setBrushShape] = useState<'circle' | 'square' | 'slash'>('circle');
  const [eraserSize, setEraserSize] = useState<number>(8);
  const [lineWidth, setLineWidth] = useState<number>(1);
  const [shapeFillMode, setShapeFillMode] = useState<ShapeFillMode>('outline');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Opciones de Texto
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [textContent, setTextContent] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [fontSize, setFontSize] = useState<number>(14);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);

  // Polígono
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([]);

  // Estado del mouse / coordenadas
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvas refs y dimensiones
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth] = useState(640);
  const [canvasHeight] = useState(400);

  // Snapshot para vista previa de formas
  const previewSnapshotRef = useRef<ImageData | null>(null);

  // Historial de deshacer / rehacer
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  // Inicializar canvas en blanco
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        saveState();
      }
    }
  }, []);

  // Guardar estado en historial
  const saveState = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    setUndoStack((prev) => [...prev.slice(-20), imgData]);
    setRedoStack([]);
  }, [canvasWidth, canvasHeight]);

  // Deshacer (Undo)
  const handleUndo = useCallback(() => {
    if (undoStack.length <= 1 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const current = undoStack[undoStack.length - 1];
    const previous = undoStack[undoStack.length - 2];

    setRedoStack((prev) => [...prev, current]);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));

    ctx.putImageData(previous, 0, 0);
  }, [undoStack]);

  // Rehacer (Redo)
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setUndoStack((prev) => [...prev, next]);

    ctx.putImageData(next, 0, 0);
  }, [redoStack]);

  // Arrastre de la ventana
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isMaximized) return;
    onFocus();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(0, dragRef.current.posX + dx),
        y: Math.max(0, dragRef.current.posY + dy)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Obtener coordenadas relativas al canvas
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / zoomLevel);
    const y = Math.floor((e.clientY - rect.top) / zoomLevel);
    return {
      x: Math.max(0, Math.min(canvasWidth - 1, x)),
      y: Math.max(0, Math.min(canvasHeight - 1, y))
    };
  };

  // Algoritmo de Relleno (Flood Fill) por BFS
  const floodFill = (startX: number, startY: number, fillColorHex: string) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imgData.data;

    const parseHex = (hex: string) => {
      const c = hex.replace('#', '');
      return {
        r: parseInt(c.substring(0, 2), 16),
        g: parseInt(c.substring(2, 4), 16),
        b: parseInt(c.substring(4, 6), 16)
      };
    };

    const fillRGB = parseHex(fillColorHex);
    const startIndex = (startY * canvasWidth + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];

    // Si ya tiene el mismo color, salir
    if (
      targetR === fillRGB.r &&
      targetG === fillRGB.g &&
      targetB === fillRGB.b &&
      targetA === 255
    ) {
      return;
    }

    const matchTarget = (idx: number) => {
      return (
        data[idx] === targetR &&
        data[idx + 1] === targetG &&
        data[idx + 2] === targetB &&
        data[idx + 3] === targetA
      );
    };

    const queue: number[] = [startX, startY];
    const visited = new Uint8Array(canvasWidth * canvasHeight);
    visited[startY * canvasWidth + startX] = 1;

    while (queue.length > 0) {
      const cy = queue.pop()!;
      const cx = queue.pop()!;
      const idx = (cy * canvasWidth + cx) * 4;

      data[idx] = fillRGB.r;
      data[idx + 1] = fillRGB.g;
      data[idx + 2] = fillRGB.b;
      data[idx + 3] = 255;

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (let i = 0; i < 4; i++) {
        const nx = neighbors[i][0];
        const ny = neighbors[i][1];

        if (nx >= 0 && nx < canvasWidth && ny >= 0 && ny < canvasHeight) {
          const nPos = ny * canvasWidth + nx;
          if (!visited[nPos]) {
            visited[nPos] = 1;
            const nIdx = nPos * 4;
            if (matchTarget(nIdx)) {
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    saveState();
  };

  // Selector de Color (Gotero)
  const pickColor = (x: number, y: number, isRightClick: boolean) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    const hex = `#${toHex(pixel[0])}${toHex(pixel[1])}${toHex(pixel[2])}`;

    if (isRightClick) {
      setSecondaryColor(hex);
    } else {
      setPrimaryColor(hex);
    }
    // Regresar a herramienta anterior
    setCurrentTool('pencil');
  };

  // Confirmar y estampar texto en el canvas
  const commitText = () => {
    if (!textPosition || !textContent.trim() || !canvasRef.current) {
      setIsTyping(false);
      setTextPosition(null);
      setTextContent('');
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      const fontStyle = `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
      ctx.font = fontStyle;
      ctx.fillStyle = primaryColor;
      ctx.fillText(textContent, textPosition.x, textPosition.y + fontSize);
      saveState();
    }

    setIsTyping(false);
    setTextPosition(null);
    setTextContent('');
  };

  // Iniciar trazo / dibujo en canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTyping) {
      commitText();
      return;
    }

    const { x, y } = getCanvasCoords(e);
    startPosRef.current = { x, y };
    const isRightClick = e.button === 2;
    const activeColor = isRightClick ? secondaryColor : primaryColor;

    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Snapshot para previsualización de formas
    previewSnapshotRef.current = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    // Herramienta Gotero
    if (currentTool === 'picker') {
      pickColor(x, y, isRightClick);
      return;
    }

    // Herramienta Bote de Relleno
    if (currentTool === 'fill') {
      floodFill(x, y, activeColor);
      return;
    }

    // Herramienta Lupa
    if (currentTool === 'magnifier') {
      if (isRightClick) {
        setZoomLevel(1);
      } else {
        setZoomLevel((prev) => (prev >= 6 ? 1 : prev === 1 ? 2 : prev === 2 ? 6 : 8));
      }
      return;
    }

    // Herramienta Texto
    if (currentTool === 'text') {
      setTextPosition({ x, y });
      setIsTyping(true);
      return;
    }

    // Herramienta Polígono
    if (currentTool === 'polygon') {
      if (polygonPoints.length === 0) {
        setPolygonPoints([{ x, y }]);
        setIsDrawing(true);
      } else {
        // Continuar siguiente arista
        const first = polygonPoints[0];
        const dist = Math.hypot(x - first.x, y - first.y);
        if (dist < 8 && polygonPoints.length >= 3) {
          // Cerrar polígono
          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          for (let i = 1; i < polygonPoints.length; i++) {
            ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
          }
          ctx.closePath();

          ctx.strokeStyle = primaryColor;
          ctx.fillStyle = secondaryColor;
          ctx.lineWidth = lineWidth;

          if (shapeFillMode === 'outline') ctx.stroke();
          else if (shapeFillMode === 'outline_fill') {
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fill();
          }

          setPolygonPoints([]);
          setIsDrawing(false);
          saveState();
        } else {
          setPolygonPoints((prev) => [...prev, { x, y }]);
        }
      }
      return;
    }

    setIsDrawing(true);

    // Lápiz punto inicial
    if (currentTool === 'pencil') {
      ctx.fillStyle = activeColor;
      ctx.fillRect(x, y, 1, 1);
    }

    // Borrador punto inicial
    if (currentTool === 'eraser') {
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
    }

    // Pincel punto inicial
    if (currentTool === 'brush') {
      drawBrushPoint(ctx, x, y, activeColor);
    }
  };

  // Dibuja una punta de pincel según la forma y tamaño seleccionado
  const drawBrushPoint = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    if (brushShape === 'circle') {
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (brushShape === 'square') {
      ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else if (brushShape === 'slash') {
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x - brushSize, y + brushSize);
      ctx.lineTo(x + brushSize, y - brushSize);
      ctx.stroke();
    }
  };

  // Movimiento del cursor sobre el canvas
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    setCursorPos({ x, y });

    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const isRightClick = e.buttons === 2;
    const activeColor = isRightClick ? secondaryColor : primaryColor;

    // Lápiz a mano alzada
    if (currentTool === 'pencil') {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startPosRef.current.x, startPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      startPosRef.current = { x, y };
      return;
    }

    // Pincel continuo
    if (currentTool === 'brush') {
      drawBrushPoint(ctx, x, y, activeColor);
      startPosRef.current = { x, y };
      return;
    }

    // Borrador continuo
    if (currentTool === 'eraser') {
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
      startPosRef.current = { x, y };
      return;
    }

    // Aerógrafo (Spray)
    if (currentTool === 'airbrush') {
      ctx.fillStyle = activeColor;
      for (let i = 0; i < 8; i++) {
        const radius = Math.random() * 10;
        const angle = Math.random() * Math.PI * 2;
        const sx = x + radius * Math.cos(angle);
        const sy = y + radius * Math.sin(angle);
        ctx.fillRect(sx, sy, 1, 1);
      }
      return;
    }

    // Para formas geométricas (Línea, Rectángulo, Elipse, etc.): restaurar imagen anterior para vista previa
    if (previewSnapshotRef.current) {
      ctx.putImageData(previewSnapshotRef.current, 0, 0);
    }

    ctx.strokeStyle = primaryColor;
    ctx.fillStyle = secondaryColor;
    ctx.lineWidth = lineWidth;

    const startX = startPosRef.current.x;
    const startY = startPosRef.current.y;

    if (currentTool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === 'rect') {
      const rx = Math.min(startX, x);
      const ry = Math.min(startY, y);
      const rw = Math.abs(x - startX);
      const rh = Math.abs(y - startY);

      if (shapeFillMode === 'outline') ctx.strokeRect(rx, ry, rw, rh);
      else if (shapeFillMode === 'outline_fill') {
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);
      } else {
        ctx.fillRect(rx, ry, rw, rh);
      }
    } else if (currentTool === 'ellipse') {
      const cx = (startX + x) / 2;
      const cy = (startY + y) / 2;
      const rx = Math.abs(x - startX) / 2;
      const ry = Math.abs(y - startY) / 2;

      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      if (shapeFillMode === 'outline') ctx.stroke();
      else if (shapeFillMode === 'outline_fill') {
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fill();
      }
    } else if (currentTool === 'rounded_rect') {
      const rx = Math.min(startX, x);
      const ry = Math.min(startY, y);
      const rw = Math.abs(x - startX);
      const rh = Math.abs(y - startY);

      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 8);
      if (shapeFillMode === 'outline') ctx.stroke();
      else if (shapeFillMode === 'outline_fill') {
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fill();
      }
    } else if (currentTool === 'curve') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo((startX + x) / 2, (startY + y) / 2 - 20, x, y);
      ctx.stroke();
    }
  };

  // Finalizar trazo / forma
  const handleCanvasMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  // Operaciones de Archivo
  const handleNew = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    saveState();
    setActiveMenu(null);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'untitled.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    setActiveMenu(null);
  };

  const handleOpenFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvasRef.current) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          saveState();
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    setActiveMenu(null);
  };

  // Atajos de teclado (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMinimized, handleUndo, handleRedo]);

  if (!isOpen) return null;

  return (
    <WindowContainer
      $isMinimized={isMinimized}
      $isMaximized={isMaximized}
      $zIndex={zIndex}
      style={
        isMaximized
          ? { top: 0, left: 0, right: 0, bottom: 30 }
          : { top: `${position.y}px`, left: `${position.x}px` }
      }
      onClick={() => {
        onFocus();
        if (activeMenu) setActiveMenu(null);
      }}
    >
      {/* 1. Barra de Título */}
      <TitleBar onMouseDown={handleTitleMouseDown}>
        <TitleContent>
          <PaintIcon size={16} />
          <span>untitled - Paint</span>
        </TitleContent>
        <WindowButtons>
          <WinBtn onClick={onMinimize} title="Minimize">
            _
          </WinBtn>
          <WinBtn onClick={() => setIsMaximized(!isMaximized)} title="Maximize">
            {isMaximized ? '❐' : '□'}
          </WinBtn>
          <WinBtn $type="close" onClick={onClose} title="Close">
            ✕
          </WinBtn>
        </WindowButtons>
      </TitleBar>

      {/* 2. Barra de Menú */}
      <MenuBar onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}>
          <u>F</u>ile
        </MenuItem>
        <MenuItem onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}>
          <u>E</u>dit
        </MenuItem>
        <MenuItem onClick={() => setActiveMenu(activeMenu === 'image' ? null : 'image')}>
          <u>I</u>mage
        </MenuItem>
        <MenuItem onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}>
          <u>H</u>elp
        </MenuItem>

        {/* Desplegable File */}
        {activeMenu === 'file' && (
          <DropdownMenu style={{ left: '4px' }}>
            <DropdownItem onClick={handleNew}>
              <span>New</span>
              <span style={{ color: '#888' }}>Ctrl+N</span>
            </DropdownItem>
            <label style={{ margin: 0, padding: 0 }}>
              <DropdownItem as="span">
                <span>Open...</span>
                <span style={{ color: '#888' }}>Ctrl+O</span>
              </DropdownItem>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleOpenFile}
              />
            </label>
            <DropdownItem onClick={handleSave}>
              <span>Save</span>
              <span style={{ color: '#888' }}>Ctrl+S</span>
            </DropdownItem>
            <div style={{ height: '1px', background: '#aca899', margin: '2px 0' }} />
            <DropdownItem onClick={onClose}>
              <span>Exit</span>
            </DropdownItem>
          </DropdownMenu>
        )}

        {/* Desplegable Edit */}
        {activeMenu === 'edit' && (
          <DropdownMenu style={{ left: '38px' }}>
            <DropdownItem onClick={handleUndo}>
              <span>Undo</span>
              <span style={{ color: '#888' }}>Ctrl+Z</span>
            </DropdownItem>
            <DropdownItem onClick={handleRedo}>
              <span>Repeat</span>
              <span style={{ color: '#888' }}>Ctrl+Y</span>
            </DropdownItem>
            <div style={{ height: '1px', background: '#aca899', margin: '2px 0' }} />
            <DropdownItem onClick={handleNew}>
              <span>Clear Image</span>
            </DropdownItem>
          </DropdownMenu>
        )}

        {/* Desplegable Image */}
        {activeMenu === 'image' && (
          <DropdownMenu style={{ left: '72px' }}>
            <DropdownItem onClick={handleNew}>
              <span>Clear Image</span>
              <span style={{ color: '#888' }}>Ctrl+Shift+N</span>
            </DropdownItem>
          </DropdownMenu>
        )}

        {/* Desplegable Help */}
        {activeMenu === 'help' && (
          <DropdownMenu style={{ left: '120px' }}>
            <DropdownItem
              onClick={() => {
                alert('Paint for Windows XP\nMicrosoft Corporation.\nInteractive Paint clone with full drawing tools.');
                setActiveMenu(null);
              }}
            >
              <span>About Paint</span>
            </DropdownItem>
          </DropdownMenu>
        )}
      </MenuBar>

      {/* Barra de formato flotante para Texto */}
      {isTyping && (
        <TextFormatBar onClick={(e) => e.stopPropagation()}>
          <span>Font:</span>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            style={{ fontSize: '11px', height: '20px' }}
          >
            <option value="Arial">Arial</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>

          <span>Size:</span>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ fontSize: '11px', height: '20px' }}
          >
            <option value={10}>10</option>
            <option value={12}>12</option>
            <option value={14}>14</option>
            <option value={18}>18</option>
            <option value={24}>24</option>
            <option value={32}>32</option>
          </select>

          <button
            style={{
              fontWeight: 'bold',
              height: '20px',
              backgroundColor: isBold ? '#ffffff' : '#ece9d8'
            }}
            onClick={() => setIsBold(!isBold)}
          >
            B
          </button>
          <button
            style={{
              fontStyle: 'italic',
              height: '20px',
              backgroundColor: isItalic ? '#ffffff' : '#ece9d8'
            }}
            onClick={() => setIsItalic(!isItalic)}
          >
            I
          </button>
          <button
            style={{ height: '20px', fontSize: '10px' }}
            onClick={commitText}
          >
            Apply
          </button>
        </TextFormatBar>
      )}

      {/* 3. Área de trabajo (Herramientas a la izquierda + Lienzo) */}
      <Workspace>
        {/* Barra de Herramientas izquierda */}
        <ToolBox>
          <ToolGrid>
            {/* Fila 1 */}
            <ToolButton
              $active={currentTool === 'free_select'}
              onClick={() => setCurrentTool('free_select')}
              title="Free-Form Select"
            >
              <FreeSelectIcon />
            </ToolButton>
            <ToolButton
              $active={currentTool === 'select'}
              onClick={() => setCurrentTool('select')}
              title="Select"
            >
              <RectSelectIcon />
            </ToolButton>

            {/* Fila 2 */}
            <ToolButton
              $active={currentTool === 'eraser'}
              onClick={() => setCurrentTool('eraser')}
              title="Eraser/Color Eraser"
            >
              <EraserIcon />
            </ToolButton>
            <ToolButton
              $active={currentTool === 'fill'}
              onClick={() => setCurrentTool('fill')}
              title="Fill With Color"
            >
              <FillBucketIcon />
            </ToolButton>

            {/* Fila 3 */}
            <ToolButton
              $active={currentTool === 'picker'}
              onClick={() => setCurrentTool('picker')}
              title="Pick Color"
            >
              <ColorPickerIcon />
            </ToolButton>
            <ToolButton
              $active={currentTool === 'magnifier'}
              onClick={() => setCurrentTool('magnifier')}
              title="Magnifier"
            >
              <MagnifierIcon />
            </ToolButton>

            {/* Fila 4 */}
            <ToolButton
              $active={currentTool === 'pencil'}
              onClick={() => setCurrentTool('pencil')}
              title="Pencil"
            >
              <PencilIcon />
            </ToolButton>
            <ToolButton
              $active={currentTool === 'brush'}
              onClick={() => setCurrentTool('brush')}
              title="Brush"
            >
              <BrushIcon />
            </ToolButton>

            {/* Fila 5 */}
            <ToolButton
              $active={currentTool === 'airbrush'}
              onClick={() => setCurrentTool('airbrush')}
              title="Airbrush"
            >
              <AirbrushIcon />
            </ToolButton>
            <ToolButton
              $active={currentTool === 'text'}
              onClick={() => setCurrentTool('text')}
              title="Text"
            >
              <TextIcon />
            </ToolButton>

            {/* Fila 6 */}
            <ToolButton
              $active={currentTool === 'line'}
              onClick={() => setCurrentTool('line')}
              title="Line"
            >
              <LineIcon />
            </ToolButton>
            <ToolButton
              $active={currentTool === 'curve'}
              onClick={() => setCurrentTool('curve')}
              title="Curve"
            >
              <CurveIcon />
            </ToolButton>

            {/* Fila 7 */}
            <ToolButton
              $active={currentTool === 'rect'}
              onClick={() => setCurrentTool('rect')}
              title="Rectangle"
            >
              <RectIcon />
            </ToolButton>
            <ToolButton
              $active={currentTool === 'polygon'}
              onClick={() => setCurrentTool('polygon')}
              title="Polygon"
            >
              <PolygonIcon />
            </ToolButton>

            {/* Fila 8 */}
            <ToolButton
              $active={currentTool === 'ellipse'}
              onClick={() => setCurrentTool('ellipse')}
              title="Ellipse"
            >
              <EllipseIcon />
            </ToolButton>
            <ToolButton
              $active={currentTool === 'rounded_rect'}
              onClick={() => setCurrentTool('rounded_rect')}
              title="Rounded Rectangle"
            >
              <RoundedRectIcon />
            </ToolButton>
          </ToolGrid>

          {/* Opciones dinámicas de la herramienta seleccionada */}
          <ToolOptionsBox>
            {/* Opciones de Borrador */}
            {currentTool === 'eraser' && (
              <>
                {[4, 6, 8, 10].map((sz) => (
                  <OptionItem
                    key={sz}
                    $selected={eraserSize === sz}
                    onClick={() => setEraserSize(sz)}
                  >
                    <div
                      style={{
                        width: `${sz}px`,
                        height: `${sz}px`,
                        backgroundColor: '#000000'
                      }}
                    />
                  </OptionItem>
                ))}
              </>
            )}

            {/* Opciones de Pincel */}
            {currentTool === 'brush' && (
              <>
                <OptionItem
                  $selected={brushShape === 'circle' && brushSize === 4}
                  onClick={() => {
                    setBrushShape('circle');
                    setBrushSize(4);
                  }}
                  title="Round Small"
                >
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#000' }} />
                </OptionItem>
                <OptionItem
                  $selected={brushShape === 'circle' && brushSize === 8}
                  onClick={() => {
                    setBrushShape('circle');
                    setBrushSize(8);
                  }}
                  title="Round Medium"
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000' }} />
                </OptionItem>
                <OptionItem
                  $selected={brushShape === 'square'}
                  onClick={() => {
                    setBrushShape('square');
                    setBrushSize(6);
                  }}
                  title="Square"
                >
                  <div style={{ width: '6px', height: '6px', background: '#000' }} />
                </OptionItem>
                <OptionItem
                  $selected={brushShape === 'slash'}
                  onClick={() => {
                    setBrushShape('slash');
                    setBrushSize(6);
                  }}
                  title="Calligraphy"
                >
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>/</span>
                </OptionItem>
              </>
            )}

            {/* Opciones de Grosor de Línea */}
            {(currentTool === 'line' || currentTool === 'curve') && (
              <>
                {[1, 2, 3, 4, 5].map((w) => (
                  <OptionItem
                    key={w}
                    $selected={lineWidth === w}
                    onClick={() => setLineWidth(w)}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: `${w}px`,
                        backgroundColor: '#000000'
                      }}
                    />
                  </OptionItem>
                ))}
              </>
            )}

            {/* Opciones de Lupa */}
            {currentTool === 'magnifier' && (
              <>
                {[1, 2, 6, 8].map((z) => (
                  <OptionItem
                    key={z}
                    $selected={zoomLevel === z}
                    onClick={() => setZoomLevel(z)}
                  >
                    <span style={{ fontSize: '10px' }}>{z}x</span>
                  </OptionItem>
                ))}
              </>
            )}

            {/* Opciones de Relleno para Formas Geométricas */}
            {(currentTool === 'rect' ||
              currentTool === 'polygon' ||
              currentTool === 'ellipse' ||
              currentTool === 'rounded_rect') && (
              <>
                <OptionItem
                  $selected={shapeFillMode === 'outline'}
                  onClick={() => setShapeFillMode('outline')}
                  title="Outline Only"
                >
                  <div style={{ width: '22px', height: '14px', border: '1px solid #000' }} />
                </OptionItem>
                <OptionItem
                  $selected={shapeFillMode === 'outline_fill'}
                  onClick={() => setShapeFillMode('outline_fill')}
                  title="Outline and Fill"
                >
                  <div
                    style={{
                      width: '22px',
                      height: '14px',
                      border: '1px solid #000',
                      backgroundColor: '#808080'
                    }}
                  />
                </OptionItem>
                <OptionItem
                  $selected={shapeFillMode === 'fill_only'}
                  onClick={() => setShapeFillMode('fill_only')}
                  title="Fill Only"
                >
                  <div style={{ width: '22px', height: '14px', backgroundColor: '#808080' }} />
                </OptionItem>
              </>
            )}
          </ToolOptionsBox>
        </ToolBox>

        {/* Contenedor del Lienzo */}
        <CanvasContainer>
          <CanvasWrapper>
            <StyledCanvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={{
                width: `${canvasWidth * zoomLevel}px`,
                height: `${canvasHeight * zoomLevel}px`
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onContextMenu={(e) => e.preventDefault()}
            />

            {/* Cuadro de entrada de texto interactivo */}
            {isTyping && textPosition && (
              <textarea
                autoFocus
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                style={{
                  position: 'absolute',
                  left: `${textPosition.x * zoomLevel}px`,
                  top: `${textPosition.y * zoomLevel}px`,
                  fontFamily,
                  fontSize: `${fontSize * zoomLevel}px`,
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  color: primaryColor,
                  border: '1px dashed #000000',
                  outline: 'none',
                  background: 'transparent',
                  resize: 'both',
                  minWidth: '80px',
                  minHeight: '30px'
                }}
              />
            )}
          </CanvasWrapper>
        </CanvasContainer>
      </Workspace>

      {/* 4. Barra de Paleta de Colores */}
      <PaletteSection>
        {/* Selector dual de colores (Primario y Secundario) */}
        <DualColorBox title="Color 1 (Foreground) / Color 2 (Background)">
          <ColorIndicator $color={primaryColor} title="Color 1 (Left click on palette)" />
          <ColorIndicator
            $color={secondaryColor}
            $isSecondary
            title="Color 2 (Right click on palette)"
          />
        </DualColorBox>

        {/* 28 colores en dos filas */}
        <PaletteGrid>
          <PaletteRow>
            {XP_PALETTE_ROW_1.map((col, idx) => (
              <PaletteColorSwatch
                key={idx}
                $color={col}
                onClick={() => setPrimaryColor(col)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSecondaryColor(col);
                }}
                title={`${col} (Left: Color 1, Right: Color 2)`}
              />
            ))}
          </PaletteRow>
          <PaletteRow>
            {XP_PALETTE_ROW_2.map((col, idx) => (
              <PaletteColorSwatch
                key={idx}
                $color={col}
                onClick={() => setPrimaryColor(col)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSecondaryColor(col);
                }}
                title={`${col} (Left: Color 1, Right: Color 2)`}
              />
            ))}
          </PaletteRow>
        </PaletteGrid>
      </PaletteSection>

      {/* 5. Barra de Estado */}
      <StatusBar>
        <div>For Help, click Help Topics on the Help Menu.</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <StatusPanel>
            {cursorPos.x}, {cursorPos.y}px
          </StatusPanel>
          <StatusPanel>
            {canvasWidth} x {canvasHeight}px
          </StatusPanel>
        </div>
      </StatusBar>
    </WindowContainer>
  );
};

export default PaintWindow;
