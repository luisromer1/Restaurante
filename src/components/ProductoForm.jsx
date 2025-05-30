// src/components/ProductoForm.jsx
import React, { useState, useEffect } from 'react';
import './ProductoForm.css'; // Estilos para el formulario de producto

function ProductoForm({ productoInicial = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: productoInicial?.id || 0,
    nombre: productoInicial?.nombre || '',
    precio: productoInicial?.precio || '',
    stock: productoInicial?.stock || '',
  });

  useEffect(() => {
    if (productoInicial) {
      setFormData({
        id: productoInicial.id,
        nombre: productoInicial.nombre,
        precio: productoInicial.precio,
        stock: productoInicial.stock,
      });
    } else {
      setFormData({
        id: 0,
        nombre: '',
        precio: '',
        stock: '',
      });
    }
  }, [productoInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir precio y stock a números si es necesario para tu backend
    const dataToSend = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
    };
    onSubmit(dataToSend);
  };

  return (
    <div className="producto-form-container">
      <h3>{productoInicial ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
      <form onSubmit={handleSubmit} className="producto-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            step="0.01" // Permite valores decimales
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {productoInicial ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductoForm;