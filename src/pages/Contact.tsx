import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { Send, Loader2, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.length < 10) {
      setErrorMsg('Please write a slightly longer message so we can better assist you.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Simulate a small psychological delay so they know it processed if it's too fast
      // But standard network latency usually covers this.
      const startTime = Date.now();

      const { error } = await supabase.from('messages').insert([
        { name, email, message }
      ]);
      if (error) throw error;
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 600) {
        // Just enough to let the loading spinner register visually to avoid flashing
        await new Promise(res => setTimeout(res, 600 - elapsedTime));
      }

      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us | AIToolGuide Support & Feedback"
        description="Get in touch with the AIToolGuide team. We'd love to hear your questions about AI tools, software features, or requests for beginner tutorials."
        keywords="contact AIToolGuide, request AI tool review, AI software feedback, artificial intelligence guide support"
        url="https://aitoolguide.vercel.app/contact"
      />
      
      <div className="bg-[#f5f5f5] min-h-[max(calc(100vh-140px),600px)] py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-4">
                Get in touch
              </h1>
              <p className="text-lg leading-6 text-gray-600">
                Have a question about an AI tool? Want to suggest a topic? Send us a message!
              </p>
            </div>

            {isSuccess ? (
              <div className="bg-green-50 text-green-800 p-8 rounded-2xl text-center flex flex-col items-center border border-green-100">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
                <p className="text-sm">Thank you for reaching out. We have received your message and will get back to you shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-sm font-medium text-green-700 hover:text-green-800"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-[#fcfcfc] transition-shadow"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-[#fcfcfc] transition-shadow"
                      placeholder="you@student.edu"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">
                    Message
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-[#fcfcfc] transition-shadow resize-none"
                      placeholder="How can we help you learn AI tools?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Connecting to server...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
