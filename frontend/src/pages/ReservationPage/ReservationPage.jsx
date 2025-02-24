import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AvailabilityCalendar from '../../components/AvailabilityCalendar/AvailabilityCalendar.jsx';
import '../ReservationPage/ReservationPage.css';

const ReservePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDates, setSelectedDates] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);

    // Obtener los detalles del producto
    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`);
            if (!response.ok) {
                throw new Error('Producto no encontrado');
            }
            const data = await response.json();
            setProduct(data);
            setAvailableDates(data.occupiedDates); // Fechas ocupadas
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Manejar la selección de fechas en el calendario
    const handleDateSelect = (dates) => {
        setSelectedDates(dates);
    };

    // Decodificar el token JWT para obtener el userId
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el token JWT
        return decodedToken.sub; // Extraer el userId del token
    };

    // Manejar el envío de la reserva
    const handleSubmitReservation = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            alert('Usuario no autenticado');
            return;
        }
    
        // Verificar que las fechas seleccionadas estén disponibles
        const isAvailable = selectedDates.every(date => !availableDates.includes(date));
        if (!isAvailable) {
            alert('Algunas de las fechas seleccionadas no están disponibles.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/api/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    productId: id,
                    reservationDate: selectedDates[0], // Fecha de reserva
                }),
            });
    
            if (!response.ok) throw new Error('Error al crear la reserva');
    
            alert('Reserva creada exitosamente');
            navigate(`/product/${id}`); // Redirigir al detalle del producto
        } catch (err) {
            console.error(err);
            alert('Error al crear la reserva');
        }
    };
    
    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (error) return (
        <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={fetchProduct}>Reintentar</button>
        </div>
    );
    if (!product) return <div>Producto no encontrado</div>;

    return (
        <div className="reserve-page">
            <h1>Reservar {product.name}</h1>

            {/* Calendario de disponibilidad */}
            <div className="calendar-section">
                <h2>Selecciona las fechas de reserva</h2>
                <AvailabilityCalendar
                    occupiedDates={availableDates}
                    onDateSelect={handleDateSelect}
                />
            </div>

            {/* Fechas seleccionadas */}
            <div className="selected-dates">
                <h3>Fechas seleccionadas:</h3>
                {selectedDates.map((date, index) => (
                    <p key={index}>{date.toLocaleDateString()}</p>
                ))}
            </div>

            {/* Botón para confirmar la reserva */}
            <button
                onClick={handleSubmitReservation}
                disabled={selectedDates.length === 0}
                className="confirm-reservation-button"
            >
                Confirmar Reserva
            </button>
        </div>
    );
};

export default ReservePage;
