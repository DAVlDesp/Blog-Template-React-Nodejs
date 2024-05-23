import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Blog from './components/Blog';
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente ProtectedRoute
import Employees from './categories/employers';
import Clients from './categories/clients';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/**" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* RUTAS protegidas */}
        <Route path="/categorias" element={<ProtectedRoute element={<Blog />} />} /> 
        <Route path="/categorias/empleados" element={<ProtectedRoute element={<Employees />} />} /> 
        <Route path="/categorias/gestionar-usuarios" element={<ProtectedRoute element={<Clients />} />} /> 

      </Routes>
    </Router>
  );
};

export default App;
