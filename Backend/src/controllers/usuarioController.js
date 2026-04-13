const usuarioModel = require('../models/usuarioModel');

const listarUsuarios = async (req, res, next) => {
  try { res.json(await usuarioModel.findAll()); } catch (error) { next(error); }
};
const crearUsuario = async (req, res, next) => {
  try {
    const nuevo = await usuarioModel.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) { next(error); }
};
const actualizarUsuario = async (req, res, next) => {
  try {
    const actualizado = await usuarioModel.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(actualizado);
  } catch (error) { next(error); }
};
const toggleUsuarioActivo = async (req, res, next) => {
  try {
    const actualizado = await usuarioModel.toggleActivo(req.params.id, req.body.activo);
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(actualizado);
  } catch (error) { next(error); }
};
const eliminarUsuario = async (req, res, next) => {
  try {
    const eliminado = await usuarioModel.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { listarUsuarios, crearUsuario, actualizarUsuario, toggleUsuarioActivo, eliminarUsuario };