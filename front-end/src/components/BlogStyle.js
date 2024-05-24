import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const BlogStyle = ({ categoryName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const author = localStorage.getItem('userId'); // Asumiendo que el ID del autor está almacenado en localStorage
    const category = categoryName;

    const response = await fetch('http://localhost:8080/post/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, author, category })
    });

    if (response.ok) {
      history.push(`/categorias/${categoryName}`);
    } else {
      // Manejar errores
    }
  };

  return (
    <div>
      <h2>Crear nuevo post en {categoryName}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Contenido" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        <button type="submit">Publicar</button>
      </form>
    </div>
  );
};

export default BlogStyle;
