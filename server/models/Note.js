const mongoose = require('mongoose');

// Creating note schema
const NoteSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String},
    createdAt: {type: Date, defalut:  Date.now},
});

module.exports = mongoose.model('Note', NoteSchema);