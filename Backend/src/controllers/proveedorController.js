const proveedorModel = require('../models/proveedorModel');

const listarProveedores = async (req, res, next) => {
  try { res.json(await proveedorModel.findAll()); } catch (error) { next(error); }
};
const obtenerProveedor = async (req, res, next) => {
  try {
    const prov = await proveedorModel.findById(req.params.id);
    if (!prov) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(prov);
  } catch (error) { next(error); }
};
const crearProveedor = async (req, res, next) => {
  try {
    const nuevo = await proveedorModel.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) { next(error); }
};
const actualizarProveedor = async (req, res, next) => {
  try {
    const actualizado = await proveedorModel.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(actualizado);
  } catch (error) { next(error); }
};
const eliminarProveedor = async (req, res, next) => {
  try {
    const eliminado = await proveedorModel.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { listarProveedores, obtenerProveedor, crearProveedor, actualizarProveedor, eliminarProveedor };