// src/layout/MainLayout.jsx
import React from 'react';
import Header from './Header'; // Importamos el Header
import Footer from './Footer'; // Importamos el Footer
import './MainLayout.css'; // Estilos para el layout principal

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        {children} {/* Aquí se renderizarán los componentes de tus páginas */}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;