import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { supabase } from "@/lib/supabase";
import { scrapeArticle } from "@/lib/scraper";
import { summarizeArticle } from "@/lib/gemini";

const RSS_FEEDS = [
  { source: "Economic Times", url: "https://economictimes.indiatimes.com/markets/rssfeeds/2146842.cms" },
  { source: "Moneycontrol", url: "https://www.moneycontrol.com/rss/latestnews.xml" },
  { source: "Livemint", url: "https://www.livemint.com/rss/markets" },
  { source: "Financial Express", url: "https://www.financialexpress.com/feed/" },
  { source: "NDTV Profit", url: "https://feeds.feedburner.com/ndtvprofit-latest" },
  { source: "Wall Street Journal", url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml" }
];

const parser = new Parser();
const MAX_ARTICLES_PER_RUN = 5;

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

    // 2. Iterate through RSS feeds
    for (const feed of RSS_FEEDS) {
      if (processedCount >= MAX_ARTICLES_PER_RUN) break;

      try {
        const feedData = await parser.parseURL(feed.url);
        
        for (const item of feedData.items) {
          if (processedCount >= MAX_ARTICLES_PER_RUN) break;

          const articleUrl = item.link;
          const title = item.title;

          if (!articleUrl || !title) continue;

          // 3. Check if article already exists in DB
          const { data: existingArticle } = await supabase
            .from("articles")
            .select("id")
            .eq("original_url", articleUrl)
            .single();

          if (existingArticle) continue; // Skip if already processed

          // 4. New Article: Scrape Date, Image and summarize
          console.log(`Processing article: ${title}`);
          const { text, imageUrl } = await scrapeArticle(articleUrl);

          if (!text || text.length < 100) {
              console.log("Not enough text to summarize, skipping.");
              continue; // Content too short
          }

          const summary = await summarizeArticle(text);

          // 5. Insert into Supabase
          // Bypassing RLS by using the service role key or since we didn't specify, maybe NEXT_PUBLIC_SUPABASE_ANON_KEY works 
          // wait, RLS blocks inserts without auth. Need to handle RLS
          const { error: insertError } = await supabase
            .from("articles")
            .insert([
              {
                title,
                summary,
                original_url: articleUrl,
                image_url: imageUrl,
                source: feed.source,
                published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
              }
            ]);

          if (insertError) {
             console.error("Supabase insert error:", insertError);
             throw insertError;
          }

          results.push({ title, url: articleUrl });
          processedCount++;
        }
      } catch (feedError) {
        console.error(`Error processing feed ${feed.url}:`, feedError);
        // Continue to the next feed
      }
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
