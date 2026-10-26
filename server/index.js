// server/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Importamos mongoose

// Variables de entorno
const PORT = process.env.PORT || 5000;
// ¡Usamos la variable de entorno que definimos en docker-compose.yml!
const MONGO_URL = process.env.MONGO_URL; 

// Inicialización de la app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Bienvenido a la API de Windows XP Clone!' });
});

// Conexión a la base de datos y arranque del servidor
console.log('Intentando conectar a MongoDB...');
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    // Solo iniciamos el servidor DESPUÉS de que la conexión a la BD sea exitosa
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    process.exit(1); // Si no nos podemos conectar, cerramos la app
  });