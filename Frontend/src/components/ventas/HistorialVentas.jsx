import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrendingUp } from 'react-icons/fi';

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await api.get('/ventas');
        setVentas(res.data);
      } catch (error) {
        toast.error('Error al cargar ventas');
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FiTrendingUp className="text-3xl text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">Historial de Ventas</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ventas.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{v.id}</td>
                <td className="px-6 py-4">{v.cliente_nombre}</td>
                <td className="px-6 py-4">{v.usuario_nombre}</td>
                <td className="px-6 py-4">{new Date(v.fecha).toLocaleString()}</td>
                <td className="px-6 py-4 font-semibold text-green-600">${parseFloat(v.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {ventas.length === 0 && <div className="text-center py-8 text-gray-500">No hay ventas registradas</div>}
      </div>
    </div>
  );
}