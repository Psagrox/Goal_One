import React from 'react';
import './AdminPanel.css'; 

const AdminPanel = () => {
  // Función para detectar si el usuario está en un dispositivo móvil
  const isMobile = () => {
    return window.innerWidth <= 768; // Consideramos móvil si el ancho es menor o igual a 768px
  };

  // Si es un dispositivo móvil, mostrar un mensaje
  if (isMobile()) {
    return (
      <div className="mobile-message">
        <h2>Acceso no disponible</h2>
        <p>El panel de administración no está disponible en dispositivos móviles.</p>
      </div>
    );
  }

  // Si no es un dispositivo móvil, mostrar el panel de administración
  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <nav className="admin-menu">
        <ul>
          <li>
            <a href="/admin/add-product">Agregar Producto</a>
          </li>
          <li>
            <a href="/admin/product-list">Lista de Productos</a> 
          </li>
          <li>
            <a href="/admin/edit-products">Editar Productos</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminPanel;