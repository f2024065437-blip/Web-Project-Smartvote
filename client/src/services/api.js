import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://web-project-smartvote-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('🔑 Request config:', config);
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH APIS ==========
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Registration failed' 
    };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
    };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Verification failed' };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Request failed' };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Reset failed' };
  }
};

// ========== VOTE APIS ==========
export const castVote = async (voteData) => {
  try {
    const response = await api.post('/votes/cast', voteData);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to cast vote' };
  }
};

export const checkVoteStatus = async (electionId) => {
  try {
    const response = await api.get(`/votes/check/${electionId}`);
    return response.data;
  } catch (error) {
    return { success: false, hasVoted: false };
  }
};

export const getVotingHistory = async () => {
  try {
    const response = await api.get('/votes/history');
    return response.data;
  } catch (error) {
    return { success: false, data: [] };
  }
};

// ========== RESULT APIS ==========
export const getElectionResults = async (electionId) => {
  try {
    const response = await api.get(`/results/election/${electionId}`);
    return response.data;
  } catch (error) {
    return { success: false, data: null };
  }
};

export const getActiveElections = async () => {
  try {
    const response = await api.get('/results/active');
    return response.data;
  } catch (error) {
    return { success: false, data: [] };
  }
};

// ========== ELECTION APIS ==========
export const getElections = async () => {
  try {
    const response = await api.get('/elections');
    return response.data;
  } catch (error) {
    return { success: false, data: [] };
  }
};

// ========== CANDIDATE APIS ==========
export const getCandidates = async (electionId) => {
  try {
    const response = await api.get(`/candidates/election/${electionId}`);
    return response.data;
  } catch (error) {
    return { success: false, data: [] };
  }
};

export const createCandidate = async (candidateData) => {
  try {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add candidate'
    };
  }
};

export const updateCandidate = async (id, candidateData) => {
  try {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update candidate'
    };
  }
};

export const deleteCandidate = async (id) => {
  try {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete candidate'
    };
  }
};

// ========== ADMIN APIS ==========
export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    return { success: false, data: {} };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    return { success: false, data: { users: [] } };
  }
};

export const getAllElections = async () => {
  try {
    const response = await api.get('/admin/elections');
    return response.data;
  } catch (error) {
    return { success: false, data: [] };
  }
};

export const createElection = async (electionData) => {
  try {
    const response = await api.post('/admin/elections', electionData);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to create election' };
  }
};

export const updateElection = async (id, electionData) => {
  try {
    const response = await api.put(`/admin/elections/${id}`, electionData);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update election' };
  }
};

export const deleteElection = async (id) => {
  try {
    const response = await api.delete(`/admin/elections/${id}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to delete election' };
  }
};

// ========== CREATE ADMIN ==========
export const createAdmin = async () => {
  try {
    const response = await api.post('/auth/create-admin');
    return response.data;
  } catch (error) {
    return { success: false, message: 'Failed to create admin' };
  }
};

export default api;