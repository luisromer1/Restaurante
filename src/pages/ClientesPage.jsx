// src/pages/ClientesPage.jsx
import React, { useState, useEffect } from 'react';
import clientesService from '../services/clientesService';
import ClienteForm from '../components/ClienteForm'; // Importa el formulario
import './ClientesPage.css'; // Estilos específicos de esta página

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // Para mostrar/ocultar el formulario
  const [editingClient, setEditingClient] = useState(null); // Cliente a editar
  const [message, setMessage] = useState(null); // Mensajes de éxito/error

  // Función para cargar los clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.getAll();
      setClientes(data);
      setError(null); // Limpiar errores previos
    } catch (err) {
      setError(err.message || 'Error al cargar clientes.');
      setClientes([]); // Asegurarse de que no haya clientes si hay error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes(); // Carga los clientes al montar el componente
  }, []);

  // Manejar el envío del formulario (Crear o Actualizar)
  const handleFormSubmit = async (clienteData) => {
    try {
      if (clienteData.id) { // Si hay un ID, es una actualización
        // Para actualizar, tu backend ASP.NET Core espera un objeto Cliente
        // que incluye la persona anidada.
        // El 'id' de la persona es importante si tu backend lo requiere para el update.
        await clientesService.update(clienteData.id, clienteData);
        setMessage('Cliente actualizado exitosamente!');
      } else { // Si no hay ID, es una creación
        // Para crear, tu backend ASP.NET Core espera un objeto Cliente
        // con la persona anidada (sin IDs, ya que los generará la BD).
        // Asegúrate de que el backend pueda manejar un objeto Cliente con la Persona
        // para la inserción.
        // Si tu backend SOLO espera la Persona para la inserción de Cliente,
        // deberías enviar `clienteData.persona` en lugar de `clienteData`
        // o adaptar tu controlador de ASP.NET Core para que reciba `Cliente`
        // y cree la `Persona` asociada si no existe.
        // Basado en tu ClientesController, si `CreateCliente` recibe `Clientes cliente`
        // y `cliente.persona` tiene todos los campos, debería funcionar.
        await clientesService.create(clienteData);
        setMessage('Cliente agregado exitosamente!');
      }
      setShowForm(false); // Ocultar el formulario
      setEditingClient(null); // Limpiar el cliente en edición
      fetchClientes(); // Recargar la lista de clientes
    } catch (err) {
      setMessage(`Error: ${err.message || 'Ocurrió un error al guardar el cliente.'}`);
      console.error("Error al guardar cliente:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000); // Borrar mensaje después de 5 segundos
    }
  };

  // Manejar edición
  const handleEdit = (cliente) => {
    setEditingClient(cliente);
    setShowForm(true);
  };

  // Manejar eliminación
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientesService.remove(id);
        setMessage('Cliente eliminado exitosamente!');
        fetchClientes(); // Recargar la lista de clientes
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar el cliente.'}`);
        console.error("Error al eliminar cliente:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  // Manejar cancelación del formulario
  const handleCancel = () => {
    setShowForm(false);
    setEditingClient(null);
    setMessage(null); // Limpiar mensajes al cancelar
  };

  if (loading) {
    return <div className="clientes-container loading">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="clientes-container error">Error: {error}</div>;
  }

  return (
    <div className="clientes-page">
      <div className="page-header">
        <h2 className="clientes-title">Gestión de Clientes</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Agregar Nuevo Cliente
        </button>
      </div>

      {message && <div className={`app-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

      {showForm && (
        <ClienteForm
          clienteInicial={editingClient}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && clientes.length === 0 ? (
        <p className="no-clientes">No hay clientes registrados.</p>
      ) : (
        !showForm && ( // Solo muestra la tabla si el formulario no está visible
          <div className="clientes-grid">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="cliente-card">
                <h3 className="cliente-name">{cliente.persona?.nombre} {cliente.persona?.apellido}</h3>
                <p><strong>ID Cliente:</strong> {cliente.id}</p>
                <p><strong>ID Persona:</strong> {cliente.persona?.id}</p>
                <p><strong>Teléfono:</strong> {cliente.persona?.telefono}</p>
                <p><strong>Dirección:</strong> {cliente.persona?.direccion}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(cliente)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(cliente.id)} className="btn-delete">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default ClientesPage;