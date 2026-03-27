const { GoogleGenAI } = require('@google/genai');

let ai;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function handleChat(message, properties) {
    if (!ai) {
        return "Please set your GEMINI_API_KEY in the .env file to use the Chatbot functionality.";
    }

    const context = `You are an AI Real Estate Assistant. 
The user is looking for properties. Here is the list of available properties in JSON:
${JSON.stringify(properties, null, 2)}

Respond to the user's message concisely. Suggest the best matching properties based on their query (budget, location, bedrooms, features, etc). 
Always mention the Property ID and Title for them to easily find it in the UI. Keep responses helpful, engaging, and professional.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: context }] },
                { role: 'user', parts: [{ text: message }] }
            ]
        });
        return response.text;
    } catch (error) {
        console.error('LLM Error:', error);
        return "I encountered an error connecting to the AI. " + error.message;
    }
}

module.exports = { handleChat };
