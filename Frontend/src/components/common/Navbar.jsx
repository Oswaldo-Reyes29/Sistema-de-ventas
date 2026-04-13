import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiPackage, FiTruck, FiShoppingCart, FiTrendingUp, FiLogOut, FiHome } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: FiHome, roles: ['admin', 'vendedor'] },
    { to: '/usuarios', label: 'Usuarios', icon: FiUsers, roles: ['admin'] },
    { to: '/productos', label: 'Productos', icon: FiPackage, roles: ['admin', 'vendedor'] },
    { to: '/proveedores', label: 'Proveedores', icon: FiTruck, roles: ['admin'] },
    { to: '/compras/nueva', label: 'Nueva Compra', icon: FiShoppingCart, roles: ['admin'] },
    { to: '/compras', label: 'Compras', icon: FiShoppingCart, roles: ['admin', 'vendedor'] },
    { to: '/ventas/nueva', label: 'Nueva Venta', icon: FiTrendingUp, roles: ['admin', 'vendedor'] },
    { to: '/ventas', label: 'Ventas', icon: FiTrendingUp, roles: ['admin', 'vendedor'] },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl"></span>
            <span className="text-xl font-bold">Sistema de Ventas</span>
          </Link>
          
          <div className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => {
              if (!item.roles.includes(user?.rol)) return null;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/20 transition-all"
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="ml-4 pl-4 border-l border-white/30 flex items-center space-x-3">
              <span className="text-sm">Hola, {user?.nombre}</span>
              <button onClick={handleLogout} className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30">
                <FiLogOut />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}