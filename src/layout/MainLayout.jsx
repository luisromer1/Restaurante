// src/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // <--- ¡Importa Outlet aquí!
import Header from './Header'; // Importamos el Header
import Footer from './Footer'; // Importamos el Footer
import './MainLayout.css'; // Estilos para el layout principal

function MainLayout() { // <--- Ya no necesitas la prop 'children'
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet /> {/* <--- ¡Aquí está el cambio clave! */}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;