import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'MyProject',
  },
  // We can add a reference to a User later if implementing auth 
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Project', ProjectSchema);