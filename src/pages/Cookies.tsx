import { SEO } from '../components/SEO';

export default function Cookies() {
  return (
    <>
      <SEO 
        title="Cookie Policy | AIToolGuide"
        description="Cookie Policy explaining how we use cookies to improve your experience."
        url="https://aitoolguide.vercel.app/cookies"
      />
      <div className="bg-white py-16 sm:py-24 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-lg prose-blue">
          <h1>Cookie Policy</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>This Cookie Policy explains what cookies are and how we use them, the types of cookies we use, the information we collect using cookies, and how that information is used.</p>
          
          <h2>1. What are cookies?</h2>
          <p>Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser.</p>
          
          <h2>2. How do we use cookies?</h2>
          <p>As most of the online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way.</p>
          
          <h2>3. Types of cookies we use</h2>
          <ul>
            <li><strong>Essential:</strong> Some cookies are essential for you to be able to experience the full functionality of our site like user authentication and keeping your sessions active.</li>
            <li><strong>Analytics:</strong> Store information like the number of visitors to the website, the number of unique visitors, which pages of the website have been visited, etc.</li>
          </ul>
          
          <h2>4. Managing cookies</h2>
          <p>You can manage your cookies preferences by changing your browser settings to block or delete cookies. To find out more about out how to manage and delete cookies, visit wikipedia.org, www.allaboutcookies.org.</p>
        </div>
      </div>
    </>
  );
}
