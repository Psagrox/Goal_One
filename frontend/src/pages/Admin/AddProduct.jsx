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
        const payload = {
            name: formData.name,
            type: formData.type,
            price: parseFloat(formData.price),  
            rating: parseFloat(formData.rating), 
            images: formData.images
        };

        const response = await fetch('http://localhost:8080/api/products', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar');
      }
      
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  const subirImagenes = async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData, 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir imágenes");
      }

      return await response.json(); 
      
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
      throw error; 
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    try {
      const uploadedUrls = await subirImagenes(files);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls] 
      }));
      
    } catch (error) {
      setError("Error al subir imágenes: " + error.message);
    }
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
            id="file-upload"
            style={{ display: "none" }}
          />
          <label htmlFor="file-upload" className="custom-file-upload">
            Seleccionar imágenes
          </label>
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