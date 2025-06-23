// models/Employee.js
import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  yearGraduated: {
    type: Number,
    required: true
  },
  fieldOfStudy: {
    type: String,
    required: true
  }
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  responsibilities: {
    type: [String],
    required: true
  }
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: {
    type: [String],
    required: true
  },
  role: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  }
});

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4] // 1=CEO, 2=Executives, 3=Managers, 4=Staff
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  department: {
    type: String,
    enum: ['Executive', 'Engineering', 'Operations', 'Finance', 'HR', 'Marketing'],
    required: true
  },
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: {
    type: [String],
    default: []
  },
  certifications: {
    type: [String],
    default: []
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;