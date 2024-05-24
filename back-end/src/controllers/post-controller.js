import jwt from 'jsonwebtoken';
import config from '../config.js';
import User from '../models/user-model.js'
import Category from '../models/category-model.js'
import Post from '../models/post-model.js';

// controllers/post-controller.js

export const createPost = async (req, res) => {
  try {
    const { title, content, categoryId, token, publishedAt } = req.body;

    if (!token) {
      return res.status(403).json({ message: 'Token no proporcionado' });
    }

    let userId = "";

    jwt.verify(token, config.app.secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido', isAuthenticated: false });
      } else {
        userId = decoded.id;
        console.log("ID del usuario:", userId);
      }
    });

    const user = await User.findOne({ _id: userId }).select('-password');

    if (!user) {
      console.log("ERROR: No se encontró ningún usuario con el correo electrónico proporcionado");
    }
    
    const author = `${user.name} ${user.surname}`;

    const post = new Post({
      title,
      content,
      author,
      category: categoryId,
      publishedAt
    });

    await post.save();

    // Actualizar la categoría con el ID del nuevo post
    await Category.findByIdAndUpdate(
      categoryId,
      { $push: { postInCategory: post._id } },
      { new: true }
    );

    res.status(201).json({ success: true, message: 'Post creado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el post.' });
  }
};

// Obtener todas las publicaciones
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author').populate('category');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una publicación por ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una publicación
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, category },
      { new: true, runValidators: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una publicación
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


