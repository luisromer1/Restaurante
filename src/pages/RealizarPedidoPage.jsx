import React, { useState, useEffect } from 'react';
import productosService from '../services/productosService'; // Para obtener los productos del menú
import pedidosService from '../services/pedidosService'; // Para enviar el pedido
import clientesService from '../services/clientesService'; // Tu servicio de clientes existente
import CustomerOrderForm from '../components/CustomerOrderForm'; // Importa el nuevo componente de cliente
import './RealizarPedidoPage.css'; // Estilos específicos para esta página (crearemos uno nuevo)

function RealizarPedidoPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Comida'); // Categoría por defecto
  const [orderItems, setOrderItems] = useState({}); // { productId: quantity }
  const [totalPedido, setTotalPedido] = useState(0);
  const [message, setMessage] = useState(null); // Mensajes de éxito/error para el pedido
  const [customerId, setCustomerId] = useState(null); // Estado para el ID del cliente

  // Cargar productos al inicio
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await productosService.getAll();
        setProductos(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar los productos del menú.');
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Calcular el total del pedido cada vez que orderItems cambia
  useEffect(() => {
    let currentTotal = 0;
    Object.entries(orderItems).forEach(([productId, quantity]) => {
      const product = productos.find(p => p.id === parseInt(productId));
      if (product) {
        currentTotal += product.precio * quantity;
      }
    });
    setTotalPedido(currentTotal);
  }, [orderItems, productos]);

  const handleQuantityChange = (productId, change) => {
    setOrderItems(prevItems => {
      const newQuantity = (prevItems[productId] || 0) + change;
      if (newQuantity < 0) return prevItems; // No permitir cantidades negativas

      const newItems = { ...prevItems };
      if (newQuantity === 0) {
        delete newItems[productId]; // Eliminar si la cantidad llega a cero
      } else {
        newItems[productId] = newQuantity;
      }
      return newItems;
    });
  };

  const filteredProducts = productos.filter(
    (producto) => producto.tipo === selectedCategory
  );

  const handleConfirmPedido = async () => {
    if (!customerId) {
      setMessage({ type: 'error', text: 'Por favor, complete los datos del cliente primero.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (Object.keys(orderItems).length === 0) {
      setMessage({ type: 'error', text: 'El pedido está vacío. Agregue productos antes de confirmar.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Preparar los datos del pedido para enviar al backend
    const pedidoData = {
      fechaHora: new Date().toISOString(),
      tipo: 'Online', // O 'Presencial', según la lógica de tu app
      estado: 'Pendiente', // El estado inicial del pedido
      id_Cliente: customerId, // ¡Usamos el ID del cliente obtenido!
      // Detalles de los productos en el pedido (ajusta esto a la estructura que tu backend espera)
      productos: Object.entries(orderItems).map(([productId, quantity]) => ({
        id_Producto: parseInt(productId),
        cantidad: quantity,
        // Puedes añadir precio unitario aquí si el backend lo necesita en el detalle
      })),
      total: totalPedido // Incluir el total calculado
    };

    try {
      // Asumiendo que tu servicio de pedidos tiene un método 'create'
      const response = await pedidosService.create(pedidoData);
      console.log("Pedido confirmado exitosamente:", response);
      setMessage({ type: 'success', text: '¡Pedido confirmado exitosamente!' });
      setOrderItems({}); // Limpiar el pedido después de confirmar
      setTotalPedido(0);
      setCustomerId(null); // Reiniciar el cliente para un nuevo pedido
    } catch (err) {
      console.error("Error al confirmar el pedido:", err);
      setMessage({ type: 'error', text: err.message || 'Error al confirmar el pedido. Intente de nuevo.' });
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleCancelPedido = () => {
    setOrderItems({});
    setTotalPedido(0);
    setCustomerId(null); // También limpiar el cliente
    setMessage({ type: 'info', text: 'Pedido cancelado.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCustomerSelected = (id) => {
    setCustomerId(id);
    setMessage({ type: 'success', text: 'Datos del cliente guardados. ¡Ahora selecciona tus productos!' });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="realizar-pedido-loading">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="realizar-pedido-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="realizar-pedido-container">
      <h2 className="realizar-pedido-title">Realizar Pedido</h2>

      {message && (
        <div className={`realizar-pedido-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {!customerId ? (
        // Muestra el formulario de cliente si no hay un customerId
        <CustomerOrderForm
          onCustomerSelected={handleCustomerSelected}
          onCancel={handleCancelPedido} // Permite cancelar y volver al inicio
          clientesService={clientesService} // Pasa clientesService como prop
        />
      ) : (
        // Muestra la selección de productos una vez que el cliente ha sido seleccionado
        <>
          <p className="text-lg text-gray-700 mb-6">Cliente actual: <span className="font-semibold">ID {customerId}</span></p>
          <div className="category-tabs">
            <button
              className={`category-button ${selectedCategory === 'Comida' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Comida')}
            >
              Comida
            </button>
            <button
              className={`category-button ${selectedCategory === 'Bebidas' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Bebidas')}
            >
              Bebidas
            </button>
            <button
              className={`category-button ${selectedCategory === 'Postre' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Postre')}
            >
              Postres
            </button>
          </div>

          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <p className="no-products-message">No hay productos en esta categoría.</p>
            ) : (
              filteredProducts.map((producto) => (
                <div key={producto.id} className="product-card">
                  <h3 className="product-name">{producto.nombre}</h3>
                  <p className="product-price">Precio: ${producto.precio?.toFixed(2)} Bs.</p>
                  <div className="quantity-control">
                    <button
                      onClick={() => handleQuantityChange(producto.id, -1)}
                      className="quantity-button minus"
                      disabled={(orderItems[producto.id] || 0) === 0}
                    >
                      -
                    </button>
                    <span className="quantity-display">
                      {orderItems[producto.id] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(producto.id, 1)}
                      className="quantity-button plus"
                      disabled={producto.stock !== undefined && (orderItems[producto.id] || 0) >= producto.stock} // Deshabilitar si no hay stock
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="order-summary">
            <p className="total-display">Total: ${totalPedido.toFixed(2)} Bs.</p>
            <div className="order-actions">
              <button onClick={handleConfirmPedido} className="confirm-button">
                Confirmar Pedido
              </button>
              <button onClick={handleCancelPedido} className="cancel-button">
                Cancelar Pedido
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RealizarPedidoPage;
