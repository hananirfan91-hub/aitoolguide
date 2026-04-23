import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Tools() {
  const [tools, setTools] = useState<any[]>([]);
  const [filteredTools, setFilteredTools] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const toolsData = data || [];
      setTools(toolsData);
      setFilteredTools(toolsData);
      
      // Extract unique categories
      const uniqueCats = Array.from(new Set(toolsData.map(t => t.category).filter(Boolean))) as string[];
      setCategories(uniqueCats.sort());
      
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredTools(tools);
    } else {
      setFilteredTools(tools.filter(t => t.category === activeCategory));
    }
  }, [activeCategory, tools]);

  return (
    <>
      <SEO 
        title="AI Tools Directory 2026: Compare Free Artificial Intelligence Apps"
        description="Browse our comprehensive directory of the best free AI tools for 2026. Compare top artificial intelligence apps for productivity, writing, and design."
        keywords="AI tools directory, list of free artificial intelligence apps, compare AI software, best AI websites, student AI resources, top generative AI tools, AI software list updated 2026, AI tools online"
        url="https://aitoolguide.vercel.app/tools"
      />
      
      <div className="bg-[#fcfcfc] min-h-screen py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              AI Tools Directory
            </h1>
            <p className="text-xl text-gray-600">
              Browse our comprehensive list of the best AI software for students, creators, and professionals. Read detailed reviews and step-by-step guides for every artificial intelligence app.
            </p>
          </div>

          {!loading && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'All' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Tools
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
             </div>
          ) : filteredTools.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="text-lg font-medium text-gray-900">No tools found</h3>
               <p className="text-gray-500 mt-2">Check back later for new AI tools.</p>
             </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="group relative flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 mb-3 border border-blue-100">
                          {tool.category}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          <Link to={`/tool/${tool.id}`}>
                            <span className="absolute inset-0" />
                            {tool.name}
                          </Link>
                        </h2>
                      </div>
                      {tool.is_free && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-100 relative z-10 shrink-0 ml-2">
                          Free Tier
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>
                    
                    <div className="mt-auto pt-4 flex items-center gap-x-2 text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                       View Guide <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between relative z-10">
                    <a 
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1.5 w-full justify-center bg-white border border-gray-200 rounded-xl py-2"
                    >
                      Visit Tool Website <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Semantic SEO Text Block */}
          {!loading && tools.length > 0 && (
            <div className="mt-24 bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto text-gray-600 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Why Use Our AI Tools Directory?</h2>
              <p className="leading-relaxed">
                The landscape of artificial intelligence software is expanding rapidly. Finding the <strong>best free artificial intelligence apps</strong> can be overwhelming. Our directory simplifies this by categorizing top generative AI tools, writing assistants, and productivity software specifically tailored for beginners and students.
              </p>
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Discover Top Generative AI Software</h3>
              <p className="leading-relaxed">
                We don't just list websites; we verify which platforms offer genuinely useful free tiers. Whether you are looking to compare AI software for creating presentations, coding, or academic research, our updated 2026 directory provides unbiased descriptions and step-by-step functionality guides. Access the most powerful student AI resources right here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
