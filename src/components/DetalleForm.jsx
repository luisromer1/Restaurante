// src/components/DetalleForm.jsx
import React, { useState, useEffect } from 'react';
import './DetalleForm.css'; // Crearemos este CSS
import pedidosService from '../services/pedidosService'; // Para obtener pedidos
import productosService from '../services/productosService'; // Para obtener productos

function DetalleForm({ detalleInicial = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: detalleInicial?.id || 0,
    cantidad: detalleInicial?.cantidad || '',
    total: detalleInicial?.total || '',
    id_Pedido: detalleInicial?.id_Pedido || '',
    id_Producto: detalleInicial?.id_Producto || '',
  });

  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loadingDependencies, setLoadingDependencies] = useState(true);
  const [errorDependencies, setErrorDependencies] = useState(null);

  // Cargar pedidos y productos al montar el componente
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setLoadingDependencies(true);
        const pedidosData = await pedidosService.getAll();
        setPedidos(pedidosData);

        const productosData = await productosService.getAll();
        setProductos(productosData);

      } catch (err) {
        setErrorDependencies('Error al cargar dependencias (pedidos/productos) para el formulario.');
        console.error("Error cargando dependencias:", err);
      } finally {
        setLoadingDependencies(false);
      }
    };
    fetchDependencies();
  }, []);

  // Actualizar formData si detalleInicial cambia (para edición)
  useEffect(() => {
    if (detalleInicial) {
      setFormData({
        id: detalleInicial.id,
        cantidad: detalleInicial.cantidad,
        total: detalleInicial.total,
        id_Pedido: detalleInicial.id_Pedido,
        id_Producto: detalleInicial.id_Producto,
      });
    } else {
      setFormData({
        id: 0,
        cantidad: '',
        total: '',
        id_Pedido: '',
        id_Producto: '',
      });
    }
  }, [detalleInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Asegurarse de que Cantidad, Total, Id_Pedido e Id_Producto sean del tipo correcto
    const dataToSend = {
      ...formData,
      cantidad: parseInt(formData.cantidad, 10),
      total: parseFloat(formData.total),
      id_Pedido: parseInt(formData.id_Pedido, 10),
      id_Producto: parseInt(formData.id_Producto, 10),
    };

    onSubmit(dataToSend);
  };

  if (loadingDependencies) {
    return <div className="detalle-form-container">Cargando datos para el formulario...</div>;
  }

  if (errorDependencies) {
    return <div className="detalle-form-container error">{errorDependencies}</div>;
  }

  return (
    <div className="detalle-form-container">
      <h3>{detalleInicial ? 'Editar Detalle de Pedido' : 'Agregar Detalle de Pedido'}</h3>
      <form onSubmit={handleSubmit} className="detalle-form">
        <div className="form-group">
          <label htmlFor="id_Pedido">Pedido:</label>
          <select
            id="id_Pedido"
            name="id_Pedido"
            value={formData.id_Pedido}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">Seleccione un pedido</option>
            {pedidos.map(pedido => (
              // Asume que un pedido tiene un ID y una FechaHora para mostrar
              <option key={pedido.id} value={pedido.id}>
                Pedido ID: {pedido.id} - Fecha: {new Date(pedido.fechaHora).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="id_Producto">Producto:</label>
          <select
            id="id_Producto"
            name="id_Producto"
            value={formData.id_Producto}
            onChange={handleChange}
            required
            className="select-input"
          >
            <option value="">Seleccione un producto</option>
            {productos.map(producto => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre} - ${producto.precio}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
            min="1"
            placeholder="Ej: 2"
          />
        </div>
        <div className="form-group">
          <label htmlFor="total">Total por Ítem:</label>
          <input
            type="number"
            id="total"
            name="total"
            value={formData.total}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            placeholder="Ej: 25.50"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {detalleInicial ? 'Actualizar Detalle' : 'Guardar Detalle'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default DetalleForm;