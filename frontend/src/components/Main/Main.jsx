import React, { useEffect, useState } from 'react';
import './Main.css';
import SearchSection from './SearchSection';
import CategoriesSection from './CategoriesSection';
import RecommendationsSection from './RecommendationsSection';
import ProductsGrid from './ProductsGrid';

export const Main = () => {
  const [products, setProducts] = useState([]); // Todos los productos
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar los productos al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products', {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Inicialmente, los productos filtrados son todos los productos
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
  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter((product) => product.type === selectedCategory);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Si no hay categoría seleccionada, mostrar todos los productos
    }
    setCurrentPage(1); // Reiniciar la paginación al cambiar la categoría
  }, [selectedCategory, products]);

  // Función para manejar la búsqueda
  const handleSearch = (searchCriteria) => {
    const { searchTerm, startDate, endDate } = searchCriteria;
    
    // Filtrar productos según el término de búsqueda y las fechas
    const filtered = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
  
      // Verificar si las fechas ocupadas del producto no coinciden con el rango seleccionado
      const isAvailable = !product.occupiedDates.some((date) => {
        const occupiedDate = new Date(date);
        return startDate && endDate && startDate <= occupiedDate && occupiedDate <= endDate;
      });
  
      // Si no se seleccionan fechas, solo se filtra por nombre
      if (!startDate || !endDate) {
        return matchesName;
      }
  
      return matchesName && isAvailable;
    });
    
  
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reiniciar la paginación al realizar una búsqueda
    console.log("Fechas seleccionadas:", startDate, endDate);
    console.log("Productos filtrados:", filtered);
  
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main className="main-container">
      {/* Pasar la función handleSearch a SearchSection */}
      <SearchSection onSearch={handleSearch} />
      <CategoriesSection onSelectCategory={setSelectedCategory} />
      <RecommendationsSection />
      <section className="home-products-section">
        <h2>Canchas Destacadas</h2>
        {/* Pasar los productos filtrados a ProductsGrid */}
        <ProductsGrid
          products={filteredProducts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </section>
    </main>
  );
};

export default Main;