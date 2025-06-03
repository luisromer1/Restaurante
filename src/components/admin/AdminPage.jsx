// src/pages/AdminPage.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AdminPage.css'; // Asegúrate de importar los estilos

// Placeholders para iconos si no usas Font Awesome
const Icon = ({ i }) => <span style={{ marginRight: '10px' }}>{i}</span>;

function AdminPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation(); // Para marcar el link activo

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' }, // Mantenemos un dashboard general
    { path: '/admin/pedidos', label: 'Pedidos', icon: '📦' }, // Nueva ruta para Pedidos
    { path: '/admin/productos', label: 'Productos', icon: '🍎' }, // Nueva ruta para Productos
    { path: '/admin/usuarios', label: 'Usuarios', icon: '👤' }, // Nueva ruta para Usuarios
    { path: '/admin/clientes', label: 'Clientes', icon: '👥' }, // Nueva ruta para Clientes
    { path: '/admin/ventas', label: 'Ventas', icon: '📈' }, // Nueva ruta para Ventas
    // Puedes eliminar o añadir otras rutas según necesites.
    // Ejemplos de las rutas anteriores si quieres mantener algunas:
    // { path: '/admin/detalles', label: 'Detalles', icon: '📄' }, // Si quieres una sección de detalles
    // { path: '/admin/entregas', label: 'Entregas', icon: '🚚' }, // Si quieres una sección de entregas
  ];

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-logo">
            {isSidebarCollapsed ? 'S' : <span className="logo-text">SeVen</span>}
          </Link>
        </div>
        <nav>
          <ul className="sidebar-nav">
            {navItems.map(item => (
              <li key={item.path} className="sidebar-nav-item">
                <Link
                  to={item.path}
                  className={`sidebar-nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                >
                  <Icon i={item.icon} />
                  {!isSidebarCollapsed && <span className="nav-text">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <Icon i="⚙️" />
          <Icon i="❓" />
          <Icon i="🚪" />
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button onClick={toggleSidebar} className="menu-toggle-btn">
              ☰
            </button>
            {/* Puedes hacer que este título sea dinámico según la ruta actual */}
            <h1 className="header-title">
                {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Panel de Administración'}
            </h1>
          </div>
          <div className="header-right">
            <input type="search" placeholder="Search" className="search-bar" />
            <div className="header-icons">
              <span className="header-icon">🛒</span>
              <span className="header-icon">🔔<span className="badge">6</span></span>
              <span className="header-icon">⚠️</span>
            </div>
            <div className="user-profile">
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">Noble Moss</span>
                <span className="user-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet /> {/* Aquí se renderizarán las rutas anidadas */}
        </div>

        <footer className="page-footer">
          © Bootstrap Gallery 2024
        </footer>
      </main>
    </div>
  );
}

export default AdminPage;
