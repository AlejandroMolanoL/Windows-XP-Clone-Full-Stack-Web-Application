// client/src/components/Icons/XpIcons.tsx
import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// 1. Logo clásico de Windows con 4 colores y curvatura XP
export const WindowsFlagIcon: React.FC<IconProps> = ({ size = 16, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <defs>
      <filter id="xp-flag-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="1" stdDeviation="0.8" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#xp-flag-shadow)">
      {/* Rojo superior izquierdo */}
      <path
        d="M2 4.5C4.5 4 7 5.5 10.5 4.5V11C7 11.8 4.5 10.5 2 11V4.5Z"
        fill="#E81123"
      />
      {/* Verde superior derecho */}
      <path
        d="M12.5 4.2C15.5 3.3 19 4.8 22 4.2V10.8C19 11.5 15.5 10 12.5 10.8V4.2Z"
        fill="#00B050"
      />
      {/* Azul inferior izquierdo */}
      <path
        d="M2 12.8C4.5 12.2 7 13.8 10.5 12.8V19.5C7 20.3 4.5 19 2 19.5V12.8Z"
        fill="#0078D7"
      />
      {/* Amarillo inferior derecho */}
      <path
        d="M12.5 12.5C15.5 11.6 19 13.1 22 12.5V19.2C19 19.9 15.5 18.4 12.5 19.2V12.5Z"
        fill="#FFC000"
      />
    </g>
  </svg>
);

// 2. Avatar de Alejandro con las piezas de ajedrez
export const ChessAvatar: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 42 42">
    <defs>
      <radialGradient id="chessBg" cx="40%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#d86326" />
        <stop offset="60%" stopColor="#a3320c" />
        <stop offset="100%" stopColor="#5a1805" />
      </radialGradient>
      <linearGradient id="goldPiece" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff2a8" />
        <stop offset="40%" stopColor="#e3a73c" />
        <stop offset="100%" stopColor="#7a4608" />
      </linearGradient>
    </defs>
    {/* Fondo cálido caoba */}
    <rect width="42" height="42" rx="3" fill="url(#chessBg)" />
    {/* Rey / Caballo de ajedrez estilizado */}
    <g transform="translate(6, 4)">
      {/* Caballo detrás */}
      <path
        d="M19 12 C18 9, 14 7, 13 4 C11 5, 11 8, 8 10 C5 12, 6 15, 7 17 C8 19, 9 24, 7 28 L23 28 C22 23, 20 16, 19 12 Z"
        fill="#8a4214"
        opacity="0.85"
      />
      {/* Pieza dorada principal (Caballo / Rey) */}
      <path
        d="M16 10 C15 7, 12 5, 11 2 C9 3, 9 6, 6 8 C4 10, 4 13, 5 15 C6 17, 7 22, 5 26 L20 26 C19 21, 17 14, 16 10 Z"
        fill="url(#goldPiece)"
        stroke="#522b04"
        strokeWidth="0.8"
      />
      <circle cx="10" cy="7" r="1.2" fill="#522b04" />
      {/* Peón dorado al lado */}
      <ellipse cx="23" cy="22" rx="4" ry="5" fill="url(#goldPiece)" stroke="#522b04" strokeWidth="0.8" />
      <circle cx="23" cy="14" r="3" fill="url(#goldPiece)" stroke="#522b04" strokeWidth="0.8" />
      <path d="M19 27 L27 27 L25 24 L21 24 Z" fill="url(#goldPiece)" stroke="#522b04" strokeWidth="0.8" />
    </g>
  </svg>
);

