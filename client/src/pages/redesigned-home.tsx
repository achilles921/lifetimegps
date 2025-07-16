import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContextFixed";
import { motion } from "framer-motion";
import { Check, Medal, Flame, Trophy, ArrowRight } from "lucide-react";
import startImage from "@assets/Start.png";
// import lifetimeGpsVideo from "@assets/Lifetime GPS video_DL2.mp4"; // Video removed for size optimization

const RedesignedHome = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [streakCount, setStreakCount] = useState(0);
  // Video functionality removed for size optimization
  
  // Randomly set streak between 1-7 days for demo purposes
  useEffect(() => {
    setStreakCount(Math.floor(Math.random() * 7) + 1);
    
    // Check if user is logged in but hasn't completed onboarding
    if (user && !isLoading) {
      const hasCompletedOnboarding = localStorage.getItem('conativeQuizCompleted');
      if (hasCompletedOnboarding !== 'true') {
        // Redirect to onboarding
        navigate('/onboarding');
      }
    }
  }, [user, isLoading, navigate]);
  
  // Toggle video playback
  // Video functionality removed for size optimization

  const handleStartJourney = () => {
    if (user) {
      // Check if onboarding is completed
      const hasCompletedOnboarding = localStorage.getItem('conativeQuizCompleted');
      if (hasCompletedOnboarding !== 'true') {
        navigate("/onboarding");
      } else {
        navigate("/voice-demo");
      }
    } else {
      // Direct to the career quiz page
      navigate("/career-quiz");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-duo-green-100 to-duo-blue-50 animate-gradient-x">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-duo-green-600 mb-4 font-fabrica">
                Discover Your Perfect Career Path
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-medium text-duo-purple-500 mb-6 font-balloon">
                Just 5 minutes a day to find your ideal career match!
              </h2>
              
              <p className="text-lg text-gray-700 mb-8">
                Answer fun mini-game questions and uncover career paths perfectly suited to your unique 
                personality, skills, and interests.
              </p>
              
              <Button 
                onClick={handleStartJourney}
                className="bg-duo-green-500 hover:bg-duo-green-600 text-white text-xl px-8 py-6 rounded-xl
                         shadow-lg transition-transform hover:scale-105 animate-bounce-slow font-balloon"
                size="lg"
              >
                {user ? "Continue Journey" : "Start Race"} 
                <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              {/* Lifetime GPS Journey Image */}
              <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <img 
                  src={startImage}
                  alt="Lifetime GPS Career Journey"
                  className="w-full rounded-2xl"
                />
                
                {/* Start Label */}
                <div className="absolute bottom-4 left-4 bg-duo-green-600 text-white px-4 py-2 rounded-lg font-bold">
                  START
                </div>
              </div>
              
              {/* Achievement Badge */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-duo-orange-500 text-white p-3 rounded-full shadow-lg
                          flex items-center justify-center"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-8 h-8" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Streak Counter */}
        {user && (
          <motion.div 
            className="bg-white rounded-xl p-4 shadow-lg flex items-center max-w-xs mx-auto mb-12"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="bg-duo-orange-500 p-2 rounded-lg mr-3">
              <Flame className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Current Streak</p>
              <p className="font-bold text-xl">{streakCount} {streakCount === 1 ? 'day' : 'days'}</p>
            </div>
          </motion.div>
        )}
        
        {/* How It Works - 3 Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-duo-purple-600 mb-10 font-balloon">
            Three Simple Steps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Play Mini-Games",
                description: "Engage with fun mini-games that reveal your unique skills and preferences.",
                icon: "🎮",
                color: "bg-duo-green-500",
                delay: 0.3
              },
              {
                title: "Discover Matches",
                description: "Get personalized career recommendations based on your natural strengths.",
                icon: "🧩",
                color: "bg-duo-purple-500",
                delay: 0.5
              },
              {
                title: "Explore Roadmaps",
                description: "See step-by-step paths to your ideal careers with education options.",
                icon: "🗺️",
                color: "bg-duo-blue-500",
                delay: 0.7
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: step.delay }}
              >
                <div className={`${step.color} p-4 flex justify-center`}>
                  <span className="text-4xl">{step.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 flex items-center font-balloon">
                    <span className="bg-duo-green-100 text-duo-green-600 rounded-full w-7 h-7 inline-flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Achievements Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-16">
          <h2 className="text-2xl font-bold text-duo-purple-600 mb-4 font-balloon">
            Achievements to Unlock
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: "Career Explorer", icon: "🔍", unlocked: true },
              { name: "Future Planner", icon: "📊", unlocked: true },
              { name: "Skill Master", icon: "🎯", unlocked: false },
              { name: "Path Finder", icon: "🧭", unlocked: false },
              { name: "Dream Chaser", icon: "💫", unlocked: false }
            ].map((achievement, index) => (
              <motion.div
                key={index}
                className={`rounded-lg p-3 text-center ${
                  achievement.unlocked 
                    ? "bg-duo-green-100 text-duo-green-700 border-2 border-duo-green-300" 
                    : "bg-gray-100 text-gray-400"
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="text-3xl mb-1">{achievement.icon}</div>
                <p className="text-sm font-medium">{achievement.name}</p>
                {achievement.unlocked && (
                  <span className="inline-flex items-center text-xs mt-1">
                    <Check className="w-3 h-3 mr-1" /> Unlocked
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center text-duo-purple-600 mb-6 font-balloon">
            Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "I had no idea what career to pursue after high school. Lifetime GPS helped me discover my passion for UX design in just a week!",
                author: "Jamie, 17",
                avatar: "👩‍💻"
              },
              {
                quote: "The mini-games made figuring out my strengths actually fun! Now I'm exploring trade careers I never would have considered.",
                author: "Tyler, 16",
                avatar: "👨‍🔧"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-duo-purple-500"
                initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <div className="flex items-start">
                  <div className="bg-duo-purple-100 rounded-full p-3 text-3xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="italic text-gray-700 mb-2">{testimonial.quote}</p>
                    <p className="font-medium text-duo-purple-600">{testimonial.author}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Start Button */}
        <div className="text-center">
          <Button 
            onClick={handleStartJourney}
            className="bg-duo-purple-500 hover:bg-duo-purple-600 text-white text-xl px-10 py-6 rounded-xl
                     shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 font-balloon"
            size="lg"
          >
            {user ? "Continue Your Journey" : "Begin Your Journey"} 
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RedesignedHome;