const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY,
    // CLIENT_URL should be set in the server environment (Render) to your frontend URL
    // e.g. https://ai-notes-crud-ahy5.vercel.app
    clientUrl: process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5173')
};

module.exports = config;