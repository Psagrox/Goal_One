import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css';
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src="../logo.png" alt="Logo" className="logo" />
          <span className="slogan">Tu cancha, nuestra pasión!</span>
        </Link>
      </div>

      <div className="header-right">
        <button className="auth-button" onClick={() => navigate("/register")}>Crear cuenta</button>
        <button className="auth-button">Iniciar sesión</button>
      </div>
  </header>
  );
};

export default Header;
