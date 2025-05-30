// src/components/PedidoForm.jsx
import React, { useState, useEffect } from 'react';
import './PedidoForm.css';
import clientesService from '../services/clientesService'; // Importa el servicio de clientes

function PedidoForm({ pedidoInicial = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: pedidoInicial?.id || 0,
    fechaHora: pedidoInicial?.fechaHora ? new Date(pedidoInicial.fechaHora).toISOString().substring(0, 16) : '', // Formatear para datetime-local
    tipo: pedidoInicial?.tipo || '',
    estado: pedidoInicial?.estado || '',
    id_Cliente: pedidoInicial?.id_Cliente || '',
  });

  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [errorClientes, setErrorClientes] = useState(null);

  useEffect(() => {
    // Cargar la lista de clientes al montar el componente
    const fetchClientes = async () => {
      try {
        setLoadingClientes(true);
        const data = await clientesService.getAll();
        setClientes(data);
        setErrorClientes(null);
      } catch (err) {
        setErrorClientes('Error al cargar la lista de clientes.');
        console.error("Error al cargar clientes:", err);
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  // Actualizar formData si pedidoInicial cambia (para edición)
  useEffect(() => {
    if (pedidoInicial) {
      setFormData({
        id: pedidoInicial.id,
        fechaHora: pedidoInicial.fechaHora ? new Date(pedidoInicial.fechaHora).toISOString().substring(0, 16) : '',
        tipo: pedidoInicial.tipo,
        estado: pedidoInicial.estado,
        id_Cliente: pedidoInicial.id_Cliente,
      });
    } else {
      setFormData({
        id: 0,
        fechaHora: '',
        tipo: '',
        estado: '',
        id_Cliente: '',
      });
    }
  }, [pedidoInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir la fecha y hora a formato ISO 8601 si no está ya en ese formato
    // Date.toISOString() devuelve un string como "2024-05-30T14:00:00.000Z"
    const dataToSend = {
      ...formData,
      fechaHora: new Date(formData.fechaHora).toISOString(),
      id_Cliente: parseInt(formData.id_Cliente, 10), // Asegúrate de que sea un número entero
    };

    onSubmit(dataToSend);
  };

  if (loadingClientes) {
    return <div className="pedido-form-container">Cargando clientes para el formulario...</div>;
  }

  if (errorClientes) {
    return <div className="pedido-form-container error">{errorClientes}</div>;
  }

  return (
    <div className="pedido-form-container">
      <h3>{pedidoInicial ? 'Editar Pedido' : 'Crear Nuevo Pedido'}</h3>
      <form onSubmit={handleSubmit} className="pedido-form">
        <div className="form-group">
          <label htmlFor="fechaHora">Fecha y Hora:</label>
          <input
            type="datetime-local"
            id="fechaHora"
            name="fechaHora"
            value={formData.fechaHora}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tipo">Tipo de Pedido:</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">Seleccione el tipo</option>
            <option value="Online">Online</option>
            <option value="Presencial">Presencial</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="estado">Estado del Pedido:</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">Seleccione el estado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Preparacion">En Preparación</option>
            <option value="Listo para Recoger">Listo para Recoger</option>
            <option value="En Camino">En Camino</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="id_Cliente">Cliente:</label>
          <select
            id="id_Cliente"
            name="id_Cliente"
            value={formData.id_Cliente}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.persona ? `${cliente.persona.nombre} ${cliente.persona.apellido}` : `Cliente ID: ${cliente.id}`}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {pedidoInicial ? 'Actualizar Pedido' : 'Guardar Pedido'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default PedidoForm;