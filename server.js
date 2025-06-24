import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import aboutRoutes from './routes/aboutUsRoutes.js';
import connectDB from './config/Db.js';
import uploadRoutes from './routes/uploadRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';

dotenv.config();

//connect to database
connectDB();

const app = express();
const port = process.env.PORT || 5000; 


// Middleware
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/abouts', aboutRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/employees', employeeRoutes);



// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
