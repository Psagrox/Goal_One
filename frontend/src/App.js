import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AdminPanel from './pages/Admin/AdminPanel';
import AddProduct from './pages/Admin/AddProduct';
import ProductDetail from './components/Main/ProductDetail';
import ProductGalleryPage from './pages/ProductGalleryPage/ProductGalleryPage';
import Footer from './components/Footer/Footer';
import ProductList from './pages/Admin/ProductList';
import EditProduct from './pages/Admin/EditProduct';
import Register from './pages/User/Register';
import Login from './pages/User/Login';
import Profile from './pages/User/Profile';
import ProtectedRoute from './components/Router/ProtectedRoute.js';
import React, { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/administracion" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/product-list" element={<ProductList />} />
        <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product/:id/gallery" element={<ProductGalleryPage />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
