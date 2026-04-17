import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, BlogPost as BlogPostType } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Tag, User, Share2, Check } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPostType[]>([]);
  const [featuredTools, setFeaturedTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    async function fetchPostAndRecent() {
      if (!slug) return;
      
      // Scroll to top when changing blog posts
      window.scrollTo(0, 0);
      
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

      const { data: recentData } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .neq('slug', slug)
        .order('created_at', { ascending: false })
        .limit(2);

      if (recentData) {
        setRecentPosts(recentData);
      }

      const { data: toolsData } = await supabase
        .from('tools')
        .select('id, name, description')
        .limit(2);
        
      if (toolsData) {
        setFeaturedTools(toolsData);
      }

      setLoading(false);
    }
    
    fetchPostAndRecent();
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            <div className="lg:col-span-2 max-w-3xl">
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

                  <div className="ml-auto">
                    <button 
                      onClick={handleShare}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors shadow-sm"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                      {copied ? 'Copied Link' : 'Share'}
                    </button>
                  </div>
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

            {/* Aside for related content */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32 space-y-10">
                
                {recentPosts.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold font-serif text-gray-900 mb-6">Read More Guides</h3>
                    <div className="space-y-6">
                      {recentPosts.map((recent) => (
                        <Link key={recent.id} to={`/blog/${recent.slug}`} className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                          {recent.image_url && (
                            <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                              <img 
                                src={recent.image_url} 
                                alt={recent.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-5">
                            <h4 className="font-serif font-bold text-gray-900 group-hover:text-blue-600 leading-snug line-clamp-2 mb-2 transition-colors">
                              {recent.title}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium">
                              {format(new Date(recent.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {featuredTools.length > 0 && (
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Essential AI Tools</h3>
                    <div className="space-y-3">
                      {featuredTools.map((tool) => (
                        <Link 
                          key={tool.id} 
                          to={`/tool/${tool.id}`} 
                          className="block bg-white p-4 rounded-2xl border border-gray-200 hover:border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all group"
                        >
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                            {tool.name}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {tool.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </aside>

          </div>
        </div>
      </article>
    </>
  );
}
