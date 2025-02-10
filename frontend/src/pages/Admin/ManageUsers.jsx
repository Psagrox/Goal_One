import React, { useEffect, useState } from 'react';
import './ManageUsers.css';
import { Navigate } from 'react-router-dom';

const ManageUsers = () => {
  console.log("Se esta renderizando")
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  // Verificamos el token solo una vez al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setRedirectToLogin(true); // Si no hay token, marcamos que debe redirigir
    } else {
      // Si hay token, obtenemos la lista de usuarios
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/users', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('No autorizado');
          }

          const data = await response.json();
          setUsers(data);
        } catch (err) {
          setError('Error al cargar los usuarios');
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, []); // Este useEffect solo se ejecuta una vez cuando el componente se monta

  // Si no hay token, redirigimos
  if (redirectToLogin) {
    return <Navigate to="/" replace />;
  }

  // Otorgar permisos de administrador
  const makeAdmin = async (userId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/make-admin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al otorgar permisos de administrador');
      }
      
      const updatedUser = await response.json();
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="manage-users">
      <h2>Gestionar Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== 'ADMIN' && (
                  <button onClick={() => makeAdmin(user.id)}>
                    Hacer Administrador
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;