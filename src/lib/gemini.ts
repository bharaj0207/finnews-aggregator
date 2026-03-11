import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function summarizeArticle(text: string): Promise<string> {
  const prompt = `Summarize the following financial news article in under 400 words. Keep it professional, concise, and focused on market impact. Return only plain text.\n\nArticle Outline:\n${text}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error summarizing article with Gemini:", error);
    throw error;
  }
}
