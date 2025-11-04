import axios from 'axios';
import config from '../config';

// Create axios instance with better configuration
const apiClient = axios.create({
  baseURL: `${config.apiUrl}/api`,
  timeout: 30000, // 30 seconds for image uploads
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

// Upload image as base64
export const uploadImageBase64 = async (base64Image) => {
  try {
    const response = await apiClient.post('/upload/image/base64', { image: base64Image });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload image as file
export const uploadImageFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${config.apiUrl}/api/upload/image`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image file:', error);
    throw error;
  }
};

