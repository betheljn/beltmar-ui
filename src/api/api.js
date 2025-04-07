import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5050/api',
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Temporary userId getter (replace later with real context)
export const getUserId = () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.warn('⚠️ No userId found in localStorage');
    return null;
  }
  return userId;
};

// API helper functions
export const fetchStrategies = () => {
    return API.get(`/strategy/user`);
  };  

export const fetchCampaigns = () => {
  const userId = getUserId();
  return API.get('/campaigns', { params: { userId } });
};

export const fetchContent = () => {
  const userId = getUserId();
  return API.get('/content', { params: { userId } });
};

export const fetchCampaignById = (id) => API.get(`/campaigns/${id}`);
export const fetchAgentStats = () => API.get('/agents/stats');

export default API;
  