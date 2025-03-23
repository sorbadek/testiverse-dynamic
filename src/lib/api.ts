
import axios from 'axios';
import { toast } from 'sonner';

// Base URL for the API
// In production, you would use an environment variable
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api'
  : 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      localStorage.removeItem('authToken');
      toast.error('Your session has expired. Please log in again.');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Helper function for handling API errors in components
export const handleApiError = (error: unknown, customMessage?: string) => {
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error) && error.response) {
    const serverMessage = error.response.data?.message;
    toast.error(serverMessage || customMessage || 'An error occurred');
  } else {
    toast.error(customMessage || 'An unexpected error occurred');
  }
};

// Test endpoints
export const testAPI = {
  getAllTests: () => api.get('/tests'),
  getTest: (id: string) => api.get(`/tests/${id}`),
  createTest: (testData: any) => api.post('/tests', testData),
  updateTest: (id: string, testData: any) => api.put(`/tests/${id}`, testData),
  deleteTest: (id: string) => api.delete(`/tests/${id}`)
};

// Result endpoints
export const resultAPI = {
  getUserResults: () => api.get('/results'),
  getResult: (id: string) => api.get(`/results/${id}`),
  submitTest: (resultData: any) => api.post('/results', resultData),
  getAllResults: () => api.get('/results/all')
};

// Auth endpoints
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData: any) => api.put('/auth/profile', userData),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => 
    api.post('/auth/reset-password', { token, password })
};
