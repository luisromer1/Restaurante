// src/layout/Header.jsx
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
            <li><Link to="/clientes" className="nav-link">Clientes</Link></li>
            <li><Link to="/productos" className="nav-link">Productos</Link></li>
            <li><Link to="/pedidos" className="nav-link">Pedidos</Link></li>
            <li><Link to="/detalles" className="nav-link">Detalles</Link></li>
            <li><Link to="/entregas" className="nav-link">Entregas</Link></li>
            <li><Link to="/ventas" className="nav-link">Ventas</Link></li> {/* ¡Nuevo enlace! */}
            <li><Link to="/roles" className="nav-link">Roles</Link></li>
            <li><Link to="/usuarios" className="nav-link">Usuarios</Link></li>
            {/* Agrega más enlaces para otras páginas aquí */}
          </ul>
        </nav>
        {/* <div className="user-section">
          <button className="btn-login">Login</button>
        </div> */}
      </div>
    </header>
  );
}

export default Header;