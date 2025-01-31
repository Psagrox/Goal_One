import React, { useEffect, useState } from 'react';
import './ProductsGrid.css';
import { Link } from 'react-router-dom';

const ProductsGrid = ({ products }) => {
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    // Función para mezclar array usando Fisher-Yates
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const uniqueProducts = [...new Set(products)];
    const shuffled = shuffleArray(uniqueProducts);
    setRandomProducts(shuffled.slice(0, 10));
  }, [products]);

  return (
    <div className="products-grid">
      {randomProducts.map((product) => (
        <div key={product.id} className="product-card">
          <img 
            src={product.images[0] } 
            alt={product.name}
            className="product-image"
            onError={(e) => e.target.src = '/placeholder.jpg'}
          />
          <div className="product-info">
            <h3>
            <Link to={`/product/${product.id}`} onClick={() => console.log("ID enviado:", product.id)}>
              {product.name}
            </Link>
            </h3>
            <p>Tipo: {product.type}</p>
            <p>Id: {product.id}</p>
            <p>Precio: {product.price}</p>
            <div className="rating">
              ⭐ {product.rating}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;