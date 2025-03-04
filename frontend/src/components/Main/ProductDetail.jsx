import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';
import AvailabilityCalendar from '../AvailabilityCalendar/AvailabilityCalendar.jsx';
import SharePopup from '../SharePopup/SharePopup.jsx';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';


const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false); // Estado para controlar la ventana emergente
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]); // Para almacenar las reseñas
    const [averageRating, setAverageRating] = useState(0); // Para almacenar la puntuación media
    const [reviewCount, setReviewCount] = useState(0); // Para almacenar el número de reseñas
    const [userRating, setUserRating] = useState(0); // Para almacenar la puntuación del usuario
    const [userComment, setUserComment] = useState(""); // Para almacenar el comentario del usuario
    const [userHasReservation, setUserHasReservation] = useState(false); // Para verificar si el usuario tiene una reserva
    const [hoverRating, setHoverRating] = useState(0); // Estado para manejar el hover
    const [selectedDate, setSelectedDate] = useState(null); // Estado para almacenar la fecha seleccionada

    const handleDateSelect = (date) => {
        setSelectedDate(date); // Almacena la fecha seleccionada en el estado
        console.log("Fecha seleccionada:", date);
    };


    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    // Token inválido o expirado, redirigir al login
                    localStorage.removeItem('token');
                    navigate('/login', {
                        state: {
                            message: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
                        },
                    });
                } else {
                    throw new Error('Producto no encontrado');
                }
            }
            const data = await response.json();
            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token JWT
            const response = await fetch(`http://localhost:8080/api/reviews/product/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluir el token en el header
                },
            });
            if (!response.ok) throw new Error('Error al obtener reseñas');
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAverageRating = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/reviews/product/${id}/average-rating`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Error al obtener la puntuación media');
            const data = await response.json();
            setAverageRating(data || 0); // Asignar 0 si data es undefined o null
        } catch (err) {
            console.error(err);
            setAverageRating(0); // Asignar 0 en caso de error
        }
    };

    const fetchReviewCount = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token JWT
            const response = await fetch(`http://localhost:8080/api/reviews/product/${id}/review-count`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluir el token en el header
                },
            });
            if (!response.ok) throw new Error('Error al obtener el número de reseñas');
            const data = await response.json();
            setReviewCount(data);
        } catch (err) {
            console.error(err);
        }
    };
    const checkIfUserHasReservation = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = 1; // Obtener el ID del usuario autenticado dinámicamente
            const response = await fetch(`http://localhost:8080/api/reservations/user/${userId}/product/${id}/completed`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al verificar reservas');
            }

            const hasReservation = await response.json();
            setUserHasReservation(hasReservation);
        } catch (err) {
            console.error(err);
        }
    };


    const checkIfFavorite = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = 1; // Aquí deberías obtener el ID del usuario autenticado
            const response = await fetch(`http://localhost:8080/api/users/favorites?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al verificar favoritos');
            }

            const favorites = await response.json();
            const isProductFavorite = favorites.some(favorite => favorite.id === parseInt(id));
            setIsFavorite(isProductFavorite);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleFavorite = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = 1; // Aquí deberías obtener el ID del usuario autenticado
            const method = isFavorite ? 'DELETE' : 'POST';
            const endpoint = isFavorite ? 'remove' : 'add';

            const response = await fetch(`http://localhost:8080/api/users/favorites/${endpoint}?userId=${userId}&productId=${id}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al ${isFavorite ? 'remover' : 'agregar'} a favoritos`);
            }

            setIsFavorite(!isFavorite); // Cambiar el estado de isFavorite
        } catch (err) {
            console.error(err);
        }
    };

    function getUserIdFromToken(token) {
        // Método simple: si usas una biblioteca como jwt-decode sería más robusto
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    }

    const handleSubmitReview = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Debes iniciar sesión para dejar una reseña");
                navigate('/login', {
                    state: {
                        message: 'Inicia sesión para dejar una reseña',
                        fromReserve: id
                    }
                });
                return;
            }

            const userId = getUserIdFromToken(token);

            // Verificar si el usuario tiene una reserva completada para el producto
            const hasReservationResponse = await fetch(`http://localhost:8080/api/reservations/user/${userId}/product/${id}/completed`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!hasReservationResponse.ok) {
                throw new Error('Error al verificar reservas');
            }

            const hasReservation = await hasReservationResponse.json();
            if (!hasReservation) {
                alert("Debes tener una reserva completada para este producto antes de dejar una reseña.");
                return;
            }

            // Construir el objeto de reseña
            const review = {
                product: { id: parseInt(id) },
                rating: userRating,
                comment: userComment
            };

            // Enviar la reseña
            const response = await fetch(`http://localhost:8080/api/reviews?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(review),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error al enviar la reseña: ${response.status} - ${errorData}`);
            }

            // Limpiar el formulario y actualizar las reseñas
            setUserRating(0);
            setUserComment("");
            await fetchReviews();
            await fetchAverageRating();
            await fetchReviewCount();

            alert("Reseña enviada correctamente");
        } catch (err) {
            console.error("Error en handleSubmitReview:", err);
            alert(err.message);
        }
    };


    const handleReserveClick = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Redirigir al login con mensaje y la ruta de origen
            navigate('/login', {
                state: {
                    message: 'Para reservar, debes iniciar sesión o registrarte.',
                    fromReserve: id, // ID del producto para redirigir después del login
                },
            });
            return;
        }

        if (!selectedDate) {
            alert('Por favor, selecciona una fecha para la reserva.');
            return;
        }

        try {
            // Asegurar que `selectedDate` sea un string en formato `YYYY-MM-DD`
            const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

            // Hacer la solicitud POST para crear la reserva
            const response = await fetch(`http://localhost:8080/api/reservations?productId=${id}&reservationDate=${formattedDate}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al crear la reserva');
            }

            const data = await response.json();
            console.log('Reserva creada:', data);

            // Mostrar mensaje de éxito
            alert('Reserva creada con éxito');
        } catch (err) {
            console.error(err);
            alert('Hubo un error al crear la reserva. Por favor, inténtalo de nuevo.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirigir al login si no hay token
            navigate('/login', {
                state: {
                    message: 'Debes iniciar sesión para acceder a esta página.',
                },
            });
        } else {
            // Si hay token, realizar las solicitudes
            checkIfUserHasReservation();
            fetchProduct();
            checkIfFavorite();
            fetchReviews();
            fetchAverageRating();
            fetchReviewCount();
            console.log("Product:", product);
        }
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
        <div className="product-detail">
            <h1>{product.name}</h1>

            {/* Galería de imágenes */}
            <div className="gallery-container">
                <div className="gallery-block">
                    {/* Imagen principal (mitad izquierda) */}
                    <div className="main-image">
                        {product.images[0] && (
                            <img src={product.images[0]} alt={`Imagen principal de ${product.name}`} />
                        )}
                    </div>

                    {/* Grilla de 4 imágenes (mitad derecha) */}
                    <div className="grid-images">
                        {product.images.slice(1, 5).map((image, index) => (
                            <div key={index} className="grid-image">
                                <img src={image} alt={`Imagen ${index + 1} de ${product.name}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botón "Ver más" */}
                <div className="view-more">
                    <Link to={`/product/${product.id}/gallery`}>Ver más</Link>
                </div>
            </div>

            {/* Información del producto */}
            <div className="product-info">
                {/* Botón de agregar/remover de favoritos */}
                <button
                    onClick={toggleFavorite}
                    className={
                        loading
                            ? "favorite-button-disabled" // Si está cargando, deshabilitar el botón
                            : isFavorite
                                ? "favorite-button-remove" // Si está en favoritos, usar el estilo de remover
                                : "favorite-button-add" // Si no está en favoritos, usar el estilo de agregar
                    }
                    disabled={loading} // Deshabilitar el botón si está cargando
                >
                    {isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
                </button>

                {/* Botón de compartir */}
                <button
                    onClick={() => setShowSharePopup(true)}
                    className="share-button"
                >
                    Compartir
                </button>

                <p><strong>Tipo:</strong> {product.type}</p>
                <p><strong>Precio:</strong> {product.price}</p>
                {/* Sección de valoraciones */}
                <div className="reviews-section">
                    <h2>Valoraciones</h2>
                    <div className="average-rating">
                        ⭐ {(averageRating || 0).toFixed(1)} ({reviewCount} reseñas)
                    </div>

                    {/* Formulario para dejar una reseña */}
                    <div className="review-form">
                        <h3>Deja tu reseña</h3>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setUserRating(star)}
                                    style={{ color: star <= (hoverRating || userRating) ? 'gold' : 'gray', cursor: 'pointer' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Escribe tu comentario..."
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                        />
                        <button onClick={() => handleSubmitReview()}>Enviar Reseña</button>

                    </div>

                    {/* Lista de reseñas */}
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <span className="review-user">{review.user.name}</span>
                                    <span className="review-date">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="review-rating">
                                    ⭐ {(review.rating || 0).toFixed(1)} (reseña)
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Descripción */}
                <p><strong>Descripción:</strong> {product.description}</p>

                {/* Ubicación */}
                <p><strong>Ubicación:</strong> {product.location}</p>

                {/* Calendario de disponibilidad */}
                <div className="availability-section">
                    <h2>Disponibilidad</h2>
                    <AvailabilityCalendar
                        occupiedDates={product.occupiedDates}
                        onDateSelect={handleDateSelect}
                    />
                </div>

                {/* Características */}
                <div className="features">
                    <strong>Características:</strong>
                    <ul>
                        {product.features.map((feature) => (
                            <li key={feature.id}>
                                <img src={feature.icon} alt={feature.name} />
                                {feature.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Ventana emergente de compartir */}
            {showSharePopup && (
                <SharePopup
                    product={product}
                    onClose={() => setShowSharePopup(false)}
                />
            )}

            <div className="product-info">
                {/* Botón de reserva */}
                <button
                    onClick={() => handleReserveClick()}
                    className="reserve-button"
                >
                    Reservar
                </button>


            </div>

        </div>
    );
};

export default ProductDetail;