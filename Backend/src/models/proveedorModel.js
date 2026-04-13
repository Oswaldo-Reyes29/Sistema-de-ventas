const { pool } = require('../config/db');

const findAll = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM proveedores ORDER BY id');
    return rows;
  } catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const create = async (proveedorData) => {
  const { nombre, ruc, telefono, direccion, email } = proveedorData;
  try {
    const [result] = await pool.query(
      'INSERT INTO proveedores (nombre, ruc, telefono, direccion, email) VALUES (?, ?, ?, ?, ?)',
      [nombre, ruc, telefono, direccion, email]
    );
    const [newProveedor] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [result.insertId]);
    return newProveedor[0];
  } catch (error) {
    throw error;
  }
};

const update = async (id, proveedorData) => {
  const { nombre, ruc, telefono, direccion, email } = proveedorData;
  try {
    await pool.query(
      'UPDATE proveedores SET nombre=?, ruc=?, telefono=?, direccion=?, email=? WHERE id=?',
      [nombre, ruc, telefono, direccion, email, id]
    );
    const [updated] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    return updated[0];
  } catch (error) {
    throw error;
  }
};

const remove = async (id) => {
  try {
    const [result] = await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};