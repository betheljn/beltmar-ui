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

export const fetchAgentLogs = ({ page = 1, limit = 10, agentType = '' } = {}) => {
    return API.get('/agents/logs', {
      params: { page, limit, agentType }
    });
  };  

export const createCampaignPlan = (data) => {
    return API.post('/campaigns', data);
  };  

export const updateCampaignPlanStatus = (id, status) => {
    return API.patch(`/campaigns/${id}/status`, { status });
  };

export const deleteCampaignPlan = (id) => {
    return API.delete(`/campaigns/${id}`);
  };

export const updateCampaignPlan = (id, data) => {
    return API.put(`/campaigns/${id}`, data); // ✅ API has baseURL set to localhost:5050
  };
  
export const fetchContentAssets = async (filters = {}, token) => {
    const params = new URLSearchParams(filters).toString();
  
    const res = await fetch(`/api/content?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    if (!res.ok) throw new Error('Failed to fetch content assets');
  
    return await res.json();
  };
  
export const updateContent = (id, data) =>
    fetch(`/api/content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data),
    }).then(res => res.json());
  
export const regenerateContentAI = (data) =>
    fetch(`/api/content/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data),
    }).then(res => res.json());

export const deleteContent = (id) =>
    fetch(`/api/content/${id}`, {
        method: 'DELETE',
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
          }
    }).then(res => res.json());
  
export default API;
  