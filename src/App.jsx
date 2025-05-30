// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import ClientesPage from './pages/ClientesPage';
import ProductosPage from './pages/ProductosPage';
import PedidosPage from './pages/PedidosPage';
import RolesPage from './pages/RolesPage';
import UsuariosPage from './pages/UsuariosPage';
import DetallesPage from './pages/DetallesPage';
import EntregasPage from './pages/EntregasPage';
import VentasPage from './pages/VentasPage'; // ¡Importa la nueva página!
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/detalles" element={<DetallesPage />} />
          <Route path="/entregas" element={<EntregasPage />} />
          <Route path="/ventas" element={<VentasPage />} /> {/* ¡Nueva ruta! */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;