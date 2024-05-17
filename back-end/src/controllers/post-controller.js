import Post from '../models/post-model.js';

// Crear una nueva publicación
export const createPost = async (req, res) => {
  try {
    const { title, content, category, author } = req.body;
    const newPost = new Post({
      title,
      content,
      author: author,  //req.user._id, // Asumiendo que el usuario está autenticado y su ID está disponible en req.user
      category
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const post = await Post.findById(id).populate('author').populate('category');
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