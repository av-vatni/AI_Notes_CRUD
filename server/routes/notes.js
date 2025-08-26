const express = require('express');
const router = express.Router();
const Note = require('../models/Note');


router.post('/', async (req, res) => {
    const { title, content, tags, folder, isPinned } = req.body;
    try {
        const note = await Note.create({
            title,
            content,
            tags: tags || [],
            folder: folder || 'General',
            isPinned: isPinned || false
        });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read all notes with filtering and search
router.get('/', async (req, res) => {
    try {
        const { search, tags, folder, sortBy = 'updatedAt', order = 'desc' } = req.query;
        
        let query = {};
        
        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }
        
        // Filter by tags
        if (tags) {
            query.tags = { $in: tags.split(',') };
        }
        
        // Filter by folder
        if (folder) {
            query.folder = folder;
        }
        
        // Sorting
        const sortOptions = {};
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        
        const notes = await Note.find(query)
            .sort(sortOptions)
            .select('-__v');
            
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        const updateData = {
            title,
            content,
            tags,
            folder,
            isPinned,
            isArchived,
            updatedAt: Date.now()
        };
        
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
        res.status(500).json({ error: err.message });
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
