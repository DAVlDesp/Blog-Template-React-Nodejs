import React, { useEffect, useState } from 'react';
import Header from '../elements/header.js';
import '../css/category.css'; // Importar el archivo CSS

async function getAllCategories() {
  try {
    const response = await fetch('http://localhost:8080/category/data/');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

async function getCategories(categoryName = "nombre de la categoria") {
  try {
    const response = await fetch(`http://localhost:8080/category/data/name/${categoryName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const category = await response.json();
    return category;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

const Blog = () => {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(filter.toLowerCase()) &&
    (!selectedRole || category.rolesAllowed.includes(selectedRole))
  );

  const handleCategoryClick = async (categoryName) => {
    try {
      const categoryInfo = await getCategories(categoryName);
      console.log('Category Info:', categoryInfo);
    } catch (error) {
      console.error('Error fetching category info:', error);
    }
  };

  const handleClearFilter = () => {
    setFilter(''); // Limpiar el filtro al hacer clic en el botón
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="container">
      <Header />
      <h1>BLOG</h1>

      <div id='filter-container'>
        <select value={selectedRole} onChange={handleRoleChange}>
          <option value="">Roles</option>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <input
          type="text"
          placeholder="Filtrar categoría"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button id="clearFilterButton" onClick={handleClearFilter}>X</button>


      </div>


      <div id="Category-container">
        {filteredCategories.map((category) => (
          <div key={category.id} className="category-item" onClick={() => handleCategoryClick(category.name)}>
            <div className='titleAndDescription'>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>
            <ul className="ranks-list">
              {category.rolesAllowed && category.rolesAllowed.map((role, index) => (
                <li key={index} className="ranks-list-item">
                  {role}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
