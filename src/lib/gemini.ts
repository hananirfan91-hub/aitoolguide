import { GoogleGenAI } from "@google/genai";

// Avoid ReferenceError in Vite by safely checking process
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  return import.meta.env.VITE_GEMINI_API_KEY;
};

const ai = new GoogleGenAI({
  apiKey: getApiKey(),
});

export const generateSEODescription = async (content: string, keywords: string) => {
  if (!content) return "Please add some content first to generate a description.";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert SEO specialist. Create a highly engaging, concise meta description (max 150 characters) summarizing the following blog post content. Incorporate these keywords naturally if possible: "${keywords}". Ensure it reads well and drives clicks. Return ONLY the meta description text without quotes or explanation. 

Content snippet: 
${content.substring(0, 3000)}`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return "Error generating AI description. Please try again or assure API key is configured.";
  }
};
