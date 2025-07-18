import React, { useState, useEffect } from 'react';
import VoiceControls from '@/components/VoiceControls';
import { PerformanceProvider } from '@/context/PerformanceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ChevronRight, PersonStanding, Volume2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const VoiceDemo: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('isLoggedIn') === 'true');
  const { toast } = useToast();
  
  // Handle login state check
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);
  
  // Debug voice API endpoints
  useEffect(() => {
    async function checkVoiceEndpoints() {
      try {
       //  console.log("Checking voice endpoints...");
        
        // Check all voices
        const allVoicesResponse = await fetch('/api/voice/voices');
        const allVoicesData = await allVoicesResponse.json();
       //  console.log("All voices:", allVoicesData);
        
        // Check female voices
        const femaleVoicesResponse = await fetch('/api/voice/voices/female');
        const femaleVoicesData = await femaleVoicesResponse.json();
       //  console.log("Female voices:", femaleVoicesData);
        
        // Check male voices
        const maleVoicesResponse = await fetch('/api/voice/voices/male');
        const maleVoicesData = await maleVoicesResponse.json();
       //  console.log("Male voices:", maleVoicesData);
      } catch (error) {
        console.error("Error checking voice endpoints:", error);
      }
    }
    
    checkVoiceEndpoints();
  }, []);
  
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
    <PerformanceProvider>
      <div className="min-h-screen bg-gradient-to-br from-duo-green-100 to-duo-blue-50 animate-gradient-x py-10 px-4">
        <motion.div 
          className="container mx-auto p-4 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-duo-purple-100 p-4 rounded-full inline-block mb-4"
            >
              <Sparkles className="h-10 w-10 text-duo-purple-500" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold mb-2 text-duo-purple-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {isLoggedIn ? 'Choose Your Voice Guide' : 'Lifetime GPS Voice Demo'}
            </motion.h1>
            <motion.p 
              className="text-lg text-duo-purple-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isLoggedIn 
                ? 'Select the voice that will guide you through your career discovery journey'
                : 'Explore our human-like voice AI options for personalized career guidance'}
            </motion.p>
          </header>
          
          <motion.section 
            className="mb-8 p-6 bg-white rounded-2xl shadow-lg"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.h2 
              className="text-2xl font-semibold mb-4 flex items-center text-duo-green-600"
              variants={item}
            >
              <Volume2 className="mr-2" />
              Voice Selection
            </motion.h2>
            <motion.p 
              className="mb-6 text-gray-600"
              variants={item}
            >
              Choose a voice for your career guidance journey. Our AI voices sound natural and engaging to provide a personalized experience.
            </motion.p>
            
            <Tabs 
              defaultValue={selectedGender} 
              onValueChange={(value) => setSelectedGender(value as 'male' | 'female')} 
              className="mt-6"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 bg-duo-green-50">
                <TabsTrigger 
                  value="female"
                  className="data-[state=active]:bg-duo-green-500 data-[state=active]:text-white py-3 rounded-xl"
                >
                  Female Voice
                </TabsTrigger>
                <TabsTrigger 
                  value="male"
                  className="data-[state=active]:bg-duo-purple-500 data-[state=active]:text-white py-3 rounded-xl"
                >
                  Male Voice
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="female" className="p-4 border rounded-xl border-duo-green-200 bg-duo-green-50">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="rounded-xl overflow-hidden bg-white p-4 shadow-sm border border-duo-green-100">
                      <h3 className="text-xl font-medium mb-3 text-duo-green-600">Female Voice Guide</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Our female voice options provide clear, friendly guidance through your career journey. Perfect for those who prefer a supportive, encouraging tone.
                      </p>
                      
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center text-sm">
                          <Check size={16} className="mr-2 text-duo-green-500" />
                          Natural-sounding speech patterns
                        </li>
                        <li className="flex items-center text-sm">
                          <Check size={16} className="mr-2 text-duo-green-500" />
                          Clear pronunciation and emphasis
                        </li>
                        <li className="flex items-center text-sm">
                          <Check size={16} className="mr-2 text-duo-green-500" />
                          Customizable voice settings
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <VoiceControls 
                      gender="female"
                      initialText="Hello! I'm your career guidance assistant. I can help you discover your perfect career path based on your unique strengths and interests."
                      onVoiceChange={setSelectedVoiceId}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="male" className="p-4 border rounded-xl border-duo-purple-200 bg-duo-purple-50">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="rounded-xl overflow-hidden bg-white p-4 shadow-sm border border-duo-purple-100">
                      <h3 className="text-xl font-medium mb-3 text-duo-purple-600">Male Voice Guide</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Our male voice options provide confident, clear guidance through your career exploration. Ideal for those who prefer a straightforward, assured tone.
                      </p>
                      
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center text-sm">
                          <Check size={16} className="mr-2 text-duo-purple-500" />
                          Clear, authoritative delivery
                        </li>
                        <li className="flex items-center text-sm">
                          <Check size={16} className="mr-2 text-duo-purple-500" />
                          Varied intonation and pacing
                        </li>
                        <li className="flex items-center text-sm">
                          <Check size={16} className="mr-2 text-duo-purple-500" />
                          Adjustable voice characteristics
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <VoiceControls 
                      gender="male"
                      initialText="Welcome to Lifetime GPS. I'm here to guide you on your career discovery journey and help you find the perfect professional path."
                      onVoiceChange={setSelectedVoiceId}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.section>
          
          <motion.section 
            className="mb-8 p-6 bg-white rounded-2xl shadow-lg"
            variants={container}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.4 }}
          >
            <motion.h2 
              className="text-2xl font-semibold mb-4 text-duo-blue-600"
              variants={item}
            >
              How Voice AI Enhances Your Experience
            </motion.h2>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mt-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div 
                className="bg-duo-blue-50 rounded-xl p-4 shadow-sm border border-duo-blue-100"
                variants={item}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-lg font-medium mb-2 flex items-center text-duo-blue-600">
                  <ChevronRight className="mr-1 text-duo-blue-500" />
                  Personalized Guidance
                </h3>
                <p className="text-sm text-gray-600">
                  Our voice AI provides customized career advice based on your unique profile, making complex information easier to understand.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-duo-blue-50 rounded-xl p-4 shadow-sm border border-duo-blue-100"
                variants={item}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-lg font-medium mb-2 flex items-center text-duo-blue-600">
                  <ChevronRight className="mr-1 text-duo-blue-500" />
                  Accessibility
                </h3>
                <p className="text-sm text-gray-600">
                  Voice interaction makes career guidance accessible to different learning styles and abilities, ensuring no one is left behind.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-duo-blue-50 rounded-xl p-4 shadow-sm border border-duo-blue-100"
                variants={item}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-lg font-medium mb-2 flex items-center text-duo-blue-600">
                  <ChevronRight className="mr-1 text-duo-blue-500" />
                  Engaging Experience
                </h3>
                <p className="text-sm text-gray-600">
                  Human-like voices create an engaging, conversational experience that keeps you motivated throughout your career discovery journey.
                </p>
              </motion.div>
            </motion.div>
          </motion.section>
          
          <motion.section 
            className="text-center p-8 bg-white rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-duo-purple-600">
              {isLoggedIn ? 'Ready to Continue Your Journey?' : 'Ready to Start Your Journey?'}
            </h2>
            <p className="text-lg mb-6 max-w-xl mx-auto text-duo-purple-500">
              {isLoggedIn 
                ? 'Welcome back! Select or change your voice guide before continuing to the career race.' 
                : 'Customize your career GPS experience by selecting your preferred voice guide and begin exploring your ideal career path today.'}
            </p>
            
            <motion.button 
              className="bg-duo-green-500 hover:bg-duo-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-md transition duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Use voice selection to proceed
                if (selectedVoiceId) {
                  // Store the voice selection in localStorage for later use
                  localStorage.setItem('selectedVoiceId', selectedVoiceId);
                  localStorage.setItem('selectedVoiceGender', selectedGender);
                  
                  // Check if the user has completed the quiz
                  const hasQuizResults = localStorage.getItem('savedResults');
                  
                  // Use the isLoggedIn state variable
                  if (isLoggedIn && hasQuizResults) {
                    // If logged in and has results, redirect to dashboard
                    window.location.assign('/dashboard');
                  } else if (isLoggedIn) {
                    // If logged in but no results, redirect to career race
                    window.location.assign('/career-quiz');
                  } else {
                    // If not logged in, redirect to signup
                    window.location.assign('/signup');
                  }
                } else {
                  // Toast notification if no voice is selected
                  toast({
                    title: "Voice Selection Required",
                    description: "Please select a voice before proceeding",
                    variant: "destructive"
                  });
                }
              }}
            >
              {isLoggedIn ? 
                (localStorage.getItem('savedResults') ? 'Continue to Dashboard ' : 'Continue to Quiz ') 
                : 'Continue to Sign Up '}
              <ChevronRight className="inline-block ml-1" />
            </motion.button>
            
            <p className="mt-4 text-sm text-gray-500">
              {isLoggedIn 
                ? 'Your voice preference will be saved to your account' 
                : 'Sign up or log in to save your voice preference and start your career discovery journey'}
            </p>
          </motion.section>
          
          <motion.footer 
            className="mt-12 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p>Voice technology powered by ElevenLabs AI</p>
          </motion.footer>
        </motion.div>
      </div>
    </PerformanceProvider>
  );
};

export default VoiceDemo;