import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Admin.css';
import LocationAutocomplete from '../../components/LocationApi/LocationAutocomplete.jsx'; 

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Fútbol 11',
    price: '',
    rating: '',
    images: [],
    description: '',
    features: [],
    occupiedDates: [],
    location: '',
  });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Función para manejar la selección de ubicación
  const handleLocationSelect = (address) => {
    setFormData(prev => ({ ...prev, location: address }));
  };


  // Cargar los datos del producto existente
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }

        );
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        const data = await response.json();

        const cleanedPrice = data.price.replace(/[$/h]/g, '');

        setFormData({
          name: data.name,
          type: data.type,
          price: cleanedPrice,
          rating: data.rating.toString(),
          images: data.images,
          description: data.description,
          occupiedDates: data.occupiedDates || [], // Nuevo campo
          location: data.location || '', // Nuevo campo
        });

        // Si el producto tiene características, selecciónalas
        if (data.features) {
          setSelectedFeatures(data.features.map(feature => feature.id));
        }

      } catch (err) {
        setError(err.message);
      }
    };

    if (token) {
      fetchProduct();
    }
  }, [token, id]);

  // Obtener características disponibles
  useEffect(() => {
    const fetchFeatures = async () => {
      const response = await fetch('http://localhost:8080/api/features');
      const data = await response.json();
      setFeatures(data);
    };
    fetchFeatures();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        images: formData.images,
        description: formData.description,
        featureIds: selectedFeatures, 
        occupiedDates: formData.occupiedDates, 
        location: formData.location,
      };

      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el producto');
      }

      navigate('/admin/product-list');
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
        headers: {
          'Authorization': `Bearer ${token}`
        },
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
      <h2>Editar Cancha</h2>
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

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        {/* Nuevo campo: Características */}
        <div className="form-group">
          <label>Características:</label>
          <select
            multiple
            value={selectedFeatures}
            onChange={(e) => setSelectedFeatures(Array.from(e.target.selectedOptions, (option) => option.value))}
          >
            {features.map((feature) => (
              <option key={feature.id} value={feature.id}>{feature.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Ubicación:</label>
          <LocationAutocomplete onPlaceSelected={handleLocationSelect} />
        </div>

        <div className="form-group">
          <label>Fechas ocupadas:</label>
          <input
            type="date"
            onChange={(e) => {
              const selectedDate = e.target.value;
              setFormData(prev => ({
                ...prev,
                occupiedDates: [...prev.occupiedDates, selectedDate]
              }));
            }}
          />
          <div className="selected-dates">
            {formData.occupiedDates.map((date, index) => (
              <div key={index} className="date-tag">
                {date}
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      occupiedDates: prev.occupiedDates.filter((d, i) => i !== index)
                    }));
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditProduct;