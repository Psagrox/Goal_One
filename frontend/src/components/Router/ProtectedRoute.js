import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, requiredRole, children }) => {

  if (user === undefined) {
    return <div>Cargando...</div>; // Muestra un loading en lugar de redirigir
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
