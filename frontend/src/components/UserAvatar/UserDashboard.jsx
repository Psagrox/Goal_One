import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css'; // Estilos para la página

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleFavoritesClick = () => {
    navigate('/favorites'); // Redirige a la página de favoritos
  };

  const handleReservationsClick = () => {
    navigate('/reservations'); // Redirige a la página de historial de reservas
  };

  return (
    <div className="user-dashboard">
      <h1>Mi Cuenta</h1>
      <div className="dashboard-options">
        <button onClick={handleFavoritesClick} className="dashboard-button">
          Mis Favoritos
        </button>
        <button onClick={handleReservationsClick} className="dashboard-button">
          Historial de Reservas
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;