// 3. Internet Explorer (e azul con órbita dorada)
export const InternetExplorerIcon: React.FC<IconProps> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <linearGradient id="ieBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#41b2ff" />
        <stop offset="45%" stopColor="#0270d4" />
        <stop offset="100%" stopColor="#003e85" />
      </linearGradient>
      <linearGradient id="ieGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffaab" />
        <stop offset="50%" stopColor="#f5b800" />
        <stop offset="100%" stopColor="#9b6e00" />
      </linearGradient>
    </defs>
    {/* Halo orbital dorado atrás */}
    <ellipse
      cx="16"
      cy="16"
      rx="15"
      ry="5"
      transform="rotate(-30 16 16)"
      fill="none"
      stroke="url(#ieGold)"
      strokeWidth="2.5"
    />
    {/* La famosa "e" azul */}
    <path
      d="M16 6 C10.5 6 6 10.5 6 16 C6 21.5 10.5 26 16 26 C20 26 23.5 23.8 25 20.5 L19.8 20.5 C18.8 21.8 17.5 22.4 16 22.4 C13.2 22.4 10.8 20.2 10.2 17.5 L25.5 17.5 C25.8 16.5 26 15.5 26 14.5 C26 9.8 21.5 6 16 6 Z M10.4 14 C11 11.4 13.2 9.6 16 9.6 C18.8 9.6 21 11.4 21.6 14 L10.4 14 Z"
      fill="url(#ieBlue)"
      stroke="#002d6b"
      strokeWidth="0.6"
    />
    {/* Halo orbital dorado al frente */}
    <path
      d="M 5 22 C 10 26, 22 25, 27 18"
      fill="none"
      stroke="url(#ieGold)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// 4. Outlook Express (Sobre con cartas y ribete aéreo)
export const OutlookExpressIcon: React.FC<IconProps> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <linearGradient id="envGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e1e8f2" />
      </linearGradient>
    </defs>
    {/* Hoja de papel saliendo */}
    <rect x="7" y="5" width="18" height="14" rx="1" fill="#fff" stroke="#99a8b8" strokeWidth="0.8" />
    <line x1="10" y1="9" x2="22" y2="9" stroke="#4886cd" strokeWidth="1" />
    <line x1="10" y1="12" x2="19" y2="12" stroke="#99a8b8" strokeWidth="0.8" />
    {/* Sobre principal */}
    <rect x="4" y="11" width="24" height="16" rx="2" fill="url(#envGrad)" stroke="#5d7b9d" strokeWidth="1" />
    {/* Solapa del sobre */}
    <path d="M4 11 L16 20 L28 11" fill="none" stroke="#7e9bbd" strokeWidth="1.2" />
    {/* Flecha azul de envío */}
    <path d="M19 19 L26 16 L23 23 Z" fill="#2d77d7" stroke="#104285" strokeWidth="0.6" />
  </svg>
);

// 5. MSN Butterfly (Mariposa de MSN multicolor)
export const MsnButterflyIcon: React.FC<IconProps> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <g transform="translate(1, 1)">
      {/* Ala superior izquierda - Azul */}
      <path
        d="M15 15 C13 9 7 4 4 6 C1 8 4 14 15 15 Z"
        fill="#00a4ef"
        stroke="#006ca5"
        strokeWidth="0.8"
      />
      {/* Ala inferior izquierda - Naranja */}
      <path
        d="M15 16 C11 19 6 23 4 21 C2 19 5 15 15 16 Z"
        fill="#ff7d00"
        stroke="#b85400"
        strokeWidth="0.8"
      />
      {/* Ala superior derecha - Verde */}
      <path
        d="M16 15 C18 8 24 3 27 5 C30 7 27 13 16 15 Z"
        fill="#7fba00"
        stroke="#4f7a00"
        strokeWidth="0.8"
      />
      {/* Ala inferior derecha - Amarillo */}
      <path
        d="M16 16 C20 20 25 24 27 22 C29 20 26 15 16 16 Z"
        fill="#ffb900"
        stroke="#b37f00"
        strokeWidth="0.8"
      />
      {/* Cuerpo de la mariposa */}
      <ellipse cx="15.5" cy="15.5" rx="1.5" ry="6" fill="#333" />
    </g>
  </svg>
);

