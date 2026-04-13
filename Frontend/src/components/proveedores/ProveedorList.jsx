import { useEffect, useState } from 'react';
import api from '../../services/api';
import ProveedorForm from './ProveedorForm';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function ProveedorList() {
  const [proveedores, setProveedores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProveedores = async () => {
    try {
      const res = await api.get('/proveedores');
      setProveedores(res.data);
    } catch (error) {
      toast.error('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar proveedor?')) {
      try {
        await api.delete(`/proveedores/${id}`);
        toast.success('Proveedor eliminado');
        fetchProveedores();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const handleEdit = (proveedor) => {
    setEditing(proveedor);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditing(null);
    fetchProveedores();
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">🚚 Proveedores</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center space-x-2">
          <FiPlus /> <span>Nuevo Proveedor</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RUC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {proveedores.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{p.nombre}</td>
                <td className="px-6 py-4">{p.ruc || '-'}</td>
                <td className="px-6 py-4">{p.telefono || '-'}</td>
                <td className="px-6 py-4">{p.email || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                  </div>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showForm && <ProveedorForm proveedor={editing} onClose={handleFormClose} />}
    </div>
  );
}