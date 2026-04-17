import { SEO } from '../components/SEO';

export default function Terms() {
  return (
    <>
      <SEO 
        title="Terms of Service | AIToolGuide"
        description="Terms of Service for AIToolGuide outlining the rules and regulations for using our site."
        url="https://aitoolguide.vercel.app/terms"
      />
      <div className="bg-white py-16 sm:py-24 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-lg prose-blue">
          <h1>Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>By accessing our website AIToolGuide, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          
          <h2>1. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on AIToolGuide's website for personal, non-commercial transitory viewing only.</p>
          
          <h2>2. Disclaimer</h2>
          <p>The materials on AIToolGuide's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <h2>3. Limitations</h2>
          <p>In no event shall AIToolGuide or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.</p>
          
          <h2>4. Links</h2>
          <p>AIToolGuide has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AIToolGuide.</p>
        </div>
      </div>
    </>
  );
}
