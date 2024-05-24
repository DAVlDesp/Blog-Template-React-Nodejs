import React, { useState, useEffect } from 'react';

const BlogStyle = ({ categoryId }) => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/category/data/id/${categoryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const categoryData = await response.json();
        const postIds = categoryData.postInCategory || [];

        const fetchedPosts = await Promise.all(postIds.map(async postId => {
          const postResponse = await fetch(`http://localhost:8080/post/data/id/${postId}`);
          if (!postResponse.ok) {
            throw new Error('Failed to fetch post data');
          }
          return postResponse.json();
        }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPosts();
  }, [categoryId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, categoryId, token: 'YOUR_TOKEN_HERE' }) // Reemplaza 'YOUR_TOKEN_HERE' con tu token real
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Puedes actualizar la lista de publicaciones aquí si lo deseas

      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="blog-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">Create Post</button>
      </form>

      <h2>Posts in Category</h2>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>Contend: {post.content}</p>
            <p>Published by: {post.author}</p>
            <p>Published at: {post.publishedAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogStyle;
