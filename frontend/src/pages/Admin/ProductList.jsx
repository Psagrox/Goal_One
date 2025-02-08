import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Obtener la lista de productos desde la API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products'); // Ajusta la URL de tu API
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (productId) => {
    // Mostrar un mensaje de confirmación
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmDelete) return; // Si el usuario cancela, no hacer nada

    try {
      // Hacer una solicitud DELETE al backend
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Actualizar la lista de productos después de la eliminación
        setProducts(products.filter((product) => product.id !== productId));
        alert('Producto eliminado correctamente');
      } else {
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  return (
    <div className="product-list-container">
      <h1>Lista de Productos</h1>
      <table className="product-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>
                <Link to={`/admin/edit-product/${product.id}`} className="action-button">
                  Editar
                </Link>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;