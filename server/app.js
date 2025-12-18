const express = require("express");
const cors = require("cors");
const path = require("path");

const config = require('./config');
const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const uploadRoutes = require('./routes/upload');
const auth = require('./middleware/auth');

const app = express();

// CORS
const corsOptions = {};
if (config.clientUrl) {
  corsOptions.origin = config.clientUrl;
  corsOptions.credentials = true;
} else {
  console.warn('⚠️ CLIENT_URL not set. Allowing all origins.');
  corsOptions.origin = true;
  corsOptions.credentials = true;
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Base route
app.get("/", (req, res) => {
  res.json({
    message: "NeuraNotes API is working",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString()
  });
});

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', auth, notesRoutes);
app.use('/api/ai', auth, aiRoutes);
app.use('/api/upload', auth, uploadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong!'
      : err.message || 'Unknown error';

  res.status(500).json({ error: message });
});

module.exports = app;
