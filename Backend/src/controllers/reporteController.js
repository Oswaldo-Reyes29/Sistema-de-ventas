const productoModel = require('../models/productoModel');
const ventaModel = require('../models/ventaModel');

const productosBajoStock = async (req, res, next) => {
  try {
    const productos = await productoModel.getLowStock();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const ventasPorFecha = async (req, res, next) => {
  const { fecha_inicio, fecha_fin } = req.query;
  
  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: 'Las fechas de inicio y fin son requeridas' });
  }
  
  try {
    const ventas = await ventaModel.findByDateRange(fecha_inicio, fecha_fin);
    res.json(ventas);
  } catch (error) {
    next(error);
  }
};

const resumenDashboard = async (req, res, next) => {
  try {
    const productos = await productoModel.findAll();
    const ventas = await ventaModel.findAll();
    
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    const ventasHoy = ventas.filter(v => v.fecha.split('T')[0] === hoy);
    const ventasMes = ventas.filter(v => v.fecha.split('T')[0] >= fechaInicioMes);
    
    const ingresosHoy = ventasHoy.reduce((sum, v) => sum + parseFloat(v.total), 0);
    const ingresosMes = ventasMes.reduce((sum, v) => sum + parseFloat(v.total), 0);
    
    res.json({
      totalProductos: productos.length,
      productosActivos: productos.filter(p => p.activo).length,
      ventasHoy: ventasHoy.length,
      ventasMes: ventasMes.length,
      ingresosHoy,
      ingresosMes,
      totalVentas: ventas.reduce((sum, v) => sum + parseFloat(v.total), 0)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  productosBajoStock,
  ventasPorFecha,
  resumenDashboard
};