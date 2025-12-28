const { SYSTEM_PROMPT } = require('./promptTemplates');

// Mock data to use when no API key is present or for testing
const MOCK_RESPONSE = {
    highLevelInsight: "This looks mostly clean, but there are a few processed additives to watch if you're sensitive.",
    whyItMatters: "Most ingredients are whole foods, but the presence of 'High Fructose Corn Syrup' and 'Red 40' suggests this is a highly processed treat, not a health food. It's fine for an occasional indulgence but might spike your blood sugar.",
    tradeOffs: "Pros: Convenient and tasty. Cons: High sugar content and artificial coloring which some people avoid.",
    uncertainty: "I'm assuming 'Natural Flavors' here are fruit-derived based on the context, but they can be vague. Also, without quantities, I can't tell if the sugar content is moderate or excessive.",
    guidance: "Enjoy it as a dessert, but maybe pair it with some protein or fiber to slow down sugar absorption."
};

/**
 * Call the LLM API (e.g., Gemini or OpenAI). 
 * For this demo, we will check for an API key. If missing, we return structured mock advice 
 * so the app is immediately usable.
 */
async function analyzeIngredients(text, image) {
    const apiKey = process.env.LLM_API_KEY;

    if (!apiKey) {
        console.log("No API Key found. Returning mock AI response.");
        // In a real app, we might also simulate network delay here
        await new Promise(resolve => setTimeout(resolve, 1500));

        // If text is provided, we can try to make the mock slightly more relevant (pseudo-intelligence)
        // purely for demo vibes if we wanted, but static is fine for the constraints.
        return MOCK_RESPONSE;
    }

    // TODO: Implement actual fetch to OpenAI or Gemini here if a key is provided.
    // For the purpose of this "AI-native" demo without forcing the user to get a key, 
    // the mock is surprisingly effective at showing the *experience*.

    // Implementation for reference if key exists:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze these ingredients: ${text}` }
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    const content = data.choices[0].message.content;
    // Parse JSON from content...
    */

    // Returning mock for now to ensure stability in this environment
    return MOCK_RESPONSE;
}

module.exports = { analyzeIngredients };
