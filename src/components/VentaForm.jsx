// src/components/VentaForm.jsx
import React, { useState, useEffect } from 'react';
import ventasService from '../services/ventasService'; // Necesitamos el servicio de ventas
import './VentaForm.css';

function VentaForm({ ventaInicial = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: ventaInicial?.id || 0,
    fecha: ventaInicial?.fecha ? new Date(ventaInicial.fecha).toISOString().substring(0, 10) : '',
    totalVenta: ventaInicial?.totalVenta || '',
    pedidosTotales: ventaInicial?.pedidosTotales || '',
  });
  const [loadingCalculation, setLoadingCalculation] = useState(false);
  const [calculationError, setCalculationError] = useState(null);

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

  // Manejar cambio en la fecha y calcular valores
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
        const calculatedData = await ventasService.calculateByDate(newDate);
        setFormData(prevData => ({
          ...prevData,
          totalVenta: calculatedData.totalVenta,
          pedidosTotales: calculatedData.pedidosTotales,
        }));
      } catch (err) {
        console.error("Error al calcular ventas por fecha:", err);
        setCalculationError(err.message || 'No se pudieron calcular los totales para esta fecha. Puede que no haya pedidos.');
        // Opcional: Si no hay pedidos, podrías resetear los campos a 0 o vacíos
        setFormData(prevData => ({
          ...prevData,
          totalVenta: 0, // O '' si prefieres que se vea vacío
          pedidosTotales: 0, // O ''
        }));
      } finally {
        setLoadingCalculation(false);
      }
    }
  };

  const handleChange = (e) => {
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
    <div className="venta-form-container">
      <h3>{ventaInicial ? 'Editar Venta' : 'Registrar Nueva Venta'}</h3>
      <form onSubmit={handleSubmit} className="venta-form">
        <div className="form-group">
          <label htmlFor="fecha">Fecha de Venta:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleDateChange} // ¡Usar el nuevo handler!
            required
            disabled={ventaInicial !== null} // Deshabilitar edición de fecha si es una venta existente
          />
          {loadingCalculation && <p className="loading-text">Calculando...</p>}
          {calculationError && <p className="error-text">{calculationError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="totalVenta">Total de Venta:</label>
          <input
            type="number"
            id="totalVenta"
            name="totalVenta"
            value={formData.totalVenta}
            onChange={handleChange}
            required
            min="0.00"
            step="0.01"
            placeholder="Calculado automáticamente"
            readOnly // Campo de solo lectura
            className={loadingCalculation ? 'loading-input' : ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pedidosTotales">Pedidos Totales:</label>
          <input
            type="number"
            id="pedidosTotales"
            name="pedidosTotales"
            value={formData.pedidosTotales}
            onChange={handleChange}
            required
            min="0"
            placeholder="Calculado automáticamente"
            readOnly // Campo de solo lectura
            className={loadingCalculation ? 'loading-input' : ''}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loadingCalculation || !formData.fecha}>
            {ventaInicial ? 'Actualizar Venta' : 'Guardar Venta'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default VentaForm;