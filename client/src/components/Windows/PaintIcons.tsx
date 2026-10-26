// client/src/components/Windows/PaintIcons.tsx
import React from 'react';

interface ToolIconProps {
  size?: number;
  color?: string;
}

// 1. Selección de forma libre
export const FreeSelectIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1.5 L10 5.5 L14.5 6 L11 9.5 L12 14 L8 11.5 L4 14 L5 9.5 L1.5 6 L6 5.5 Z"
      stroke="#222"
      strokeWidth="1"
      strokeDasharray="2 1.5"
      fill="none"
    />
  </svg>
);

// 2. Selección rectangular
export const RectSelectIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="2"
      width="12"
      height="12"
      stroke="#222"
      strokeWidth="1"
      strokeDasharray="2 1.5"
      fill="none"
    />
  </svg>
);

// 3. Borrador / Goma
export const EraserIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <polygon points="4,13 1,10 7,4 10,7" fill="#f096a6" stroke="#902636" strokeWidth="0.8" />
    <polygon points="7,4 10,7 15,2 12,-1" fill="#78909c" stroke="#37474f" strokeWidth="0.8" />
    <polygon points="10,7 13,10 16,5 13,2" fill="#b0bec5" stroke="#37474f" strokeWidth="0.8" />
    <polygon points="4,13 7,16 13,10 10,7" fill="#f8bbd0" stroke="#902636" strokeWidth="0.8" />
  </svg>
);

// 4. Bote de relleno (Cubo de pintura)
export const FillBucketIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    {/* Balde inclinado */}
    <path d="M5 4 L11 10 L8 13 L2 7 Z" fill="#37474f" stroke="#212121" strokeWidth="0.8" />
    <ellipse cx="8" cy="7" rx="4.2" ry="2" transform="rotate(45 8 7)" fill="#90a4ae" stroke="#212121" strokeWidth="0.6" />
    {/* Asa */}
    <path d="M4 3 C7 0 12 5 11 10" stroke="#78909c" strokeWidth="1" fill="none" />
    {/* Pintura cayendo */}
    <path d="M11 10 C12 11, 14 13, 14 14 C14 15.1, 13.1 16, 12 16 C10.9 16, 10 15.1, 10 14 C10 13, 11 11, 11 10 Z" fill="#00bcd4" />
  </svg>
);

// 5. Gotero / Selector de color
export const ColorPickerIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M12 2 C13 1 15 3 14 4 L12 6 L10 4 Z" fill="#212121" stroke="#000" strokeWidth="0.6" />
    <path d="M10 4 L12 6 L6 12 L4 10 Z" fill="#cfd8dc" stroke="#455a64" strokeWidth="0.8" />
    <path d="M6 12 L4 10 L2 14 L4 14 Z" fill="#78909c" stroke="#37474f" strokeWidth="0.8" />
    <circle cx="2" cy="15" r="1" fill="#000" />
  </svg>
);

// 6. Lupa
export const MagnifierIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" fill="#e1f5fe" stroke="#37474f" strokeWidth="1.2" />
    <ellipse cx="5" cy="5" rx="1.5" ry="0.8" transform="rotate(-30 5 5)" fill="#ffffff" />
    <line x1="10" y1="10" x2="14.5" y2="14.5" stroke="#212121" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="10" y1="10" x2="14" y2="14" stroke="#ffb300" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// 7. Lápiz
export const PencilIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <polygon points="12,1 15,4 6,13 3,10" fill="#ffd54f" stroke="#f57f17" strokeWidth="0.8" />
    <polygon points="3,10 6,13 1,15" fill="#ffcc80" stroke="#e65100" strokeWidth="0.6" />
    <polygon points="1,15 2,13.5 3.5,15" fill="#212121" />
    <line x1="11" y1="2" x2="14" y2="5" stroke="#ef5350" strokeWidth="1" />
  </svg>
);

// 8. Pincel
export const BrushIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    {/* Mango de madera */}
    <path d="M15 1 L12 4 L9 9 L11 11 L14 6 Z" fill="#bcaaa4" stroke="#5d4037" strokeWidth="0.8" />
    {/* Virola plateada */}
    <polygon points="9,9 11,11 7,13 6,11" fill="#cfd8dc" stroke="#455a64" strokeWidth="0.6" />
    {/* Cerdas */}
    <path d="M6 11 L7 13 C5 15, 2 16, 1 15 C1 13, 2 11, 6 11 Z" fill="#3e2723" />
  </svg>
);

// 9. Aerógrafo (Spray)
export const AirbrushIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="7" y="6" width="6" height="9" rx="1" fill="#42a5f5" stroke="#1565c0" strokeWidth="0.8" />
    <rect x="8" y="3" width="4" height="3" fill="#cfd8dc" stroke="#37474f" strokeWidth="0.6" />
    <rect x="9.5" y="1" width="1.5" height="2" fill="#ef5350" />
    {/* Gotitas de spray */}
    <circle cx="4" cy="2" r="0.8" fill="#1e88e5" />
    <circle cx="2" cy="4" r="0.6" fill="#1e88e5" />
    <circle cx="5" cy="5" r="0.7" fill="#1e88e5" />
  </svg>
);

// 10. Texto
export const TextIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <text
      x="8"
      y="13"
      fontSize="14"
      fontWeight="bold"
      fontFamily="serif"
      textAnchor="middle"
      fill="#111"
    >
      A
    </text>
  </svg>
);

// 11. Línea recta
export const LineIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <line x1="2" y1="14" x2="14" y2="2" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 12. Curva
export const CurveIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M2 13 C6 3, 10 13, 14 3" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// 13. Rectángulo
export const RectIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="10" stroke="#212121" strokeWidth="1.2" fill="none" />
  </svg>
);

// 14. Polígono
export const PolygonIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <polygon points="8,2 14,7 11,14 4,12 3,5" stroke="#212121" strokeWidth="1.2" fill="none" />
  </svg>
);

// 15. Elipse / Círculo
export const EllipseIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <ellipse cx="8" cy="8" rx="6" ry="4.5" stroke="#212121" strokeWidth="1.2" fill="none" />
  </svg>
);

// 16. Rectángulo redondeado
export const RoundedRectIcon: React.FC<ToolIconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="10" rx="3" stroke="#212121" strokeWidth="1.2" fill="none" />
  </svg>
);
