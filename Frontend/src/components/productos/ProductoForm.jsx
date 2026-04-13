import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

export default function ProductoForm({ producto, onClose }) {
  const [formData, setFormData] = useState({
    codigo: producto?.codigo || '',
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio_compra: producto?.precio_compra || '',
    precio_venta: producto?.precio_venta || '',
    stock_actual: producto?.stock_actual || 0,
    stock_minimo: producto?.stock_minimo || 0,
    unidad_medida: producto?.unidad_medida || 'unidad'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (producto) {
        await api.put(`/productos/${producto.id}`, formData);
        toast.success('Producto actualizado');
      } else {
        await api.post('/productos', formData);
        toast.success('Producto creado');
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
          <h2 className="text-xl font-bold">{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX className="text-2xl" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <input name="codigo" value={formData.codigo} onChange={handleChange} required className="input-modern" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} required className="input-modern" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="2" className="input-modern" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio compra</label>
              <input type="number" step="0.01" name="precio_compra" value={formData.precio_compra} onChange={handleChange} required className="input-modern" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio venta</label>
              <input type="number" step="0.01" name="precio_venta" value={formData.precio_venta} onChange={handleChange} required className="input-modern" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock actual</label>
              <input type="number" name="stock_actual" value={formData.stock_actual} onChange={handleChange} className="input-modern" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock mínimo</label>
              <input type="number" name="stock_minimo" value={formData.stock_minimo} onChange={handleChange} className="input-modern" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unidad de medida</label>
            <input name="unidad_medida" value={formData.unidad_medida} onChange={handleChange} className="input-modern" />
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