// 6. Windows Media Player (Círculo azul con triángulo naranja)
export const WindowsMediaPlayerIcon: React.FC<IconProps> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <linearGradient id="wmpCircle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#438ef5" />
        <stop offset="70%" stopColor="#1251ba" />
        <stop offset="100%" stopColor="#082d70" />
      </linearGradient>
      <radialGradient id="wmpOrange" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffb347" />
        <stop offset="60%" stopColor="#ff6a00" />
        <stop offset="100%" stopColor="#b33600" />
      </radialGradient>
    </defs>
    {/* Aro exterior plateado/azul */}
    <circle cx="16" cy="16" r="14" fill="url(#wmpCircle)" stroke="#225cb8" strokeWidth="1" />
    <circle cx="16" cy="16" r="11" fill="#0d2854" />
    {/* Botón de reproducción naranja central */}
    <circle cx="16" cy="16" r="8" fill="url(#wmpOrange)" />
    {/* Flecha play blanca */}
    <polygon points="14,12 20,16 14,20" fill="#ffffff" />
  </svg>
);

// 7. Windows Messenger (Dos siluetas: verde y azul)
export const WindowsMessengerIcon: React.FC<IconProps> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <linearGradient id="msnBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4aa5ff" />
        <stop offset="100%" stopColor="#085fc5" />
      </linearGradient>
      <linearGradient id="msnGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#82e85a" />
        <stop offset="100%" stopColor="#259a0e" />
      </linearGradient>
    </defs>
    {/* Amigo azul (fondo) */}
    <circle cx="20" cy="11" r="4.5" fill="url(#msnBlue)" stroke="#064187" strokeWidth="0.8" />
    <path
      d="M13 25 C13 18, 18 17, 21 17 C25 17, 28 19, 28 25 Z"
      fill="url(#msnBlue)"
      stroke="#064187"
      strokeWidth="0.8"
    />
    {/* Amigo verde (frente) */}
    <circle cx="11" cy="13" r="4.5" fill="url(#msnGreen)" stroke="#1a6e08" strokeWidth="0.8" />
    <path
      d="M4 27 C4 20, 9 19, 12 19 C16 19, 19 21, 19 27 Z"
      fill="url(#msnGreen)"
      stroke="#1a6e08"
      strokeWidth="0.8"
    />
  </svg>
);

// 8. Tour Windows XP (Logo XP en disco / brújula)
export const TourXpIcon: React.FC<IconProps> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <radialGradient id="cdGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#e4effb" />
        <stop offset="80%" stopColor="#a3c4ed" />
        <stop offset="100%" stopColor="#6393ce" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="14" fill="url(#cdGrad)" stroke="#456ea6" strokeWidth="1" />
    <circle cx="16" cy="16" r="5" fill="#ffffff" stroke="#456ea6" strokeWidth="0.8" />
    <circle cx="16" cy="16" r="2" fill="#d0e2f7" />
    {/* Banderita XP en esquina */}
    <g transform="translate(13, 7) scale(0.6)">
      <rect x="0" y="0" width="7" height="6" fill="#e81123" />
      <rect x="8" y="0" width="7" height="6" fill="#00b050" />
      <rect x="0" y="7" width="7" height="6" fill="#0078d7" />
      <rect x="8" y="7" width="7" height="6" fill="#ffc000" />
    </g>
  </svg>
);

// 9. Files and Settings Transfer Wizard (Monitor con varita y archivos)
export const TransferWizardIcon: React.FC<IconProps> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    {/* Monitor */}
    <rect x="5" y="6" width="22" height="17" rx="2" fill="#e8e8e8" stroke="#717171" strokeWidth="1" />
    <rect x="7" y="8" width="18" height="13" fill="#2d68b8" />
    {/* Base */}
    <rect x="13" y="23" width="6" height="3" fill="#cfcfcf" stroke="#717171" strokeWidth="0.8" />
    <rect x="10" y="26" width="12" height="2" rx="1" fill="#bebebe" stroke="#717171" strokeWidth="0.8" />
    {/* Varita mágica con chispas */}
    <line x1="26" y1="6" x2="16" y2="16" stroke="#f6c243" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="26" cy="5" r="1.5" fill="#fff" />
    <polygon points="17,11 19,13 15,14" fill="#ffd700" />
  </svg>
);

