import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Clock, ExternalLink } from "lucide-react";
import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate at most every minute

export default async function Home() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Error fetching articles:", error);
    return <div className="text-center text-red-500 py-12">Failed to load articles. Please try again later.</div>;
  }

  const newsContent = articles && articles.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => (
        <Link href={`/article/${article.id}`} key={article.id} className="group outline-none">
          <article className="glass-card h-full flex flex-col overflow-hidden">
            <div className="relative w-full h-48 bg-card-border overflow-hidden">
              {article.image_url ? (
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-card-border/50 text-muted">
                  No Image Available
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/10">
                  {article.source}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow space-y-4">
              <div className="flex items-center text-xs text-muted gap-2">
                <Clock className="w-3.5 h-3.5" />
                <time dateTime={article.published_at}>
                  {new Date(article.published_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata"
                  })}
                </time>
              </div>
              
              <h2 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3">
                {article.title}
              </h2>
              
              <p className="text-sm text-neutral-400 line-clamp-3 flex-grow">
                {article.summary}
              </p>
              
              <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-auto text-sm font-medium text-primary group-hover:text-primary-dark transition-colors">
                Read Intelligence <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  ) : (
    <div className="text-center p-12 glass-card rounded-2xl border-dashed">
      <p className="text-lg text-muted">No articles found in the database.</p>
      <p className="text-sm text-neutral-500 mt-2">Make sure your cron job has run at least once.</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 pt-12 pb-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Market Intelligence,<br />Distilled.
        </h1>
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
          AI-powered financial news aggregation. We cut through the noise so you can focus on the signal.
        </p>
      </section>

      <Dashboard newsContent={newsContent} />
    </div>
  );
}
