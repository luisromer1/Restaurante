// src/pages/DetallesPage.jsx
import React, { useState, useEffect } from 'react';
import detalleService from '../services/detalleService';
import DetalleForm from '../components/DetalleForm';
import './DetallesPage.css'; // Crearemos este CSS

function DetallesPage() {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDetalle, setEditingDetalle] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchDetalles = async () => {
    try {
      setLoading(true);
      const data = await detalleService.getAll();
      setDetalles(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar detalles.');
      setDetalles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalles();
  }, []);

  const handleFormSubmit = async (detalleData) => {
    try {
      if (detalleData.id) { // Es una actualización
        await detalleService.update(detalleData.id, detalleData);
        setMessage('Detalle actualizado exitosamente!');
      } else { // Es una creación
        await detalleService.create(detalleData);
        setMessage('Detalle creado exitosamente!');
      }
      setShowForm(false);
      setEditingDetalle(null);
      fetchDetalles(); // Recargar la lista
    } catch (err) {
      setMessage(`Error: ${err.message || 'Ocurrió un error al guardar el detalle.'}`);
      console.error("Error al guardar detalle:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (detalle) => {
    setEditingDetalle(detalle);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este detalle?')) {
      try {
        await detalleService.remove(id);
        setMessage('Detalle eliminado exitosamente!');
        fetchDetalles(); // Recargar la lista
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar el detalle.'}`);
        console.error("Error al eliminar detalle:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDetalle(null);
    setMessage(null);
  };

  if (loading) {
    return <div className="detalles-container loading">Cargando detalles...</div>;
  }

  if (error) {
    return <div className="detalles-container error">Error: {error}</div>;
  }

  return (
    <div className="detalles-page">
      <div className="page-header">
        <h2 className="detalles-title">Gestión de Detalles de Pedido</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Agregar Nuevo Detalle
        </button>
      </div>

      {message && <div className={`app-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

      {showForm && (
        <DetalleForm
          detalleInicial={editingDetalle}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && detalles.length === 0 ? (
        <p className="no-detalles">No hay detalles de pedidos registrados.</p>
      ) : (
        !showForm && (
          <div className="detalles-grid">
            {detalles.map((detalle) => (
              <div key={detalle.id} className="detalle-card">
                <h3 className="detalle-title-card">Detalle ID: {detalle.id}</h3>
                <p><strong>Pedido ID:</strong> {detalle.pedido?.id || 'N/A'}</p>
                <p><strong>Producto:</strong> {detalle.producto?.nombre || 'N/A'}</p>
                <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
                <p><strong>Total:</strong> ${detalle.total}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(detalle)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(detalle.id)} className="btn-delete">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default DetallesPage;