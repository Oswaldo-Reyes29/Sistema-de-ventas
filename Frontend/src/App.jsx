import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import UsuarioList from './components/usuarios/UsuarioList';
import ProductoList from './components/productos/ProductoList';
import ProveedorList from './components/proveedores/ProveedorList';
import CompraForm from './components/compras/CompraForm';
import HistorialCompras from './components/compras/HistorialCompras';
import VentaForm from './components/ventas/VentaForm';
import HistorialVentas from './components/ventas/HistorialVentas';

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      {user && <Navbar />}
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><UsuarioList /></PrivateRoute>} />
          <Route path="/productos" element={<PrivateRoute><ProductoList /></PrivateRoute>} />
          <Route path="/proveedores" element={<PrivateRoute><ProveedorList /></PrivateRoute>} />
          <Route path="/compras/nueva" element={<PrivateRoute><CompraForm /></PrivateRoute>} />
          <Route path="/compras" element={<PrivateRoute><HistorialCompras /></PrivateRoute>} />
          <Route path="/ventas/nueva" element={<PrivateRoute><VentaForm /></PrivateRoute>} />
          <Route path="/ventas" element={<PrivateRoute><HistorialVentas /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;