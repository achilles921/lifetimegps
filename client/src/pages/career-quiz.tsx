import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronsRight, Sparkles, Target, Clock, Trophy, Star, Flag, Medal, Rocket, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContextFixed';
import finishLineImage from "@assets/Finish Line.png";
import womanRacerImage from "@assets/woman racer.png";
import gpsImage from "@assets/LIFETIME Career Race.png";

const CareerQuizPage: React.FC = () => {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  // Debug Authentication state - log whenever it changes
  useEffect(() => {
    console.log("Authentication state changed:", { 
      isAuthenticated, 
      user
    });
  }, [isAuthenticated, user]);

  // Load the selected voice from localStorage
  useEffect(() => {
    const voiceId = localStorage.getItem('selectedVoiceId');
    const voiceGender = localStorage.getItem('selectedVoiceGender');
    
    if (voiceId) {
      setSelectedVoiceId(voiceId);
    }
    
    if (voiceGender) {
      setSelectedVoiceGender(voiceGender);
    }
  }, []);

  // Clear previous quiz data when retaking the quiz
  const clearPreviousQuizData = () => {
    // Get all localStorage keys
    const allKeys = Object.keys(localStorage);
    
    // Find all keys related to previous quiz sessions
    const quizKeys = allKeys.filter(key => 
      key.includes('_quickQuizAnswers_') || 
      key.includes('_question_timing_') ||
      key.includes('_shuffled_questions_')
    );
    
    // Remove all previous quiz data
    quizKeys.forEach(key => localStorage.removeItem(key));
    
    // Reset sector to 1
    localStorage.setItem('currentSector', '1');
    
    // Remove any fully completed flag
    localStorage.removeItem('quizFullyCompleted');
    
    // Clear previous career matches - this is important!
    // Otherwise old results can sometimes be reused
    localStorage.removeItem('allCareerMatches');
    
    console.log('Cleared all previous quiz data and career matches');
  };

  // Direct navigation to the Career Race Quiz
  const handleStartQuiz = () => {
    // Clear all previous quiz data
    clearPreviousQuizData();
    
    // We'll always start a new quiz session regardless of previous completion
    // Create a new session ID based on current timestamp
    const newSessionId = `quiz_${Date.now()}`;
    localStorage.setItem('currentQuizSessionId', newSessionId);
    console.log("Starting new quiz session:", newSessionId);
    
    // Navigate to the quiz
    navigate('/quick-quiz');
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-duo-green-100 to-duo-blue-50 animate-gradient-x py-10 px-4">
      <motion.div 
        className="container mx-auto p-4 max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.header 
          className="mb-8 text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="bg-duo-purple-100 p-4 rounded-full inline-block mb-4"
            variants={item}
          >
            <Trophy className="h-10 w-10 text-duo-purple-500" />
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold mb-2 text-duo-green-600"
            variants={item}
          >
            Your Fun Career Discovery Race
          </motion.h1>
          <motion.p 
            className="text-xl text-duo-purple-500 mb-4"
            variants={item}
          >
            Discover your ideal career path through fun, interactive activities
          </motion.p>
          <motion.div
            className="flex items-center justify-center space-x-3 mt-4"
            variants={item}
          >
            <span className="inline-flex items-center rounded-full bg-duo-orange-100 border-2 border-duo-orange-300 px-3 py-1 text-sm font-semibold text-duo-orange-600">
              <Clock size={16} className="mr-1" /> Quick &amp; Fun
            </span>
            <span className="inline-flex items-center rounded-full bg-duo-blue-100 border-2 border-duo-blue-300 px-3 py-1 text-sm font-semibold text-duo-blue-600">
              <Star size={16} className="mr-1" /> 90%+ accurate and effective
            </span>
          </motion.div>
        </motion.header>

        <motion.section 
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="flex items-center gap-4 mb-6"
            variants={item}
          >
            <div className="bg-duo-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center">
              <Flag size={24} />
            </div>
            <h2 className="text-2xl font-bold text-duo-green-600">Welcome to Your Career Race!</h2>
          </motion.div>
          
          <motion.p 
            className="mb-6 text-gray-700 text-lg"
            variants={item}
          >
            Your {selectedVoiceGender || 'AI'} guide will help you navigate through this fun 
            race to discover career paths that match your unique strengths and interests.
          </motion.p>
          
          <motion.div 
            className="relative mb-10 mt-6 rounded-xl overflow-hidden shadow-lg"
            variants={item}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src={gpsImage} 
              alt="GPS Career Journey Milestones" 
              className="w-full rounded-xl"
            />
            <motion.div
              className="absolute -top-3 -right-3 bg-duo-orange-500 text-white p-2 rounded-full shadow-lg"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-6 h-6" />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            variants={container}
            initial="hidden"
            animate="show"
            transition={{ delayChildren: 0.3 }}
          >
            <motion.div 
              className="bg-duo-blue-50 rounded-xl p-5 shadow-md border-2 border-duo-blue-200"
              variants={item}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-duo-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">1</div>
                <h3 className="font-bold text-duo-blue-700">Fun Mini-Games</h3>
              </div>
              <p className="text-duo-blue-800">
                Quick, fun activities that reveal your talents and natural abilities!
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-duo-purple-50 rounded-xl p-5 shadow-md border-2 border-duo-purple-200"
              variants={item}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-duo-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">2</div>
                <h3 className="font-bold text-duo-purple-700">Instant Analysis</h3>
              </div>
              <p className="text-duo-purple-800">
                Our AI quickly processes your results to identify ideal career matches!
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-duo-green-50 rounded-xl p-5 shadow-md border-2 border-duo-green-200"
              variants={item}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-duo-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">3</div>
                <h3 className="font-bold text-duo-green-700">Career Roadmap</h3>
              </div>
              <p className="text-duo-green-800">
                Get a personalized path to your ideal career with clear, actionable steps!
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-duo-purple-200 rounded-2xl shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-duo-green-100 to-duo-blue-100">
              <CardTitle className="flex items-center gap-3 text-duo-purple-600">
                <Medal className="text-duo-orange-500" size={28} />
                Start Your Career Race Quiz
              </CardTitle>
              <CardDescription className="text-duo-purple-800 text-base">
                Complete the fun Career Race Quiz to unlock mini-games and discover your ideal career
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div 
                className="bg-duo-orange-50 border-2 border-duo-orange-200 p-4 rounded-xl mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <p className="text-duo-orange-800 text-sm font-medium">
                  <strong>Pro Tip:</strong> Complete each section of the Career Race Quiz to unlock exciting mini-games
                  that will help you further develop your skills while having fun!
                </p>
              </motion.div>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex items-start space-x-4 p-5 rounded-xl cursor-pointer bg-duo-purple-50 border-2 border-duo-purple-200 hover:bg-duo-purple-100 transition-all hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log("Career Race Quiz clicked");
                    // Add additional debug information
                    console.log("Auth state:", { 
                      isAuthenticated, 
                      user,
                      isAuthByFullCheck: checkUserAuthenticated()
                    });
                    
                    // FIXED: Use more robust auth check
                    if (checkUserAuthenticated()) {
                      console.log("User is authenticated, navigating directly to quiz");
                      handleStartQuiz();
                    } else {
                      console.log("User not authenticated, navigating to signup");
                      // Save where to redirect after login (to quick-quiz directly)
                      localStorage.setItem('redirectAfterLogin', '/quick-quiz');
                      navigate('/login');
                    }
                  }}
                >
                  <div className="bg-duo-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 font-bold">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold text-lg flex items-center text-duo-purple-700">
                      <span>Career Race Quiz</span>
                      <span className="ml-2 bg-white text-duo-purple-600 text-xs px-3 py-1 rounded-full flex items-center border border-duo-purple-300">
                        <Clock size={12} className="mr-1" /> 10-15 min
                      </span>
                    </Label>
                    <p className="text-duo-purple-800">
                      Complete this fun, interactive quiz to discover your unique talents, preferences, and interests.
                      Each section you complete will unlock a mini-game that helps you develop your skills!
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-5 bg-duo-blue-50 border-t-2 border-duo-blue-200">
              <p className="text-sm font-medium text-duo-blue-700 italic">
                Unlock mini-games by completing sections of the Career Race Quiz
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => {
                    // Add additional debug information
                    console.log("Start Race button clicked");
                    console.log("Auth state:", { 
                      isAuthenticated, 
                      user,
                      isAuthByFullCheck: checkUserAuthenticated()
                    });
                    
                    // FIXED: Use more robust auth check
                    if (checkUserAuthenticated()) {
                      console.log("User is authenticated, navigating directly to quiz");
                      handleStartQuiz();
                    } else {
                      console.log("User not authenticated, navigating to signup");
                      // Save where to redirect after login (to quick-quiz directly)
                      localStorage.setItem('redirectAfterLogin', '/quick-quiz');
                      navigate('/login');
                    }
                  }}
                  className="bg-duo-green-500 hover:bg-duo-green-600 text-white font-bold rounded-xl px-6 py-2 text-lg"
                >
                  Start Race
                  <ChevronRight className="ml-2" size={20} />
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.section>

        <motion.section 
          className="p-8 rounded-2xl text-center relative overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)), url(${finishLineImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-duo-green-500/20 to-duo-purple-500/20" />
          <div className="relative z-10">
            <motion.div
              className="bg-duo-orange-100 p-4 rounded-full inline-block mb-4 border-2 border-duo-orange-300"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Rocket className="h-10 w-10 text-duo-orange-500" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4 text-duo-purple-700">
              Your Career Discovery Race Starts Now!
            </h2>
            <p className="mb-6 max-w-xl mx-auto text-lg text-duo-purple-600">
              Complete the Career Race Quiz to unlock mini-games and discover your ideal careers
              based on your unique talents and interests.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => {
                  // Add additional debug information
                  console.log("Bottom Start Race button clicked");
                  console.log("Auth state:", { 
                    isAuthenticated, 
                    user,
                    isAuthByFullCheck: checkUserAuthenticated()
                  });
                  
                  // FIXED: Use more robust auth check
                  if (checkUserAuthenticated()) {
                    console.log("User is authenticated, navigating directly to quiz");
                    handleStartQuiz();
                  } else {
                    console.log("User not authenticated, navigating to signup");
                    // Save where to redirect after login (to quick-quiz directly)
                    localStorage.setItem('redirectAfterLogin', '/quick-quiz');
                    navigate('/login');
                  }
                }}
                className="bg-duo-orange-500 hover:bg-duo-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-xl"
              >
                Start Race <ChevronsRight className="ml-2" size={24} />
              </Button>
            </motion.div>
          </div>
        </motion.section>
        
        <motion.div 
          className="mt-10 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>© 2025 Lifetime GPS · All career data is accurate and up-to-date</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CareerQuizPage;