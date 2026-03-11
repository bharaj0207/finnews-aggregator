import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeArticle(text: string): Promise<string> {
  const prompt = `Summarize the following financial news article in under 1000 words. Keep it professional, concise, and focused on market impact. Return only plain text.\n\nArticle Outline:\n${text}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });
    
    return response.choices[0]?.message?.content || "Could not generate summary.";
  } catch (error) {
    console.error("Error summarizing article with OpenAI:", error);
    throw error;
  }
}
