// src/pages/EntregasPage.jsx
import React, { useState, useEffect } from 'react';
import entregasService from '../services/entregasService';
import EntregaForm from '../components/EntregaForm';
import './EntregasPage.css'; // Crearemos este CSS

function EntregasPage() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEntrega, setEditingEntrega] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchEntregas = async () => {
    try {
      setLoading(true);
      const data = await entregasService.getAll();
      setEntregas(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar entregas.');
      setEntregas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntregas();
  }, []);

  const handleFormSubmit = async (entregaData) => {
    try {
      if (entregaData.id) { // Es una actualización
        await entregasService.update(entregaData.id, entregaData);
        setMessage('Entrega actualizada exitosamente!');
      } else { // Es una creación
        await entregasService.create(entregaData);
        setMessage('Entrega creada exitosamente!');
      }
      setShowForm(false);
      setEditingEntrega(null);
      fetchEntregas(); // Recargar la lista
    } catch (err) {
      setMessage(`Error: ${err.message || 'Ocurrió un error al guardar la entrega.'}`);
      console.error("Error al guardar entrega:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (entrega) => {
    setEditingEntrega(entrega);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrega?')) {
      try {
        await entregasService.remove(id);
        setMessage('Entrega eliminada exitosamente!');
        fetchEntregas(); // Recargar la lista
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar la entrega.'}`);
        console.error("Error al eliminar entrega:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntrega(null);
    setMessage(null);
  };

  // Función para formatear fechas
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString(); // Formato local de fecha y hora
  };

  if (loading) {
    return <div className="entregas-container loading">Cargando entregas...</div>;
  }

  if (error) {
    return <div className="entregas-container error">Error: {error}</div>;
  }

  return (
    <div className="entregas-page">
      <div className="page-header">
        <h2 className="entregas-title">Gestión de Entregas</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Registrar Nueva Entrega
        </button>
      </div>

      {message && <div className={`app-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

      {showForm && (
        <EntregaForm
          entregaInicial={editingEntrega}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && entregas.length === 0 ? (
        <p className="no-entregas">No hay entregas registradas.</p>
      ) : (
        !showForm && (
          <div className="entregas-grid">
            {entregas.map((entrega) => (
              <div key={entrega.id} className="entrega-card">
                <h3 className="entrega-title-card">Entrega ID: {entrega.id}</h3>
                <p><strong>Pedido ID:</strong> {entrega.pedido?.id || 'N/A'}</p>
                <p><strong>Fecha Salida:</strong> {formatDateTime(entrega.fechaSalida)}</p>
                <p><strong>Fecha Entrega:</strong> {formatDateTime(entrega.fechaEntrega)}</p>
                <p><strong>Dirección:</strong> {entrega.direccionEntrega}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(entrega)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(entrega.id)} className="btn-delete">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default EntregasPage;