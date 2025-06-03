import React from 'react';

function AdminForm({ formType, entityData, onSave, onCancel }) {
  // Este es un formulario muy básico. Deberías expandirlo.
  // formType podría ser 'cliente', 'producto', etc.
  // entityData contendría los datos si estás editando.

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para recolectar datos del formulario
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
    };
    if (onSave) onSave(formData);
  };

  return (
    <div className="admin-form-container">
      <h2>{entityData ? `Edit ${formType}` : `Create New ${formType}`}</h2>
      <form onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={entityData?.name || ''}
            required
          />
        </div>
        <div className="admin-form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={entityData?.email || ''}
            required
          />
        </div>
        {/* Agrega más campos según sea necesario */}
        <button type="submit" className="admin-form-button">Save {formType}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="admin-form-button" style={{marginLeft: '10px', backgroundColor: '#7f8c8d'}}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default AdminForm;