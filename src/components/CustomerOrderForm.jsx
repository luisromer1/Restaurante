import React, { useState, useEffect } from 'react';
import clientesService from '../services/clientesService'; // Servicio para interactuar con la API de clientes
import './CustomerOrderForm.css'; // Estilos específicos para este formulario

function CustomerOrderForm({ onCustomerSelected, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    email: '',
  });
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [selectedExistingCustomerId, setSelectedExistingCustomerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Mensajes de éxito/error/info

  useEffect(() => {
    // Cargar clientes existentes al montar el componente
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await clientesService.getAll();
        setExistingCustomers(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar clientes existentes.');
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSelectExistingCustomer = (e) => {
    setSelectedExistingCustomerId(e.target.value);
    // Si se selecciona un cliente existente, limpia el formulario de nuevo cliente
    if (e.target.value) {
      setFormData({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        email: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Limpiar mensajes anteriores

    if (selectedExistingCustomerId) {
      // Si se seleccionó un cliente existente
      const selectedCustomer = existingCustomers.find(c => c.id === parseInt(selectedExistingCustomerId));
      if (selectedCustomer) {
        onCustomerSelected(selectedCustomer.id);
        setMessage({ type: 'success', text: `Cliente ${selectedCustomer.persona.nombre} seleccionado.` });
      } else {
        setMessage({ type: 'error', text: 'Cliente existente no encontrado.' });
      }
    } else {
      // Si se va a registrar un nuevo cliente
      if (!formData.nombre || !formData.apellido || !formData.direccion || !formData.telefono || !formData.email) {
        setMessage({ type: 'error', text: 'Por favor, complete todos los campos para registrar un nuevo cliente.' });
        return;
      }

      try {
        // Asumiendo que el backend espera un objeto 'persona' dentro del cliente
        const newCustomerData = {
          persona: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            direccion: formData.direccion,
            telefono: formData.telefono,
            email: formData.email,
          }
        };
        const newCustomer = await clientesService.create(newCustomerData);
        onCustomerSelected(newCustomer.id); // Pasa el ID del nuevo cliente
        setMessage({ type: 'success', text: `Cliente ${newCustomer.persona.nombre} registrado y seleccionado.` });
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Error al registrar el nuevo cliente.' });
        console.error("Error registering new customer:", err);
      }
    }
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="customer-form-loading">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-form-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="customer-form-container">
      <h2 className="customer-form-title">Datos del Cliente</h2>

      {message && (
        <div className={`customer-form-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección para seleccionar cliente existente */}
        <div className="form-group">
          <label htmlFor="existingClient" className="block text-gray-700 text-sm font-semibold mb-2">
            Seleccionar Cliente Existente:
          </label>
          <select
            id="existingClient"
            value={selectedExistingCustomerId}
            onChange={handleSelectExistingCustomer}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 appearance-none bg-white pr-8"
          >
            <option value="">-- Seleccione un cliente --</option>
            {existingCustomers.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.persona ? `${cliente.persona.nombre} ${cliente.persona.apellido} (${cliente.persona.telefono})` : `Cliente ID: ${cliente.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Sección para registrar nuevo cliente (solo si no se seleccionó uno existente) */}
        {!selectedExistingCustomerId && (
          <>
            <p className="text-center text-gray-600 my-4">O registre un nuevo cliente:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="nombre" className="block text-gray-700 text-sm font-semibold mb-2">Nombre:</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido" className="block text-gray-700 text-sm font-semibold mb-2">Apellido:</label>
                <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="direccion" className="block text-gray-700 text-sm font-semibold mb-2">Dirección:</label>
              <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="telefono" className="block text-gray-700 text-sm font-semibold mb-2">Teléfono:</label>
                <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            disabled={!selectedExistingCustomerId && (!formData.nombre || !formData.apellido || !formData.telefono)} // Deshabilita si no hay selección ni datos mínimos
          >
            Continuar con el Pedido
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerOrderForm;
