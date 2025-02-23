import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FavoritePages.css"; // Archivo CSS para estilos

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = 1; // Aquí deberías obtener el ID del usuario autenticado dinámicamente

      const response = await fetch(`http://localhost:8080/api/users/favorites?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las canchas favoritas");
      }

      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="favorites-page">
      <h1>Mis Canchas Favoritas</h1>
      {favorites.length === 0 ? (
        <p>No tienes canchas favoritas.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-item">
              <h2>{favorite.name}</h2>
              <p>{favorite.description}</p>
              <p>Precio: {favorite.price}</p>
              <button onClick={() => navigate(`/product/${favorite.id}`)}>Ver Detalles</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;