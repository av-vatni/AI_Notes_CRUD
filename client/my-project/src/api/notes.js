import axios from 'axios';

const API = 'http://localhost:5000/api/notes';

// Create axios instance with better configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
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
      console.error('API Error:', error.response.data);
      
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      error.message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API functions with better error handling
export const getNotes = async () => {
  try {
    const response = await apiClient.get('/notes');
    return response;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getNote = async (id) => {
  try {
    const response = await apiClient.get(`/notes/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching note ${id}:`, error);
    throw error;
  }
};

export const createNote = async (note) => {
  try {
    const response = await apiClient.post('/notes', note);
    console.log('Note created successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const updateNote = async (id, note) => {
  try {
    const response = await apiClient.put(`/notes/${id}`, note);
    console.log(`Note ${id} updated successfully:`, response.data);
    return response;
  } catch (error) {
    console.error(`Error updating note ${id}:`, error);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    const response = await apiClient.delete(`/notes/${id}`);
    console.log(`Note ${id} deleted successfully`);
    return response;
  } catch (error) {
    console.error(`Error deleting note ${id}:`, error);
    throw error;
  }
};