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

  // Estado para el mensaje de error del formulario
  const [formMessage, setFormMessage] = useState(null);

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

    // Validación de campos vacíos
    if (!formData.persona.nombre || !formData.persona.apellido || !formData.persona.telefono || !formData.persona.direccion) {
      setFormMessage('Por favor, completa todos los campos.');
      setTimeout(() => setFormMessage(null), 3000); // Borrar mensaje después de 3 segundos
      return;
    }

    onSubmit(formData); // Llama a la función onSubmit que se pasa desde ClientesPage
  };

  return (
    <div className="cliente-form-container bg-white p-8 rounded-xl shadow-2xl mb-6 border border-gray-100 mx-auto max-w-2xl"> {/* Contenedor más profesional y centrado */}
      <h3 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-blue-500 text-center"> {/* Título más grande y con borde, centrado */}
        {clienteInicial ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
      </h3>

      {formMessage && (
        <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700 text-center font-medium"> {/* Mensaje centrado y con mejor estilo */}
          {formMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6"> {/* Mayor espacio entre elementos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Mayor espacio entre columnas */}
          <div className="form-group">
            <label htmlFor="nombre" className="block text-sm font-semibold mb-2">Nombre:</label> {/* Labels más definidos, color ahora en CSS */}
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.persona.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base" // Estilo de input mejorado, color de texto y placeholder ahora en CSS
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido" className="block text-sm font-semibold mb-2">Apellido:</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.persona.apellido}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="telefono" className="block text-sm font-semibold mb-2">Teléfono:</label>
            <input
              type="text" // Usamos "text" para permitir guiones, espacios, etc.
              id="telefono"
              name="telefono"
              value={formData.persona.telefono}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
            />
          </div>
          <div className="form-group">
            <label htmlFor="direccion" className="block text-sm font-semibold mb-2">Dirección:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.persona.direccion}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8"> {/* Separador y espacio para botones */}
          <button
            type="button"
            onClick={onCancel}
            className="btn-form-cancel" // Usando la clase CSS personalizada
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-form-submit" // Usando la clase CSS personalizada
          >
            {clienteInicial ? 'Actualizar Cliente' : 'Guardar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClienteForm;
