import React from 'react';

const SearchSection = () => {
  return (
    <section className="search-section">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Buscar canchas por nombre..."
          className="search-input"
        />
        <button className="search-button">
          Buscar
        </button>
      </div>
    </section>
  );
};

export default SearchSection;