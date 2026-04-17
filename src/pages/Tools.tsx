import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { ExternalLink, ArrowRight, Loader2 } from 'lucide-react';

export default function Tools() {
  const [tools, setTools] = useState<any[]>([]);
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
      setTools(data || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Best AI Tools for Students | AIToolGuide"
        description="Discover the best free AI tools in 2026 for students and beginners. Learn how to use ChatGPT, Canva AI, Grammarly, and Notion AI."
        keywords="free AI tools 2026, best AI tools for students, ChatGPT tutorial, Canva AI, Grammarly AI"
        url="https://aitoolguide.vercel.app/tools"
      />
      
      <div className="bg-[#fcfcfc] min-h-screen py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              AI Tools Directory
            </h1>
            <p className="text-xl text-gray-600">
              A curated list of the best AI tools for students, creators, and beginners. Learn what they do and exactly how to use them to boost your productivity.
            </p>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
             </div>
          ) : tools.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="text-lg font-medium text-gray-900">No tools found</h3>
               <p className="text-gray-500 mt-2">Check back later for new AI tools.</p>
             </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {tools.map((tool) => (
                <div key={tool.id} className="flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 mb-3 border border-blue-100">
                          {tool.category}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900">{tool.name}</h2>
                      </div>
                      {tool.is_free && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-100">
                          Free Tier
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">How to use</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {tool.how_to_use}
                      </p>
                    </div>
                  </div>
                  
                  <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 mt-auto flex items-center justify-between group">
                    <a 
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      Visit Website <ExternalLink className="w-4 h-4" />
                    </a>
                    <button className="text-gray-400 group-hover:text-blue-600 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
