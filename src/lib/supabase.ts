import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqghapidhudwzwwpnyfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZ2hhcGlkaHVkd3p3d3BueWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjMwMjYsImV4cCI6MjA5MTkzOTAyNn0.vP5QVskX7gwwL97rw5uaoKLnPOOi6BnCabE0oEOvWfo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for the Database
export type BlogPost = {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string;
  tags: string[];
  image_url: string | null;
  author_email: string;
  published: boolean;
};
