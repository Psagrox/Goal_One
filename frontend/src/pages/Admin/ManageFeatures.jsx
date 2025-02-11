import React, { useState, useEffect } from 'react';
import './Admin.css';

const ManageFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ name: '', icon: '' });
  const [editingFeature, setEditingFeature] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    const response = await fetch('http://localhost:8080/api/features', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setFeatures(data);
  };

  const handleAddFeature = async () => {
    const response = await fetch('http://localhost:8080/api/features', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newFeature)
    });
    if (response.ok) {
      fetchFeatures();
      setNewFeature({ name: '', icon: '' });
    }
  };

  const handleDeleteFeature = async (id) => {
    const response = await fetch(`http://localhost:8080/api/features/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      fetchFeatures();
    }
  };

  return (
    <div className="manage-features">
      <h2>Administrar Características</h2>
      <div className="manage-feature-container">
        <input
          type="text"
          placeholder="Nombre"
          value={newFeature.name}
          onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Url del ícono"
          value={newFeature.icon}
          onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
        />
        <button onClick={handleAddFeature}>Agregar</button>
      </div>
      <ul className="feature-list">
        {features.map((feature) => (
          <li key={feature.id}>
            {feature.name} - 
            <img src={feature.icon} alt="Icono"/>
            <button className="feature-button" onClick={() => handleDeleteFeature(feature.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageFeatures;