import React from 'react';

const categories = [
  'Fútbol 11',
  'Fútbol 7',
  'Fútbol 5',
  'Canchas Sintéticas',
  'Canchas de Cesped Natural'
];

const CategoriesSection = () => {
  return (
    <section className="categories-section">
      <h2>Categorías</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <button key={index} className="category-card">
            {category}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;