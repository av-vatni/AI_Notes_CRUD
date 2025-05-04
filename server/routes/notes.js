const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Create
router.post('/', async (req, res)=>{
    const {title, content} = req.body;
    try{
        const note = await Note.create({title,content});
        res.json(note);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// Read all reqs:
router.get('/', async(req, res)=>{
    const notes = await Note.find().sort({createdAt: -1});
    res.json(notes);
});

// Read single note
router.get('/:id',async (req, res)=>{
    const note = await Note.findById(req.params.id);
    res.json(note);
})
// UPDATE
router.put('/:id',async (req, res)=>{
    const {title, content} = req.body;
    const updateNote = await Note.findByIdAndUpdate(req.params.id, {title, content}, {new: true});
    res.json(updateNote);
})

// DELETE
router.delete('/:id', async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);
    res.json({message: "Note deleted"});
})

module.exports = router;