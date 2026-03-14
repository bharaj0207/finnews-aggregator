import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate at most every minute

export default async function ArticlePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Pulse
      </Link>

      <header className="space-y-6 mb-10">
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30 shadow-inner">
            {article.source}
          </span>
          <div className="flex items-center text-muted">
            <Calendar className="w-4 h-4 mr-2" />
            <time dateTime={article.published_at}>
              {new Date(article.published_at).toLocaleDateString("en-US", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
              })}
            </time>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {article.title}
        </h1>
      </header>

      {article.image_url && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-card-border shadow-2xl glass-card">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      <div className="glass-card p-8 md:p-12 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <ShieldCheck className="w-32 h-32" />
        </div>
        
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
          <div className="w-2 h-2 rounded-full bg-green shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
          <h2 className="text-xl font-semibold tracking-wide">AI Executive Summary</h2>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none text-neutral-300">
          {article.summary.split('\n').map((paragraph: string, idx: number) => (
            <p key={idx} className="leading-relaxed mb-4">{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <a
          href={article.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary/50 transform hover:-translate-y-0.5"
        >
          Read Original Article on {article.source}
          <ExternalLink className="w-5 h-5 ml-2" />
        </a>
      </div>
    </article>
  );
}
