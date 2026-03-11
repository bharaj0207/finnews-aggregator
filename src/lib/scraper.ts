import * as cheerio from "cheerio";

export interface ScrapedData {
  imageUrl: string | null;
  text: string;
}

export async function scrapeArticle(url: string): Promise<ScrapedData> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract og:image
    let imageUrl = $('meta[property="og:image"]').attr("content") || null;
    
    // Fallback image scraping
    if (!imageUrl) {
        imageUrl = $('meta[name="twitter:image"]').attr("content") || null;
    }

    // Extract main paragraph text (simplistic heuristic: getting all p tags)
    // For more robust scraping, one might look for specific article body classes
    const paragraphs: string[] = [];
    $("p").each((_, element) => {
      const text = $(element).text().trim();
      if (text.length > 50) {
        // Only consider paragraphs with significant text
        paragraphs.push(text);
      }
    });

    const text = paragraphs.join("\n\n");

    return {
      imageUrl,
      text: text.substring(0, 5000), // Limit text sent to Gemini to avoid token limits
    };
  } catch (error) {
    console.error(`Error scraping article ${url}:`, error);
    throw error;
  }
}
