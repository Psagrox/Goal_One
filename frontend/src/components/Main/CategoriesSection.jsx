import React from 'react';

const categories = [
  'Fútbol 11',
  'Fútbol 7',
  'Fútbol 5',
  'Canchas Sintéticas',
  'Canchas de Cesped Natural',
];

const CategoriesSection = ({ onSelectCategory }) => {
  return (
    <section className="categories-section">
      <h2>Categorías</h2>
      <div className="categories-grid">
        <button
          key="all"
          className="category-card"
          onClick={() => onSelectCategory('')}
        >
          Todas
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            className="category-card"
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;