-- RUN THIS SCRIPT IN YOUR SUPABASE SQL EDITOR --

-- 1. Create the blogs table
create table if not exists public.blogs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  keywords text,
  tags text[],
  image_url text,
  author_email text not null,
  published boolean default true
);

-- 2. Enable Row Level Security
alter table public.blogs enable row level security;

-- 3. Create access policies
-- ANYONE can read published blogs
create policy "Public blogs are viewable by everyone."
  on public.blogs for select
  using (published = true);

-- ONLY the specified admin emails can insert/update/delete
create policy "Admin can insert" on public.blogs for insert
  with check (auth.jwt() ->> 'email' in ('hananuk501@gmil.com', 'hananuk501@gmail.com'));

create policy "Admin can update" on public.blogs for update
  using (auth.jwt() ->> 'email' in ('hananuk501@gmil.com', 'hananuk501@gmail.com'));

create policy "Admin can delete" on public.blogs for delete
  using (auth.jwt() ->> 'email' in ('hananuk501@gmil.com', 'hananuk501@gmail.com'));

-- 4. Setup Storage for Blog Images
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

create policy "Images public access" on storage.objects for select
using (bucket_id = 'blog-images');

create policy "Admin can upload images" on storage.objects for insert
with check (bucket_id = 'blog-images' AND auth.jwt() ->> 'email' in ('hananuk501@gmil.com', 'hananuk501@gmail.com'));
