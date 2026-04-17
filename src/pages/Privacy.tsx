import { SEO } from '../components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO 
        title="Privacy Policy | AIToolGuide"
        description="Privacy Policy for AIToolGuide detailing how we handle data and privacy."
        url="https://aitoolguide.vercel.app/privacy"
      />
      <div className="bg-white py-16 sm:py-24 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-lg prose-blue">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>Welcome to AIToolGuide. We respect your privacy and are committed to protecting your personal data.</p>
          
          <h2>1. Information We Collect</h2>
          <p>We may collect basic information when you register, use our tools, or subscribe to our newsletter, including your email address and name.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to operate, maintain, and provide the features of our website, and to communicate with you.</p>
          
          <h2>3. Third-Party Services</h2>
          <p>We use external services like Supabase for database management and authentication. Your data is stored securely using industry-standard protocols.</p>
          
          <h2>4. Your Rights</h2>
          <p>You have the right to access, update, or delete the personal information we have on you. Please contact us to make changes.</p>
          
          <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </div>
      </div>
    </>
  );
}
