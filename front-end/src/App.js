import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Category from './components/category';
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente ProtectedRoute
import Employees from './categories/employers';
import Clients from './categories/clients';
import BlogStyle from './components/BlogStyle';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/**" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* RUTAS protegidas */}
        <Route path="/categorias" element={<ProtectedRoute element={<Category />} />} /> 
        <Route path="/categorias/empleados" element={<ProtectedRoute element={<Employees />} />} /> 
        <Route path="/categorias/gestionar-usuarios" element={<ProtectedRoute element={<Clients />} />} /> 
        <Route path="/categorias/solicitar-servicio" element={<ProtectedRoute element={<BlogStyle categoryId="664dcb27afcd382723a36da1" />} />} />


      </Routes>
    </Router>
  );
};

export default App;
