const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SYSTEM_PROMPT } = require('./promptTemplates');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes ingredient text using Gemini model.
 * @param {string} ingredientText - The raw ingredient text.
 * @returns {Promise<object>} - The structured JSON analysis.
 */
async function analyzeIngredients(ingredientText) {
  try {
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    console.log("Using Gemini Model:", modelName);
    const model = genAI.getGenerativeModel({ model: modelName });

    // Combine system prompt and user input
    const prompt = `${SYSTEM_PROMPT}\n\nInput Text:\n"${ingredientText}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Raw LLM Response:", text);

    // cleanup markdown if present (sometimes models add it despite instructions)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    console.error('LLM Analysis Error:', error);
    // Fallback mock response for demo purposes if API key fails or quota exceeded
    return {
      highLevelInsight: "Unable to reach AI service (Mock Response).",
      whyItMatters: "We encountered an error analyzing the ingredients directly. This is a fallback.",
      tradeOffs: "Analysis not live.",
      uncertainty: "System error.",
      primaryRecommendation: "Please check your backend configuration.",
      contextualExplanation: "We could not reach the analysis service to provide a contextual recommendation.",
      uiState: "yellow"
    };
  }
}

module.exports = {
  analyzeIngredients,
};
