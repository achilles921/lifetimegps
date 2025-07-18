import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export function About() {
  const { setScreen } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Lifetime GPS</h1>
          <Button 
            variant="ghost" 
            onClick={() => setScreen("onboarding")}
            className="text-primary hover:text-primary-dark"
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8 animate-fadeIn">
          <section>
            <h2 className="text-3xl font-bold text-center text-primary mb-6">About Lifetime GPS</h2>
            <p className="text-lg text-center italic mb-8">
              We believe the best career path is the one that's built for you and
              around you.
            </p>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <p className="mb-4">
                At Lifetime GPS, we're on a mission to help students and young adults unlock their true
                potential by showing them career paths that match their innate strengths, traits,
                interests, work styles, and motivation. No more guessing. No more pressure. Just clear,
                personalized guidance for building a life you'll love.
              </p>
            </div>
            
            {/* Video Section */}
            <div className="mt-10 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-center">Watch Our Story</h3>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                {/* Replace with actual video when available */}
                <div className="flex items-center justify-center h-full p-6 text-center">
                  <div>
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Video coming soon</p>
                    <p className="text-sm text-gray-400 mt-2">Our team is creating an inspiring video that showcases how Lifetime GPS is transforming career guidance for students</p>
                  </div>
                </div>
                {/* 
                When video is available, replace the placeholder with:
                <iframe 
                  className="w-full h-full" 
                  src="VIDEO_URL_HERE" 
                  title="Lifetime GPS Story" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
                */}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Team</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-5 transform transition-all duration-300 hover:scale-105">
                <h4 className="font-bold text-primary">Alain Nguyen & Don Lennox</h4>
                <p className="text-gray-700 mt-2">
                  Created Lifetime GPS after spending over 50 years
                  building businesses in tech, advertising, cybersecurity, fiber optic, and data
                  infrastructure, and online search. They saw a major gap: young people need better tools
                  — tools powered by AI— to make smarter, more confident career choices for students,
                  including their children. So they decided to build it.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-5 transform transition-all duration-300 hover:scale-105">
                <h4 className="font-bold text-primary">Gail Swift</h4>
                <p className="text-gray-700 mt-2">
                  A career coach who's helped over 1,500 students discover
                  the careers they were meant for. She's leading the charge to create our fast, 15-minute
                  career race so students can identify their ideal paths.
                </p>
              </div>
              

              
              <div className="bg-white rounded-lg shadow-md p-5 transform transition-all duration-300 hover:scale-105">
                <h4 className="font-bold text-primary">Our Vision</h4>
                <p className="text-gray-700 mt-2">
                  Together, we're building more than a platform — we're building a GPS for life. We
                  believe you're not a number, your future shouldn't be a guessing game and the right
                  career changes everything.
                </p>
              </div>
            </div>
          </section>
          
          <section className="text-center mt-12 py-6">
            <h3 className="text-2xl font-bold text-primary mb-2">Your life, Your path. Your Lifetime GPS.</h3>
            <Button 
              onClick={() => setScreen("onboarding")} 
              className="mt-4 bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-2"
            >
              Start Your Journey
            </Button>
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Lifetime GPS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}