// src/components/EntregaForm.jsx
import React, { useState, useEffect } from 'react';
import './EntregaForm.css'; // Crearemos este CSS
import pedidosService from '../services/pedidosService'; // Para obtener pedidos

function EntregaForm({ entregaInicial = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: entregaInicial?.id || 0,
    fechaSalida: entregaInicial?.fechaSalida ? new Date(entregaInicial.fechaSalida).toISOString().substring(0, 16) : '',
    fechaEntrega: entregaInicial?.fechaEntrega ? new Date(entregaInicial.fechaEntrega).toISOString().substring(0, 16) : '',
    direccionEntrega: entregaInicial?.direccionEntrega || '',
    id_Pedido: entregaInicial?.id_Pedido || '',
  });

  const [pedidos, setPedidos] = useState([]);
  const [loadingDependencies, setLoadingDependencies] = useState(true);
  const [errorDependencies, setErrorDependencies] = useState(null);

  // Cargar pedidos al montar el componente
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setLoadingDependencies(true);
        const pedidosData = await pedidosService.getAll();
        setPedidos(pedidosData);
      } catch (err) {
        setErrorDependencies('Error al cargar dependencias (pedidos) para el formulario.');
        console.error("Error cargando dependencias:", err);
      } finally {
        setLoadingDependencies(false);
      }
    };
    fetchDependencies();
  }, []);

  // Actualizar formData si entregaInicial cambia (para edición)
  useEffect(() => {
    if (entregaInicial) {
      setFormData({
        id: entregaInicial.id,
        fechaSalida: entregaInicial.fechaSalida ? new Date(entregaInicial.fechaSalida).toISOString().substring(0, 16) : '',
        fechaEntrega: entregaInicial.fechaEntrega ? new Date(entregaInicial.fechaEntrega).toISOString().substring(0, 16) : '',
        direccionEntrega: entregaInicial.direccionEntrega,
        id_Pedido: entregaInicial.id_Pedido,
      });
    } else {
      setFormData({
        id: 0,
        fechaSalida: '',
        fechaEntrega: '',
        direccionEntrega: '',
        id_Pedido: '',
      });
    }
  }, [entregaInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Asegurarse de que Id_Pedido sea un número entero
    const dataToSend = {
      ...formData,
      id_Pedido: parseInt(formData.id_Pedido, 10), // Convertir a entero
      fechaSalida: new Date(formData.fechaSalida).toISOString(), // Asegurar formato ISO
      fechaEntrega: new Date(formData.fechaEntrega).toISOString(), // Asegurar formato ISO
    };

    onSubmit(dataToSend);
  };

  if (loadingDependencies) {
    return <div className="entrega-form-container">Cargando datos para el formulario...</div>;
  }

  if (errorDependencies) {
    return <div className="entrega-form-container error">{errorDependencies}</div>;
  }

  return (
    <div className="entrega-form-container">
      <h3>{entregaInicial ? 'Editar Entrega' : 'Registrar Nueva Entrega'}</h3>
      <form onSubmit={handleSubmit} className="entrega-form">
        <div className="form-group">
          <label htmlFor="id_Pedido">Pedido Asociado:</label>
          <select
            id="id_Pedido"
            name="id_Pedido"
            value={formData.id_Pedido}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">Seleccione un pedido</option>
            {pedidos.map(pedido => (
              <option key={pedido.id} value={pedido.id}>
                Pedido ID: {pedido.id} - Estado: {pedido.estado} - Tipo: {pedido.tipo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fechaSalida">Fecha y Hora de Salida:</label>
          <input
            type="datetime-local"
            id="fechaSalida"
            name="fechaSalida"
            value={formData.fechaSalida}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaEntrega">Fecha y Hora de Entrega:</label>
          <input
            type="datetime-local"
            id="fechaEntrega"
            name="fechaEntrega"
            value={formData.fechaEntrega}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="direccionEntrega">Dirección de Entrega:</label>
          <input
            type="text"
            id="direccionEntrega"
            name="direccionEntrega"
            value={formData.direccionEntrega}
            onChange={handleChange}
            required
            placeholder="Ej: Av. Principal 123, Zona Central"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {entregaInicial ? 'Actualizar Entrega' : 'Guardar Entrega'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EntregaForm;