// 10. My Documents (Carpeta amarilla con documento saliendo)
export const MyDocumentsIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <linearGradient id="folderBack" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f3be4d" />
        <stop offset="100%" stopColor="#cf961d" />
      </linearGradient>
      <linearGradient id="folderFront" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffe680" />
        <stop offset="100%" stopColor="#e5a92a" />
      </linearGradient>
    </defs>
    {/* Lengüeta trasera */}
    <path d="M4 8 L12 8 L15 11 L28 11 L28 25 L4 25 Z" fill="url(#folderBack)" stroke="#a17006" strokeWidth="0.8" />
    {/* Hoja de papel interna */}
    <rect x="9" y="5" width="15" height="16" rx="1" fill="#fff" stroke="#9bb1c8" strokeWidth="0.8" />
    <line x1="12" y1="8" x2="21" y2="8" stroke="#3d7ab8" strokeWidth="1" />
    <line x1="12" y1="11" x2="19" y2="11" stroke="#9bb1c8" strokeWidth="0.8" />
    <line x1="12" y1="14" x2="20" y2="14" stroke="#9bb1c8" strokeWidth="0.8" />
    {/* Parte frontal inclinada de la carpeta */}
    <polygon points="2,14 30,14 27,27 2,27" fill="url(#folderFront)" stroke="#a17006" strokeWidth="0.8" />
  </svg>
);

// 11. My Recent Documents (Carpeta con reloj pequeño)
export const MyRecentDocumentsIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <MyDocumentsIcon size={size} />
    {/* Relojito indicador de reciente */}
    <circle cx="24" cy="22" r="6" fill="#fff" stroke="#1f4f89" strokeWidth="1" />
    <polyline points="24,18 24,22 27,22" fill="none" stroke="#e04006" strokeWidth="1.2" />
  </svg>
);

// 12. My Pictures (Carpeta con foto de paisaje clásico)
export const MyPicturesIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <linearGradient id="picSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#55a5f7" />
        <stop offset="100%" stopColor="#b4d7fe" />
      </linearGradient>
    </defs>
    {/* Carpeta base */}
    <path d="M3 9 L11 9 L14 12 L27 12 L27 26 L3 26 Z" fill="#e5aa2b" stroke="#996a06" strokeWidth="0.8" />
    {/* Marco de fotografía */}
    <rect x="7" y="5" width="18" height="15" rx="1" fill="#fff" stroke="#888" strokeWidth="0.8" />
    <rect x="9" y="7" width="14" height="11" fill="url(#picSky)" />
    {/* Sol y montañita */}
    <circle cx="12" cy="10" r="1.8" fill="#ffd000" />
    <polygon points="9,18 14,13 18,17 21,14 23,18" fill="#3b8c23" />
    {/* Frontal de carpeta */}
    <polygon points="1,14 29,14 26,27 1,27" fill="#fed65d" stroke="#a17006" strokeWidth="0.8" />
  </svg>
);

