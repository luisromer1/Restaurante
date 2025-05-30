// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
// Puedes importar imágenes aquí si las tienes en src/assets
import heroBg from '../assets/hero-bg.jpg'; // Imagen de fondo para el héroe
import dish1 from '../assets/dish1.jpg'; // Imagen de un plato
import dish2 from '../assets/dish2.jpg'; // Otra imagen de un plato

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">¡Bienvenidos a Sabor y Gestión!</h1>
          <p className="hero-subtitle">
            Administra tu restaurante con facilidad. Desde pedidos hasta clientes,
            todo en un solo lugar.
          </p>
          <div className="hero-buttons">
            <Link to="/pedidos" className="btn-primary">Ver Pedidos</Link>
            <Link to="/clientes" className="btn-secondary">Gestionar Clientes</Link>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-title">Sobre Nosotros</h2>
        <p className="section-description">
          Sabor y Gestión es la solución integral para restaurantes que buscan optimizar
          sus operaciones diarias. Con nuestra plataforma intuitiva, puedes manejar
          reservas, inventario, pedidos y mucho más, permitiéndote enfocarte en
          lo más importante: ¡la experiencia de tus comensales!
        </p>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Gestión de Pedidos</h3>
            <p>Controla cada pedido desde la cocina hasta la entrega.</p>
          </div>
          <div className="feature-item">
            <h3>Administración de Clientes</h3>
            <p>Mantén un registro detallado de tus clientes y sus preferencias.</p>
          </div>
          <div className="feature-item">
            <h3>Inventario de Productos</h3>
            <p>Monitorea tu stock en tiempo real y evita faltantes.</p>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <h2 className="section-title">Nuestros Platos Estrellas</h2>
        <div className="gallery-grid">
          <div className="gallery-item">
            <img src={dish1} alt="Plato delicioso 1" className="gallery-img" />
            <p className="gallery-caption">Plato del Día</p>
          </div>
          <div className="gallery-item">
            <img src={dish2} alt="Plato delicioso 2" className="gallery-img" />
            <p className="gallery-caption">Especial del Chef</p>
          </div>
          {/* Añade más imágenes si tienes */}
        </div>
      </section>

      <section className="cta-section">
        <h2 className="section-title">¿Listo para transformar tu restaurante?</h2>
        <Link to="/contact" className="btn-primary-lg">Contáctanos Hoy</Link>
      </section>
    </div>
  );
}

export default HomePage;