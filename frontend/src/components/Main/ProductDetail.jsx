import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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

        fetchProduct();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
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
                <p><strong>Tipo:</strong> {product.type}</p>
                <p><strong>Precio:</strong> {product.price}</p>
                <p><strong>Calificación:</strong> ⭐ {product.rating}</p>

                {/* Descripción */}
                <p><strong>Descripción:</strong> {product.description}</p>

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