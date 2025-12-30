const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you there?");
        console.log(`Success with ${modelName}`);
        return true;
    } catch (error) {
        console.error(`Failed with ${modelName}:`, error.message);
        return false;
    }
}

async function runTests() {
    const models = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-pro"
    ];

    for (const m of models) {
        if (await testModel(m)) {
            console.log(`\nRECOMMENDATION: Use model '${m}'`);
            break;
        }
    }
}

runTests();
