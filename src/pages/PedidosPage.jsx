import React, { useState, useEffect } from 'react';
import pedidosService from '../services/pedidosService';
import clientesService from '../services/clientesService'; // Importa el servicio de clientes
import PedidoForm from '../components/PedidoForm'; // Importa el formulario de pedido
import './PedidosPage.css'; 
// Componente Modal simple para confirmaciones
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientesMap, setClientesMap] = useState({}); // Nuevo estado para el mapa de clientes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'delete' o 'avanzarEstado'
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  // Función para cargar los pedidos
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidosService.getAll();
      setPedidos(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar pedidos.');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar los clientes y crear el mapa
  const fetchClientes = async () => {
    try {
      const data = await clientesService.getAll();
      const map = data.reduce((acc, cliente) => {
        acc[cliente.id] = cliente;
        return acc;
      }, {});
      setClientesMap(map);
    } catch (err) {
      console.error("Error al cargar clientes para lookup:", err);
      // Opcional: setError('Error al cargar datos de clientes.');
    }
  };

  // Cargar pedidos y clientes al inicio
  useEffect(() => {
    fetchPedidos();
    fetchClientes();
  }, []);

  const handleFormSubmit = async (pedidoData) => {
    try {
      if (pedidoData.id && pedidoData.id !== 0) { // Es una actualización
        await pedidosService.update(pedidoData.id, pedidoData);
        setMessage('Pedido actualizado exitosamente!');
      } else { // Es una creación
        await pedidosService.create(pedidoData);
        setMessage('Pedido creado exitosamente!');
      }
      setShowForm(false);
      setEditingPedido(null);
      fetchPedidos(); // Recargar pedidos para ver los cambios
      fetchClientes(); // Recargar clientes si se pudiera haber añadido uno nuevo
    } catch (err) {
      setMessage(`Error: ${err.message || 'Ocurrió un error al guardar el pedido.'}`);
      console.error("Error al guardar pedido:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (pedido) => {
    setEditingPedido(pedido);
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedPedidoId(id);
    setModalAction('delete');
    setShowModal(true);
  };

  const handleAvanzarEstadoClick = (id) => {
    setSelectedPedidoId(id);
    setModalAction('avanzarEstado');
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    setShowModal(false);
    if (modalAction === 'delete') {
      try {
        await pedidosService.remove(selectedPedidoId);
        setMessage('Pedido eliminado exitosamente!');
        fetchPedidos();
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar el pedido.'}`);
        console.error("Error al eliminar pedido:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    } else if (modalAction === 'avanzarEstado') {
      try {
        const response = await pedidosService.avanzarEstado(selectedPedidoId);
        setMessage(response.mensaje || 'Estado del pedido avanzado exitosamente!');
        fetchPedidos();
      } catch (err) {
        setMessage(`Error al avanzar estado: ${err.message || 'Ocurrió un error.'}`);
        console.error("Error al avanzar estado:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setSelectedPedidoId(null);
    setModalAction(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPedido(null);
    setMessage(null);
  };

  const formatFecha = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString(); // Formato local de fecha y hora
  };

  // Función para obtener la clase de estilo basada en el estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'En Preparacion': return 'bg-blue-100 text-blue-800';
      case 'Listo para Recoger': return 'bg-green-100 text-green-800';
      case 'En Camino': return 'bg-indigo-100 text-indigo-800';
      case 'Entregado': return 'bg-gray-100 text-gray-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h2>
        {/* Botón "Nuevo Pedido" con diseño mejorado y símbolo '+' */}
        <button
          onClick={() => setShowForm(true)}
          className="btn-nuevo-pedido" // Usamos la clase CSS personalizada
        >
          <span className="icon-plus">+</span> {/* Símbolo '+' con estilo */}
          Nuevo Pedido
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <PedidoForm
          pedidoInicial={editingPedido}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && pedidos.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">No hay pedidos registrados.</p>
      ) : (
        !showForm && (
          <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-gray-200">
            <table className="min-w-full leading-normal divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-800 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left font-bold tracking-wider">ID Pedido</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Cliente</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Fecha/Hora</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Tipo</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Estado</th>
                  <th className="py-3 px-6 text-center font-bold tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b border-gray-200 hover:bg-blue-50 transition duration-150 ease-in-out">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900">#{pedido.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {/* Buscar el nombre del cliente en el mapa */}
                      {(() => {
                        const clienteAsociado = clientesMap[pedido.id_Cliente];
                        if (clienteAsociado && clienteAsociado.persona) {
                          return `${clienteAsociado.persona.nombre || ''} ${clienteAsociado.persona.apellido || ''}`.trim();
                        }
                        return `Cliente ID: ${pedido.id_Cliente || 'N/A'}`;
                      })()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatFecha(pedido.fechaHora)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {pedido.tipo}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`px-3 py-1 text-xs font-bold leading-tight rounded-full ${getEstadoClass(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(pedido)}
                          className="w-9 h-9 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 flex items-center justify-center transition duration-200 transform hover:scale-110 shadow-md"
                          title="Editar"
                        >
                          <span className="text-lg">✏️</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(pedido.id)}
                          className="w-9 h-9 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition duration-200 transform hover:scale-110 shadow-md"
                          title="Eliminar"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                        {(pedido.estado !== 'Entregado' && pedido.estado !== 'Cancelado') && (
                          <button
                            onClick={() => handleAvanzarEstadoClick(pedido.id)}
                            className="w-9 h-9 rounded-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center transition duration-200 transform hover:scale-110 shadow-md"
                            title="Avanzar Estado"
                          >
                            <span className="text-lg">➡️</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {showModal && modalAction === 'delete' && (
        <ConfirmationModal
          message="¿Estás seguro de que quieres eliminar este pedido?"
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
      {showModal && modalAction === 'avanzarEstado' && (
        <ConfirmationModal
          message="¿Estás seguro de que quieres avanzar el estado de este pedido?"
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  );
}

export default PedidosPage;
