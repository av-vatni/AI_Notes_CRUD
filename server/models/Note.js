const mongoose = require('mongoose');

// Creating note schema
const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    tags: [{ type: String }],
    folder: { type: String, default: 'General' },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    aiSummary: { type: String },
    voiceNote: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Update the updatedAt field before saving
NoteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Add text index for search functionality
NoteSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Note', NoteSchema);