const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
let GoogleGenerativeAI;
try {
    GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (_) {
    GoogleGenerativeAI = null;
}

// Generate AI summary for a note
router.post('/summary/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);
        
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        const providedKey = process.env.GEMINI_API_KEY;
        if (!providedKey) {
            return res.status(500).json({ error: 'Server not configured: set GEMINI_API_KEY in server .env' });
        }

        if (!GoogleGenerativeAI) {
            return res.status(500).json({ error: 'Gemini SDK (@google/generative-ai) not installed on server.' });
        }

        const genAI = new GoogleGenerativeAI(providedKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Summarize the following note in 2-3 sentences, focusing on the key ideas and action items. Return only the summary.\n\nTitle: ${note.title}\nContent (HTML allowed):\n${note.content}`;

        let aiSummary = '';
        try {
            const result = await model.generateContent(prompt);
            aiSummary = result.response.text().trim();
        } catch (gemErr) {
            return res.status(502).json({ error: 'Gemini request failed', details: String(gemErr?.message || gemErr) });
        }

        note.aiSummary = aiSummary;
        note.updatedAt = Date.now();
        await note.save();

        res.json({ summary: aiSummary, note });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Expand note content with AI suggestions
router.post('/expand/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;
        const { expansionType } = req.body; // 'detailed', 'creative', 'academic', etc.
        
        const note = await Note.findById(noteId);
        
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        const providedKey = process.env.GEMINI_API_KEY;
        if (!providedKey) {
            return res.status(500).json({ error: 'Server not configured: set GEMINI_API_KEY in server .env' });
        }

        if (!GoogleGenerativeAI) {
            return res.status(500).json({ error: 'Gemini SDK (@google/generative-ai) not installed on server.' });
        }

        const genAI = new GoogleGenerativeAI(providedKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const styleInstruction = expansionType === 'creative' ? 'Add creative perspectives and examples' : expansionType === 'academic' ? 'Add academic rigor, references, and methodology suggestions' : 'Add detailed explanations and actionable steps';
        const prompt = `Expand the following note. Maintain the original content and append an expanded section with a clear heading. Use the style: ${styleInstruction}. Keep it concise (200-300 words).\n\nOriginal note title: ${note.title}\nOriginal content (HTML allowed):\n${note.content}`;

        let expandedAppend = '';
        try {
            const result = await model.generateContent(prompt);
            expandedAppend = result.response.text().trim();
        } catch (gemErr) {
            return res.status(502).json({ error: 'Gemini request failed', details: String(gemErr?.message || gemErr) });
        }

        const expandedContent = `${note.content}\n\n${expandedAppend}`;
        note.content = expandedContent;
        note.updatedAt = Date.now();
        await note.save();

        res.json({ expandedContent, note });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generate tags for a note using AI
router.post('/generate-tags/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);
        
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        const providedKey = process.env.GEMINI_API_KEY;
        if (!providedKey) {
            return res.status(500).json({ error: 'Server not configured: set GEMINI_API_KEY in server .env' });
        }

        if (!GoogleGenerativeAI) {
            return res.status(500).json({ error: 'Gemini SDK (@google/generative-ai) not installed on server.' });
        }

        const genAI = new GoogleGenerativeAI(providedKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Suggest 3-5 concise tags for the following note. Return ONLY a JSON array of lowercase tag strings (no extra text).\n\nTitle: ${note.title}\nContent (HTML allowed):\n${note.content}`;

        let uniqueTags = [];
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim() || '[]';
            try {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    uniqueTags = parsed.map(t => String(t).toLowerCase()).slice(0, 5);
                }
            } catch (_) {
                uniqueTags = [];
            }
        } catch (gemErr) {
            return res.status(502).json({ error: 'Gemini request failed', details: String(gemErr?.message || gemErr) });
        }

        res.json({ suggestedTags: uniqueTags, note });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
