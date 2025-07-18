import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export function PrivacyPolicy() {
  const { setScreen } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-primary">Lifetime GPS</h1>
          <Button 
            variant="ghost" 
            onClick={() => setScreen("onboarding")}
            className="text-primary hover:text-primary-dark text-sm md:text-base"
          >
            Back
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-8 animate-fadeIn">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-6">Privacy Policy</h2>
          
          <div className="space-y-4 text-gray-700">
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">1. Introduction</h3>
              <p>
                Lifetime GPS ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our career guidance platform.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">2. Information We Collect</h3>
              <p className="mb-2">We may collect information about you in a variety of ways including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Personal Data: Name, email address, and contact information.</li>
                <li>Quiz Responses: Information about your preferences, skills, interests, and work styles.</li>
                <li>Usage Data: How you interact with our platform.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">3. How We Use Your Information</h3>
              <p className="mb-2">We may use the information we collect from you for purposes including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Providing personalized career recommendations and roadmaps.</li>
                <li>Improving our platform and user experience.</li>
                <li>Communicating with you about our services.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">4. Disclosure of Your Information</h3>
              <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described in this policy.</p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">5. Data Security</h3>
              <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">6. Children's Privacy</h3>
              <p>Our service is intended for users who are at least 12 years of age. We do not knowingly collect personal information from children under 12.</p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">7. Changes to This Privacy Policy</h3>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">8. Contact Us</h3>
              <p>If you have questions about this Privacy Policy, please contact us at privacy@lifetimegps.com.</p>
            </section>
            
            <section className="pt-4 border-t border-gray-200 mt-6">
              <p className="text-sm text-gray-600">Last updated: May 1, 2025</p>
            </section>
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              onClick={() => setScreen("onboarding")} 
              className="bg-primary hover:bg-primary-dark text-white"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Lifetime GPS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}