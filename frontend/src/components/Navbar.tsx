import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  MenuIcon, XIcon, Home, Info, MessageSquare, Mail, 
  Compass, Rocket, LogIn, Award, Flame, LogOut, 
  BarChart3, ChevronDown, ChevronUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContextFixed';
import { areAllSectionsCompleted } from '@/utils/quizLogic';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();
  // Using useRef to prevent re-renders + deep equality check issues
  const streakCountRef = useRef<number>(0);
  const { user, isAuthenticated, logout } = useAuth();
  
  // Generate a stable streak count that doesn't change on re-renders
  // Using useEffect to prevent potential render loop issues
  useEffect(() => {
    if (isAuthenticated && streakCountRef.current === 0) {
      // Set once and only once during component lifecycle
      streakCountRef.current = Math.floor(Math.random() * 7) + 1;
    }
  }, [isAuthenticated]);
  
  // Handle logout with the centralized function from useAuth
  const handleLogout = () => {
    // Clear session storage but let the auth hook handle cookies
    sessionStorage.clear();
    
    // Use the centralized logout function which will handle cookie clearing and redirect
    logout();
    
    // Optional: Add a fallback redirect with a slight delay
    setTimeout(() => {
      if (window.location.pathname !== '/') {
        window.location.href = window.location.origin;
      }
    }, 100);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  // Pill animation variants
  const pillVariants = {
    inactive: { 
      backgroundColor: 'rgb(255, 255, 255)',
      color: 'rgb(75, 85, 99)'
    },
    active: { 
      backgroundColor: 'rgb(52, 211, 153)',
      color: 'rgb(255, 255, 255)'
    },
    hover: { 
      scale: 1.05,
      backgroundColor: 'rgb(16, 185, 129)',
      color: 'rgb(255, 255, 255)'
    }
  };

  const renderNavLink = (path: string, label: string, icon: React.ReactNode) => {
    const active = isActive(path);
    
    return (
      <Link href={path} onClick={closeMenu}>
        <motion.div
          className={`flex items-center px-4 py-2 rounded-full font-medium transition-all cursor-pointer`}
          initial="inactive"
          animate={active ? "active" : "inactive"}
          whileHover="hover"
          variants={pillVariants}
        >
          {icon}
          <span className="ml-2 font-balloon">{label}</span>
          {active && (
            <motion.div
              className="w-2 h-2 bg-white rounded-full ml-2"
              layoutId="navIndicator"
              transition={{ type: "spring", bounce: 0.2 }}
            />
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <motion.nav 
      className="bg-white sticky top-0 z-50 shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center">
            <motion.span 
              className="text-duo-green-600 font-bold text-2xl font-fabrica !font-fabrica"
              style={{ fontFamily: "'Space Grotesk', 'Lexend', sans-serif" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lifetime GPS
            </motion.span>
          </Link>

          {/* Streak indicator (if logged in) */}
          {isAuthenticated && (
            <motion.div 
              className="hidden md:flex items-center bg-duo-orange-50 px-3 py-1 rounded-full border border-duo-orange-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
            >
              <Flame className="text-duo-orange-500 mr-1 h-5 w-5" />
              <span className="text-duo-orange-700 font-medium">{streakCountRef.current}-day streak</span>
            </motion.div>
          )}

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {renderNavLink("/", "Home", <Home className="h-4 w-4" />)}
            
            {/* About dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  className="flex items-center px-4 py-2 rounded-full font-medium transition-all cursor-pointer bg-white text-gray-600 hover:bg-duo-green-500 hover:text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  <Info className="h-4 w-4" />
                  <span className="ml-2 font-balloon">About</span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/about" className="flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    <span>About Us</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/testimonials" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Testimonials</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Contact</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {renderNavLink("/career-quiz", "Career Race", <Compass className="h-4 w-4" />)}
            {isAuthenticated && renderNavLink("/dashboard", "Dashboard", <BarChart3 className="h-4 w-4" />)}
            {/* Always show Mini-games Hub if authenticated to prevent potential infinite loops */}
            {isAuthenticated && renderNavLink("/mini-games", "Mini-games Hub", <Rocket className="h-4 w-4" />)}
            
            <div onClick={() => {
                if (isAuthenticated) {
                  // FIXED: When logged in, go directly to quiz questions, not the intro page
                 //  console.log("Navbar Start Race: User is authenticated, going directly to quiz questions");
                  
                  // Clear previous quiz data to start fresh
                  // Get all localStorage keys
                  const allKeys = Object.keys(localStorage);
                  
                  // Find and remove all keys related to previous quiz sessions
                  const quizKeys = allKeys.filter(key => 
                    key.includes('_quickQuizAnswers_') || 
                    key.includes('_question_timing_') ||
                    key.includes('_shuffled_questions_')
                  );
                  
                  // Remove all previous quiz data
                  quizKeys.forEach(key => localStorage.removeItem(key));
                  
                  // Reset sector to 1
                  localStorage.setItem('currentSector', '1');
                  
                  // Remove any fully completed flag and clear previous career matches
                  localStorage.removeItem('quizFullyCompleted');
                  localStorage.removeItem('allCareerMatches');
                  
                  // Create a new session ID
                  const newSessionId = `quiz_${Date.now()}`;
                  localStorage.setItem('currentQuizSessionId', newSessionId);
                  
                  // Navigate directly to the quiz questions
                  navigate("/quick-quiz");
                } else {
                  navigate("/login");
                }
              }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="sm" 
                  className="bg-duo-purple-500 hover:bg-duo-purple-600 text-white rounded-full ml-2 font-balloon"
                >
                  {isAuthenticated ? (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Start Race
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Start Race
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
            
            {/* Logout Button */}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2"
              >
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-duo-red-300 text-duo-red-600 hover:bg-duo-red-50 rounded-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={toggleMenu}
              className="bg-duo-green-100 text-duo-green-600 p-2 rounded-full hover:bg-duo-green-200 focus:outline-none"
              whileTap={{ scale: 0.9 }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden py-4 space-y-2 mt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderNavLink("/", "Home", <Home className="h-4 w-4" />)}
              
              {/* About section with submenu for mobile */}
              <div className="bg-white rounded-lg border border-gray-100">
                <button 
                  onClick={() => {
                    const elem = document.getElementById('about-submenu');
                    if (elem) {
                      elem.classList.toggle('hidden');
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-left"
                >
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    <span className="font-medium font-balloon">About</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                <div id="about-submenu" className="hidden px-4 py-2 border-t border-gray-100 space-y-2">
                  <Link href="/about" onClick={closeMenu} className="flex items-center py-1">
                    <Info className="h-4 w-4 mr-2 text-duo-green-500" />
                    <span>About Us</span>
                  </Link>
                  <Link href="/testimonials" onClick={closeMenu} className="flex items-center py-1">
                    <MessageSquare className="h-4 w-4 mr-2 text-duo-green-500" />
                    <span>Testimonials</span>
                  </Link>
                  <Link href="/contact" onClick={closeMenu} className="flex items-center py-1">
                    <Mail className="h-4 w-4 mr-2 text-duo-green-500" />
                    <span>Contact</span>
                  </Link>
                </div>
              </div>
              
              {renderNavLink("/career-quiz", "Career Race", <Compass className="h-4 w-4" />)}
              {isAuthenticated && renderNavLink("/dashboard", "Dashboard", <BarChart3 className="h-4 w-4" />)}
              {/* Always show Mini-games Hub in mobile menu if authenticated */}
              {isAuthenticated && renderNavLink("/mini-games", "Mini-games Hub", <Rocket className="h-4 w-4" />)}
              
              <div className="pt-2">
                <div onClick={() => {
                  closeMenu();
                  if (isAuthenticated) {
                    // FIXED: When logged in, go directly to quiz questions in mobile menu too
                   //  console.log("Mobile Start Race: User is authenticated, going directly to quiz questions");
                    
                    // Clear previous quiz data to start fresh
                    const allKeys = Object.keys(localStorage);
                    const quizKeys = allKeys.filter(key => 
                      key.includes('_quickQuizAnswers_') || 
                      key.includes('_question_timing_') ||
                      key.includes('_shuffled_questions_')
                    );
                    
                    // Remove all previous quiz data
                    quizKeys.forEach(key => localStorage.removeItem(key));
                    
                    // Reset sector to 1 and create new session
                    localStorage.setItem('currentSector', '1');
                    localStorage.removeItem('quizFullyCompleted');
                    localStorage.removeItem('allCareerMatches');
                    
                    // Create a new session ID
                    const newSessionId = `quiz_${Date.now()}`;
                    localStorage.setItem('currentQuizSessionId', newSessionId);
                    
                    // Navigate directly to the quiz questions
                    navigate("/quick-quiz");
                  } else {
                    navigate("/login");
                  }
                }}>
                  <Button 
                    className="w-full bg-duo-purple-500 hover:bg-duo-purple-600 text-white rounded-xl font-balloon"
                  >
                    {isAuthenticated ? "Start Race" : "Start Race"}
                  </Button>
                </div>
              </div>
              
              {/* Logout Button for Mobile */}
              {isAuthenticated && (
                <div className="pt-2">
                  <Button 
                    className="w-full border-duo-red-300 text-duo-red-600 bg-white hover:bg-duo-red-50 rounded-xl"
                    variant="outline"
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              )}
              
              {isAuthenticated && (
                <motion.div 
                  className="flex items-center justify-center bg-duo-orange-50 p-2 rounded-full mt-4 border border-duo-orange-200"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <Flame className="text-duo-orange-500 mr-2 h-5 w-5" />
                  <span className="text-duo-orange-700 font-medium">{streakCountRef.current}-day streak</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}