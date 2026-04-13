const ventaModel = require('../models/ventaModel');

const registrarVenta = async (req, res, next) => {
  try {
    const resultado = await ventaModel.create({ ...req.body, usuario_id: req.user.id });
    res.status(201).json({ mensaje: 'Venta registrada', venta_id: resultado.venta_id, total: resultado.total });
  } catch (error) { next(error); }
};
const listarVentas = async (req, res, next) => {
  try { res.json(await ventaModel.findAll()); } catch (error) { next(error); }
};
const obtenerDetalleVenta = async (req, res, next) => {
  try {
    const venta = await ventaModel.findById(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (error) { next(error); }
};

module.exports = { registrarVenta, listarVentas, obtenerDetalleVenta };