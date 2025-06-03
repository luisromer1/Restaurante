import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Asegúrate de tener un logo en src/assets/logo.png
import './Header.css';

function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo del Restaurante" className="logo" />
          <span className="app-name">Sabor y Gestión</span>
        </Link>
        <nav className="main-nav">
          <ul>
            <li><Link to="/" className="nav-link">Inicio</Link></li>
            {/* "Detalles" ahora es "Realizar Pedido" y apunta al nuevo componente */}
            <li><Link to="/realizar-pedido" className="nav-link">Realizar Pedido</Link></li>
            {/* Enlace para el menú detallado */}
            <li><Link to="/menu" className="nav-link">Menú</Link></li>
            {/* Eliminados: Clientes, Productos, Pedidos, Entregas, Ventas, Roles, Usuarios */}
          </ul>
        </nav>
        {/* Sección de usuario comentada */}
        {/* <div className="user-section">
          <button className="btn-login">Login</button>
        </div> */}
      </div>
    </header>
  );
}

export default Header;
