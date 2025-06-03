import React, { useState, useEffect } from 'react';
import clientesService from '../services/clientesService'; // Importa el servicio de clientes
import './PedidoForm.css'; // Importa PedidoForm.css (singular)

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

    const dataToSend = {
      ...formData,
      fechaHora: new Date(formData.fechaHora).toISOString(),
      id_Cliente: parseInt(formData.id_Cliente, 10), // Asegúrate de que sea un número entero
    };

    onSubmit(dataToSend);
  };

  if (loadingClientes) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Cargando clientes para el formulario...</p>
      </div>
    );
  }

  if (errorClientes) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {errorClientes}</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl mb-6 border border-gray-100 mx-auto max-w-2xl"> {/* Contenedor más profesional y centrado */}
      <h3 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-blue-500 text-center"> {/* Título más grande y con borde, centrado */}
        {pedidoInicial ? 'Editar Pedido' : 'Crear Nuevo Pedido'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6"> {/* Mayor espacio entre elementos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Mayor espacio entre columnas */}
          <div className="form-group">
            <label htmlFor="fechaHora" className="block text-sm font-semibold mb-2">Fecha y Hora:</label> {/* Labels más definidos, color ahora en CSS */}
            <input
              type="datetime-local"
              id="fechaHora"
              name="fechaHora"
              value={formData.fechaHora}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base" // Estilo de input mejorado, color de texto y placeholder ahora en CSS
            />
          </div>
          <div className="form-group">
            <label htmlFor="tipo" className="block text-sm font-semibold mb-2">Tipo de Pedido:</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base appearance-none bg-white pr-8" // Estilo de select mejorado, color de texto y placeholder ahora en CSS
            >
              <option value="">Seleccione el tipo</option>
              <option value="Online">Online</option>
              <option value="Presencial">Presencial</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="estado" className="block text-sm font-semibold mb-2">Estado del Pedido:</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base appearance-none bg-white pr-8" // Estilo de select mejorado, color de texto y placeholder ahora en CSS
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
            <label htmlFor="id_Cliente" className="block text-sm font-semibold mb-2">Cliente:</label>
            <select
              id="id_Cliente"
              name="id_Cliente"
              value={formData.id_Cliente}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base appearance-none bg-white pr-8" // Estilo de select mejorado, color de texto y placeholder ahora en CSS
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.persona ? `${cliente.persona.nombre} ${cliente.persona.apellido}` : `Cliente ID: ${cliente.id}`}
                </option>
              ))}
            </select>
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
            {pedidoInicial ? 'Actualizar Pedido' : 'Guardar Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PedidoForm;
