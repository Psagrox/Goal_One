import React from 'react';
import './Footer.css';
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton.jsx'; // Importa el botón de WhatsApp

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Acerca de Nosotros</h3>
          <p>Somos una plataforma dedicada a la reserva de canchas de fútbol. ¡Encuentra tu cancha ideal y reserva en minutos!</p>
        </div>
        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/contacto">Contacto</a></li>
            <li><a href="/terminos">Términos y Condiciones</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contacto</h3>
          <p>Email: info@reservacancha.com</p>
          <p>Teléfono: +123 456 789</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ReservaCancha. Todos los derechos reservados.</p>
      </div>

      {/* Botón de WhatsApp */}
      <WhatsAppButton />
    </footer>
  );
};

export default Footer;