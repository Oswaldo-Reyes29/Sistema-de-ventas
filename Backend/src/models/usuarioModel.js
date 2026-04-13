const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const findAll = async () => {
  const [rows] = await pool.query('SELECT id, nombre, email, rol, activo, created_at FROM usuarios ORDER BY id');
  return rows;
};
const findById = async (id) => {
  const [rows] = await pool.query('SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = ?', [id]);
  return rows[0];
};
const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
};
const create = async ({ nombre, email, password, rol }) => {
  const hashed = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?,?,?,?)', [nombre, email, hashed, rol || 'vendedor']);
  const [newUser] = await pool.query('SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = ?', [result.insertId]);
  return newUser[0];
};
const update = async (id, { nombre, email, rol }) => {
  await pool.query('UPDATE usuarios SET nombre=?, email=?, rol=? WHERE id=?', [nombre, email, rol, id]);
  return findById(id);
};
const toggleActivo = async (id, activo) => {
  await pool.query('UPDATE usuarios SET activo=? WHERE id=?', [activo, id]);
  return findById(id);
};
const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM usuarios WHERE id=?', [id]);
  return result.affectedRows > 0;
};
const verifyCredentials = async (email, password) => {
  const user = await findByEmail(email);
  if (!user || !user.activo) return null;
  const valid = await bcrypt.compare(password, user.password_hash);
  return valid ? user : null;
};
module.exports = { findAll, findById, findByEmail, create, update, toggleActivo, remove, verifyCredentials };