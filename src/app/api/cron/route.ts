import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { scrapeArticle } from "@/lib/scraper";
import { summarizeArticle } from "@/lib/openai";

const RSS_FEEDS = [
  { source: "Economic Times", url: "https://economictimes.indiatimes.com/markets/rssfeeds/2146842.cms" },
  { source: "Moneycontrol", url: "https://www.moneycontrol.com/rss/latestnews.xml" },
  { source: "Livemint", url: "https://www.livemint.com/rss/markets" },
  { source: "Financial Express", url: "https://www.financialexpress.com/feed/" },
  { source: "NDTV Profit", url: "https://feeds.feedburner.com/ndtvprofit-latest" },
  { source: "Wall Street Journal", url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml" }
];

const parser = new Parser();
const MAX_ARTICLES_PER_RUN = 15;

// Next.js Route configs
export const maxDuration = 300; // max 5 min timeout for free tier
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization Header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let processedCount = 0;
    const results = [];

    // 2. Fetch and parse all feeds concurrently
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const feedData = await parser.parseURL(feed.url);
        return feedData.items.map(item => ({ ...item, source: feed.source }));
      } catch (error) {
        console.error(`Error processing feed ${feed.url}:`, error);
        return [];
      }
    });

    const nestedItems = await Promise.all(feedPromises);
    
    // 3. Flatten and sort all items by date descending (newest first)
    const allItems = nestedItems.flat().sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return dateB - dateA; // Descending
    });

    // 4. Process the newest articles until we reach MAX_ARTICLES_PER_RUN
    for (const item of allItems) {
      if (processedCount >= MAX_ARTICLES_PER_RUN) break;

      const articleUrl = item.link;
      const title = item.title;

      if (!articleUrl || !title) continue;

      // 5. Check if article already exists in DB
      const { data: existingArticle } = await supabase
        .from("articles")
        .select("id")
        .eq("original_url", articleUrl)
        .single();

      if (existingArticle) continue; // Skip if already processed

      // 6. New Article: Scrape Date, Image and summarize
      console.log(`Processing article: ${title}`);
      const { text, imageUrl } = await scrapeArticle(articleUrl);

      if (!text || text.length < 100) {
          console.log("Not enough text to summarize, skipping.");
          continue; // Content too short
      }

      const summary = await summarizeArticle(text);

      // 7. Insert into Supabase
      const { error: insertError } = await supabaseAdmin
        .from("articles")
        .insert([
          {
            title,
            summary,
            original_url: articleUrl,
            image_url: imageUrl,
            source: item.source,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
          }
        ]);

      if (insertError) {
         console.error("Supabase insert error:", insertError);
         continue; // Attempt to continue with next article instead of failing whole cron
      }

      results.push({ title, url: articleUrl });
      processedCount++;
    }

    return NextResponse.json({
      message: "Cron job completed successfully",
      processed: processedCount,
      articles: results
    });

  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
