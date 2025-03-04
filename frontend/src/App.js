import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import AdminPanel from './pages/Admin/AdminPanel';
import AddProduct from './pages/Admin/AddProduct';
import ProductDetail from './components/Main/ProductDetail';
import ProductGalleryPage from './pages/ProductGalleryPage/ProductGalleryPage';
import ProductList from './pages/Admin/ProductList';
import EditProduct from './pages/Admin/EditProduct';
import Register from './pages/User/Register';
import Login from './pages/User/Login';
import Profile from './pages/User/Profile';
import ProtectedRoute from './components/Router/ProtectedRoute';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageFeatures from './pages/Admin/ManageFeatures';
import ManageCategories from './pages/Admin/ManageCategories';
import FavoritesPage from './components/UserAvatar/FavoritesPages';
import ReservationPage from './pages/ReservationPage/ReservationPage';
import UserDashboard from './components/UserAvatar/UserDashboard'; // Nueva página de dashboard del usuario
import ReservationHistory from './components/UserAvatar/ReservationHistory'; // Nueva página de historial de reservas

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);

        setUser({
          token: storedToken,
          email: decoded.sub,
          name: decoded.sub.split('@')[0],
          roles: decoded.roles,
        });
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  if (user === undefined) {
    return <div>Cargando...</div>; // Puedes reemplazarlo con un spinner
  }

  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product/:id/gallery" element={<ProductGalleryPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Nueva ruta para el dashboard del usuario */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute user={user}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Ruta para el historial de reservas */}
        <Route path="/reservations" element={
          <ProtectedRoute user={user}>
            <ReservationHistory />
          </ProtectedRoute>
        } />

        {/* Ruta para favoritos */}
        <Route path="/favorites" element={
          <ProtectedRoute user={user}>
            <FavoritesPage />
          </ProtectedRoute>
        } />

        {/* Ruta para el perfil del usuario */}
        <Route path="/perfil" element={
          <ProtectedRoute user={user}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Ruta para la página de reserva */}
        <Route path="/reserve/:id" element={
          <ProtectedRoute user={user}>
            <ReservationPage />
          </ProtectedRoute>
        } />

        {/* Rutas de administración */}
        <Route path="/admin" element={
          <ProtectedRoute user={user} requiredRole="ADMIN">
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-product" element={
          <ProtectedRoute user={user} requiredRole="ADMIN">
            <AddProduct />
          </ProtectedRoute>
        } />
        <Route path="/admin/product-list" element={
          <ProtectedRoute user={user} requiredRole="ADMIN">
            <ProductList />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-product/:id" element={
          <ProtectedRoute user={user} requiredRole="ADMIN">
            <EditProduct />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-users" element={
          <ProtectedRoute user={user} requiredRole="ADMIN">
            <ManageUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-features" element={
          <ProtectedRoute user={user} requiredRole="ADMIN">
            <ManageFeatures />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-categories" element={
          <ProtectedRoute user={user} requiredRole="ADMIN">
            <ManageCategories />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;