// 13. My Music (Carpeta con nota musical azul)
export const MyMusicIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    {/* Carpeta base */}
    <path d="M3 9 L11 9 L14 12 L27 12 L27 26 L3 26 Z" fill="#e5aa2b" stroke="#996a06" strokeWidth="0.8" />
    {/* Papel con notas */}
    <rect x="8" y="5" width="16" height="15" rx="1" fill="#fff" stroke="#888" strokeWidth="0.8" />
    {/* Dos corcheas musicales unidas */}
    <g transform="translate(10, 6) scale(0.7)">
      <ellipse cx="4" cy="11" rx="2.5" ry="2" fill="#0066cc" />
      <ellipse cx="11" cy="9" rx="2.5" ry="2" fill="#0066cc" />
      <rect x="5.5" y="2" width="1.5" height="9" fill="#0066cc" />
      <rect x="12.5" y="0" width="1.5" height="9" fill="#0066cc" />
      <polygon points="5.5,2 14,0 14,3 5.5,5" fill="#0066cc" />
    </g>
    {/* Frontal de carpeta */}
    <polygon points="1,14 29,14 26,27 1,27" fill="#fed65d" stroke="#a17006" strokeWidth="0.8" />
  </svg>
);

// 14. My Computer (Monitor CRT beige con pantalla azul y torre)
export const MyComputerIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <linearGradient id="crtScreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a5db3" />
        <stop offset="100%" stopColor="#3b8af3" />
      </linearGradient>
    </defs>
    {/* Monitor */}
    <rect x="4" y="5" width="19" height="16" rx="2" fill="#f0efe8" stroke="#8c8b84" strokeWidth="1" />
    <rect x="6" y="7" width="15" height="12" fill="url(#crtScreen)" stroke="#525049" strokeWidth="0.6" />
    {/* Base monitor */}
    <rect x="11" y="21" width="5" height="3" fill="#deddd5" stroke="#8c8b84" strokeWidth="0.8" />
    <rect x="8" y="24" width="11" height="2" rx="1" fill="#d2d1c8" stroke="#8c8b84" strokeWidth="0.8" />
    {/* Mini CPU / Torre a la derecha */}
    <rect x="23" y="10" width="7" height="16" rx="1" fill="#f0efe8" stroke="#8c8b84" strokeWidth="1" />
    <rect x="25" y="12" width="3" height="1.5" fill="#525049" />
    <rect x="25" y="15" width="3" height="1.5" fill="#525049" />
    <circle cx="26.5" cy="22" r="0.8" fill="#00d000" />
  </svg>
);

// 15. Control Panel (Ventana con engranajes)
export const ControlPanelIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x="3" y="6" width="26" height="20" rx="2" fill="#f4f7fb" stroke="#5d7b9d" strokeWidth="1" />
    <rect x="3" y="6" width="26" height="6" fill="#2d68b8" />
    <g transform="translate(13, 14)">
      <circle cx="6" cy="6" r="4" fill="#a4b3c4" stroke="#4a5f78" strokeWidth="1" />
      <circle cx="6" cy="6" r="1.5" fill="#f4f7fb" />
    </g>
    <g transform="translate(6, 11)">
      <circle cx="4" cy="4" r="2.8" fill="#d49b38" stroke="#8f6111" strokeWidth="0.8" />
      <circle cx="4" cy="4" r="1" fill="#f4f7fb" />
    </g>
  </svg>
);

// 16. Set Program Access and Defaults (Monitor con CD y check)
export const ProgramAccessIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x="4" y="6" width="18" height="15" rx="1" fill="#f0efe8" stroke="#777" strokeWidth="0.8" />
    <rect x="6" y="8" width="14" height="11" fill="#2d68b8" />
    {/* CD */}
    <circle cx="22" cy="20" r="7" fill="#e8f0fe" stroke="#668bb5" strokeWidth="1" />
    <circle cx="22" cy="20" r="2.5" fill="#fff" stroke="#668bb5" strokeWidth="0.8" />
    {/* Checkmark verde */}
    <polyline points="19,20 21,23 25,18" fill="none" stroke="#00a82d" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 17. Printers and Faxes (Impresora beige clásica)
