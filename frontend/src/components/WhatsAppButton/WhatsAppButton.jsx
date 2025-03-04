import React from 'react';
import './WhatsAppButton.css'; // Archivo CSS para estilos
import whatsappIcon from 'https://img.icons8.com/?size=100&id=aUugRyDZVcWE&format=png&color=000000'; // Ícono de WhatsApp
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WhatsAppButton = () => {
    const phoneNumber = '541169756013'; // Número de teléfono con código de país
    const message = 'Hola, estoy interesado en reservar una cancha.'; // Mensaje predefinido

    const handleClick = () => {
        if (!phoneNumber || !message) {
            alert('Por favor, verifica el número de teléfono y el mensaje.');
            return;
        }
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        toast.success('Redirigiendo a WhatsApp...');
    };

    return (
        <div className="whatsapp-button" onClick={handleClick}>
            <img src={whatsappIcon} alt="WhatsApp" />
        </div>
    );
};

export default WhatsAppButton;