const Tesseract = require('tesseract.js');

/**
 * Extracts text from an image buffer using Tesseract.js.
 * @param {Buffer} imageBuffer - The image data as a buffer.
 * @returns {Promise<string>} - The extracted text.
 */
async function extractTextFromImage(imageBuffer) {
    try {
        console.log('Starting OCR processing...');
        const result = await Tesseract.recognize(
            imageBuffer,
            'eng',
            {
                logger: m => {
                    // Optional: Log progress only if needed, keeping it quiet for now to reduce noise
                    if (m.status === 'recognizing text' && m.progress % 0.5 === 0) {
                        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                    }
                }
            }
        );

        const text = result.data.text;
        console.log('OCR processing complete.');
        // Basic cleanup: remove excessive whitespace
        return text.trim();
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from image.');
    }
}

module.exports = {
    extractTextFromImage,
};
