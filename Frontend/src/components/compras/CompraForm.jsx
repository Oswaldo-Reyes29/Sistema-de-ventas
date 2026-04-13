import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi';

export default function CompraForm() {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [items, setItems] = useState([]);
  const [currentProducto, setCurrentProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provRes, prodRes] = await Promise.all([
          api.get('/proveedores'),
          api.get('/productos')
        ]);
        setProveedores(provRes.data);
        setProductos(prodRes.data);
      } catch (error) {
        toast.error('Error al cargar datos');
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    if (!currentProducto || cantidad <= 0 || !precioUnitario) return;
    const producto = productos.find(p => p.id === parseInt(currentProducto));
    if (!producto) return;
    setItems([...items, {
      producto_id: producto.id,
      producto_nombre: producto.nombre,
      cantidad: parseInt(cantidad),
      precio_unitario: parseFloat(precioUnitario)
    }]);
    setCurrentProducto('');
    setCantidad(1);
    setPrecioUnitario('');
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProveedor || items.length === 0) {
      toast.error('Complete proveedor y al menos un producto');
      return;
    }
    setLoading(true);
    try {
      await api.post('/compras', {
        proveedor_id: selectedProveedor,
        items: items.map(i => ({
          producto_id: i.producto_id,
          cantidad: i.cantidad,
          precio_unitario: i.precio_unitario
        }))
      });
      toast.success('Compra registrada exitosamente');
      setSelectedProveedor('');
      setItems([]);
    } catch (error) {
      toast.error('Error al registrar compra');
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FiShoppingCart className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Registrar Compra</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
          <select value={selectedProveedor} onChange={e => setSelectedProveedor(e.target.value)} required className="input-modern">
            <option value="">Seleccione proveedor</option>
            {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Agregar Producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select value={currentProducto} onChange={e => setCurrentProducto(e.target.value)} className="input-modern">
              <option value="">Seleccione producto</option>
              {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
            <input type="number" placeholder="Cantidad" value={cantidad} onChange={e => setCantidad(e.target.value)} className="input-modern" />
            <input type="number" step="0.01" placeholder="Precio unitario" value={precioUnitario} onChange={e => setPrecioUnitario(e.target.value)} className="input-modern" />
            <button type="button" onClick={addItem} className="btn-primary flex items-center justify-center space-x-2">
              <FiPlus /> Agregar
            </button>
          </div>
        </div>
        
        {items.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Subtotal</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">{item.producto_nombre}</td>
                    <td className="px-4 py-3">{item.cantidad}</td>
                    <td className="px-4 py-3">${item.precio_unitario.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold">${(item.cantidad * item.precio_unitario).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => removeItem(idx)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan="3" className="px-4 py-3 text-right">Total:</td>
                  <td className="px-4 py-3 text-blue-600 text-lg">${total.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-success flex items-center space-x-2">
            {loading ? 'Registrando...' : 'Registrar Compra'}
          </button>
        </div>
      </form>
    </div>
  );
}