import axios from 'axios';
import config from '../config';

// Create axios instance with better configuration
const apiClient = axios.create({
  baseURL: `${config.apiUrl}/api`,
  timeout: 30000, // Longer timeout for AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('AI API Error:', error.response.data);
      
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      }
    } else if (error.request) {
      // Request made but no response
      console.error('AI Network Error:', error.message);
      error.message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      console.error('AI Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// AI API functions with better error handling
export const summarizeNote = async (noteId) => {
  try {
    console.log(`🤖 Starting AI summary for note ${noteId}...`);
    const response = await apiClient.post(`/ai/summary/${noteId}`);
    console.log('✅ AI summary completed successfully');
    return response;
  } catch (error) {
    console.error('❌ AI summary failed:', error);
    throw error;
  }
};

export const expandNote = async (noteId, expansionType = 'detailed') => {
  try {
    console.log(`🤖 Starting AI expansion for note ${noteId} (${expansionType})...`);
    const response = await apiClient.post(`/ai/expand/${noteId}`, { expansionType });
    console.log('✅ AI expansion completed successfully');
    return response;
  } catch (error) {
    console.error('❌ AI expansion failed:', error);
    throw error;
  }
};

export const generateTags = async (noteId) => {
  try {
    console.log(`🤖 Starting AI tag generation for note ${noteId}...`);
    const response = await apiClient.post(`/ai/generate-tags/${noteId}`);
    console.log('✅ AI tag generation completed successfully');
    return response;
  } catch (error) {
    console.error('❌ AI tag generation failed:', error);
    throw error;
  }
};


