const { pool } = require('../config/db');

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM proveedores ORDER BY id');
  return rows;
};
const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
  return rows[0];
};
const create = async ({ nombre, ruc, telefono, direccion, email }) => {
  const [result] = await pool.query('INSERT INTO proveedores (nombre, ruc, telefono, direccion, email) VALUES (?,?,?,?,?)', [nombre, ruc, telefono, direccion, email]);
  const [newProv] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [result.insertId]);
  return newProv[0];
};
const update = async (id, data) => {
  const { nombre, ruc, telefono, direccion, email } = data;
  await pool.query('UPDATE proveedores SET nombre=?, ruc=?, telefono=?, direccion=?, email=? WHERE id=?', [nombre, ruc, telefono, direccion, email, id]);
  return findById(id);
};
const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM proveedores WHERE id=?', [id]);
  return result.affectedRows > 0;
};
module.exports = { findAll, findById, create, update, remove };