import React, { useEffect, useState, useRef } from 'react';
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

async function deleteCategory(categoryName, token) {
  try {
    const response = await fetch(`http://localhost:8080/category/deleteByUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: categoryName, token: token })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

async function getUserId(token) {
  try {
    const response = await fetch(`http://localhost:8080/getID/token/${token}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const { userId } = await response.json();
    return userId;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    throw error;
  }
}

const Blog = () => {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [userRole, setUserRole] = useState('');
  const menuRef = useRef(null);

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

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token'); // Suponiendo que el token está almacenado en localStorage
      try {
        const userId = await getUserId(token);
        const userResponse = await fetch(`http://localhost:8080/user/data/id/${userId}`);
        if (!userResponse.ok) {
          throw new Error(`HTTP error! Status: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        setUserRole(userData.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(filter.toLowerCase()) &&
    ((!selectedRole && userRole === 'owner') || (category.rolesAllowed.includes('todos')) || (!selectedRole && category.rolesAllowed.includes(userRole)) || (selectedRole && category.rolesAllowed.includes(selectedRole)))
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
    setFilter('');
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleMenuClick = (categoryName) => {
    setShowMenu(categoryName === showMenu ? null : categoryName);
  };

  const handleDeleteClick = (categoryName) => {
    setCategoryToDelete(categoryName);
    setShowConfirm(true);
    setShowMenu(null);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token'); // Suponiendo que el token está almacenado en localStorage
    try {
      await deleteCategory(categoryToDelete, token);
      setCategories(categories.filter(category => category.name !== categoryToDelete));
      setShowConfirm(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="container">
      <Header />
      <h1>BLOG</h1>

      <div id='filter-container'>
        <select value={selectedRole} onChange={handleRoleChange}>
          <option value="">Roles</option>
          <option value="todos">Todos</option>
          <option value="empleado">Empleado</option>
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
          <div key={category.id} className="category-item">
            <div className='titleAndDescription' onClick={() => handleCategoryClick(category.name)}>
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
            <button className="options-button" onClick={() => handleMenuClick(category.name)}>⋮</button>
            {showMenu === category.name && (
              <div className="options-menu" ref={menuRef}>
                <center><h2>{categories.find(cat => cat.name === showMenu).name}</h2></center>

                {(userRole === 'owner' || userRole === 'empleado') && (
                  <button>📖 Editar</button>
                )}

                {(userRole === 'owner' || userRole === 'empleado') && (
                  <button >📌 Fijar</button>
                )}

                {userRole === 'owner' && (
                  <button className='borrar' onClick={() => handleDeleteClick(categories.find(cat => cat.name === showMenu).name)}>❌ Borrar</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showConfirm && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <p>¿Quieres borrar la categoría <b>{categoryToDelete}</b>?</p>
            <button onClick={handleConfirmDelete} style={{ backgroundColor: '#b2ffb2' }}>Sí</button>
            <button onClick={handleCancelDelete} style={{ backgroundColor: '#ff8b8b' }}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
