import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { FiArrowRight } from "react-icons/fi";
import { BsRobot, BsPersonCircle, BsMap, BsChevronRight, BsInfoCircle, BsPeopleFill, BsLightningCharge, BsAward } from "react-icons/bs";

export function Onboarding() {
  const { setScreen } = useUser();

  const handleStartJourney = () => {
    setScreen("avatarSelection");
  };

  // Images for the visual elements
  const heroImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Visual Appeal */}
      <header className="relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90 z-10"></div>
        
        {/* Background collage effect */}
        <div className="absolute inset-0 grid grid-cols-3 opacity-40">
          {heroImages.map((img, index) => (
            <div key={index} className="h-full overflow-hidden">
              <img 
                src={img} 
                alt="Career professionals" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-20 py-16 px-5 text-center">
          <h1 className="font-bold text-4xl md:text-5xl mb-4 text-white animate-[pulse_3s_ease-in-out_infinite]">Lifetime GPS</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-lg mx-auto font-light">
            Your personalized guide to discovering the perfect career path that matches who you truly are
          </p>
          
          {/* Quick stats for social proof */}
          <div className="flex justify-center mt-8 space-x-6 text-white">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">1,500+</span>
              <span className="text-sm opacity-80">Students Guided</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">92%</span>
              <span className="text-sm opacity-80">Satisfaction</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">150+</span>
              <span className="text-sm opacity-80">Career Paths</span>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-12 z-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,208C672,213,768,171,864,144C960,117,1056,107,1152,122.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-10 max-w-lg mx-auto w-full">
        <div className="slide-in-bottom space-y-8">
          {/* Main CTA Card */}
          <div className="card-hover bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/10 to-secondary/5 rounded-tr-3xl"></div>
            
            <h2 className="font-bold text-2xl mb-4 text-gray-800">Begin Your Adventure</h2>
            <p className="text-gray-600 mb-6">
              Take our interactive quiz to discover careers that match your unique strengths, interests, and personality. Your perfect path is waiting!
            </p>
            
            {/* Gamification teaser */}
            <div className="flex items-center mb-6 p-3 bg-amber-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-3">
                <BsLightningCharge className="w-5 h-5" />
              </div>
              <p className="text-sm text-amber-700">
                Complete fun challenges, earn points, and unlock your personalized career roadmap!
              </p>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center text-lg font-medium shadow-md hover:shadow-lg"
              onClick={handleStartJourney}
            >
              <span>Start Your Journey</span>
              <FiArrowRight className="ml-2" />
            </Button>
          </div>
          
          {/* Features Cards - Now with visual elements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-hover bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary flex items-center justify-center text-white mb-3">
                <BsRobot className="w-7 h-7" />
              </div>
              <h3 className="font-medium mb-1">AI Voice Guide</h3>
              <p className="text-sm text-gray-500">Your personal AI assistant with human-like conversation</p>
            </div>
            
            <div className="card-hover bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary/20 to-secondary flex items-center justify-center text-white mb-3">
                <BsPersonCircle className="w-7 h-7" />
              </div>
              <h3 className="font-medium mb-1">Custom Avatars</h3>
              <p className="text-sm text-gray-500">Create your digital companion with 20+ diverse options</p>
            </div>
            
            <div className="card-hover bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/20 to-accent flex items-center justify-center text-white mb-3">
                <BsMap className="w-7 h-7" />
              </div>
              <h3 className="font-medium mb-1">Success Roadmap</h3>
              <p className="text-sm text-gray-500">Your personalized plan for achieving career goals faster</p>
            </div>
          </div>
          
          {/* Testimonial teaser */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36 50.4C44.8 50.4 52 43.2 52 34.4C52 25.6 44.8 18.4 36 18.4C27.2 18.4 20 25.6 20 34.4C20 43.2 27.2 50.4 36 50.4ZM36 58.4C25.2 58.4 4 63.8 4 74.4V82.4H68V74.4C68 63.8 46.8 58.4 36 58.4Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <BsAward className="text-primary w-5 h-5 mr-2" />
                <h3 className="font-semibold text-primary">Student Success</h3>
              </div>
              <p className="text-gray-700 italic mb-3">"Lifetime GPS helped me discover my passion for UX design - something I never would have considered before!"</p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&q=80" 
                  alt="Jessica" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-white mr-2"
                />
                <p className="text-sm text-gray-600">Jessica, 18</p>
              </div>
              <Button 
                variant="link" 
                onClick={() => setScreen("testimonials")}
                className="text-primary mt-3 text-sm flex items-center p-0"
              >
                Read more success stories <BsChevronRight className="ml-1 w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Links to other pages */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setScreen("about")}
              className="card-hover flex flex-col items-center p-5 bg-white rounded-xl shadow-sm transition hover:shadow-md text-center"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                <BsInfoCircle className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">About Us</span>
            </button>

            <button 
              onClick={() => setScreen("testimonials")}
              className="card-hover flex flex-col items-center p-5 bg-white rounded-xl shadow-sm transition hover:shadow-md text-center"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                <BsPeopleFill className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">Success Stories</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Button 
              variant="link" 
              onClick={() => setScreen("privacyPolicy")}
              className="text-gray-500 hover:text-primary"
            >
              Privacy Policy
            </Button>
            <Button 
              variant="link" 
              onClick={() => setScreen("termsConditions")}
              className="text-gray-500 hover:text-primary"
            >
              Terms & Conditions
            </Button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            © {new Date().getFullYear()} Lifetime GPS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
