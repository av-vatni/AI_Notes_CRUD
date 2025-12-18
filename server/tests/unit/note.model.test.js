const mongoose = require('mongoose');
const Note = require('../../models/Note');

describe('Note Model', () => {

  test('should create a valid note', async () => {
    const note = await Note.create({
      title: 'Test Note',
      content: 'This is a test note',
      tags: ['ai', 'notes'],
      userId: new mongoose.Types.ObjectId()
    });

    expect(note._id).toBeDefined();
    expect(note.title).toBe('Test Note');
  });

  test('should fail without title', async () => {
    let error;

    try {
      await Note.create({
        content: 'Missing title',
        userId: new mongoose.Types.ObjectId()
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
  });

  test('should fail without content', async () => {
    let error;

    try {
      await Note.create({
        title: 'No Content',
        userId: new mongoose.Types.ObjectId()
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.content).toBeDefined();
  });

});
