import React from 'react';
import './UserAvatar.css';

const UserAvatar = ({ name }) => {
  // Si name no está definido, usa un valor predeterminado
  const initials = name
    ? name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U"; // "U" de "Usuario"

  return (
    <div className="user-avatar">
      <span>{initials}</span>
    </div>
  );
};

export default UserAvatar;