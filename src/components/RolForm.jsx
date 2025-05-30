// src/components/RolForm.jsx
import React, { useState, useEffect } from 'react';
import './RolForm.css'; // Crearemos este CSS

function RolForm({ rolInicial = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: rolInicial?.id || 0,
    nombre: rolInicial?.nombre || '',
  });

  // Actualizar formData si rolInicial cambia (para edición)
  useEffect(() => {
    if (rolInicial) {
      setFormData({
        id: rolInicial.id,
        nombre: rolInicial.nombre,
      });
    } else {
      // Resetear para nuevo rol si rolInicial es null
      setFormData({
        id: 0,
        nombre: '',
      });
    }
  }, [rolInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="rol-form-container">
      <h3>{rolInicial ? 'Editar Rol' : 'Crear Nuevo Rol'}</h3>
      <form onSubmit={handleSubmit} className="rol-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Rol:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Administrador, Cajero, Cocinero"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {rolInicial ? 'Actualizar Rol' : 'Guardar Rol'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default RolForm;