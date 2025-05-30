// src/components/ClienteForm.jsx
import React, { useState, useEffect } from 'react';
import './ClienteForm.css'; // Estilos para el formulario

function ClienteForm({ clienteInicial = null, onSubmit, onCancel }) {
  // Estado para los campos del formulario, inicializados con datos del cliente inicial o vacíos
  const [formData, setFormData] = useState({
    id: clienteInicial?.id || 0, // ID del cliente (0 para nuevo, el ID real para editar)
    persona: { // Los datos de Persona anidados
      id: clienteInicial?.persona?.id || 0, // ID de Persona
      nombre: clienteInicial?.persona?.nombre || '',
      apellido: clienteInicial?.persona?.apellido || '',
      telefono: clienteInicial?.persona?.telefono || '',
      direccion: clienteInicial?.persona?.direccion || '',
    }
  });

  // Efecto para actualizar el formulario si clienteInicial cambia (ej. al editar otro cliente)
  useEffect(() => {
    if (clienteInicial) {
      setFormData({
        id: clienteInicial.id,
        persona: {
          id: clienteInicial.persona?.id || 0,
          nombre: clienteInicial.persona?.nombre || '',
          apellido: clienteInicial.persona?.apellido || '',
          telefono: clienteInicial.persona?.telefono || '',
          direccion: clienteInicial.persona?.direccion || '',
        }
      });
    } else {
      // Si clienteInicial es null, resetear el formulario a valores vacíos para un nuevo cliente
      setFormData({
        id: 0,
        persona: {
          id: 0,
          nombre: '',
          apellido: '',
          telefono: '',
          direccion: '',
        }
      });
    }
  }, [clienteInicial]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si el campo es parte de 'persona', actualiza el objeto persona
    if (name in formData.persona) {
      setFormData(prevData => ({
        ...prevData,
        persona: {
          ...prevData.persona,
          [name]: value
        }
      }));
    } else {
      // Si es un campo directo del cliente (como 'id'), actualiza directamente
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Llama a la función onSubmit que se pasa desde ClientesPage
  };

  return (
    <div className="cliente-form-container">
      <h3>{clienteInicial ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h3>
      <form onSubmit={handleSubmit} className="cliente-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.persona.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.persona.apellido}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="text" // Usamos "text" para permitir guiones, espacios, etc.
            id="telefono"
            name="telefono"
            value={formData.persona.telefono}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.persona.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {clienteInicial ? 'Actualizar Cliente' : 'Guardar Cliente'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClienteForm;