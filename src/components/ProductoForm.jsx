import React, { useState, useEffect } from 'react';
import './ProductoForm.css';

function ProductoForm({ productoInicial, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [tipo, setTipo] = useState(''); // Este campo ahora manejará la categoría

  // Estado para el mensaje de error del formulario
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    if (productoInicial) {
      setNombre(productoInicial.nombre || '');
      setPrecio(productoInicial.precio || '');
      setStock(productoInicial.stock || '');
      setTipo(productoInicial.tipo || ''); // Asume que 'tipo' del backend ya contiene la categoría
    } else {
      setNombre('');
      setPrecio('');
      setStock('');
      setTipo('');
    }
  }, [productoInicial]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!nombre || !precio || !stock || !tipo) {
      setFormMessage('Por favor, completa todos los campos.');
      setTimeout(() => setFormMessage(null), 3000); // Borrar mensaje después de 3 segundos
      return;
    }

    onSubmit({
      id: productoInicial?.id,
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock, 10),
      tipo, // 'tipo' ahora enviará la categoría al backend
    });
  };

  return (
    <div className="producto-form-container mx-auto max-w-2xl"> {/* Contenedor con estilos de CSS y centrado */}
      <h3 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-blue-500 text-center"> {/* Título más grande y con borde, centrado */}
        {productoInicial ? 'Editar Producto' : 'Agregar Producto'}
      </h3>

      {formMessage && (
        <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700 text-center font-medium"> {/* Mensaje centrado y con mejor estilo */}
          {formMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="nombre" className="block text-sm font-semibold mb-2">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del producto"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio" className="block text-sm font-semibold mb-2">Precio:</label>
            <input
              type="number"
              id="precio"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Precio en USD"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="stock" className="block text-sm font-semibold mb-2">Stock:</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Cantidad en stock"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
            />
          </div>

          {/* Campo 'Tipo' ahora como select para la categoría */}
          <div className="form-group">
            <label htmlFor="tipo" className="block text-sm font-semibold mb-2">Categoría (Tipo):</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base appearance-none bg-white pr-8"
            >
              <option value="">Selecciona una categoría</option>
              <option value="Comida">Comida</option>
              <option value="Postre">Postre</option>
              <option value="Bebidas">Bebidas</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="btn-form-cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-form-submit"
          >
            {productoInicial ? 'Guardar Cambios' : 'Agregar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductoForm;
