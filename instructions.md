# SYSTEM ROLE
You are an expert Full-Stack Next.js Developer and AI Engineer. Your task is to build a complete, end-to-end automated Financial News Aggregator web application. You will generate all necessary code, database schemas, API routes, and frontend components.

# PROJECT OVERVIEW
A web app that automatically fetches financial news every 15 minutes from specific RSS feeds, scrapes the article content and `og:image`, summarizes the content to under 400 words using the Google Gemini API, saves it to a Supabase PostgreSQL database, and displays it on a responsive Next.js frontend.

# TECH STACK
* Frontend & Backend: Next.js (App Router), React, Tailwind CSS
* Database: Supabase (PostgreSQL)
* AI Summarization: Google Gemini API (`@google/generative-ai`)
* Scraping/Parsing: `rss-parser` (for RSS), `cheerio` (for og:image and text extraction)
* Automation: GitHub Actions (Cron job)
* Deployment: Vercel

# DATA SOURCES (HARDCODE THESE INTO THE SCRIPTS)
* Economic Times: https://economictimes.indiatimes.com/markets/rssfeeds/2146842.cms
* Moneycontrol: https://www.moneycontrol.com/rss/latestnews.xml
* Livemint: https://www.livemint.com/rss/markets
* Financial Express: https://www.financialexpress.com/feed/
* NDTV Profit: https://feeds.feedburner.com/ndtvprofit-latest
* Wall Street Journal: https://feeds.a.dj.com/rss/RSSMarketsMain.xml

# ENVIRONMENT VARIABLES ASSUMED
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `CRON_SECRET`

# EXECUTION STEPS
Please write the complete code for this project by following these exact steps. Do not skip any files. Provide the file path for each code block (e.g., `src/app/page.tsx`).

## Step 1: Database Setup
Write the Supabase SQL commands to create an `articles` table with the following columns: `id` (uuid, primary key), `title` (text), `summary` (text), `original_url` (text, unique), `image_url` (text), `source` (text), and `published_at` (timestamptz). Create a row-level security (RLS) policy that allows public read access but restricts inserts to authenticated server roles only.

## Step 2: Utilities & Services
1. Create `src/lib/supabase.ts` to initialize the Supabase client.
2. Create `src/lib/gemini.ts` to initialize the Gemini API and write a function `summarizeArticle(text: string)` that prompts the AI to: "Summarize the following financial news article in under 400 words. Keep it professional, concise, and focused on market impact. Return only plain text."
3. Create `src/lib/scraper.ts` using `cheerio` to visit a URL, extract the `og:image` from the `<head>`, and grab the main paragraph text from the `<body>`.

## Step 3: The Automation Endpoint
Create a Next.js API route at `src/app/api/cron/route.ts`. 
* It must strictly accept POST requests.
* It must verify the `Authorization: Bearer <CRON_SECRET>` header.
* It should iterate through the RSS feeds using `rss-parser`.
* For each new article (limit to processing 5 at a time to avoid timeouts), scrape the text/image, pass the text to `summarizeArticle`, and insert the result into Supabase. Catch errors gracefully if an article fails so the loop continues.

## Step 4: Frontend Development
1. Create `src/app/layout.tsx` with a dark-mode friendly, professional financial aesthetic using Tailwind CSS.
2. Create `src/app/page.tsx` to fetch the latest articles from Supabase (ordered by `published_at` descending) and display them in a responsive CSS Grid. Each card should show the image, title, source, and a "Read More" button.
3. Create a dynamic route `src/app/article/[id]/page.tsx` that fetches a single article by ID, displays the full AI summary, the image, and a prominent HTML anchor `target="_blank"` link back to the `original_url`.

## Step 5: GitHub Actions Cron
Create `.github/workflows/update-news.yml` that runs every 15 minutes (`*/15 * * * *`). It should execute a `curl -X POST` request to `https://[PROJECT_DOMAIN]/api/cron`, passing the `CRON_SECRET` stored in GitHub Secrets.

Begin generating the code starting with Step 1.