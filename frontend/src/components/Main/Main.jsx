import React, { useEffect, useState } from 'react';
import './Main.css';
import SearchSection from './SearchSection';
import CategoriesSection from './CategoriesSection';
import RecommendationsSection from './RecommendationsSection';
import ProductsGrid from './ProductsGrid';

export const Main = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    setCurrentPage(1); 
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.type === selectedCategory)
    : products;

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    
    return (
      <main className="main-container">
        <SearchSection />
        <CategoriesSection onSelectCategory={setSelectedCategory} />
        <RecommendationsSection />
        <section className="home-products-section">
          <h2>Canchas Destacadas</h2>
          <ProductsGrid 
            products={filteredProducts} 
            totalProducts={products.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </section>
      </main>
    );
};

export default Main;