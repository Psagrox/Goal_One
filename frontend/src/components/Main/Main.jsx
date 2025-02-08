import React, { useEffect, useState } from 'react';
import './Main.css';
import SearchSection from './SearchSection';
import CategoriesSection from './CategoriesSection';
import RecommendationsSection from './RecommendationsSection';
import ProductsGrid from './ProductsGrid';

export const Main = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.type === selectedCategory)
    : products;

  return (
    <main className="main-container">
      <SearchSection />
      <CategoriesSection onSelectCategory={setSelectedCategory} />
      <RecommendationsSection />
      <section className="home-products-section">
        <h2>Canchas Destacadas</h2>
        <ProductsGrid products={filteredProducts} totalProducts={products.length}/>
      </section>
    </main>
  );
};

export default Main;