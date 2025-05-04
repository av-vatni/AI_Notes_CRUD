const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const notesRoutes = require('./routes/notes');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => res.send("API is working"));

app.use('/api/notes',notesRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
