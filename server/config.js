const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY,
    clientUrl: process.env.NODE_ENV === 'production' 
        ? 'https://neura-notes.vercel.app'  // We'll set this up on Vercel
        : 'http://localhost:5173'
};

module.exports = config;