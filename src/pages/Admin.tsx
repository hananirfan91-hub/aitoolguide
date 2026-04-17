import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Image, Save, ArrowLeft, Wand2, RefreshCw, MessageSquare, Wrench } from 'lucide-react';
import { generateSEODescription } from '../lib/gemini';

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  
  // Blog Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  // Tools Form State
  const [toolName, setToolName] = useState('');
  const [toolCategory, setToolCategory] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [toolHowToUse, setToolHowToUse] = useState('');
  const [toolUrl, setToolUrl] = useState('');
  const [toolIsFree, setToolIsFree] = useState(false);

  // SEO Audit State & Messages
  const [existingPosts, setExistingPosts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState<'create_blog' | 'create_tool' | 'messages'>('create_blog');

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'messages') fetchMessages();
    }
  }, [isAdmin, activeTab]);

  const fetchMessages = async () => {
    setLoadingData(true);
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoadingData(false);
  };

  const handleGenerateSEO = async () => {
    if (!content) {
       alert("Please write some content first to generate a meta description.");
       return;
    }
    setIsGeneratingSEO(true);
    const generated = await generateSEODescription(content, keywords);
    setExcerpt(generated);
    setIsGeneratingSEO(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      
      setImageUrl(data.publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const tagsArray = tags.split(',').map(tag => tag.trim());
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { error } = await supabase.from('blogs').insert([
      {
        title,
        slug: finalSlug,
        excerpt,
        content,
        keywords,
        tags: tagsArray,
        image_url: imageUrl,
        author_email: user.email,
        published: true, 
      }
    ]);

    if (error) {
      alert("Error saving post: " + error.message);
    } else {
      alert("Post created successfully!");
      setTitle(''); setSlug(''); setExcerpt(''); setContent(''); setKeywords(''); setTags(''); setImageUrl('');
    }
    setIsSubmitting(false);
  };

  const handleCreateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const { error } = await supabase.from('tools').insert([
      {
        name: toolName,
        category: toolCategory,
        description: toolDescription,
        how_to_use: toolHowToUse,
        url: toolUrl,
        is_free: toolIsFree
      }
    ]);

    if (error) {
      alert("Error saving tool: " + error.message);
    } else {
      alert("Tool created successfully!");
      setToolName(''); setToolCategory(''); setToolDescription(''); setToolHowToUse(''); setToolUrl(''); setToolIsFree(false);
    }
    setIsSubmitting(false);
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#fcfcfc] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-red-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You are not authorized to view the admin panel. Only the system administrator can access this area.</p>
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
             <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500">Logged in as {user?.email}</p>
        </div>
        <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-xl gap-1">
          <button 
            onClick={() => setActiveTab('create_blog')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'create_blog' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Create Blog Post
          </button>
          <button 
            onClick={() => setActiveTab('create_tool')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'create_tool' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Wrench className="w-4 h-4"/> Add AI Tool
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'messages' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <MessageSquare className="w-4 h-4"/> Messages
          </button>
        </div>
      </div>

      {activeTab === 'create_blog' && (
        <div className="bg-white rounded-3xl shadow-sm border border-purple-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Blog Post</h2>
          <form onSubmit={handleCreatePost} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-purple-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Slug (optional)</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-purple-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">SEO Keywords (comma separated)</label>
                <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-purple-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-purple-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 flex justify-between items-end mb-2">
                <span>Excerpt (Meta Description for SEO)</span>
                <span className={`text-xs font-mono ${(excerpt.length < 120 || excerpt.length > 160) ? 'text-amber-600' : 'text-green-600'}`}>
                  {excerpt.length} / 160 chars
                </span>
              </label>
              <div className="relative">
                <textarea required rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-purple-600" />
                <button type="button" onClick={handleGenerateSEO} disabled={isGeneratingSEO} className="absolute bottom-3 right-3 flex items-center px-3 py-1.5 border border-purple-200 text-xs font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none transition-colors disabled:opacity-50">
                  <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Auto-Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Image className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-1 rounded-xl border border-gray-200 px-4 py-3 bg-gray-50" placeholder="Or paste an image URL..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 flex justify-between">
                <span>Main Content (Markdown Supported)</span>
              </label>
              <textarea required rows={15} value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-purple-600 font-mono text-sm" />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center px-4 py-4 rounded-xl shadow-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors">
                <Save className="w-5 h-5 mr-3" /> Publish Blog Post
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'create_tool' && (
        <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Add New AI Tool</h2>
          <form onSubmit={handleCreateTool} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tool Name</label>
                <input required type="text" value={toolName} onChange={(e) => setToolName(e.target.value)} placeholder="e.g. ChatGPT" className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input required type="text" value={toolCategory} onChange={(e) => setToolCategory(e.target.value)} placeholder="e.g. AI Chat & Writing" className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea required rows={2} value={toolDescription} onChange={(e) => setToolDescription(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">How to use (Instructions)</label>
              <textarea required rows={3} value={toolHowToUse} onChange={(e) => setToolHowToUse(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700">Website URL</label>
                <input required type="url" value={toolUrl} onChange={(e) => setToolUrl(e.target.value)} placeholder="https://" className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="flex items-center h-full pt-6">
                <input id="isFree" type="checkbox" checked={toolIsFree} onChange={(e) => setToolIsFree(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                <label htmlFor="isFree" className="ml-3 text-sm font-medium text-gray-700">Offers a Free Tier</label>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center px-4 py-4 rounded-xl shadow-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <Save className="w-5 h-5 mr-3" /> Save AI Tool
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-gray-900">Contact Messages</h2>
             <button onClick={fetchMessages} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Inbox
             </button>
           </div>
           
           {loadingData ? (
             <div className="text-center py-10 text-gray-500">Loading messages...</div>
           ) : messages.length === 0 ? (
             <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">No messages found.</div>
           ) : (
             <div className="space-y-4">
               {messages.map((msg) => (
                 <div key={msg.id} className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <h3 className="font-bold text-gray-900">{msg.name}</h3>
                       <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 hover:underline">{msg.email}</a>
                     </div>
                     <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
                       {new Date(msg.created_at).toLocaleDateString()}
                     </span>
                   </div>
                   <p className="text-gray-700 mt-4 text-sm whitespace-pre-wrap leading-relaxed border-t border-gray-200 pt-3">
                     {msg.message}
                   </p>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
}
