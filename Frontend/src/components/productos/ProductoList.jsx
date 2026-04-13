import { useEffect, useState } from 'react';
import api from '../../services/api';
import ProductoForm from './ProductoForm';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiX, FiEdit2, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi';

export default function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [termino, setTermino] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const buscarProductos = async () => {
    if (!termino.trim()) return fetchProductos();
    try {
      const res = await api.get(`/productos/buscar?termino=${termino}`);
      setProductos(res.data);
    } catch (error) {
      toast.error('Error en búsqueda');
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleToggleActivo = async (id, activoActual) => {
    try {
      await api.patch(`/productos/${id}/toggle-activo`, { activo: !activoActual });
      toast.success(`Producto ${!activoActual ? 'activado' : 'desactivado'}`);
      fetchProductos();
    } catch (error) {
      toast.error('Error al cambiar estado');
    }
  };

  const handleEdit = (producto) => {
    setEditingProducto(producto);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar producto permanentemente?')) {
      try {
        await api.delete(`/productos/${id}`);
        toast.success('Producto eliminado');
        fetchProductos();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProducto(null);
    fetchProductos();
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📦 Productos</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center space-x-2">
          <FiPlus /> <span>Nuevo Producto</span>
        </button>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={termino}
            onChange={e => setTermino(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && buscarProductos()}
            className="input-modern pl-10"
          />
        </div>
        <button onClick={buscarProductos} className="btn-primary">Buscar</button>
        <button onClick={fetchProductos} className="btn-secondary flex items-center space-x-1"><FiX /> Limpiar</button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P. Venta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono">{p.codigo}</td>
                <td className="px-6 py-4 font-medium">{p.nombre}</td>
                <td className="px-6 py-4 text-green-600 font-semibold">${parseFloat(p.precio_venta).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock_actual <= p.stock_minimo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {p.stock_actual} unidades
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><FiEdit2 /></button>
                    <button onClick={() => handleToggleActivo(p.id, p.activo)} className="text-yellow-600 hover:text-yellow-800">
                      {p.activo ? <FiToggleRight className="text-xl" /> : <FiToggleLeft className="text-xl" />}
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                  </div>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showForm && <ProductoForm producto={editingProducto} onClose={handleFormClose} />}
    </div>
  );
}