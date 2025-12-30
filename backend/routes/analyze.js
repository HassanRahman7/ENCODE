const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractTextFromImage } = require('../services/ocrService');
const { analyzeIngredients } = require('../services/llmService');

// Configure multer for memory storage (stateless)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * POST /api/analyze
 * Accepts multipart/form-data.
 * - Field 'image': file upload
 * - Field 'text': raw text string
 */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        let textToAnalyze = req.body.text;

        // 1. OCR Step (if image provided)
        if (req.file) {
            console.log('Image received. Running OCR...');
            const ocrText = await extractTextFromImage(req.file.buffer);
            console.log('OCR Result:', ocrText.substring(0, 100) + '...');

            // Prefer OCR text if both are present, or combine/fallback?
            // Strategy: Use OCR text if successful.
            if (ocrText && ocrText.length > 5) {
                textToAnalyze = ocrText;
            } else if (!textToAnalyze) {
                return res.status(400).json({ error: 'Could not extract readable text from image.' });
            }
        }

        // 2. Validation
        if (!textToAnalyze || textToAnalyze.trim().length === 0) {
            return res.status(400).json({ error: 'Please provide ingredient text or a valid image.' });
        }

        // 3. LLM Step
        console.log('Sending to LLM...');
        const analysis = await analyzeIngredients(textToAnalyze);

        // 4. Response
        res.json(analysis);

    } catch (error) {
        console.error('Analysis Route Error:', error);
        res.status(500).json({ error: 'Internal Server Error during analysis.' });
    }
});

module.exports = router;
