// src/pages/RolesPage.jsx
import React, { useState, useEffect } from 'react';
import rolesService from '../services/rolesService';
import RolForm from '../components/RolForm'; // Importa el formulario de rol
import './RolesPage.css'; // Crearemos este CSS

function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRol, setEditingRol] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await rolesService.getAll();
      setRoles(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar roles.');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleFormSubmit = async (rolData) => {
    try {
      if (rolData.id) { // Es una actualización
        await rolesService.update(rolData.id, rolData);
        setMessage('Rol actualizado exitosamente!');
      } else { // Es una creación
        await rolesService.create(rolData);
        setMessage('Rol creado exitosamente!');
      }
      setShowForm(false);
      setEditingRol(null);
      fetchRoles(); // Recargar la lista
    } catch (err) {
      setMessage(`Error: ${err.message || 'Ocurrió un error al guardar el rol.'}`);
      console.error("Error al guardar rol:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (rol) => {
    setEditingRol(rol);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      try {
        await rolesService.remove(id);
        setMessage('Rol eliminado exitosamente!');
        fetchRoles(); // Recargar la lista
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar el rol.'}`);
        console.error("Error al eliminar rol:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRol(null);
    setMessage(null);
  };

  // Puedes reutilizar las clases de app-message si las tienes definidas globalmente
  // o definirlas aquí si no las tienes.
  // .app-message, .app-message.success, .app-message.error

  if (loading) {
    return <div className="roles-container loading">Cargando roles...</div>;
  }

  if (error) {
    return <div className="roles-container error">Error: {error}</div>;
  }

  return (
    <div className="roles-page">
      <div className="page-header">
        <h2 className="roles-title">Gestión de Roles</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Crear Nuevo Rol
        </button>
      </div>

      {message && <div className={`app-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

      {showForm && (
        <RolForm
          rolInicial={editingRol}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && roles.length === 0 ? (
        <p className="no-roles">No hay roles registrados.</p>
      ) : (
        !showForm && (
          <div className="roles-grid">
            {roles.map((rol) => (
              <div key={rol.id} className="rol-card">
                <h3 className="rol-name">{rol.nombre}</h3>
                <p>ID: {rol.id}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(rol)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(rol.id)} className="btn-delete">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default RolesPage;