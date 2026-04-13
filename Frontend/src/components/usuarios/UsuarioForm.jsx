import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

export default function UsuarioForm({ usuario, onClose }) {
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    password: '',
    rol: usuario?.rol || 'vendedor'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (usuario) {
        await api.put(`/usuarios/${usuario.id}`, {
          nombre: formData.nombre,
          email: formData.email,
          rol: formData.rol
        });
        toast.success('Usuario actualizado');
      } else {
        await api.post('/usuarios', formData);
        toast.success('Usuario creado');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX className="text-2xl" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} required className="input-modern" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-modern" />
          </div>
          {!usuario && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-modern" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select name="rol" value={formData.rol} onChange={handleChange} className="input-modern">
              <option value="admin">Administrador</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}