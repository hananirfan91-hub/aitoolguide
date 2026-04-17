import { SEO } from '../components/SEO';
import { BookOpen } from 'lucide-react';

export default function About() {
  return (
    <>
      <SEO 
        title="About Us | AIToolGuide"
        description="Learn about AIToolGuide and our mission to provide AI education for beginners and make learning AI tools easy."
        keywords="learn AI tools easily, AI education for beginners, about AIToolGuide"
        url="https://aitoolguide.vercel.app/about"
      />
      
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-8">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About AIToolGuide
            </h1>
          </div>
          
          <div className="prose prose-lg prose-blue mx-auto text-gray-600">
            <p className="lead text-xl text-gray-900 font-medium mb-8">
              Our mission is to help everyone learn AI tools easily. We believe AI education for beginners shouldn't require a computer science degree.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Why we started</h2>
            <p className="mb-6">
              Artificial Intelligence is changing the way we study, work, and create. However, many of the resources available are filled with technical jargon that makes jumping in feel overwhelming.
            </p>
            <p className="mb-6">
              We started <strong>AIToolGuide</strong> to bridge that gap. We focus specifically on testing, reviewing, and explaining AI tools for students and everyday users. Our tutorials focus on practical applications—like how to summarize a lecture, format an essay, or generate flashcards.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Approach</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <strong className="text-gray-900 min-w-32">Simple Language:</strong> 
                <span>We avoid complex terms like "LLMs" and "transformers" when a simpler explanation works better.</span>
              </li>
              <li className="flex gap-3">
                <strong className="text-gray-900 min-w-32">Practical Use Cases:</strong> 
                <span>We show you exactly what to type and where to click to get results.</span>
              </li>
              <li className="flex gap-3">
                <strong className="text-gray-900 min-w-32">Student Focused:</strong> 
                <span>We highlight free tools and ethical uses of AI for academic success.</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">About the Creator</h2>
            <p className="mb-6">
              AIToolGuide was created by <strong className="text-gray-900">Hanan Irfan</strong>. My goal is to make AI accessible and easy to learn for everyone. If you're interested in going beyond using AI tools and want to learn how to actively develop your own artificial intelligence applications, check out my comprehensive <a href="https://aicoursebyhananirfan.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">AI Development Course</a>.
            </p>

            <div className="bg-gray-50 rounded-2xl p-8 mt-12 text-center border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to start learning?</h3>
              <p className="mb-6 text-base">Check out our directory to find the best tools for your needs.</p>
              <a href="/tools" className="inline-flex px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors">
                Explore Directory
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