export const PrintersFaxesIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    {/* Hoja superior */}
    <rect x="9" y="4" width="14" height="10" fill="#fff" stroke="#999" strokeWidth="0.8" />
    <line x1="12" y1="7" x2="20" y2="7" stroke="#bbb" strokeWidth="1" />
    <line x1="12" y1="10" x2="18" y2="10" stroke="#bbb" strokeWidth="1" />
    {/* Cuerpo impresora */}
    <rect x="4" y="11" width="24" height="12" rx="2" fill="#ecebe4" stroke="#777" strokeWidth="1" />
    <rect x="8" y="19" width="16" height="7" fill="#fff" stroke="#999" strokeWidth="0.8" />
    <line x1="11" y1="22" x2="21" y2="22" stroke="#467bb0" strokeWidth="1" />
    {/* Botones y luces */}
    <circle cx="24" cy="14" r="1" fill="#00d000" />
    <circle cx="24" cy="17" r="1" fill="#e67e22" />
  </svg>
);

// 18. Help and Support (Esfera azul con signo de interrogación blanco)
export const HelpSupportIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <radialGradient id="helpBlue" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#63b6ff" />
        <stop offset="55%" stopColor="#156ee0" />
        <stop offset="100%" stopColor="#08387a" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="12" fill="url(#helpBlue)" stroke="#093d84" strokeWidth="1" />
    <text
      x="16"
      y="22"
      textAnchor="middle"
      fontSize="17"
      fontWeight="bold"
      fill="#ffffff"
      fontFamily="Tahoma, sans-serif"
    >
      ?
    </text>
  </svg>
);

// 19. Search (Lupa sobre carpeta)
export const SearchIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e3f2fd" />
        <stop offset="100%" stopColor="#90caf9" />
      </linearGradient>
    </defs>
    {/* Carpeta amarilla */}
    <path d="M4 10 L11 10 L13 13 L24 13 L24 23 L4 23 Z" fill="#f3be4d" stroke="#a17006" strokeWidth="0.8" />
    {/* Lupa */}
    <circle cx="18" cy="15" r="7" fill="url(#lensGrad)" stroke="#616161" strokeWidth="2" opacity="0.9" />
    <line x1="23" y1="20" x2="29" y2="26" stroke="#424242" strokeWidth="3" strokeLinecap="round" />
    <line x1="23" y1="20" x2="29" y2="26" stroke="#ffb300" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// 20. Run... (Ventana de diálogo con flecha de comando)
export const RunIcon: React.FC<IconProps> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x="4" y="7" width="24" height="18" rx="2" fill="#ffffff" stroke="#68809a" strokeWidth="1" />
    <rect x="4" y="7" width="24" height="5" fill="#2d68b8" />
    <polyline points="9,17 14,20 9,23" fill="none" stroke="#007acc" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="23" x2="23" y2="23" stroke="#555" strokeWidth="1.5" />
  </svg>
);

// 21. Log Off (Llave dorada)
export const LogOffIcon: React.FC<IconProps> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect width="24" height="24" rx="4" fill="#e67e22" />
    {/* Llave dorada */}
    <circle cx="8" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="2" />
    <line x1="12" y1="12" x2="20" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="12" x2="17" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="12" x2="19" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 22. Turn Off Computer (Botón rojo con símbolo de encendido)
export const TurnOffIcon: React.FC<IconProps> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#e81123" stroke="#b00816" strokeWidth="1" />
    {/* Símbolo de encendido blanco */}
    <path
      d="M12 5 L12 11 M8 7.5 C5.5 9 4.5 12 5.5 15 C6.8 18 10.5 19.5 14 18.5 C17.5 17.5 19.5 14 18.5 10.5 C18 9 17 7.8 15.5 7"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

