import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
