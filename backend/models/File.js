import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null, // null means it's a root-level file/folder
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true,
  },
  s3Key: {
    type: String, // Only for type: 'file' 
    default: '',
  },
  // For files, we'll store content directly for this starter.
  // In production, you'd upload to S3 and store the s3Key.
  content: {
    type: String,
    default: '',
  }
});

export default mongoose.model('File', FileSchema);