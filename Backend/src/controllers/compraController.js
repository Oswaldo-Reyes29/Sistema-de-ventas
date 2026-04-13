const compraModel = require('../models/compraModel');

const registrarCompra = async (req, res, next) => {
  const { proveedor_id, items } = req.body;
  const usuario_id = req.user.id;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Debe incluir al menos un producto' });
  }
  
  try {
    const resultado = await compraModel.create({ proveedor_id, usuario_id, items });
    res.status(201).json({ 
      mensaje: 'Compra registrada exitosamente', 
      compra_id: resultado.compra_id,
      total: resultado.total
    });
  } catch (error) {
    next(error);
  }
};

const listarCompras = async (req, res, next) => {
  try {
    const compras = await compraModel.findAll();
    res.json(compras);
  } catch (error) {
    next(error);
  }
};

const obtenerDetalleCompra = async (req, res, next) => {
  const { id } = req.params;
  try {
    const compra = await compraModel.findById(id);
    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    res.json(compra);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrarCompra,
  listarCompras,
  obtenerDetalleCompra
};