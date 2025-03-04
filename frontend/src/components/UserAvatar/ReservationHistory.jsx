import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReservationHistory.css';

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken(token);

    try {
      const response = await fetch(`http://localhost:8080/api/reservations/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las reservas');
      }

      const data = await response.json();
      setReservations(data);
      console.log("Reservas actualizadas:", data); // Verifica que los datos se están actualizando
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      console.log("Reserva completa");
    }
  };

  const completeReservation = async (id) => {
    console.log("Marcando como completa la reserva con ID:", id); // Log antes de la llamada
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8080/api/reservations/${id}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("Respuesta del servidor:", response.status); // Log del estado de la respuesta

      if (!response.ok) {
        throw new Error('Error al completar la reserva');
      }

      await fetchReservations();
      console.log('Después de recargar las reservas');
    } catch (err) {
      console.error(err.message); // Log de error
      alert(err.message);
    }
  };


  const deleteReservation = async (id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al eliminar la reserva');
        }

        fetchReservations(); // Actualiza la lista después de eliminar
    } catch (err) {
        alert(err.message);
    }
};

  function getUserIdFromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  }

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="reservation-history">
      <h1>Historial de Reservas</h1>
      <button onClick={() => navigate('/user-dashboard')} className="back-button">
        Volver al Dashboard
      </button>
      <div className="reservations-list">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="reservation-item">
            <p>Fecha: {new Date(reservation.reservationDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</p>
            <p>Producto: {reservation.product.name}</p>
            <p>Estado: {reservation.completed ? 'Completada' : 'Pendiente'}</p>

            {!reservation.completed && (
              <button onClick={() => completeReservation(reservation.id)} className="complete-button">
                Marcar como Completada
              </button>
            )}

            <button onClick={() => deleteReservation(reservation.id)} className="delete-button">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationHistory;
