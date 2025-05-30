// src/pages/UsuariosPage.jsx
import React, { useState, useEffect } from 'react';
import usuariosService from '../services/usuariosService';
import UsuarioForm from '../components/UsuarioForm'; // Importa el formulario de usuario
import './UsuariosPage.css'; // Crearemos este CSS

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosService.getAll();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios.');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleFormSubmit = async (usuarioData) => {
    try {
      if (usuarioData.id) { // Es una actualización
        await usuariosService.update(usuarioData.id, usuarioData);
        setMessage('Usuario actualizado exitosamente!');
      } else { // Es una creación
        await usuariosService.create(usuarioData);
        setMessage('Usuario creado exitosamente!');
      }
      setShowForm(false);
      setEditingUsuario(null);
      fetchUsuarios(); // Recargar la lista
    } catch (err) {
      setMessage(`Error: ${err.message || 'Ocurrió un error al guardar el usuario.'}`);
      console.error("Error al guardar usuario:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await usuariosService.remove(id);
        setMessage('Usuario eliminado exitosamente!');
        fetchUsuarios(); // Recargar la lista
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar el usuario.'}`);
        console.error("Error al eliminar usuario:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUsuario(null);
    setMessage(null);
  };

  if (loading) {
    return <div className="usuarios-container loading">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="usuarios-container error">Error: {error}</div>;
  }

  return (
    <div className="usuarios-page">
      <div className="page-header">
        <h2 className="usuarios-title">Gestión de Usuarios</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Crear Nuevo Usuario
        </button>
      </div>

      {message && <div className={`app-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

      {showForm && (
        <UsuarioForm
          usuarioInicial={editingUsuario}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && usuarios.length === 0 ? (
        <p className="no-usuarios">No hay usuarios registrados.</p>
      ) : (
        !showForm && (
          <div className="usuarios-grid">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="usuario-card">
                <h3 className="usuario-name">{usuario.nombreUsuario}</h3>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Persona:</strong> {usuario.persona ? `${usuario.persona.nombre} ${usuario.persona.apellido}` : 'N/A'}</p>
                <p><strong>Rol:</strong> {usuario.rol ? usuario.rol.nombre : 'N/A'}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(usuario)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(usuario.id)} className="btn-delete">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default UsuariosPage;