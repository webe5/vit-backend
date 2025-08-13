const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// POST route for /generate-notes
app.post('/generate-notes', (req, res) => {
    const { text, format } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    // Example logic: split text into sentences and format
    let notes = '';
    let noteCount = 0;

    if (format === 'bullets') {
        notes = text
            .split(/[.!?]/)
            .filter(s => s.trim())
            .map(s => `• ${s.trim()}`)
            .join('<br>');
        noteCount = notes.split('<br>').length;
    } 
    else if (format === 'highlights') {
        notes = `<mark>${text}</mark>`;
        noteCount = 1;
    } 
    else if (format === 'keywords') {
        const words = text.split(/\s+/);
        const keywords = [...new Set(words.filter(w => w.length > 5))];
        notes = keywords.join(', ');
        noteCount = keywords.length;
    } 
    else if (format === 'summary') {
        notes = text.split(/[.!?]/).slice(0, 2).join('. ') + '.';
        noteCount = 1;
    } 
    else {
        notes = text;
        noteCount = 1;
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    res.json({
        notes,
        wordCount,
        noteCount
    });
});

app.listen(5000, () => {
    console.log('✅ Backend running on http://localhost:5000');
});
