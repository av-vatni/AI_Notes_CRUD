const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// CREATE
router.post('/', async (req, res) => {
  const { title, content, tags, folder } = req.body;
  try {
    const note = await Note.create({ title, content, tags, folder });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

// READ SINGLE
router.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.json(note);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { title, content, tags, folder } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content, tags, folder },
    { new: true }
  );
  res.json(updatedNote);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
});

module.exports = router;
