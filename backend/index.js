import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';


import projectRoutes from './routes/projectRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected successfully.'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('CipherStudio Backend is running!');
});

app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});