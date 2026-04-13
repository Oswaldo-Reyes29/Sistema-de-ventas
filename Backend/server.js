require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('combined'));

// ============================================
// DATOS EN MEMORIA PARA PRUEBAS (SIN BASE DE DATOS)
// ============================================

const usuarios = [
  { id: 1, nombre: 'Administrador', email: 'admin@example.com', password: 'Admin123', rol: 'admin', activo: true }
];

const productos = [
  { id: 1, codigo: 'PROD001', nombre: 'Laptop Gaming', precio_venta: 1200, stock_actual: 15, stock_minimo: 5, activo: true },
  { id: 2, codigo: 'PROD002', nombre: 'Mouse Inalámbrico', precio_venta: 35, stock_actual: 50, stock_minimo: 10, activo: true },
  { id: 3, codigo: 'PROD003', nombre: 'Teclado Mecánico', precio_venta: 65, stock_actual: 30, stock_minimo: 8, activo: true }
];

const proveedores = [
  { id: 1, nombre: 'Proveedor A', ruc: '12345678901', telefono: '555-0101', direccion: 'Calle 1', email: 'ventas@proveedora.com' }
];

let compras = [];
let ventas = [];
let nextCompraId = 1;
let nextVentaId = 1;

// ============================================
// RUTAS DE LA API
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente', timestamp: new Date() });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Intento de login:', email);
  
  const user = usuarios.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  if (!user.activo) {
    return res.status(401).json({ error: 'Cuenta desactivada' });
  }
  
  const token = 'fake-token-' + user.id + '-' + Date.now();
  console.log('Login exitoso:', user.nombre);
  
  res.json({
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }
  });
});

// Middleware para verificar token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  if (token && token.startsWith('fake-token-')) {
    const parts = token.split('-');
    const userId = parseInt(parts[2]);
    const user = usuarios.find(u => u.id === userId);
    if (user) {
      req.user = { id: user.id, email: user.email, rol: user.rol };
      return next();
    }
  }
  return res.status(401).json({ error: 'Token inválido' });
};

// ========== PRODUCTOS ==========
app.get('/api/productos', authMiddleware, (req, res) => {
  res.json(productos);
});

app.get('/api/productos/buscar', authMiddleware, (req, res) => {
  const { termino } = req.query;
  if (!termino) return res.json(productos);
  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(termino.toLowerCase()) ||
    p.codigo.toLowerCase().includes(termino.toLowerCase())
  );
  res.json(filtered);
});

app.post('/api/productos', authMiddleware, (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { codigo, nombre, precio_compra, precio_venta, stock_actual, stock_minimo } = req.body;
  const newId = Math.max(...productos.map(p => p.id)) + 1;
  const newProducto = {
    id: newId,
    codigo,
    nombre,
    precio_venta: parseFloat(precio_venta),
    stock_actual: parseInt(stock_actual) || 0,
    stock_minimo: parseInt(stock_minimo) || 0,
    activo: true
  };
  productos.push(newProducto);
  res.status(201).json(newProducto);
});

// ========== VENTAS ==========
app.post('/api/ventas', authMiddleware, (req, res) => {
  const { cliente_nombre, cliente_documento, items } = req.body;
  
  // Validar stock
  for (const item of items) {
    const producto = productos.find(p => p.id === item.producto_id);
    if (!producto) {
      return res.status(400).json({ error: `Producto no existe` });
    }
    if (producto.stock_actual < item.cantidad) {
      return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}` });
    }
  }
  
  let total = 0;
  for (const item of items) {
    const producto = productos.find(p => p.id === item.producto_id);
    total += item.cantidad * producto.precio_venta;
  }
  
  const nuevaVenta = {
    id: nextVentaId++,
    usuario_id: req.user.id,
    cliente_nombre,
    cliente_documento: cliente_documento || '',
    fecha: new Date().toISOString(),
    total,
    estado: 'completada'
  };
  ventas.push(nuevaVenta);
  
  // Actualizar stock
  for (const item of items) {
    const producto = productos.find(p => p.id === item.producto_id);
    if (producto) {
      producto.stock_actual -= item.cantidad;
    }
  }
  
  res.status(201).json({ mensaje: 'Venta registrada', venta_id: nuevaVenta.id, total });
});

app.get('/api/ventas', authMiddleware, (req, res) => {
  const ventasConNombres = ventas.map(v => ({
    ...v,
    usuario_nombre: usuarios.find(u => u.id === v.usuario_id)?.nombre || 'Desconocido'
  }));
  res.json(ventasConNombres);
});

// ========== PROVEEDORES ==========
app.get('/api/proveedores', authMiddleware, (req, res) => {
  res.json(proveedores);
});

// ========== COMPRAS ==========
app.get('/api/compras', authMiddleware, (req, res) => {
  const comprasConNombres = compras.map(c => ({
    ...c,
    proveedor_nombre: proveedores.find(p => p.id === c.proveedor_id)?.nombre || 'Desconocido',
    usuario_nombre: usuarios.find(u => u.id === c.usuario_id)?.nombre || 'Desconocido'
  }));
  res.json(comprasConNombres);
});

app.post('/api/compras', authMiddleware, (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { proveedor_id, items } = req.body;
  let total = 0;
  for (const item of items) {
    total += item.cantidad * item.precio_unitario;
  }
  const nuevaCompra = {
    id: nextCompraId++,
    proveedor_id,
    usuario_id: req.user.id,
    fecha: new Date().toISOString(),
    total,
    estado: 'completada'
  };
  compras.push(nuevaCompra);
  
  // Actualizar stock
  for (const item of items) {
    const producto = productos.find(p => p.id === item.producto_id);
    if (producto) {
      producto.stock_actual += item.cantidad;
    }
  }
  
  res.status(201).json({ mensaje: 'Compra registrada', compra_id: nuevaCompra.id });
});

// ========== REPORTES ==========
app.get('/api/reportes/stock-bajo', authMiddleware, (req, res) => {
  const bajoStock = productos.filter(p => p.stock_actual <= p.stock_minimo && p.activo);
  res.json(bajoStock);
});

// ========== USUARIOS ==========
app.get('/api/usuarios', authMiddleware, (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const usuariosList = usuarios.map(u => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    activo: u.activo
  }));
  res.json(usuariosList);
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API de Gestión Comercial - Funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('✅ Servidor backend corriendo correctamente');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log('='.repeat(50));
  console.log('\n📋 CREDENCIALES DE PRUEBA:');
  console.log('   Admin:   admin@example.com / Admin123');
  console.log('='.repeat(50));
});