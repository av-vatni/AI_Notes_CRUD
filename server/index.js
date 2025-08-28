const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (simplified, initial-style config)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during MongoDB shutdown:', err);
    process.exit(1);
  }
});

// Routes
app.get("/", (req, res) => res.json({ 
  message: "NeuraNotes API is working", 
  version: "1.0.0",
  status: "online",
  timestamp: new Date().toISOString()
}));

app.use('/api/auth', authRoutes);
app.use('/api/notes', auth, notesRoutes);
app.use('/api/ai', auth, aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
