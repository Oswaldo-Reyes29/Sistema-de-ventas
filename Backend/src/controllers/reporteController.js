const productoModel = require('../models/productoModel');
const ventaModel = require('../models/ventaModel');

const productosBajoStock = async (req, res, next) => {
  try { res.json(await productoModel.getLowStock()); } catch (error) { next(error); }
};
const ventasPorFecha = async (req, res, next) => {
  try { res.json(await ventaModel.findByDateRange(req.query.fecha_inicio, req.query.fecha_fin)); } catch (error) { next(error); }
};
const resumenDashboard = async (req, res, next) => {
  try {
    const productos = await productoModel.findAll();
    const ventas = await ventaModel.findAll();
    const hoy = new Date().toISOString().split('T')[0];
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const ventasHoy = ventas.filter(v => v.fecha.split('T')[0] === hoy);
    const ventasMes = ventas.filter(v => v.fecha.split('T')[0] >= inicioMes);
    res.json({
      totalProductos: productos.length,
      productosActivos: productos.filter(p => p.activo).length,
      ventasHoy: ventasHoy.length,
      ventasMes: ventasMes.length,
      ingresosHoy: ventasHoy.reduce((s,v) => s + parseFloat(v.total), 0),
      ingresosMes: ventasMes.reduce((s,v) => s + parseFloat(v.total), 0),
      totalVentas: ventas.reduce((s,v) => s + parseFloat(v.total), 0)
    });
  } catch (error) { next(error); }
};

module.exports = { productosBajoStock, ventasPorFecha, resumenDashboard };