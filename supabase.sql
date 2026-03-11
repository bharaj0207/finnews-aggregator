-- Create an articles table
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  original_url text unique not null,
  image_url text,
  source text not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.articles enable row level security;

-- Policy to allow public read access
create policy "Allow public read access" on public.articles
  for select using (true);

-- Policy to restrict inserts to authenticated server roles only
-- Note: The server-side API cron job should use the SUPABASE_SERVICE_ROLE_KEY to bypass RLS 
-- and insert articles, or use an authenticated session.
create policy "Restrict inserts to authenticated" on public.articles
  for insert with check (auth.role() = 'authenticated');
