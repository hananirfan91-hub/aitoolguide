import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables if available
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rqghapidhudwzwwpnyfh.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZ2hhcGlkaHVkd3p3d3BueWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjMwMjYsImV4cCI6MjA5MTkzOTAyNn0.vP5QVskX7gwwL97rw5uaoKLnPOOi6BnCabE0oEOvWfo';
const SITE_URL = 'https://aitoolguide.vercel.app';

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log('Generating sitemap.xml...');

  const staticPages = [
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/tools', changefreq: 'weekly', priority: 0.9 },
    { loc: '/blog', changefreq: 'daily', priority: 0.9 },
    { loc: '/about', changefreq: 'monthly', priority: 0.7 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.6 },
    { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
    { loc: '/cookies', changefreq: 'yearly', priority: 0.3 },
  ];

  let dynamicPages = [];

  try {
    const { data: posts, error } = await supabase
      .from('blogs')
      .select('slug, created_at')
      .eq('published', true);

    if (error) throw error;

    if (posts) {
      dynamicPages = posts.map((post) => ({
        loc: `/blog/${post.slug}`,
        lastmod: new Date(post.created_at).toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  const allPages = [...staticPages, ...dynamicPages];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      (page) => `
  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('')}
</urlset>
`;

  // Write to public directory
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // Also drop a quick robots.txt to ensure Google crawls correctly
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://aitoolguide.vercel.app/sitemap.xml`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
  console.log('sitemap.xml and robots.txt generated successfully!');
}

generateSitemap();
