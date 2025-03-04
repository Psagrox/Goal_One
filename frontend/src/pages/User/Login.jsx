import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importar useLocation
import "./Login.css";
import { jwtDecode } from "jwt-decode";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ubicación actual

  // Mensaje de reserva obligatoria
  const reservationMessage = location.state?.message || "";

  // Validaciones
  const validateForm = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      const token = data.token;

      if (!token) {
        throw new Error("No se recibió un token válido");
      }

      const decodedToken = jwtDecode(token); // Decodifica el token
      console.log(decodedToken);
      const user = {
        token,
        email: decodedToken.sub,
        name: decodedToken.name,
        role: decodedToken.roles || [],
      };

      localStorage.setItem("token", token); // Guardar el JWT en localStorage
      setUser(user); // Guardar el usuario en el estado global

      // Redirigir al usuario a la página de reserva si vino desde allí
      const fromReserve = location.state?.fromReserve;
      if (fromReserve) {
        navigate(`/reserve/${fromReserve}`);
      } else {
        navigate("/"); // Redirigir al inicio
      }
    } catch (err) {
      setServerError("Email o contraseña incorrectos. Intenta de nuevo.");
    }
    
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {reservationMessage && <p className="reservation-message">{reservationMessage}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {serverError && <p className="error">{serverError}</p>}

        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;