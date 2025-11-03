const config = {
    apiUrl: import.meta.env.PROD 
        ? 'https://neura-notes-api.onrender.com'  // We'll set this up on Render
        : 'http://localhost:5000'
};

export default config;