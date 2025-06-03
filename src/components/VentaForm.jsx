import React, { useState, useEffect } from 'react';
import ventasService from '../services/ventasService';
// Eliminado: No se importa pedidosService aquí para la lógica de cálculo/validación
import './VentaForm.css'; // Estilos para el formulario

function VentaForm({ ventaInicial = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: ventaInicial?.id || 0,
    fecha: ventaInicial?.fecha ? new Date(ventaInicial.fecha).toISOString().substring(0, 10) : '',
    totalVenta: ventaInicial?.totalVenta || '',
    pedidosTotales: ventaInicial?.pedidosTotales || '',
  });
  const [loadingCalculation, setLoadingCalculation] = useState(false);
  const [calculationError, setCalculationError] = useState(null);
  // Eliminado: formMessage ya no es necesario

  // Cuando ventaInicial cambia (para edición), actualiza el formulario
  useEffect(() => {
    if (ventaInicial) {
      setFormData({
        id: ventaInicial.id,
        fecha: ventaInicial.fecha ? new Date(ventaInicial.fecha).toISOString().substring(0, 10) : '',
        totalVenta: ventaInicial.totalVenta,
        pedidosTotales: ventaInicial.pedidosTotales,
      });
    } else {
      // Si no hay venta inicial (es una nueva), resetea el formulario
      setFormData({
        id: 0,
        fecha: '',
        totalVenta: '',
        pedidosTotales: '',
      });
    }
    setCalculationError(null); // Limpiar errores de cálculo al cambiar de modo
  }, [ventaInicial]);

  // Manejar cambio en la fecha y calcular valores (lógica simplificada)
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      fecha: newDate,
      totalVenta: '', // Limpiar campos mientras se recalculan
      pedidosTotales: '',
    }));
    setCalculationError(null);

    if (newDate) {
      setLoadingCalculation(true);
      try {
        // Se asume que ventasService.calculateByDate devuelve los totales para la fecha,
        // sin importar el estado de los pedidos, según lo solicitado.
        const calculatedData = await ventasService.calculateByDate(newDate);
        setFormData(prevData => ({
          ...prevData,
          totalVenta: calculatedData.totalVenta,
          pedidosTotales: calculatedData.pedidosTotales,
        }));
      } catch (err) {
        console.error("Error al calcular ventas por fecha:", err);
        setCalculationError(err.message || 'No se pudieron calcular los totales para esta fecha.');
        setFormData(prevData => ({
          ...prevData,
          totalVenta: 0,
          pedidosTotales: 0,
        }));
      } finally {
        setLoadingCalculation(false);
      }
    }
  };

  const handleChange = (e) => { // Mantenemos handleChange como se solicitó
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Asegurarse de que Fecha, TotalVenta y PedidosTotales sean del tipo correcto
    const dataToSend = {
      ...formData,
      fecha: formData.fecha, // La fecha ya está en YYYY-MM-DD
      totalVenta: parseFloat(formData.totalVenta),
      pedidosTotales: parseInt(formData.pedidosTotales, 10),
    };

    onSubmit(dataToSend);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl mb-6 border border-gray-100">
      <h3 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-blue-500">
        {ventaInicial ? 'Editar Venta' : 'Registrar Nueva Venta'}
      </h3>

      {/* Eliminado: formMessage ya no se muestra */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="fecha" className="block text-gray-700 text-sm font-semibold mb-2">Fecha de Venta:</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleDateChange} // ¡Usar el nuevo handler!
              required
              disabled={ventaInicial !== null} // Deshabilitar edición de fecha si es una venta existente
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            />
            {loadingCalculation && <p className="loading-text text-blue-600 text-sm mt-1">Calculando...</p>}
            {calculationError && <p className="error-text text-red-600 text-sm mt-1">{calculationError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="totalVenta" className="block text-gray-700 text-sm font-semibold mb-2">Total de Venta:</label>
            <input
              type="number"
              id="totalVenta"
              name="totalVenta"
              value={formData.totalVenta}
              onChange={handleChange} // Mantenemos handleChange como se solicitó
              required
              min="0.00"
              step="0.01"
              placeholder="Calculado automáticamente"
              readOnly // Campo de solo lectura
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400 ${loadingCalculation ? 'bg-gray-100' : ''}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="pedidosTotales" className="block text-gray-700 text-sm font-semibold mb-2">Pedidos Totales:</label>
            <input
              type="number"
              id="pedidosTotales"
              name="pedidosTotales"
              value={formData.pedidosTotales}
              onChange={handleChange} // Mantenemos handleChange como se solicitó
              required
              min="0"
              placeholder="Calculado automáticamente"
              readOnly // Campo de solo lectura
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400 ${loadingCalculation ? 'bg-gray-100' : ''}`}
            />
          </div>

          {/* Eliminado: No hay select de estado */}
        </div>

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
            disabled={loadingCalculation || !formData.fecha} // Deshabilita si está calculando o no hay fecha
          >
            {ventaInicial ? 'Actualizar Venta' : 'Guardar Venta'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VentaForm;
