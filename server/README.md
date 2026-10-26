# 🖥️ Windows XP Clone — Backend API

Backend y API REST para el proyecto **Windows XP Clone**, desarrollado con Node.js, Express y MongoDB. Proporciona los servicios y la persistencia de datos necesarios para alimentar el cliente web.

---

## 🚀 Tecnologías Principales

| Tecnología | Versión / Detalle | Descripción |
| :--- | :--- | :--- |
| **Node.js** | `>= 20.x` | Entorno de ejecución de JavaScript en el servidor |
| **Express** | `^5.1.0` | Framework web rápido y minimalista para la API REST |
| **MongoDB & Mongoose** | `^8.19.2` | Base de datos NoSQL y ODM para modelado y persistencia de datos |
| **Yarn (Berry)** | `4.9.2` | Gestor de paquetes moderno configurado con `node-modules` linker |
| **CORS** | `^2.8.5` | Middleware para habilitar Cross-Origin Resource Sharing con el cliente |
| **Nodemon** | `^3.1.10` | Herramienta de desarrollo para reinicio automático en caliente (hot reload) |
| **Docker** | `node:20` | Contenedorización del servicio con script de entrada (`entrypoint.sh`) |

---

## 📁 Estructura del Directorio

```plaintext
server/
├── .yarn/              # Archivos y binarios de Yarn Berry
├── .dockerignore       # Archivos excluidos del contexto Docker
├── .editorconfig       # Configuración de estilo y formateo de código
├── .gitignore          # Reglas de exclusión para Git
├── .yarnrc.yml         # Configuración del gestor de paquetes Yarn
├── Dockerfile          # Definición de la imagen de Docker (Node.js 20)
├── entrypoint.sh       # Script de arranque del contenedor (sincroniza dependencias)
├── index.js            # Punto de entrada de la aplicación, conexión BD y rutas
├── package.json        # Dependencias y scripts de ejecución
└── README.md           # Documentación del servicio
```

---

## ⚙️ Variables de Entorno

El servidor requiere las siguientes variables de entorno para su correcto funcionamiento:

| Variable | Tipo | Obligatorio | Descripción / Ejemplo |
| :--- | :---: | :---: | :--- |
| `PORT` | Número | No | Puerto en el que escucha el servidor (por defecto: `5000`). |
| `MONGO_URL` | String | **Sí** | URI de conexión a la base de datos MongoDB.<br>Ejemplos:<br>- Local: `mongodb://localhost:27017/windows-xp`<br>- Docker Compose: `mongodb://mongo:27017/windows-xp` |

> ⚠️ **Importante:** El servidor valida la conexión a MongoDB **antes** de habilitar el puerto de escucha. Si `MONGO_URL` no está definida o no se puede establecer la conexión, el proceso terminará (`process.exit(1)`).

---

## 🛠️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de contar con:

- [Node.js](https://nodejs.org/) (versión 20 o superior recomendada).
- [Yarn](https://yarnpkg.com/) v4 habilitado mediante Corepack:
  ```bash
  corepack enable
  ```
- Instancia activa de [MongoDB](https://www.mongodb.com/) (local o vía Docker).
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) (opcional, para ejecución en contenedores).

---

## 🏃 Formas de Ejecutar el Servicio

### Opción 1: Modo Local (Desarrollo directo)

1. **Instalar dependencias:**
   ```bash
   yarn install
   ```

2. **Configurar variables de entorno:**
   Puedes exportarlas en tu terminal o crear un archivo `.env` según tu flujo de trabajo:
   - **En Windows (PowerShell):**
     ```powershell
     $env:PORT="5000"
     $env:MONGO_URL="mongodb://localhost:27017/windows_xp_clone"
     ```
   - **En Linux / macOS:**
     ```bash
     export PORT=5000
     export MONGO_URL="mongodb://localhost:27017/windows_xp_clone"
     ```

3. **Iniciar en modo desarrollo (con recarga automática):**
   ```bash
   yarn dev
   ```

4. **Iniciar en modo producción:**
   ```bash
   yarn start
   ```

---

### Opción 2: Con Docker (Contenedor individual)

1. **Construir la imagen de Docker:**
   ```bash
   docker build -t windows-xp-server .
   ```

2. **Ejecutar el contenedor:**
   ```bash
   docker run -d \
     --name windows-xp-backend \
     -p 5000:5000 \
     -e PORT=5000 \
     -e MONGO_URL="mongodb://host.docker.internal:27017/windows_xp_clone" \
     windows-xp-server
   ```
   *(Usa `host.docker.internal` si MongoDB se encuentra corriendo localmente en tu máquina anfitriona).*

---

### Opción 3: Con Docker Compose (Entorno Completo Recomendado)

Si ejecutas el backend junto con el servicio de base de datos MongoDB desde la raíz del proyecto mediante `docker-compose.yml`:

```bash
# Levantar los servicios y reconstruir si hay cambios
docker compose up --build

# O en segundo plano (detached mode)
docker compose up -d
```

Para consultar los logs del backend:
```bash
docker compose logs -f server
```

Para detener los contenedores:
```bash
docker compose down
```

---

## 📡 Endpoints de la API

| Método | Ruta | Descripción | Respuesta de Ejemplo |
| :---: | :--- | :--- | :--- |
| `GET` | `/` | Comprobación de estado y bienvenida | `{"message": "¡Bienvenido a la API de Windows XP Clone!"}` |

---

## 📜 Scripts Disponibles en `package.json`

- `yarn dev`: Arranca el servidor con `nodemon` escuchando cambios en tiempo real.
- `yarn start`: Ejecuta el servidor en modo estándar con `node index.js`.
