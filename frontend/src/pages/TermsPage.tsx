import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-primary">Lifetime GPS</h1>
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary-dark text-sm md:text-base"
            >
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-8 animate-fadeIn">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-6">Terms and Conditions</h2>
          
          <div className="space-y-4 text-gray-700">
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">1. Acceptance of Terms</h3>
              <p>
                By accessing or using the Lifetime GPS platform, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">2. Use License</h3>
              <p className="mb-2">
                Permission is granted to temporarily access the Lifetime GPS platform for personal, non-commercial use. This license does not include:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose</li>
                <li>Attempting to decompile or reverse engineer any software contained on the platform</li>
                <li>Removing any copyright or other proprietary notations</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">3. Disclaimer</h3>
              <p>
                The materials on Lifetime GPS's platform are provided on an 'as is' basis. Lifetime GPS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">4. Career Information</h3>
              <p>
                Lifetime GPS provides career guidance based on the information you provide. While we strive for accuracy, the career matches, roadmaps, and other guidance provided are not guarantees of career success or suitability. Users should conduct their own research and potentially seek professional advice for major career decisions.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">5. Limitations</h3>
              <p>
                In no event shall Lifetime GPS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Lifetime GPS's platform, even if Lifetime GPS or a Lifetime GPS authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">6. Account Responsibilities</h3>
              <p>
                If you create an account on our platform, you are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">7. Modifications</h3>
              <p>
                Lifetime GPS may revise these terms of service at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">8. Acceptable Use and Disclaimer</h3>
              <p className="mb-2">
                This Lifetime GPS platform is provided with the primary intent of benefiting its users by facilitating Lifetime GPS platform's purpose, e.g., "the sharing of educational resources". Users are granted access to the platform under the condition that they engage with it in a lawful, respectful, and constructive manner. Any use of the platform for malicious, unlawful, or harmful purposes is strictly prohibited.
              </p>
              <p className="mb-2">Prohibited activities include, but are not limited to:</p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>Engaging in illegal activities or violating applicable laws and regulations.</li>
                <li>Transmitting content that is abusive, defamatory, obscene, or otherwise objectionable.</li>
                <li>Infringing upon the intellectual property rights of others.</li>
                <li>Introducing malicious software or engaging in activities that disrupt the platform's functionality.</li>
              </ul>
              <p>
                Users acknowledge that the platform's administrators reserve the right to monitor usage and enforce these terms, including the removal of content and suspension or termination of access for violations. By using this platform, users agree to indemnify and hold harmless Lifetime GPS and its affiliates from any claims arising out of their misuse of the platform.
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">9. Governing Law</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws and any dispute relating to these terms shall be subject to the exclusive jurisdiction of the courts.
              </p>
            </section>
            
            <section className="pt-4 border-t border-gray-200 mt-6">
              <p className="text-sm text-gray-600">Last updated: May 5, 2025</p>
            </section>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/">
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
              >
                Return to Home
              </Button>
            </Link>
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
};

export default TermsPage;