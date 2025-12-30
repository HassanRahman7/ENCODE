const https = require('https');
const fs = require('fs');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Fetching models...');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            fs.writeFileSync('available_models.json', JSON.stringify(json, null, 2));
            console.log("Written to available_models.json");
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
            console.log("Raw output:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e);
});
