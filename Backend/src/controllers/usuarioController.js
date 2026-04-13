const usuarioModel = require('../models/usuarioModel');

const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuarioModel.findAll();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

const crearUsuario = async (req, res, next) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const nuevoUsuario = await usuarioModel.create({ nombre, email, password, rol });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya existe' });
    }
    next(error);
  }
};

const actualizarUsuario = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;
  try {
    const usuarioActualizado = await usuarioModel.update(id, { nombre, email, rol });
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    next(error);
  }
};

const toggleUsuarioActivo = async (req, res, next) => {
  const { id } = req.params;
  const { activo } = req.body;
  try {
    const usuarioActualizado = await usuarioModel.toggleActivo(id, activo);
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    next(error);
  }
};

const eliminarUsuario = async (req, res, next) => {
  const { id } = req.params;
  try {
    const eliminado = await usuarioModel.remove(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  toggleUsuarioActivo,
  eliminarUsuario
};