import React, { useEffect, useState } from 'react';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Otorgar permisos de administrador
  const makeAdmin = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/make-admin`, {
        method: 'PUT',
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