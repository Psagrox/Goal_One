import React, { useState } from 'react';

const CategoriesSection = ({ onSelectCategory }) => {
  // Estado local para manejar las categorías
  const [categories, setCategories] = useState([
    'Fútbol 11',
    'Fútbol 7',
    'Fútbol 5',
    'Sintética',
    'Césped Natural',
  ]);

  // Función para agregar una nueva categoría
  const addCategory = (newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  // Función para manejar el cambio de categoría
  const handleCategoryClick = (category) => {
    onSelectCategory(category);
  };

  return (
    <section className="categories-section">
      <h2>Categorías</h2>
      <div className="categories-grid">
        <button
          key="all"
          className="category-card"
          onClick={() => handleCategoryClick('')}
        >
          Todas
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            className="category-card"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Agregar nueva categoría */}
      <div className="add-category">
        <input
          type="text"
          id="new-category"
          placeholder="Nueva categoría"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addCategory(e.target.value);
              e.target.value = ''; // Limpiar el input después de agregar
            }
          }}
        />
        <button onClick={() => addCategory(document.getElementById('new-category').value)}>
          Agregar Categoría
        </button>
      </div>
    </section>
  );
};

export default CategoriesSection;