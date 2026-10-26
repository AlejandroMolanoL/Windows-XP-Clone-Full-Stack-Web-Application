# 🪟 Windows XP Web Clone (Client)

Un clon web nostálgico y fiel del legendario sistema operativo **Windows XP** (tema visual *Luna Blue* y fondo de pantalla clásico *Bliss*). Diseñado como una Single Page Application (SPA) interactiva construida con tecnologías modernas del ecosistema React.

---

## 🚀 Tecnologías Utilizadas

Este proyecto combina la potencia y velocidad de herramientas modernas de desarrollo frontend:

| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| **[React](https://react.dev/)** | `^19.1.1` | Biblioteca base para la construcción de interfaces declarativas basadas en componentes. |
| **[TypeScript](https://www.typescriptlang.org/)** | `~5.9.3` | Tipado estático estricto para mayor robustez, autocompletado y mantenibilidad. |
| **[Vite](https://vite.dev/)** | `^7.1.7` | Entorno de desarrollo ultrarrápido con soporte HMR (Hot Module Replacement) instantáneo y bundler optimizado con Rollup/oxc. |
| **[Styled Components](https://styled-components.com/)** | `^6.1.19` | Solución CSS-in-JS para recrear de forma modular los gradientes, sombras, bordes y estilos visuales nativos de Windows XP. |
| **[React Icons](https://react-icons.github.io/react-icons/)** | `^5.5.0` | Conjunto de iconos vectoriales ligeros (utilizado para el logotipo clásico de Windows en el botón Start). |
| **[ESLint](https://eslint.org/)** | `^9.36.0` | Linter con configuración plana (*flat config*) y plugins específicos para React Hooks y TypeScript. |
| **[Docker](https://www.docker.com/)** | `Node 20 Alpine/Debian` | Contenedorización del entorno de desarrollo para reproducibilidad garantizada. |
| **[Yarn](https://yarnpkg.com/)** | `Berry / Classic` (Corepack) | Gestor de paquetes rápido y seguro configurado en modo `nodeLinker: node-modules`. |

---

## 📁 Estructura del Proyecto

```text
client/
├── public/                 # Archivos estáticos públicos
├── src/
│   ├── assets/             # Recursos multimedia (wallpaper Bliss 'xp-wallpaper.jpg', sonidos, etc.)
│   ├── components/         # Componentes modulares de la interfaz
│   │   └── Taskbar/        # Barra de tareas de Windows XP
│   │       ├── StartButton.tsx   # Botón verde curvo "start" con logo y estados hover/active
│   │       └── Taskbar.tsx       # Contenedor inferior con gradiente azul clásico
│   ├── App.tsx             # Componente raíz que orquesta Desktop y Taskbar
│   ├── GlobalStyle.ts      # Estilos globales (fuente Tahoma, cursor, fondo Bliss, user-select: none)
│   ├── index.css           # Estilos base adicionales
│   └── main.tsx            # Punto de entrada de React en el DOM
├── .dockerignore           # Exclusiones de contexto para la imagen Docker
├── Dockerfile              # Definición de la imagen del contenedor
├── entrypoint.sh           # Script de inicio que sincroniza dependencias y arranca el servidor
├── package.json            # Metadatos del proyecto, dependencias y scripts
├── tsconfig.json           # Configuración base de TypeScript
├── vite.config.ts          # Configuración del servidor de desarrollo y plugins de Vite
└── yarn.lock               # Archivo de bloqueo de versiones de dependencias
```

---

## 🛠️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de contar con alguna de las siguientes herramientas instaladas:

- **[Node.js](https://nodejs.org/)** (v18.0 o superior, recomendado v20.x LTS)
- **[Yarn](https://yarnpkg.com/)** (o Corepack activado mediante `corepack enable`)
- *(Opcional)* **[Docker](https://www.docker.com/)** y **Docker Desktop** (si deseas ejecutarlo en contenedores)

---

## 💻 Formas de Ejecutar el Servicio

Tienes dos alternativas principales para levantar y probar la aplicación:

### Opción 1: Ejecución Local en el Sistema Operativo (Recomendada para Desarrollo Rápido)

1. **Clonar o situarse en el directorio del cliente**:
   ```bash
   cd client
   ```

2. **Habilitar Corepack y configurar Yarn** (si es necesario):
   ```bash
   corepack enable
   yarn config set nodeLinker node-modules
   ```

3. **Instalar dependencias**:
   ```bash
   yarn install
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   yarn dev
   ```

5. **Abrir en el navegador**:
   El servidor estará disponible en:
   👉 **[http://localhost:5173](http://localhost:5173)**

---

### Opción 2: Ejecución con Docker

El proyecto incluye un `Dockerfile` y un `entrypoint.sh` optimizados para sincronizar dependencias automáticamente y exponer el servicio de desarrollo en red local (`0.0.0.0:5173`).

1. **Construir la imagen de Docker**:
   ```bash
   docker build -t windows-xp-clone-client .
   ```

2. **Ejecutar el contenedor**:
   ```bash
   # En Windows PowerShell / CMD:
   docker run -it --rm -p 5173:5173 --name xp-client windows-xp-clone-client

   # Con volumen montado para Hot Reloading instantáneo:
   docker run -it --rm -p 5173:5173 -v ${PWD}:/app -v /app/node_modules --name xp-client windows-xp-clone-client
   ```

3. **Si dispones de un `docker-compose.yml` en la raíz del proyecto**:
   ```bash
   docker compose up --build
   ```

4. **Acceder a la aplicación**:
   Abre tu navegador en:
   👉 **[http://localhost:5173](http://localhost:5173)**

---

## 📜 Scripts Disponibles

En el archivo [package.json](file:///d:/ProyectosWEB/windows-xp-clone/client/package.json) puedes encontrar los siguientes comandos útiles:

| Comando | Descripción |
| :--- | :--- |
| `yarn dev` | Inicia el servidor de desarrollo con Vite y HMR en el puerto `5173`. |
| `yarn build` | Realiza el chequeo de tipos con `tsc -b` y compila los assets para producción en `/dist`. |
| `yarn preview` | Previsualiza localmente el build de producción generado. |
| `yarn lint` | Ejecuta ESLint sobre todo el proyecto para encontrar y corregir problemas de código. |

---

## ✨ Componentes y Características Implementadas

- **Fondo de Pantalla Bliss**: Renderizado a pantalla completa mediante `GlobalStyle`, adaptativo y con bloqueo de selección de texto para simular la sensación de un sistema operativo nativo.
- **Barra de Tareas (Taskbar)**:
  - Fijada en la parte inferior con posición absoluta y `z-index: 1000`.
  - Gradiente vertical azul clásico Luna (`#245edb` ➔ `#3f8cf3` ➔ `#50a0fc`).
  - Borde superior oscuro separator.
- **Botón de Inicio (Start Button)**:
  - Forma ergonómica con bordes redondeados asimétricos característicos de XP (`border-radius: 2px 10px 10px 2px`).
  - Gradiente verde brillante (`#3DA953` ➔ `#3ED82B` ➔ `#2E7143`).
  - Logotipo vectorial de Windows integrado con sombra de texto (`text-shadow: 1px 1px 2px #0146DB`).
  - Microinteracciones: animación de brillo al pasar el cursor (`:hover`) e inversión del gradiente al hacer clic (`:active`).

---

## 🗺️ Roadmap de Próximas Funcionalidades

- [ ] **Start Menu (Menú de Inicio)**: Despliegue del menú de inicio en dos columnas con avatar de usuario y accesos rápidos.
- [ ] **Desktop Icons**: Iconos arrastrables y seleccionables (*Mi PC*, *Mis documentos*, *Papelera de reciclaje*, *Internet Explorer*).
- [ ] **Window Manager**: Sistema de ventanas flotantes con barra de título azul, controles de minimizar, maximizar y cerrar, arrastre y redimensionado.
- [ ] **System Tray & Clock**: Reloj digital en tiempo real y bandeja de notificación en la esquina inferior derecha.
- [ ] **Efectos de Sonido**: Reproducción de sonidos icónicos (inicio de sesión, sonido de error de parada, clics de navegación).
