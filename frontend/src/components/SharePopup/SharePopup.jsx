import React, { useState } from "react";
import "./SharePopup.css"; // Archivo CSS para estilos

const SharePopup = ({ product, onClose }) => {
  const [customMessage, setCustomMessage] = useState("");

  const handleShare = (socialMedia) => {
    const productUrl = window.location.href; // URL de la página del producto
    const message = `${customMessage || "Mira esta cancha:"} ${productUrl}`;

    switch (socialMedia) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
          "_blank"
        );
        break;
      case "instagram":
        // Instagram no permite compartir directamente desde un enlace, pero puedes redirigir a la app
        alert("Para compartir en Instagram, copia el enlace y pégalo en la app.");
        break;
      default:
        break;
    }
  };

  return (
    <div className="share-popup-overlay">
      <div className="share-popup">
        <h2>Compartir en redes sociales</h2>
        <div className="share-content">
          <img src={product.images[0]} alt={product.name} className="share-image" />
          <p className="share-description">{product.description}</p>
          <input
            type="text"
            placeholder="Escribe un mensaje personalizado..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="share-message-input"
          />
        </div>
        <div className="share-buttons">
          <button onClick={() => handleShare("facebook")} className="facebook-button">
            Compartir en Facebook
          </button>
          <button onClick={() => handleShare("twitter")} className="twitter-button">
            Compartir en Twitter
          </button>
          <button onClick={() => handleShare("instagram")} className="instagram-button">
            Compartir en Instagram
          </button>
        </div>
        <button onClick={onClose} className="close-button">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default SharePopup;