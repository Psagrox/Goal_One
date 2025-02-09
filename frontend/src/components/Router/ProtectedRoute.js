import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, requiredRole, children }) => {
  console.log("ProtectedRoute ejecutado con user:", user, "y requiredRole:", requiredRole);

  if (user === undefined) {
    console.log("Esperando a que se defina el usuario...");
    return <div>Cargando...</div>; // Muestra un loading en lugar de redirigir
  }

  if (!user) {
    console.log("Redirigiendo a /login...");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log("Redirigiendo a / porque el rol no coincide...");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
