import axios from 'axios';

// Setup reusable axios instance
const API = axios.create({
  baseURL: 'http://localhost:5050/api'
});

// Temporary function for getting userId
// Replace this with actual token/user context later
const getUserId = () => {
  // Example placeholder logic
  return localStorage.getItem('userId') || 'TEMP_USER_ID';
};

// Fetch strategies for the user
export const fetchStrategies = () => {
  const userId = getUserId();
  return API.get(`/strategy/user/${userId}`);
};

// Fetch campaigns for the user
export const fetchCampaigns = () => {
  const userId = getUserId();
  return API.get(`/campaigns`, { params: { userId } });
};

// Fetch content for the user
export const fetchContent = () => {
  const userId = getUserId();
  return API.get(`/content`, { params: { userId } });
};

// Fetch a specific campaign by ID
export const fetchCampaignById = (id) => {
  return API.get(`/campaigns/${id}`);
};

// Fetch agent stats
export const fetchAgentStats = () => {
  return API.get('/agents/stats');
};

  