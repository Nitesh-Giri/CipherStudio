import axios from 'axios';

const API_URL = 'http://localhost:8008/api';

const api = axios.create({
  baseURL: API_URL,
});

export const createProject = (name) => api.post('/projects', { name });

export const getProject = (id) => api.get(`/projects/${id}`);

export const updateFile = (id, content) => api.put(`/files/${id}`, { content });

export default api;

