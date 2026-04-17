import { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, PenTool, Sparkles, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [topTools, setTopTools] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch latest blogs
      const { data: blogData } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (blogData) {
        setLatestBlogs(blogData);
      }

      // Fetch top tools
      const { data: toolData } = await supabase
        .from('tools')
        .select('id, name, category, description, is_free')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (toolData) {
        setTopTools(toolData);
      }
    }
    fetchData();
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AIToolGuide",
    "url": "https://aitoolguide.vercel.app",
    "description": "Learn AI Tools Easily. Discover the best free AI tools in 2026 for students and beginners. Productivity apps, design tools, and writing assistants."
  };

  return (
    <>
      <SEO 
        title="Best AI Tools for Students & Beginners (2026) | AIToolGuide"
        description="Discover the best free AI tools in 2026 for students and beginners. Master ChatGPT, productivity apps, automation tools, and writing assistants."
        keywords="best AI tools for students, free AI tools 2026, learn AI tools for beginners, how to use ChatGPT, AI productivity tools, top AI tools"
        url="https://aitoolguide.vercel.app/"
        schema={schema}
      />
      
      {/* Hero Section */}
      <section className="bg-white px-4 py-20 sm:py-32 text-center border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 ring-1 ring-inset ring-blue-600/20 mb-8 tracking-wide">
            Updated for 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 outline-none">
            Best AI Tools for Students & Beginners (2026)
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto mb-10 font-light">
            Stay ahead of the curve. Explore the ultimate directory of <span className="font-semibold text-gray-800">free AI tools</span> tailored for students and beginners. From <span className="font-semibold text-gray-800">productivity tools</span> to creative assistants, find everything you need to boost your academic and professional life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/tools" 
              className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all flex items-center gap-2"
            >
              Explore AI Tools <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/blog" 
              className="text-sm font-semibold leading-6 text-gray-900 px-8 py-3.5 hover:text-gray-600 transition-colors"
            >
              Read the Guides <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Top AI Tools Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center gap-2">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" /> Top AI Tools
              </h2>
              <p className="mt-4 text-lg text-gray-600">The highest-rated artificial intelligence apps right now.</p>
            </div>
            <Link to="/tools" className="hidden sm:flex text-blue-600 font-medium hover:text-blue-800 items-center gap-1 transition-colors">
               View All Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {topTools.map((tool) => (
              <div key={tool.id} className="group flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                    {tool.category}
                  </span>
                  {tool.is_free && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-100">
                      Free Tier
                    </span>
                  )}
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
          <div className="mt-8 sm:hidden">
             <Link to="/tools" className="w-full justify-center flex text-blue-600 font-medium hover:text-blue-800 items-center gap-1 transition-colors">
               View All Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Browse by Category</h2>
            <p className="mt-4 text-lg text-gray-600">Find the right AI tools for your specific needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow border border-gray-100">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-6">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Writing Tools</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Boost your writing speed and quality with AI assistants, grammar checkers, and content generators.</p>
              <Link to="/category/ai-writing-tools" className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1">
                View Writing Tools <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow border border-gray-100">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Design Tools</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Create stunning visuals, presentations, and graphics in seconds with powerful AI generation tools.</p>
              <Link to="/category/ai-design-tools" className="text-purple-600 text-sm font-medium hover:text-purple-800 flex items-center gap-1">
                View Design Tools <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow border border-gray-100">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-green-50 text-green-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Productivity</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Automate your workflow, summarize meetings, and organize your study life with AI productivity apps.</p>
              <Link to="/category/ai-productivity-tools" className="text-green-600 text-sm font-medium hover:text-green-800 flex items-center gap-1">
                View Productivity Tools <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Section SEO friendly text */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                The Best AI Tools for Students
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Navigating the world of Artificial Intelligence shouldn't be complicated. We curate the best free AI tools in 2026 and break down exactly how to use them for your assignments, research, and daily study routines.
              </p>
              <div className="space-y-4">
                {['Save hours on research', 'Improve writing clarity', 'Generate engaging presentations'].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 lg:mt-0 relative rounded-2xl bg-gray-50 p-8 border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-center">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
               <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-100 rounded-full opacity-50 blur-xl"></div>
               <h3 className="text-xl font-semibold mb-4 relative z-10">Latest Blog Posts</h3>
               {latestBlogs.length === 0 ? (
                 <p className="text-sm text-gray-500 relative z-10">No posts published yet.</p>
               ) : (
                 <ul className="space-y-4 relative z-10 w-full">
                    {latestBlogs.map((blog) => (
                      <li key={blog.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer group">
                        <Link to={`/blog/${blog.slug}`} className="block">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{blog.title}</h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{blog.excerpt}</p>
                        </Link>
                      </li>
                    ))}
                 </ul>
               )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
