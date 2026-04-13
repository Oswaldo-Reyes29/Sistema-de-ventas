import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPackage, FiShoppingCart, FiTrendingUp, FiAlertTriangle, FiArrowRight, FiDollarSign } from 'react-icons/fi';

export default function Dashboard() {
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [ultimasVentas, setUltimasVentas] = useState([]);
  const [stats, setStats] = useState({ totalProductos: 0, ventasHoy: 0, ingresosHoy: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockRes, ventasRes, productosRes] = await Promise.all([
          api.get('/reportes/stock-bajo'),
          api.get('/ventas'),
          api.get('/productos')
        ]);
        
        setProductosBajoStock(stockRes.data);
        setUltimasVentas(ventasRes.data.slice(0, 5));
        
        const hoy = new Date().toISOString().split('T')[0];
        const ventasHoy = ventasRes.data.filter(v => v.fecha.split('T')[0] === hoy);
        const ingresosHoy = ventasHoy.reduce((sum, v) => sum + parseFloat(v.total), 0);
        
        setStats({
          totalProductos: productosRes.data.length,
          ventasHoy: ventasHoy.length,
          ingresosHoy: ingresosHoy
        });
      } catch (error) {
        toast.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statsCards = [
    { title: 'Productos', value: stats.totalProductos, icon: FiPackage, color: 'bg-blue-500', link: '/productos' },
    { title: 'Ventas Hoy', value: stats.ventasHoy, icon: FiShoppingCart, color: 'bg-green-500', link: '/ventas' },
    { title: 'Ingresos Hoy', value: `$${stats.ingresosHoy.toFixed(2)}`, icon: FiDollarSign, color: 'bg-purple-500', link: '/ventas' },
    { title: 'Stock Bajo', value: productosBajoStock.length, icon: FiAlertTriangle, color: 'bg-red-500', link: '/productos' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link to={stat.link} key={idx} className="block hover:scale-105 transition-transform">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    <Icon className="text-2xl" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiAlertTriangle className="mr-2 text-red-500" /> Productos con stock bajo
          </h2>
          {productosBajoStock.length === 0 ? (
            <p className="text-gray-500 text-center py-4">✅ No hay productos con stock bajo</p>
          ) : (
            <ul className="divide-y">
              {productosBajoStock.map(p => (
                <li key={p.id} className="py-2 flex justify-between">
                  <span>{p.nombre}</span>
                  <span className="text-red-600 font-bold">{p.stock_actual} unidades</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/productos" className="mt-4 inline-flex items-center text-blue-600">Ver todos <FiArrowRight className="ml-1" /></Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiTrendingUp className="mr-2 text-green-500" /> Últimas ventas
          </h2>
          {ultimasVentas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
          ) : (
            <ul className="divide-y">
              {ultimasVentas.map(v => (
                <li key={v.id} className="py-2 flex justify-between">
                  <span>{v.cliente_nombre}</span>
                  <span className="text-green-600 font-bold">${parseFloat(v.total).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/ventas" className="mt-4 inline-flex items-center text-blue-600">Ver historial <FiArrowRight className="ml-1" /></Link>
        </div>
      </div>
    </div>
  );
}