import { useEffect, useState } from 'react';
import api from '../../services/api';
import UsuarioForm from './UsuarioForm';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi';

export default function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleToggleActivo = async (id, activoActual) => {
    try {
      await api.patch(`/usuarios/${id}/toggle-activo`, { activo: !activoActual });
      toast.success(`Usuario ${!activoActual ? 'activado' : 'desactivado'}`);
      fetchUsuarios();
    } catch (error) {
      toast.error('Error al cambiar estado');
    }
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUsuario(null);
    fetchUsuarios();
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">👥 Usuarios</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center space-x-2">
          <FiPlus /> <span>Nuevo Usuario</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{u.nombre}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {u.rol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button onClick={() => handleEdit(u)} className="text-blue-600 hover:text-blue-800" title="Editar">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleToggleActivo(u.id, u.activo)} className="text-yellow-600 hover:text-yellow-800" title={u.activo ? 'Desactivar' : 'Activar'}>
                      {u.activo ? <FiToggleRight className="text-xl" /> : <FiToggleLeft className="text-xl" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showForm && <UsuarioForm usuario={editingUsuario} onClose={handleFormClose} />}
    </div>
  );
}