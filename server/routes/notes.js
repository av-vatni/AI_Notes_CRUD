const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.post('/', async (req, res) => {
    const { title, content, tags, folder, isPinned } = req.body;
    
    // Validate required fields
    if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    try {
        const userId = req.user._id;
        
        const note = await Note.create({
            title: title.trim(),
            content: content || '',
            tags: Array.isArray(tags) ? tags.filter(tag => tag && tag.trim()) : [],
            folder: folder || 'General',
            isPinned: isPinned || false,
            userId: userId
        });
        
        console.log(`✅ Note created: ${note.title} (ID: ${note._id})`);
        res.status(201).json(note);
    } catch (err) {
        console.error('❌ Error creating note:', err);
        res.status(500).json({ error: 'Failed to create note', details: err.message });
    }
});

// Read all notes with filtering and search
router.get('/', async (req, res) => {
    try {
        const { search, tags, folder, sortBy = 'updatedAt', order = 'desc' } = req.query;
        
        let query = { userId: req.user._id };
        
        // Add user filtering when auth is implemented
        // if (req.user?.id) {
        //     query.userId = req.user.id;
        // }
        
        if (search && search.trim()) {
            // Use regex search instead of text index for better compatibility
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { content: searchRegex },
                { tags: searchRegex }
            ];
        }
        
        if (tags && tags.trim()) {
            const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            if (tagArray.length > 0) {
                query.tags = { $in: tagArray };
            }
        }
        
        if (folder && folder.trim()) {
            query.folder = folder.trim();
        }
        
        const sortOptions = {};
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        
        const notes = await Note.find(query)
            .sort(sortOptions)
            .select('-__v')
            .limit(1000); // Prevent excessive data retrieval
            
        console.log(`📝 Retrieved ${notes.length} notes`);
        res.json(notes);
    } catch (err) {
        console.error('❌ Error retrieving notes:', err);
        res.status(500).json({ error: 'Failed to retrieve notes', details: err.message });
    }
});

// Read single note
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    try {
        const { title, content, tags, folder, isPinned, isArchived } = req.body;
        
        // Validate content size (MongoDB document limit is 16MB, but we'll be more conservative)
        if (content && content.length > 10 * 1024 * 1024) { // 10MB limit
            return res.status(400).json({ 
                error: 'Content too large. Please reduce image sizes or remove some images.',
                details: `Content size: ${(content.length / 1024 / 1024).toFixed(2)}MB (max 10MB)`
            });
        }
        
        // Check if note belongs to user
        const existingNote = await Note.findById(req.params.id);
        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        
        if (existingNote.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to update this note' });
        }
        
        const updateData = {
            title,
            content,
            tags,
            folder,
            isPinned,
            isArchived,
            updatedAt: Date.now()
        };
        
        // Remove undefined fields
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );
        
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        
        res.json(updatedNote);
    } catch (err) {
        console.error('❌ Error updating note:', err);
        // Log request context to help debugging
        console.error('Request params:', req.params);
        console.error('Request body keys:', Object.keys(req.body || {}));
        console.error('Content length:', req.body?.content?.length);
        
        // Provide more specific error messages
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation error', 
                details: Object.values(err.errors).map(e => e.message).join(', ')
            });
        }
        
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid note ID format' });
        }
        
        res.status(500).json({ 
            error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
            details: err.stack
        });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: "Note deleted", note: deletedNote });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all tags
router.get('/tags/all', async (req, res) => {
    try {
        const tags = await Note.distinct('tags');
        res.json(tags.filter(tag => tag && tag.trim() !== ''));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all folders
router.get('/folders/all', async (req, res) => {
    try {
        const folders = await Note.distinct('folder');
        res.json(folders.filter(folder => folder && folder.trim() !== ''));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle pin status
router.patch('/:id/toggle-pin', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        
        note.isPinned = !note.isPinned;
        note.updatedAt = Date.now();
        await note.save();
        
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Archive/Unarchive note
router.patch('/:id/toggle-archive', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        
        note.isArchived = !note.isArchived;
        note.updatedAt = Date.now();
        await note.save();
        
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
