import React, { useState, useEffect } from 'react';
import ventasService from '../services/ventasService';
// Eliminamos la importación de pedidosService ya que no se usará
import VentaForm from '../components/VentaForm';
import './VentasPage.css'; // Estilos específicos de esta página

// Componente Modal simple para confirmaciones (se mantiene si se usa window.confirm, pero no se utiliza directamente aquí)
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

function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [message, setMessage] = useState(null);
  // Eliminado: showModal y selectedVentaId, ya que se usará window.confirm

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const data = await ventasService.getAll();
      setVentas(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar ventas.');
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const handleFormSubmit = async (ventaData) => {
    try {
      if (ventaData.id) { // Es una actualización
        await ventasService.update(ventaData.id, ventaData);
        setMessage('Venta actualizada exitosamente!');
      } else { // Es una creación
        await ventasService.create(ventaData);
        setMessage('Venta registrada exitosamente!');
      }
      setShowForm(false);
      setEditingVenta(null);
      fetchVentas(); // Recargar la lista
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || err.message || 'Ocurrió un error al guardar la venta.'}`);
      console.error("Error al guardar venta:", err);
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (venta) => {
    setEditingVenta(venta);
    setShowForm(true);
  };

  const handleDelete = async (id) => { // Se mantiene la lógica con window.confirm
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      try {
        await ventasService.remove(id);
        setMessage('Venta eliminada exitosamente!');
        fetchVentas(); // Recargar la lista
      } catch (err) {
        setMessage(`Error: ${err.message || 'Ocurrió un error al eliminar la venta.'}`);
        console.error("Error al eliminar venta:", err);
      } finally {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleCancelForm = () => { // Renombrado de handleCancel
    setShowForm(false);
    setEditingVenta(null); // Limpiar cualquier venta que se estuviera editando
    setMessage(null);
  };

  // Función para formatear fechas (solo la parte de la fecha)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Eliminado: getEstadoClass ya no es necesaria si no se muestra el estado

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Cargando ventas...</p>
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
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Ventas</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingVenta(null); // Asegúrate de que no haya venta en edición al abrir el formulario para crear
          }}
          className="btn-nueva-venta" // Clase CSS personalizada para el botón de venta
        >
          <span className="icon-plus">+</span> {/* Símbolo '+' con estilo */}
          Registrar Nueva Venta
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <VentaForm
          ventaInicial={editingVenta}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && ventas.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">No hay ventas registradas.</p>
      ) : (
        !showForm && (
          <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-gray-200">
            <table className="min-w-full leading-normal divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-800 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left font-bold tracking-wider">ID Venta</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Fecha</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Total Venta</th>
                  <th className="py-3 px-6 text-left font-bold tracking-wider">Pedidos Totales</th>
                  {/* Eliminado: No se muestra la columna de estado */}
                  <th className="py-3 px-6 text-center font-bold tracking-wider min-w-36">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                {ventas.map((venta) => (
                  <tr key={venta.id} className="border-b border-gray-200 hover:bg-blue-50 transition duration-150 ease-in-out">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900">#{venta.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(venta.fecha)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      ${venta.totalVenta?.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {venta.pedidosTotales}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(venta)}
                          className="w-9 h-9 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 flex items-center justify-center transition duration-200 transform hover:scale-110 shadow-md"
                          title="Editar"
                        >
                          <span className="text-lg">✏️</span>
                        </button>
                        <button
                          onClick={() => handleDelete(venta.id)} // Usando handleDelete directamente
                          className="w-9 h-9 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition duration-200 transform hover:scale-110 shadow-md"
                          title="Eliminar"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Eliminado: ConfirmationModal ya no se renderiza si se usa window.confirm */}
    </div>
  );
}

export default VentasPage;
