import { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { supabase, BlogPost as BlogPostType } from '../lib/supabase';
import { format } from 'date-fns';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blogs:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  return (
    <>
      <SEO 
        title="AI Tools Blog & Guides: Tutorials for Students & Beginners"
        description="Read our latest blog posts on how to use AI tools for students. Tutorials, tips, and reviews of the best free artificial intelligence apps and software."
        keywords="how to use ChatGPT, AI tools for making presentations, AI education for beginners, best AI blog 2026, artificial intelligence tutorials, guide to generative AI, student study hacks with AI, review of free AI software"
        url="https://aitoolguide.vercel.app/blog"
      />
      
      <div className="bg-[#fcfcfc] py-16 sm:py-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              AI Guides & Articles
            </h1>
            <p className="text-xl text-gray-600">
              Simple, step-by-step tutorials to help you master AI tools. No technical jargon, just actionable advice for beginners.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No guides published yet</h3>
              <p className="text-gray-500">Check back soon for new AI tutorials and reviews!</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
                  {post.image_url && (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-x-4 text-xs mb-4">
                      <time dateTime={post.created_at} className="text-gray-500 font-medium z-10">
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </time>
                      {post.tags && post.tags[0] && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="relative z-10 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                            {post.tags[0]}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <h2 className="mt-2 text-xl font-bold font-serif leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-6 flex items-center gap-x-2 text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                       Read Article <span aria-hidden="true">&rarr;</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
