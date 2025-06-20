import Blog from '../models/Blog.js';
import { cloudinary } from '../config/cloudinary.js';

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    // Get image URL from Cloudinary (handled by multer middleware)
    const imageUrl = req.file ? req.file.path : null;

    const blog = new Blog({
      title,
      content,
      author,
      image: imageUrl,
    });

    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (blog.image) {
        const publicId = blog.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`services/${publicId}`);
      }
      blog.image = req.file.path;
    }

    // Update other fields
    if (req.body.title) blog.title = req.body.title;
    if (req.body.content) blog.content = req.body.content;
    if (req.body.author) blog.author = req.body.author;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Delete image from Cloudinary if exists
    if (blog.image) {
      const publicId = blog.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`services/${publicId}`);
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};