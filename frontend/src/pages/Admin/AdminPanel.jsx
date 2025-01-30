import React from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <Link to="/admin/add-product" className="admin-button">
        Agregar Cancha
      </Link>
    </div>
  );
};

export default AdminPanel;