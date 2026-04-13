const compraModel = require('../models/compraModel');

const registrarCompra = async (req, res, next) => {
  try {
    const resultado = await compraModel.create({ ...req.body, usuario_id: req.user.id });
    res.status(201).json({ mensaje: 'Compra registrada', compra_id: resultado.compra_id, total: resultado.total });
  } catch (error) { next(error); }
};
const listarCompras = async (req, res, next) => {
  try { res.json(await compraModel.findAll()); } catch (error) { next(error); }
};
const obtenerDetalleCompra = async (req, res, next) => {
  try {
    const compra = await compraModel.findById(req.params.id);
    if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
    res.json(compra);
  } catch (error) { next(error); }
};

module.exports = { registrarCompra, listarCompras, obtenerDetalleCompra };