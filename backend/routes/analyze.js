const express = require('express');
const router = express.Router();
const { analyzeIngredients } = require('../services/llmService');

router.post('/', async (req, res) => {
    try {
        const { text, image } = req.body;

        if (!text && !image) {
            return res.status(400).json({ error: 'Please provide ingredient text or an image.' });
        }

        // For this MVP, we prioritize text. Image support would need OCR (e.g., Tesseract or a vision model).
        // Passing raw inputs to the service.
        const analysis = await analyzeIngredients(text, image);
        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze ingredients. Please try again.' });
    }
});

module.exports = router;
