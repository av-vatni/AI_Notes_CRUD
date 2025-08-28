const mongoose = require('mongoose');

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
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Update the updatedAt field before saving
NoteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Add compound index for better query performance
NoteSchema.index({ userId: 1, updatedAt: -1 });
NoteSchema.index({ userId: 1, isPinned: 1, updatedAt: -1 });
NoteSchema.index({ userId: 1, folder: 1, updatedAt: -1 });
NoteSchema.index({ userId: 1, tags: 1, updatedAt: -1 });

module.exports = mongoose.model('Note', NoteSchema);
