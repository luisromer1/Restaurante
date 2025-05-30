// src/pages/PedidosPage.jsx
import React, { useState, useEffect } from 'react';
import pedidosService from '../services/pedidosService';
import PedidoForm from '../components/PedidoForm'; // Importa el formulario de pedido
import './PedidosPage.css'; // Estilos específicos de esta página

function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidosService.getAll();
      setPedidos(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar pedidos.');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleFormSubmit = async (pedidoData) => {
    try {
      if (pedidoData.id) { // Es una actualización
        await pedidosService.update(pedidoData.id, pedidoData);
        setMessage('Pedido actualizado exitosamente!');
      } else { // Es una creación
        await pedidosService.create(pedidoData);
        setMessage('Pedido creado exitosamente!');
      }
      setShowForm(false);
      setEditingPedido(null);
      fetchPedidos();
    } catch (err) {
      setMessage(`Error: ${err.message || 'Ocurrió un error al guardar el pedido.'}`);
      console.error("Error al guardar pedido:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (pedido) => {
    setEditingPedido(pedido);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      try {
        await pedidosService.remove(id);
        setMessage('Pedido eliminado exitosamente!');
        fetchPedidos();
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar el pedido.'}`);
        console.error("Error al eliminar pedido:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleAvanzarEstado = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres avanzar el estado de este pedido?')) {
      try {
        const response = await pedidosService.avanzarEstado(id);
        setMessage(response.mensaje || 'Estado del pedido avanzado exitosamente!');
        fetchPedidos(); // Recargar para ver el nuevo estado
      } catch (err) {
        setMessage(`Error al avanzar estado: ${err.message || 'Ocurrió un error.'}`);
        console.error("Error al avanzar estado:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };


  const handleCancel = () => {
    setShowForm(false);
    setEditingPedido(null);
    setMessage(null);
  };

  const formatFecha = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString(); // Formato local de fecha y hora
  };

  // Función para obtener la clase de estilo basada en el estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'estado-pendiente';
      case 'En Preparacion': return 'estado-en-preparacion';
      case 'Listo para Entrega': return 'estado-listo';
      case 'Entregado': return 'estado-entregado';
      case 'Cancelado': return 'estado-cancelado';
      default: return '';
    }
  };


  if (loading) {
    return <div className="pedidos-container loading">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="pedidos-container error">Error: {error}</div>;
  }

  return (
    <div className="pedidos-page">
      <div className="page-header">
        <h2 className="pedidos-title">Gestión de Pedidos</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Crear Nuevo Pedido
        </button>
      </div>

      {message && <div className={`app-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

      {showForm && (
        <PedidoForm
          pedidoInicial={editingPedido}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && pedidos.length === 0 ? (
        <p className="no-pedidos">No hay pedidos registrados.</p>
      ) : (
        !showForm && (
          <div className="pedidos-grid">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className={`pedido-card ${getEstadoClass(pedido.estado)}`}>
                <h3 className="pedido-id">Pedido #{pedido.id}</h3>
                <p><strong>Cliente:</strong> {pedido.cliente?.persona?.nombre} {pedido.cliente?.persona?.apellido}</p>
                <p><strong>Fecha/Hora:</strong> {formatFecha(pedido.fechaHora)}</p>
                <p><strong>Tipo:</strong> {pedido.tipo}</p>
                <p><strong>Estado:</strong> <span className={`estado-badge ${getEstadoClass(pedido.estado)}`}>{pedido.estado}</span></p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(pedido)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(pedido.id)} className="btn-delete">Eliminar</button>
                  {/* Mostrar botón de avanzar estado solo si no está Entregado o Cancelado */}
                  {(pedido.estado !== 'Entregado' && pedido.estado !== 'Cancelado') && (
                    <button onClick={() => handleAvanzarEstado(pedido.id)} className="btn-avanzar">Avanzar Estado</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default PedidosPage;