import React from 'react';
import './ProductsGrid.css';
import { Link } from 'react-router-dom';

const ProductsGrid = ({ products, currentPage, setCurrentPage }) => {
  const productsPerPage = 6;

  // Calcular el índice de los productos a mostrar
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generar números de página
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="products-grid">
      {/* Listado de productos */}
      <div className="products-list">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-image"
              onError={(e) => (e.target.src = '/placeholder.jpg')}
            />
            <div className="product-info">
              <h3>
                <Link to={`/product/${product.id}`}>{product.name}</Link>
              </h3>
              <p>Tipo: {product.type}</p>
              <p>Precio: {product.price}</p>
              <div className="rating">⭐ {product.rating}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="pagination-controls">
        <button 
          onClick={() => paginate(1)} 
          disabled={currentPage === 1}
          className="inicio"
        >
          Inicio
        </button>
        <button 
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="anterior"
        >
          Anterior
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        <button 
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
          className="siguiente"
        >
          Siguiente
        </button>
        <button 
          onClick={() => paginate(pageNumbers.length)}
          className="final"
        >
          Final
        </button>
      </div>
    </div>
  );
};

export default ProductsGrid;