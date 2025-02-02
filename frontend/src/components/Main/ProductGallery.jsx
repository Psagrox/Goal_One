import React from 'react';
import './ProductGallery.css';
import { Link } from 'react-router-dom';

const ProductGallery = ({ product }) => {
  const { images } = product;

  // Verificar si hay suficientes imágenes
  const hasEnoughImages = images && images.length >= 5;

  return (
    <div className="gallery-container">
      <div className="gallery-block">
        {/* Imagen principal (mitad izquierda) */}
        <div className="main-image">
          {hasEnoughImages && <img src={images[0]} alt={`Imagen principal de ${product.name}`} />}
        </div>

        {/* Grilla de 4 imágenes (mitad derecha) */}
        <div className="grid-images">
          {hasEnoughImages && images.slice(1, 5).map((image, index) => (
            <div key={index} className="grid-image">
              <img src={image} alt={`Imagen ${index + 1} de ${product.name}`} />
            </div>
          ))}
        </div>

        {/* Texto "Ver más" */}
        <div className="view-more">
          <Link to={`/product/${product.id}/gallery`}>Ver más</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;