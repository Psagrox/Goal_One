import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../UserAvatar/UserAvatar.jsx';

export const Header = ({ user, setUser }) => { 
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);  
    navigate('/');  
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src="../logo.png" alt="Logo" className="logo" />
          <span className="slogan">Tu cancha, nuestra pasión!</span>
        </Link>
      </div>

      {user ? (
        <div className="user-info">
          <UserAvatar name={user?.name || "Usuario"} />
          <span>{user?.name}</span>

          {user?.role?.includes("ADMIN") && (
            <Link to="/admin" className="auth-button">Administrar</Link>
          )}

          <button className="auth-button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : (
         <div className="header-right">
          <button className="auth-button" onClick={() => navigate("/register")}>Crear cuenta</button>
          <Link className="auth-button" to="/login">Iniciar Sesión</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
