import Snapshot from '../models/Snapshot.js';
import File from '../models/File.js';

// Save a snapshot for a project
export const saveSnapshot = async (req, res) => {
  try {
    const { projectId, data } = req.body;
    if (!projectId || !data) return res.status(400).json({ message: 'projectId and data required' });

    const snap = new Snapshot({ projectId, data });
    await snap.save();
    return res.status(201).json({ message: 'Snapshot saved', snapshot: snap });
  } catch (err) {
    console.error('saveSnapshot error', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// List snapshots for a project
export const listSnapshots = async (req, res) => {
  try {
    const { projectId } = req.params;
    const snaps = await Snapshot.find({ projectId }).sort({ createdAt: -1 });
    return res.status(200).json({ snapshots: snaps });
  } catch (err) {
    console.error('listSnapshots error', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Restore a snapshot to the project (overwrites files in DB)
export const restoreSnapshot = async (req, res) => {
  try {
    const { id } = req.params; // snapshot id
    const snap = await Snapshot.findById(id);
    if (!snap) return res.status(404).json({ message: 'Snapshot not found' });

    const { projectId, data } = snap;
    const { files } = data;

    // For simplicity, we'll replace project files (non-recursive). Delete existing files and re-create.
    await File.deleteMany({ projectId });
    if (Array.isArray(files)) {
      for (const f of files) {
        const newF = new File({ projectId, parentId: f.parentId || null, name: f.name, type: f.type, content: f.content || '' });
        await newF.save();
      }
    }

    return res.status(200).json({ message: 'Snapshot restored' });
  } catch (err) {
    console.error('restoreSnapshot error', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
