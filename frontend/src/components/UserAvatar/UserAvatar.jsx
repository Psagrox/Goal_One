import React from 'react';
import './UserAvatar.css';
import { useNavigate } from "react-router-dom";

const UserAvatar = ({ name }) => {
  const navigate = useNavigate();

  // Si name no está definido, usa un valor predeterminado
  const initials = name
    ? name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
    : "U"; // "U" de "Usuario"

  const handleClick = () => {
    navigate("/favorites"); // Redirige a la página de favoritos
  };

  return (
    <div className="user-avatar" onClick={handleClick}>
      <span>{initials}</span>
    </div>
  );
};

export default UserAvatar;