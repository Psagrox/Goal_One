import React, { useRef, useState } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import './LocationAutocomplete.css';

const libraries = ['places'];

const LocationAutocomplete = ({ onPlaceSelected }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: '', // Reemplaza con tu API Key
    libraries,
  });

  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState(''); // Estado para controlar el valor del input

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
  
      // Intentar obtener la dirección del `formatted_address` o `name`
      const address = place.formatted_address || place.name;
      
      if (address) {
        onPlaceSelected(address);
      } else {
        console.log("No se pudo obtener la dirección.");
      }
    }
  };

  return (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceChanged}
      options={{
        componentRestrictions: { country: 'ar' }, // Cambia 'ar' por el código de tu país
        fields: ['address_components', 'geometry', 'icon', 'name'],
      }}
    >
      <input
        type="text"
        placeholder="Ingresa la ubicación"
        value={inputValue} // Controlar el valor del input
        onChange={(e) => setInputValue(e.target.value)} // Permitir la edición manual
        style={{
          boxSizing: 'border-box',
          border: '1px solid transparent',
          width: '100%',
          height: '40px',
          padding: '0 12px',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          fontSize: '14px',
          outline: 'none',
          textOverflow: 'ellipsis', // Corregido: 'ellipsis' en lugar de 'ellipses'
        }}
      />
    </Autocomplete>
  );
};

export default LocationAutocomplete;
