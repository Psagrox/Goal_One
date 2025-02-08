import React from 'react';
import './UserAvatar.css';

const UserAvatar = ({ name }) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  
    return (
      <div className="user-avatar">
        <span>{initials}</span>
      </div>
    );
  };
  
  export default UserAvatar;