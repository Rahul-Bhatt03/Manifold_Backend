import Service from '../models/Service.js';
import { cloudinary } from '../config/cloudinary.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching services', error: err.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching service', error: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Get image URL from Cloudinary (handled by multer middleware)
    const imageUrl = req.file ? req.file.path : null;

    const service = new Service({ 
      name, 
      description, 
      image: imageUrl 
    });
    
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ message: 'Server error. Could not save service.', error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (service.image) {
        const publicId = service.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`services/${publicId}`);
      }
      service.image = req.file.path;
    }

    // Update other fields
    if (req.body.name) service.name = req.body.name;
    if (req.body.description) service.description = req.body.description;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: 'Error updating service', error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Delete image from Cloudinary if exists
    if (service.image) {
      const publicId = service.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`services/${publicId}`);
    }

    await Service.deleteOne({ _id: req.params.id });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting service', error: err.message });
  }
};