import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, BlogPost as BlogPostType } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
        
      if (error || !data) {
        console.error('Error fetching post:', error);
        navigate('/blog', { replace: true });
        return;
      }
      
      setPost(data);
      setLoading(false);
    }
    
    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!post) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://aitoolguide.vercel.app/blog/${post.slug}`
    },
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image_url || "https://aitoolguide.vercel.app/default-share.jpg",
    "author": {
      "@type": "Person",
      "name": "AIToolGuide Team"
    },
    "datePublished": post.created_at,
    "keywords": post.keywords
  };

  return (
    <>
      <SEO 
        title={`${post.title} | AIToolGuide`}
        description={post.excerpt}
        keywords={post.keywords}
        url={`https://aitoolguide.vercel.app/blog/${post.slug}`}
        schema={schema}
      />
      
      <article className="bg-[#fcfcfc] min-h-screen py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all guides
          </Link>

          <header className="mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), 'MMMM d, yyyy')}
                </time>
              </div>
              <div className="flex items-center gap-2">
                 <User className="w-4 h-4" />
                 <span>AIToolGuide Team</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          {post.image_url && (
            <div className="mb-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 mb-16">
            <MarkdownRenderer content={post.content} />
          </div>
          
        </div>
      </article>
    </>
  );
}
