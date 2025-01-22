import React from 'react'

export const Header = () => {
  return (
    <header className="main-header">
        <div className="header left">
            <Link to="/" className="logo-link">
                <img src="/logo.png" alt="Logo" className="logo"/>
                <span className="slogan">Tu cancha, nuestra pasión!</span>
            </Link>
        </div>

        <div className="header-right">
            <button className="auth-button">Crear cuenta</button>
            <button className="auth-button">Iniciar sesión</button>
        </div>

    </header>
  );
};

export default Header;
