const { GoogleGenerativeAI } = require("@google/generative-ai");
const { SYSTEM_PROMPT } = require("./promptTemplates");

// ✅ Mock response (KEEP THIS)
const MOCK_RESPONSE = {
  highLevelInsight:
    "This looks mostly clean, but there are a few processed additives to watch if you're sensitive.",
  whyItMatters:
    "Most ingredients are whole foods, but the presence of high fructose corn syrup and artificial coloring suggests this is a highly processed product. It's fine occasionally, but not ideal for frequent consumption.",
  tradeOffs:
    "Pros: Convenient and tasty. Cons: High sugar content and added coloring which some people prefer to avoid.",
  uncertainty:
    "Ingredient quantities are not listed, so the actual impact depends on portion size and frequency. 'Natural flavors' can also vary widely in source.",
  guidance:
    "Occasional consumption is fine, but pairing it with fiber or protein may help reduce sugar spikes."
};

/**
 * Analyze ingredients using Gemini.
 * Falls back to mock data if API key is missing or fails.
 */
async function analyzeIngredients(text, image) {
  const apiKey = process.env.GEMINI_API_KEY;

  // ✅ Fallback if no API key
  if (!apiKey) {
    console.log("⚠️ No GEMINI_API_KEY found. Returning mock AI response.");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return MOCK_RESPONSE;
  }

  try {
    console.log("🚀 Using Gemini API for analysis.");
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
    });

    // 🧠 Force structured JSON output
    const prompt = `
${SYSTEM_PROMPT}

User provided ingredient information:
"${text}"

Respond ONLY in valid JSON using this exact structure:

{
  "highLevelInsight": "",
  "whyItMatters": "",
  "tradeOffs": "",
  "uncertainty": "",
  "guidance": ""
}

Do not include markdown.
Do not include explanations outside JSON.
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // 🛡️ Safe JSON parsing
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid JSON format from Gemini");
    }

    const parsedResponse = JSON.parse(
      rawText.substring(jsonStart, jsonEnd + 1)
    );

    return parsedResponse;
  } catch (error) {
    console.error("❌ Gemini API failed:", error.message);
    console.log("🔁 Falling back to mock response.");
    return MOCK_RESPONSE;
  }
}

module.exports = { analyzeIngredients };
