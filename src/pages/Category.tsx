import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { ArrowRight, Box, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Category() {
  const { name } = useParams<{ name: string }>();
  const [tools, setTools] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formattedName = name?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || '';

  useEffect(() => {
    async function fetchData() {
      if (!name) return;
      setLoading(true);
      window.scrollTo(0, 0);

      // We'll search by matching the category string roughly
      const searchCategory = formattedName.replace(' Tools', '');

      // Fetch Tools matching category
      const { data: toolsData } = await supabase
        .from('tools')
        .select('*')
        .ilike('category', `%${searchCategory}%`)
        .order('created_at', { ascending: false });

      if (toolsData) setTools(toolsData);

      // Fetch Blogs matching category (via tags)
      const { data: blogsData } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .contains('tags', [searchCategory])
        .order('created_at', { ascending: false });

      if (blogsData) setBlogs(blogsData);
      
      setLoading(false);
    }
    
    fetchData();
  }, [name, formattedName]);

  return (
    <>
      <SEO 
        title={`Best ${formattedName} for Students (2026) | AIToolGuide`}
        description={`Discover the top free ${formattedName} for students and beginners. Learn how to use them to boost your productivity with our comprehensive guides.`}
        keywords={`${formattedName}, best ${formattedName}, free ${formattedName}, top artificial intelligence apps for ${formattedName.toLowerCase()}, how to use ${formattedName.toLowerCase()}, beginner tutorial for ${formattedName.toLowerCase()}`}
        url={`https://aitoolguide.vercel.app/category/${name}`}
      />
      
      <div className="bg-[#fcfcfc] min-h-screen py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <header className="mb-16 text-center max-w-3xl mx-auto bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Box className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Best {formattedName}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Explore our curated collection of the top {formattedName.toLowerCase()}. 
              We review the latest software and provide step-by-step guides on how to use them effectively for your academic and professional goals.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-20">
              
              {/* Tools Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Top {formattedName}</h2>
                </div>
                
                {tools.length === 0 ? (
                  <div className="bg-white p-8 text-center rounded-2xl border border-gray-100">
                    <p className="text-gray-500">No tools found in this category yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {tools.map((tool) => (
                      <div key={tool.id} className="group relative flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                            {tool.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                          <Link to={`/tool/${tool.id}`}>
                            <span className="absolute inset-0" />
                            {tool.name}
                          </Link>
                        </h3>
                        <p className="text-gray-600 line-clamp-3 mb-6 text-sm flex-1">
                          {tool.description}
                        </p>
                        <div className="mt-auto flex items-center gap-x-2 text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                           View Guide <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Blogs Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Related Guides & Articles</h2>
                </div>

                {blogs.length === 0 ? (
                  <div className="bg-white p-8 text-center rounded-2xl border border-gray-100">
                    <p className="text-gray-500">No guides found for this category yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((post) => (
                      <article key={post.id} className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
                        {post.image_url && (
                          <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                            <img 
                              src={post.image_url} 
                              alt={post.title} 
                              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <time dateTime={post.created_at} className="text-xs text-gray-500 font-medium mb-3">
                            {format(new Date(post.created_at), 'MMM d, yyyy')}
                          </time>
                          <h3 className="text-lg font-bold font-serif leading-tight text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                            <Link to={`/blog/${post.slug}`}>
                              <span className="absolute inset-0" />
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {/* Semantic SEO Details Box */}
              {(tools.length > 0 || blogs.length > 0) && (
                 <section className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
                   <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use {formattedName}?</h2>
                   <p className="text-gray-600 leading-relaxed text-sm mb-6">
                     Selecting the right <strong>{formattedName.toLowerCase()}</strong> can drastically reduce the time you spend on repetitive tasks. Our deep-dive reviews ensure you are finding the best-in-class generative artificial intelligence for your particular workflow. Whether you're seeking free tier apps for college assignments, or powerful generative AI software for content creation, mapping your specific needs to the right platform is critical.
                   </p>
                   <p className="text-gray-600 leading-relaxed text-sm">
                     Dive into our step-by-step beginner guides above to see exact prompt examples, feature breakdowns, and unbiased recommendations on how to actually implement {formattedName.toLowerCase()} into your daily routine successfully in 2026.
                   </p>
                 </section>
              )}

            </div>
          )}
          
        </div>
      </div>
    </>
  );
}
