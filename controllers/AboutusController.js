import About from '../models/About.js';
import { cloudinary } from '../config/cloudinary.js';

export const getAllAbouts = async (req, res) => {
  try {
    const abouts = await About.find();
    res.status(200).json(abouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: 'About not found' });
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAbout = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Get image URL from Cloudinary (handled by multer middleware)
    const imageUrl = req.file ? req.file.path : null;

    const about = new About({
      title,
      content,
      image: imageUrl
    });

    const newAbout = await about.save();
    res.status(201).json(newAbout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: 'About not found' });

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (about.image) {
        const publicId = about.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`services/${publicId}`);
      }
      about.image = req.file.path;
    }

    // Update other fields
    if (req.body.title) about.title = req.body.title;
    if (req.body.content) about.content = req.body.content;

    const updatedAbout = await about.save();
    res.status(200).json(updatedAbout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: 'About not found' });

    // Delete image from Cloudinary if exists
    if (about.image) {
      const publicId = about.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`services/${publicId}`);
    }

    const deleted = await About.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'About entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
