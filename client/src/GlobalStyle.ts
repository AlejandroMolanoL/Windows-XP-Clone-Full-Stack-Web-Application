// client/src/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

// ¡Importante! Necesitarás esta imagen.
// Descarga el wallpaper clásico de Windows XP
// y guárdalo en: client/src/assets/xp-wallpaper.jpg
// Si no lo encuentras, avísame y te paso un enlace.
import xpWallpaper from './assets/xp-wallpaper.jpg';

// Fuente clásica de Windows XP
// Puedes descargar "Tahoma" e importarla, pero por ahora usaremos una genérica.

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Tahoma', 'Geneva', sans-serif;
    font-size: 11px; /* Tamaño de fuente clásico de XP */

    /* El fondo de pantalla de XP */
    background: url(${xpWallpaper}) no-repeat center center fixed;
    background-size: cover;

    /* Evita que el usuario seleccione texto (como en un SO real) */
    user-select: none;
  }
`;