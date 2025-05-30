// src/pages/VentasPage.jsx
import React, { useState, useEffect } from 'react';
import ventasService from '../services/ventasService';
import VentaForm from '../components/VentaForm';
import './VentasPage.css';

function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const data = await ventasService.getAll();
      setVentas(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar ventas.');
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const handleFormSubmit = async (ventaData) => {
    try {
      if (ventaData.id) { // Es una actualización (aunque la fecha está deshabilitada, podría venir el ID)
        await ventasService.update(ventaData.id, ventaData);
        setMessage('Venta actualizada exitosamente!');
      } else { // Es una creación o actualización por fecha
        // El backend ya maneja si es una inserción o actualización basada en la fecha
        await ventasService.create(ventaData);
        setMessage('Venta guardada/actualizada exitosamente!');
      }
      setShowForm(false);
      setEditingVenta(null);
      fetchVentas(); // Recargar la lista
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || err.message || 'Ocurrió un error al guardar la venta.'}`);
      console.error("Error al guardar venta:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (venta) => {
    setEditingVenta(venta);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      try {
        await ventasService.remove(id);
        setMessage('Venta eliminada exitosamente!');
        fetchVentas(); // Recargar la lista
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar la venta.'}`);
        console.error("Error al eliminar venta:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVenta(null); // Limpiar cualquier venta que se estuviera editando
  };

  // Función para formatear fechas (solo la parte de la fecha)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="ventas-container loading">Cargando ventas...</div>;
  }

  if (error) {
    return <div className="ventas-container error">Error: {error}</div>;
  }

  return (
    <div className="ventas-page">
      <div className="page-header">
        <h2 className="ventas-title">Gestión de Ventas</h2>
        <button onClick={() => {
          setShowForm(true);
          setEditingVenta(null); // Asegúrate de que no haya venta en edición al abrir el formulario para crear
        }} className="btn-primary">
          Registrar Nueva Venta
        </button>
      </div>

      {message && <div className={`app-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

      {showForm && (
        <VentaForm
          ventaInicial={editingVenta}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && ventas.length === 0 ? (
        <p className="no-ventas">No hay ventas registradas.</p>
      ) : (
        !showForm && (
          <div className="ventas-grid">
            {ventas.map((venta) => (
              <div key={venta.id} className="venta-card">
                <h3 className="venta-title-card">Venta ID: {venta.id}</h3>
                <p><strong>Fecha:</strong> {formatDate(venta.fecha)}</p>
                <p><strong>Total Venta:</strong> ${venta.totalVenta?.toFixed(2)}</p>
                <p><strong>Pedidos Totales:</strong> {venta.pedidosTotales}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(venta)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(venta.id)} className="btn-delete">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default VentasPage;