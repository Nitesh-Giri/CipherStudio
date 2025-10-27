import axios from 'axios';

const API_URL = 'http://localhost:8008/api';

const api = axios.create({
  baseURL: API_URL,
});

export const createProject = (name) => api.post('/projects', { name });

export const getProject = (id) => api.get(`/projects/${id}`);

export const updateFile = (id, content) => api.put(`/files/${id}`, { content });

export const createFile = (payload) => api.post('/files', payload);

export const deleteFile = (id) => api.delete(`/files/${id}`);

export const renameFile = (id, name) => api.patch(`/files/${id}/rename`, { name });

// Snapshot APIs
export const saveSnapshot = (payload) => api.post('/snapshots', payload);
export const listSnapshots = (projectId) => api.get(`/snapshots/${projectId}`);
export const restoreSnapshot = (snapshotId) => api.post(`/snapshots/${snapshotId}/restore`);

export default api;

