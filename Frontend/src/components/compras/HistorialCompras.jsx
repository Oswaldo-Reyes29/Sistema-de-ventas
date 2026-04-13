import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiShoppingCart } from 'react-icons/fi';

export default function HistorialCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await api.get('/compras');
        setCompras(res.data);
      } catch (error) {
        toast.error('Error al cargar compras');
      } finally {
        setLoading(false);
      }
    };
    fetchCompras();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FiShoppingCart className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Historial de Compras</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {compras.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{c.id}</td>
                <td className="px-6 py-4">{c.proveedor_nombre}</td>
                <td className="px-6 py-4">{c.usuario_nombre}</td>
                <td className="px-6 py-4">{new Date(c.fecha).toLocaleString()}</td>
                <td className="px-6 py-4 font-semibold text-green-600">${parseFloat(c.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {compras.length === 0 && <div className="text-center py-8 text-gray-500">No hay compras registradas</div>}
      </div>
    </div>
  );
}