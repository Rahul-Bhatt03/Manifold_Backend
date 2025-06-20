import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String
});

const About = mongoose.model('About', aboutSchema);
export default About;
