import Project from '../models/Project.js';
import { cloudinary } from '../config/cloudinary.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, location, date, link ,status} = req.body;
    
    // Get image URL from Cloudinary (handled by multer middleware)
    const imageUrl = req.file ? req.file.path : null;

    const project = new Project({ 
      title, 
      description, 
      location, 
      date, 
      link,
       status: status || 'ongoing',
      image: imageUrl 
    });
    
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: 'Server error. Could not save project.', error: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (project.image) {
        const publicId = project.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`services/${publicId}`);
      }
      project.image = req.file.path;
    }

    // Update other fields
    if (req.body.title) project.title = req.body.title;
    if (req.body.description) project.description = req.body.description;
    if (req.body.location) project.location = req.body.location;
    if (req.body.link) project.link = req.body.link;
    if (req.body.date) project.date = req.body.date;
    if(req.body.status) project.status = req.body.status

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: 'Error updating project', error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Delete image from Cloudinary if exists
    if (project.image) {
      const publicId = project.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`services/${publicId}`);
    }

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
};