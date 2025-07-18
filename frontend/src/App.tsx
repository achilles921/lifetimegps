import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import RedesignedHome from "@/pages/redesigned-home";
import AlgorithmDemo from "@/components/AlgorithmDemo";
import VoiceDemo from "@/pages/voice-demo";
import SimpleSignupPage from "@/pages/SimpleSignup";
import CareerQuizPageFixed from "@/pages/career-quiz-fixed";
import QuickQuizPage from "@/pages/quick-quiz";
import ResultsPage from "@/pages/results";
import CareerDashboardPage from "@/pages/dashboard";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import TestimonialsPage from "@/pages/testimonials";
import TermsPage from "@/pages/TermsPage";
import EducationRequirements from "@/pages/education/[id]";
import ShadowingOpportunitiesPage from "@/pages/shadowing-opportunities";
import AlgorithmTestPage from "@/pages/algorithm-test";
import OnboardingPage from "@/pages/onboarding";

import MiniGamesHub from "@/pages/mini-games";
import ColorDashPage from "@/pages/mini-games/color-dash";
// Import mini-game pages
import SentenceQuestPage from "@/pages/mini-games/sentence-quest";
import MultisensoryMatrixPage from "@/pages/mini-games/multisensory-matrix";
import VerboFlashPage from "@/pages/mini-games/verbo-flash";
import { useEffect } from "react";

import { ActivityProvider } from "@/context/ActivityContext";
import { AuthProviderFixed } from "@/context/AuthContextFixed";
import { UserProvider } from "@/context/UserContext";
import { Navbar } from "@/components/Navbar";
import { ProtectedRouteFixed as ProtectedRoute, MiniGameProtectedRouteFixed as MiniGameProtectedRoute } from "@/components/ProtectedRouteFixed";

function Router() {
  const [location] = useLocation();

  // Log current route for debugging
  useEffect(() => {
   //  console.log(`Current route: ${location}`);
    
    // Check if we've just logged out (URL contains ?logout=timestamp)
    if (location.includes('?logout=')) {
     //  console.log('Detected logout redirect, clearing client-side state');
      
      // Clear any client-side authentication data or state
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Force a page reload to reset all client state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={RedesignedHome} />
        <Route path="/algorithm-demo" component={AlgorithmDemo} />
        <Route path="/voice-demo" component={VoiceDemo} />
        <Route path="/onboarding" component={OnboardingPage} />
        <Route path="/login" component={SimpleSignupPage} />
        <Route path="/career-quiz" component={CareerQuizPageFixed} />
        <Route path="/quick-quiz">
          <ProtectedRoute>
            <QuickQuizPage />
          </ProtectedRoute>
        </Route>
        <Route path="/results" component={ResultsPage} />
        <Route path="/dashboard">
          <ProtectedRoute>
            <CareerDashboardPage />
          </ProtectedRoute>
        </Route>
        <Route path="/mini-games">
          <MiniGameProtectedRoute>
            <MiniGamesHub />
          </MiniGameProtectedRoute>
        </Route>
        <Route path="/mini-games/color-dash">
          <MiniGameProtectedRoute>
            <ColorDashPage />
          </MiniGameProtectedRoute>
        </Route>
        <Route path="/mini-games/sentence-quest">
          <MiniGameProtectedRoute>
            <SentenceQuestPage />
          </MiniGameProtectedRoute>
        </Route>
        <Route path="/mini-games/multisensory-matrix">
          <MiniGameProtectedRoute>
            <MultisensoryMatrixPage />
          </MiniGameProtectedRoute>
        </Route>
        <Route path="/mini-games/verbo-flash">
          <MiniGameProtectedRoute>
            <VerboFlashPage />
          </MiniGameProtectedRoute>
        </Route>

        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/testimonials" component={TestimonialsPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/education/:id">
          <ProtectedRoute>
            <EducationRequirements />
          </ProtectedRoute>
        </Route>
        <Route path="/shadowing-opportunities" component={ShadowingOpportunitiesPage} />
        <Route path="/algorithm-test" component={AlgorithmTestPage} />
        {/* Fallback to 404 with debug info */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderFixed>
        <ActivityProvider>
          <UserProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </UserProvider>
        </ActivityProvider>
      </AuthProviderFixed>
    </QueryClientProvider>
  );
}

export default App;