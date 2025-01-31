import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async() => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}`);
                if(!response.ok) {
                    throw new Error('Producto no encontrado');
                }
                const data = await response.json();
                setProduct(data);
            } catch(err) {
                setError(err.message);
            } finally {
                setLoading(false)
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div>Cargando...</div>
    if (error) return <div>Error: {error}</div>
    if (!product) return <div>Producto no encontrado</div>

    return (
        <div className="product-detail">
            <h1>{product.name}</h1>
            <div className="product-images">
                {product.images.map((img, index) => (
                    <img key={index} src={img} alt={`Imagen ${index + 1}`} />
                ))}
            </div>
            <div className="product-info">
                <p><strong>Tipo:</strong> {product.type}</p>
                <p><strong>Precio:</strong> {product.price}</p>
                <p><strong>Calificacion:</strong> ⭐ {product.rating}</p>
            </div>
        </div>
    );
};

export default ProductDetail;