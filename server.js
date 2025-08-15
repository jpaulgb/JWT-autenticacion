require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

const cors = require('cors');

app.use(cors());
// Conectar a MongoDB
conectarDB();

// Middleware
app.use(express.json());

// Rutas
app.use('/api', authRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});