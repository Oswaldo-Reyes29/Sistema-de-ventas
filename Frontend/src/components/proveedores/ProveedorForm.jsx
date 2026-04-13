import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

export default function ProveedorForm({ proveedor, onClose }) {
  const [formData, setFormData] = useState({
    nombre: proveedor?.nombre || '',
    ruc: proveedor?.ruc || '',
    telefono: proveedor?.telefono || '',
    direccion: proveedor?.direccion || '',
    email: proveedor?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (proveedor) {
        await api.put(`/proveedores/${proveedor.id}`, formData);
        toast.success('Proveedor actualizado');
      } else {
        await api.post('/proveedores', formData);
        toast.success('Proveedor creado');
      }
      onClose();
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX className="text-2xl" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} required className="input-modern" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">RUC</label>
            <input name="ruc" value={formData.ruc} onChange={handleChange} className="input-modern" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleChange} className="input-modern" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input name="direccion" value={formData.direccion} onChange={handleChange} className="input-modern" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-modern" />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}