import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Tus imports existentes
import MainLayout from './layout/MainLayout'; // Asumo que tienes esto para tu web pública
import HomePage from './pages/HomePage';
import ClientesPage from './pages/ClientesPage';
import ProductosPage from './pages/ProductosPage';
import PedidosPage from './pages/PedidosPage';
import DetallesPage from './pages/DetallesPage'; // Tu DetallesPage existente para gestión
import EntregasPage from './pages/EntregasPage';
import VentasPage from './pages/VentasPage';
import RolesPage from './pages/RolesPage';
import UsuariosPage from './pages/UsuariosPage';
import MenuPage from './pages/MenuPage'; // Tu MenuPage existente

// Nuevo import para la página de "Realizar Pedido"
import RealizarPedidoPage from './pages/RealizarPedidoPage';

// Nuevos imports para el Admin
import AdminPage from './components/admin/AdminPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminForm from './components/admin/AdminForm';

// Importa los estilos del admin globalmente si es necesario o en AdminPage.jsx como ya se hizo
import './components/admin/AdminPage.css';


// Un componente simple para demostrar el uso de AdminForm
const ManageCustomers = () => <AdminForm formType="Customer" />;
const ManageOrders = () => <AdminForm formType="Order" />;
const ManageProducts = () => <AdminForm formType="Product" />;

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas de tu aplicación pública */}
        <Route path="/" element={<MainLayout />}> {/* Si usas un layout para la parte pública */}
          <Route index element={<HomePage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="pedidos" element={<PedidosPage />} />
          <Route path="detalles" element={<DetallesPage />} /> {/* Tu DetallesPage existente para gestión */}
          <Route path="entregas" element={<EntregasPage />} />
          <Route path="ventas" element={<VentasPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="menu" element={<MenuPage />} /> {/* Tu MenuPage existente */}
          {/* Nueva ruta para el flujo de "Realizar Pedido" con registro de cliente */}
          <Route path="realizar-pedido" element={<RealizarPedidoPage />} />
          {/* ... otras rutas públicas */}
        </Route>

        {/* Rutas del Panel de Administración */}
        <Route path="/admin" element={<AdminPage />}> {/* AdminPage es el layout */}
          <Route index element={<AdminDashboard />} /> {/* Ruta por defecto para /admin */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="subscriptions" element={<AdminDashboard />} /> {/* Reutilizando para el ejemplo */}
          <Route path="pedidos" element={<PedidosPage />} />      {/* Asocia la ruta con tu componente PedidosPage */}
          <Route path="productos" element={<ProductosPage />} />  {/* Asocia la ruta con tu componente ProductosPage */}
          <Route path="usuarios" element={<UsuariosPage />} />

          <Route path="clientes" element={<ClientesPage />} />  {/* Asocia la ruta con tu componente UsuariosPage */}
          <Route path="ventas" element={<VentasPage />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="crm" element={<div>Contenido CRM Aquí</div>} />
          <Route path="projects" element={<div>Contenido Proyectos Aquí</div>} />
          {/* ... etc. */}
        </Route>

        {/* Puedes tener una ruta de Not Found */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