// 23. Calculator (Calculadora clásica de Windows XP)
export const CalculatorIcon: React.FC<IconProps> = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={style}>
    <defs>
      <linearGradient id="calcBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dce8f8" />
        <stop offset="35%" stopColor="#b6cde8" />
        <stop offset="100%" stopColor="#82a5cf" />
      </linearGradient>
      <linearGradient id="calcScreen" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e3ebf5" />
      </linearGradient>
      <filter id="calcShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#calcShadow)">
      {/* Cuerpo de la calculadora */}
      <rect
        x="3"
        y="2"
        width="26"
        height="28"
        rx="2.5"
        fill="url(#calcBody)"
        stroke="#2c5a96"
        strokeWidth="1"
      />
      {/* Brillo superior */}
      <line x1="5" y1="3.5" x2="27" y2="3.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
      {/* Pantalla display */}
      <rect
        x="6"
        y="5.5"
        width="20"
        height="5.5"
        rx="1"
        fill="url(#calcScreen)"
        stroke="#4a6f9c"
        strokeWidth="0.8"
      />
      {/* Texto display simulado "0." */}
      <rect x="21" y="8" width="3" height="1.5" fill="#1b3964" />
      <circle cx="25" cy="9.2" r="0.6" fill="#1b3964" />

      {/* Teclas */}
      {/* Fila 1 */}
      <rect x="6" y="13" width="3.5" height="3" rx="0.5" fill="#d9534f" stroke="#8c1c18" strokeWidth="0.5" />
      <rect x="11.5" y="13" width="3.5" height="3" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="17" y="13" width="3.5" height="3" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="22.5" y="13" width="3.5" height="3" rx="0.5" fill="#d9534f" stroke="#8c1c18" strokeWidth="0.5" />

      {/* Fila 2 */}
      <rect x="6" y="17.5" width="3.5" height="3" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="11.5" y="17.5" width="3.5" height="3" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="17" y="17.5" width="3.5" height="3" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="22.5" y="17.5" width="3.5" height="3" rx="0.5" fill="#d9534f" stroke="#8c1c18" strokeWidth="0.5" />

      {/* Fila 3 */}
      <rect x="6" y="22" width="3.5" height="3" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="11.5" y="22" width="3.5" height="3" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="17" y="22" width="3.5" height="3" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="22.5" y="22" width="3.5" height="3" rx="0.5" fill="#d9534f" stroke="#8c1c18" strokeWidth="0.5" />

      {/* Fila 4 */}
      <rect x="6" y="26.5" width="3.5" height="2.5" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="11.5" y="26.5" width="3.5" height="2.5" rx="0.5" fill="#f8f9fa" stroke="#607d8b" strokeWidth="0.5" />
      <rect x="17" y="26.5" width="3.5" height="2.5" rx="0.5" fill="#d9534f" stroke="#8c1c18" strokeWidth="0.5" />
      <rect x="22.5" y="26.5" width="3.5" height="2.5" rx="0.5" fill="#d9534f" stroke="#8c1c18" strokeWidth="0.5" />
    </g>
  </svg>
);

