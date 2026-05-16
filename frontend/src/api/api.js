import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Candidate APIs
export const addCandidate = (data) => API.post('/api/candidates', data);
export const getCandidates = (params) => API.get('/api/candidates', { params });
export const deleteCandidate = (id) => API.delete(`/api/candidates/${id}`);

// Match API
export const matchCandidates = (data) => API.post('/api/match', data);

// AI API
export const aiShortlist = (data) => API.post('/api/ai/shortlist', data);

export default API;
