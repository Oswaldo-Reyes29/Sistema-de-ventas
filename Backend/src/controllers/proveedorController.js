const proveedorModel = require('../models/proveedorModel');

const listarProveedores = async (req, res, next) => {
  try {
    const proveedores = await proveedorModel.findAll();
    res.json(proveedores);
  } catch (error) {
    next(error);
  }
};

const obtenerProveedor = async (req, res, next) => {
  const { id } = req.params;
  try {
    const proveedor = await proveedorModel.findById(id);
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (error) {
    next(error);
  }
};

const crearProveedor = async (req, res, next) => {
  const { nombre, ruc, telefono, direccion, email } = req.body;
  try {
    const nuevoProveedor = await proveedorModel.create({ nombre, ruc, telefono, direccion, email });
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    next(error);
  }
};

const actualizarProveedor = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, ruc, telefono, direccion, email } = req.body;
  try {
    const proveedorActualizado = await proveedorModel.update(id, { nombre, ruc, telefono, direccion, email });
    if (!proveedorActualizado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(proveedorActualizado);
  } catch (error) {
    next(error);
  }
};

const eliminarProveedor = async (req, res, next) => {
  const { id } = req.params;
  try {
    const eliminado = await proveedorModel.remove(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};