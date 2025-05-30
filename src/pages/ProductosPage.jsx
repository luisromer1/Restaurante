// src/pages/ProductosPage.jsx
import React, { useState, useEffect } from 'react';
import productosService from '../services/productosService';
import ProductoForm from '../components/ProductoForm'; // Importa el formulario de producto
import './ProductosPage.css'; // Estilos específicos de esta página

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [message, setMessage] = useState(null);

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
      if (productoData.id) { // Es una actualización
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

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productosService.remove(id);
        setMessage('Producto eliminado exitosamente!');
        fetchProductos();
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar el producto.'}`);
        console.error("Error al eliminar producto:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProducto(null);
    setMessage(null);
  };

  if (loading) {
    return <div className="productos-container loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="productos-container error">Error: {error}</div>;
  }

  return (
    <div className="productos-page">
      <div className="page-header">
        <h2 className="productos-title">Gestión de Productos</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Agregar Nuevo Producto
        </button>
      </div>

      {message && <div className={`app-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

      {showForm && (
        <ProductoForm
          productoInicial={editingProducto}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && productos.length === 0 ? (
        <p className="no-productos">No hay productos registrados.</p>
      ) : (
        !showForm && (
          <div className="productos-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="producto-card">
                <h3 className="producto-name">{producto.nombre}</h3>
                <p><strong>ID:</strong> {producto.id}</p>
                <p><strong>Precio:</strong> ${producto.precio ? producto.precio.toFixed(2) : '0.00'}</p>
                <p><strong>Stock:</strong> {producto.stock}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(producto)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(producto.id)} className="btn-delete">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default ProductosPage;