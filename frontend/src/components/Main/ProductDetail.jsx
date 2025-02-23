import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';
import AvailabilityCalendar from '../AvailabilityCalendar/AvailabilityCalendar.jsx';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`);
            if (!response.ok) {
                throw new Error('Producto no encontrado');
            }
            const data = await response.json();
            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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

    useEffect(() => {
        fetchProduct();
        checkIfFavorite(); // Verificar si la cancha está en favoritos al cargar la página
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
                <p><strong>Tipo:</strong> {product.type}</p>
                <p><strong>Precio:</strong> {product.price}</p>
                <p><strong>Calificación:</strong> ⭐ {product.rating}</p>

                {/* Descripción */}
                <p><strong>Descripción:</strong> {product.description}</p>

                {/* Ubicación */}
                <p><strong>Ubicación:</strong> {product.location}</p>

                {/* Calendario de disponibilidad */}
                <div className="availability-section">
                    <h2>Disponibilidad</h2>
                    <AvailabilityCalendar occupiedDates={product.occupiedDates} />
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
        </div>
    );
};

export default ProductDetail;