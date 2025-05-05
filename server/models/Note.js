const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  tags: [{ type: String }],             // ➕ Add tags
  folder: { type: String },             // ➕ Add folder
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', NoteSchema);
