// Use Vite environment variable VITE_API_URL in production/staging.
// Set VITE_API_URL in Vercel to your backend URL (e.g. https://ai-notes-crud.onrender.com)
const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000'
};

export default config;