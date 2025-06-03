import React, { useState, useEffect } from 'react';
import productosService from '../services/productosService';
import ProductoForm from '../components/ProductoForm';
import './ProductosPage.css'; // Estilos específicos de esta página

// Componente Modal simple para confirmaciones (reutilizado)
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false); // Para el modal de confirmación
  const [selectedProductoId, setSelectedProductoId] = useState(null); // Para el ID del producto a eliminar

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await productosService.getAll();
      setProductos(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar productos.');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleFormSubmit = async (productoData) => {
    try {
      if (productoData.id && productoData.id !== 0) { // Es una actualización
        await productosService.update(productoData.id, productoData);
        setMessage('Producto actualizado exitosamente!');
      } else { // Es una creación
        await productosService.create(productoData);
        setMessage('Producto agregado exitosamente!');
      }
      setShowForm(false);
      setEditingProducto(null);
      fetchProductos();
    } catch (err) {
      setMessage(`Error: ${err.message || 'Ocurrió un error al guardar el producto.'}`);
      console.error("Error al guardar producto:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (producto) => {
    setEditingProducto(producto);
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedProductoId(id);
    setShowModal(true); // Mostrar el modal
  };

  const handleModalConfirm = async () => {
    setShowModal(false); // Cerrar el modal
    try {
      await productosService.remove(selectedProductoId);
      setMessage('Producto eliminado exitosamente!');
      fetchProductos();
    } catch (err) {
      setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar el producto.'}`);
      console.error("Error al eliminar producto:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false); // Cerrar el modal
    setSelectedProductoId(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProducto(null);
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Productos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-nuevo-producto" // Clase CSS personalizada
        >
          <span className="icon-plus">+</span> {/* Símbolo '+' con estilo */}
          Nuevo Producto
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <ProductoForm
          productoInicial={editingProducto}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && productos.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">No hay productos registrados.</p>
      ) : (
        !showForm && (
          <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-gray-200">
            <table className="min-w-full leading-normal divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-800 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left font-bold tracking-wider">ID</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Nombre</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Precio</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Stock</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Tipo</th>
                  <th className="py-3 px-6 text-center font-bold tracking-wider min-w-36">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                {productos.map((producto) => (
                  <tr key={producto.id} className="border-b border-gray-200 hover:bg-blue-50 transition duration-150 ease-in-out">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900">#{producto.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {producto.nombre}
                    </td>
                    <td className="py-3 px-6 text-left">
                      ${producto.precio ? producto.precio.toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {producto.stock}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {producto.tipo}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="w-9 h-9 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 flex items-center justify-center transition duration-200 transform hover:scale-110 shadow-md"
                          title="Editar"
                        >
                          <span className="text-lg">✏️</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(producto.id)}
                          className="w-9 h-9 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition duration-200 transform hover:scale-110 shadow-md"
                          title="Eliminar"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {showModal && (
        <ConfirmationModal
          message="¿Estás seguro de que quieres eliminar este producto?"
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  );
}

export default ProductosPage;
