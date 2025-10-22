import Project from '../models/Project.js';
import File from '../models/File.js';

// @desc    Create a new project
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name } = req.body;
    
    // 1. Create the new project
    const newProject = new Project({ name: name || 'MyProject' });
    await newProject.save();

    // 2. Create the root folder for this project 
    const rootFolder = new File({
      projectId: newProject._id,
      parentId: null,
      name: name || 'MyProject',
      type: 'folder',
    });
    await rootFolder.save();

    // 3. Create a default package.json 
    const packageJson = new File({
      projectId: newProject._id,
      parentId: rootFolder._id,
      name: 'package.json',
      type: 'file',
      content: JSON.stringify({
        "name": "react-project",
        "version": "1.0.0",
        "dependencies": { "react": "latest", "react-dom": "latest" }
      }, null, 2)
    });
    await packageJson.save();

    // 4. Create a default App.js 
    const appJs = new File({
      projectId: newProject._id,
      parentId: rootFolder._id,
      name: 'App.js',
      type: 'file',
      content: `import React from 'react';

export default function App() {
  return <h1>Hello, CipherStudio!</h1>;
}`
    });
    await appJs.save();

    res.status(201).json({
      message: 'Project created successfully',
      projectId: newProject._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a project and all its files
// @route   GET /api/projects/:id
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find all files associated with this project 
    const files = await File.find({ projectId: id });

    res.status(200).json({ project, files });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};