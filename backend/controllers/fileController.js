import File from '../models/File.js';

// @desc    Update a file's content
// @route   PUT /api/files/:id
export const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    if (file.type === 'folder') {
      return res.status(400).json({ message: 'Cannot update content of a folder' });
    }

    // In a production app, this is where you'd update the file in S3 
    file.content = content;
    await file.save();

    res.status(200).json({ message: 'File updated', file });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Add more functions for createFile, deleteFile as needed

// @desc    Create a new file or folder
// @route   POST /api/files
export const createFile = async (req, res) => {
  try {
    const { projectId, parentId = null, name, type = 'file', content = '' } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({ message: 'projectId and name are required' });
    }

    const newFile = new File({ projectId, parentId, name, type, content });
    await newFile.save();

    res.status(201).json({ message: 'File created', file: newFile });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a file or folder
// @route   DELETE /api/files/:id
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // If it's a folder, delete all children recursively (simple one-level cascade)
    try {
      if (file.type === 'folder') {
        await File.deleteMany({ parentId: file._id });
      }
      await File.findByIdAndDelete(id);
      return res.status(200).json({ message: 'File deleted' });
    } catch (innerErr) {
      console.error('Error deleting file or its children:', innerErr);
      return res.status(500).json({ message: 'Failed to delete file', error: innerErr.message });
    }
  } catch (error) {
    console.error('deleteFile controller error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Rename a file or folder
// @route   PATCH /api/files/:id/rename
export const renameFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: 'New name is required' });

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Optional: ensure no sibling has the same name
    const duplicate = await File.findOne({ projectId: file.projectId, parentId: file.parentId, name });
    if (duplicate) return res.status(409).json({ message: 'A file with that name already exists' });

    file.name = name;
    await file.save();

    return res.status(200).json({ message: 'File renamed', file });
  } catch (error) {
    console.error('renameFile controller error:', error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};