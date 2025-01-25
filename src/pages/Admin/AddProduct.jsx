import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    rating: '',
    images: []
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: `$${formData.price}/h`
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar');
      }
      
      if (response.status === 201) {
        navigate('/admin');
      }
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append('files', file);
        const response = await fetch('http://localhost:8080/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        return data[0];
      })
    );
    setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
  };

  return (
    <div className="add-product-form">
      <h2>Registrar Nueva Cancha</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de cancha:</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            required
          >
            <option value="Fútbol 11">Fútbol 11</option>
            <option value="Fútbol 7">Fútbol 7</option>
            <option value="Fútbol 5">Fútbol 5</option>
            <option value="Sintética">Canchas Sintética</option>
            <option value="Césped Natural">Canchas de Cesped Natural</option>
          </select>
        </div>

        <div className="form-group">
          <label>Precio por hora (sin símbolos):</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="Ej: 25000"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Calificación:</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
            placeholder="Ej: 4.8"
            required
          />
        </div>

        <div className="form-group">
          <label>Imágenes:</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            accept="image/*"
          />
          <div className="image-preview">
            {formData.images.map((img, index) => (
              <img key={index} src={img} alt={`Preview ${index}`} />
            ))}
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        <button type="submit">Guardar Cancha</button>
      </form>
    </div>
  );
};

export default AddProduct;