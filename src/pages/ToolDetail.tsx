import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { ArrowLeft, ExternalLink, Share2, Check, Zap, Info } from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: tool?.name,
          text: tool?.description,
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
    async function fetchTool() {
      if (!id) return;
      
      window.scrollTo(0, 0);
      
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) {
        console.error('Error fetching tool:', error);
        navigate('/tools', { replace: true });
        return;
      }
      
      setTool(data);
      setLoading(false);
    }
    
    fetchTool();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!tool) return null;

  return (
    <>
      <SEO 
        title={`${tool.name} Guide | AIToolGuide`}
        description={tool.description}
        keywords={`${tool.name}, how to use ${tool.name}, ${tool.category} ai tool`}
        url={`https://aitoolguide.vercel.app/tool/${tool.id}`}
      />
      
      <div className="bg-[#fcfcfc] min-h-screen py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/tools" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Tools
          </Link>

          <header className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
              <div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 mb-4 border border-blue-100">
                  {tool.category}
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 leading-tight">
                  {tool.name}
                </h1>
              </div>
              <div className="flex gap-3 shrink-0">
                <button 
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Share'}
                </button>
                <a 
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  Visit Website <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            {tool.is_free && (
              <div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 border border-green-100 mt-2">
                <Zap className="w-4 h-4 mr-1.5" /> Offers Free Tier
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              
              <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" /> What is {tool.name}?
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {tool.description}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 sm:p-10 rounded-3xl border border-blue-100/50">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" /> How to use {tool.name}
                </h2>
                <div className="prose prose-blue prose-lg max-w-none text-gray-700">
                  <MarkdownRenderer content={tool.how_to_use} />
                </div>
              </div>

            </div>
            
            <aside className="md:col-span-1">
              <div className="bg-gray-900 rounded-3xl p-8 text-center text-white sticky top-32">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Try {tool.name} Today</h3>
                <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                  Start boosting your productivity now by integrating {tool.name} into your workflow.
                </p>
                <a 
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 px-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Go to Website
                </a>
              </div>
            </aside>
          </div>
          
        </div>
      </div>
    </>
  );
}
