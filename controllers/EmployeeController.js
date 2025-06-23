// controllers/EmployeeController.js
import Employee from '../models/Employee.js';

export const createEmployee = async (req, res) => {
  try {
    const { 
      name, 
      position, 
      level, 
      parentId, 
      department,
      education,
      experience,
      projects,
      skills,
      certifications
    } = req.body;
    
    const image = req.file?.path;

    if (!image) {
      return res.status(400).json({ message: 'Employee image is required' });
    }

    // Parse JSON strings if needed
    const parsedEducation = education ? JSON.parse(education) : [];
    const parsedExperience = experience ? JSON.parse(experience) : [];
    const parsedProjects = projects ? JSON.parse(projects) : [];
    const parsedSkills = skills ? JSON.parse(skills) : [];
    const parsedCertifications = certifications ? JSON.parse(certifications) : [];

    const employee = await Employee.create({
      name,
      position,
      image,
      level,
      parentId,
      department,
      education: parsedEducation,
      experience: parsedExperience,
      projects: parsedProjects,
      skills: parsedSkills,
      certifications: parsedCertifications
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrgChart = async (req, res) => {
  try {
    const employees = await Employee.find({ isDeleted: false }).sort({ level: 1 });
    
    const buildTree = (parentId = null) => {
      return employees
        .filter(emp => String(emp.parentId) === String(parentId))
        .map(emp => ({
          ...emp.toObject(),
          children: buildTree(emp._id)
        }));
    };

    const orgChart = buildTree();
    res.json(orgChart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      position, 
      level, 
      parentId, 
      department,
      education,
      experience,
      projects,
      skills,
      certifications
    } = req.body;
    
    let updateData = { 
      name, 
      position, 
      level, 
      parentId, 
      department,
      education: education ? JSON.parse(education) : [],
      experience: experience ? JSON.parse(experience) : [],
      projects: projects ? JSON.parse(projects) : [],
      skills: skills ? JSON.parse(skills) : [],
      certifications: certifications ? JSON.parse(certifications) : []
    };

    if (req.file?.path) {
      updateData.image = req.file.path;
      
      // Delete old image from Cloudinary (optional)
      const oldEmployee = await Employee.findById(id);
      if (oldEmployee.image) {
        const publicId = oldEmployee.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`services/${publicId}`);
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete by setting isDeleted to true
    const employee = await Employee.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isDeleted: false })
      .select('name position level department image');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false
    }).lean();

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Universal array handler
    const ensureArray = (field) => {
      if (field === null || field === undefined) return [];
      return Array.isArray(field) ? field : [field];
    };

    // Universal date transformer
    const transformDate = (date) => {
      if (!date) return null;
      if (date instanceof Date) return date.toISOString();
      if (typeof date === 'object' && date.$date) return new Date(date.$date).toISOString();
      return date;
    };

    // Universal ID transformer
    const transformId = (id) => {
      if (!id) return null;
      if (typeof id === 'object' && id.$oid) return id.$oid;
      return id.toString();
    };

    const transformExperience = (exp) => ({
      ...exp,
      _id: transformId(exp._id),
      startDate: transformDate(exp.startDate),
      endDate: transformDate(exp.endDate),
      responsibilities: ensureArray(exp.responsibilities)
        .filter(resp => typeof resp === 'string')
    });

    const transformEducation = (edu) => ({
      ...edu,
      _id: transformId(edu._id),
      yearGraduated: parseInt(edu.yearGraduated) || edu.yearGraduated
    });

    const transformProject = (proj) => ({
      ...proj,
      _id: transformId(proj._id),
      technologies: ensureArray(proj.technologies)
        .filter(tech => typeof tech === 'string')
    });

    const transformedEmployee = {
      ...employee,
      _id: transformId(employee._id),
      createdAt: transformDate(employee.createdAt),
      updatedAt: transformDate(employee.updatedAt),
      
      // Transform all array fields consistently
      education: ensureArray(employee.education).map(transformEducation),
      experience: ensureArray(employee.experience).map(transformExperience),
      projects: ensureArray(employee.projects).map(transformProject),
      skills: ensureArray(employee.skills).filter(skill => typeof skill === 'string'),
      certifications: ensureArray(employee.certifications).filter(cert => typeof cert === 'string')
    };

    res.json(transformedEmployee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ 
      message: 'Failed to fetch employee',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};