// 24. Paint (Paleta de pintura clásica de Windows XP con pinceles)
export const PaintIcon: React.FC<IconProps> = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={style}>
    <defs>
      <linearGradient id="paletteWood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f7e6b5" />
        <stop offset="40%" stopColor="#e2bc77" />
        <stop offset="100%" stopColor="#b5873a" />
      </linearGradient>
      <filter id="paintShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="1" dy="1" stdDeviation="0.8" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#paintShadow)">
      {/* Pincel trasero azul */}
      <path d="M7 2 L10 5 L24 25 L21 28 Z" fill="#2979ff" />
      <path d="M22 26 L24 29 L21 31 L19 28 Z" fill="#546e7a" />
      {/* Pincel trasero rojo */}
      <path d="M22 2 L25 5 L11 25 L8 28 Z" fill="#e53935" />
      <path d="M7 26 L9 29 L6 31 L4 28 Z" fill="#546e7a" />

      {/* Paleta de madera */}
      <path
        d="M6 14 C4 8 10 4 18 4 C26 4 29 10 28 17 C27 23 23 27 16 27 C12 27 11 23 9 22 C7 21 5 19 6 14 Z"
        fill="url(#paletteWood)"
        stroke="#7c531d"
        strokeWidth="1.2"
      />
      {/* Agujero para el pulgar */}
      <ellipse cx="23" cy="20" rx="2.5" ry="3" fill="#ffffff" stroke="#7c531d" strokeWidth="1" />

      {/* Manchas de pintura al óleo */}
      {/* Rojo */}
      <ellipse cx="10" cy="8" rx="2.2" ry="2" fill="#e53935" stroke="#b71c1c" strokeWidth="0.5" />
      <ellipse cx="9.5" cy="7.5" rx="0.8" ry="0.6" fill="#ff8a80" />
      {/* Amarillo */}
      <ellipse cx="16" cy="7" rx="2.2" ry="2" fill="#ffd600" stroke="#f57f17" strokeWidth="0.5" />
      <ellipse cx="15.5" cy="6.5" rx="0.8" ry="0.6" fill="#ffff8d" />
      {/* Azul */}
      <ellipse cx="22" cy="9" rx="2.2" ry="2" fill="#1976d2" stroke="#0d47a1" strokeWidth="0.5" />
      <ellipse cx="21.5" cy="8.5" rx="0.8" ry="0.6" fill="#82b1ff" />
      {/* Verde */}
      <ellipse cx="25" cy="14" rx="2" ry="1.8" fill="#43a047" stroke="#1b5e20" strokeWidth="0.5" />
      {/* Púrpura */}
      <ellipse cx="12" cy="18" rx="2" ry="1.8" fill="#8e24aa" stroke="#4a148c" strokeWidth="0.5" />
    </g>
  </svg>
);

// 25. Buscaminas / Minesweeper (Mina clásica con púas y destello)
export const MinesweeperIcon: React.FC<IconProps> = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={style}>
    <defs>
      <radialGradient id="mineSphere" cx="38%" cy="38%" r="60%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="60%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#050505" />
      </radialGradient>
      <linearGradient id="tileBevel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e8e8e8" />
        <stop offset="100%" stopColor="#9c9c9c" />
      </linearGradient>
    </defs>
    {/* Fondo de casilla biselada clásica */}
    <rect x="2" y="2" width="28" height="28" rx="2" fill="#c0c0c0" stroke="url(#tileBevel)" strokeWidth="1.5" />
    <path d="M2 30 L2 2 L30 2" stroke="#ffffff" strokeWidth="2" fill="none" />
    <path d="M2 30 L30 30 L30 2" stroke="#808080" strokeWidth="2" fill="none" />

    {/* Púas de la mina */}
    <g stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round">
      {/* Horizontales y verticales */}
      <line x1="16" y1="5" x2="16" y2="27" />
      <line x1="5" y1="16" x2="27" y2="16" />
      {/* Diagonales */}
      <line x1="8" y1="8" x2="24" y2="24" />
      <line x1="8" y1="24" x2="24" y2="8" />
    </g>

    {/* Puntas rojas de las espinas */}
    <circle cx="16" cy="5" r="1.2" fill="#e53935" />
    <circle cx="16" cy="27" r="1.2" fill="#e53935" />
    <circle cx="5" cy="16" r="1.2" fill="#e53935" />
    <circle cx="27" cy="16" r="1.2" fill="#e53935" />
    <circle cx="8" cy="8" r="1.2" fill="#e53935" />
    <circle cx="24" cy="24" r="1.2" fill="#e53935" />
    <circle cx="8" cy="24" r="1.2" fill="#e53935" />
    <circle cx="24" cy="8" r="1.2" fill="#e53935" />

    {/* Esfera central de la mina */}
    <circle cx="16" cy="16" r="7.5" fill="url(#mineSphere)" stroke="#000000" strokeWidth="1" />

    {/* Destello blanco en la esfera */}
    <rect x="12" y="12" width="2.5" height="2.5" fill="#ffffff" rx="0.5" />
  </svg>
);


