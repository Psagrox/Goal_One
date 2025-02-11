import React, { useState } from 'react';
import CategoriesSection from '../../components/Main/CategoriesSection.jsx';
import './ManageCategories.css'; 

const ManageCategories = () => {
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

  // Función para eliminar una categoría
  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter((category) => category !== categoryToRemove));
  };

  // Función para editar una categoría
  const editCategory = (oldCategory, newCategory) => {
    setCategories(
      categories.map((category) =>
        category === oldCategory ? newCategory : category
      )
    );
  };

  return (
    <div className="manage-categories">
      <h1>Administrar Categorías</h1>

      <div className="category-actions">
        <h2>Agregar Nueva Categoría</h2>
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
        <button
          onClick={() => {
            const newCategory = document.getElementById('new-category').value;
            addCategory(newCategory);
            document.getElementById('new-category').value = ''; // Limpiar el input
          }}
        >
          Agregar Categoría
        </button>
      </div>

      <div className="categories-list">
        <h2>Categorías Existentes</h2>
        <ul>
          {categories.map((category, index) => (
            <li key={index} className="category-item">
              <span>{category}</span>
              <button onClick={() => removeCategory(category)}>Eliminar</button>
              <button
                onClick={() => {
                  const newCategory = prompt('Ingrese el nuevo nombre de la categoría', category);
                  if (newCategory) {
                    editCategory(category, newCategory);
                  }
                }}
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <CategoriesSection onSelectCategory={(category) => console.log(category)} />
    </div>
  );
};

export default ManageCategories;
