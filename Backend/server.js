require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./src/routes/authRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const proveedorRoutes = require('./src/routes/proveedorRoutes');
const compraRoutes = require('./src/routes/compraRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');
const reporteRoutes = require('./src/routes/reporteRoutes');
const errorMiddleware = require('./src/middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());
app.use(morgan('combined'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/reportes', reporteRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Servidor funcionando' }));
app.get('/', (req, res) => res.json({ message: 'API de Gestión Comercial' }));

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`✅ Servidor backend corriendo en puerto ${PORT}`));