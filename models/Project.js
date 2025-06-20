import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  link: String,
  date: { type: Date, default: Date.now() },
  location: String,
   status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'on-hold'],
    default: 'ongoing'
  }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
