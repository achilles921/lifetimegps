import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  ChevronRight, 
  Trophy, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Award, 
  Mic, 
  RefreshCw,
  Home,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import CareerDashboard from '@/components/CareerDashboard';
import CareerDetailView from '@/components/CareerDetailView';
import { processQuizResponses, generateCareerMatches } from '@/utils/quizLogic';
import { motion } from 'framer-motion';
import { useActivity } from '@/context/ActivityContext';
// Define locally to avoid schema sync issues
interface CareerMatch {
  id: string;
  title: string;
  match: number;
  description: string;
  skills: string[];
  education: string;
  salary: string;
  outlook: string;
  category: string;
  workSchedule: string;
  youMightLike: string[];
  challenges: string[];
  workplaces: string[];
  colleagues: string[];
  educationPaths: string[];
  certifications: string[];
  advancementPaths: string[];
  growth?: string; // For backwards compatibility
}

const CareerDashboardPage: React.FC = () => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { trackEvent } = useActivity();
  const [careers, setCareers] = useState<CareerMatch[]>([]);
  const [userName, setUserName] = useState<string>('career explorer');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCareer, setSelectedCareer] = useState<CareerMatch | null>(null);
  const [viewingDetail, setViewingDetail] = useState<boolean>(false);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  useEffect(() => {
    // Trigger welcome confetti when the dashboard loads
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#58a700', '#a560f0', '#1cb0f6', '#ff9600'] // Duolingo colors
    });

    // Check if the user has completed the quiz without logging in
    const quizCompleted = localStorage.getItem('quizFullyCompleted') === 'true' || 
                         localStorage.getItem('quizCompleted') === 'true';
                         
    // Check if user is in guest mode
    const isGuest = !localStorage.getItem('isLoggedIn') && quizCompleted;
    setIsGuestMode(isGuest);
    
    // Get user name if available or use "Guest" for users who completed the quiz without registering
    const storedName = localStorage.getItem('userName');
    
    if (storedName && !isGuest) {
      setUserName(storedName);
    } else if (isGuest) {
      setUserName('Guest');
    }
    
    // Load career matches from localStorage
    const loadCareerMatches = () => {
      try {
        // First check for saved results
        const savedResults = localStorage.getItem('savedResults');
        if (savedResults) {
          setCareers(JSON.parse(savedResults));
          setIsLoading(false);
          return;
        }
        
        // Next, check for the allCareerMatches we created when seeding data
        const allMatches = localStorage.getItem('allCareerMatches');
        if (allMatches) {
          const parsedMatches = JSON.parse(allMatches);
          setCareers(parsedMatches);
          setIsLoading(false);
          
          // Also save to savedResults for future reference
          localStorage.setItem('savedResults', allMatches);
          return;
        }
        
        // Otherwise, check if the current user has specific quiz data
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          console.log(`Looking for quiz data for user: ${userEmail}`);
          
          // Look for quiz sessions that belong to this user
          const allKeys = Object.keys(localStorage);
          const userQuizSessions = allKeys.filter(key => 
            key.includes(userEmail) && 
            key.includes('_userEmail')
          );
          
          if (userQuizSessions.length > 0) {
            console.log(`Found ${userQuizSessions.length} quiz sessions for ${userEmail}`);
            
            // Get the most recent session ID (remove the _userEmail suffix)
            const mostRecentSession = userQuizSessions[userQuizSessions.length - 1]
              .replace('_userEmail', '');
            
            console.log(`Using most recent session: ${mostRecentSession}`);
            
            // Now fetch quiz data for this session
            const responses: any = {};
            
            // Get sector 1-4 answers
            for (let i = 1; i <= 4; i++) {
              const sectorKey = `${mostRecentSession}_quickQuizAnswers_sector_${i}`;
              const sectorData = localStorage.getItem(sectorKey);
              if (sectorData) {
                responses[`sector${i}`] = JSON.parse(sectorData);
                console.log(`Found data for sector ${i}`);
              }
            }
            
            // Get interests (sector 5)
            const sector5Key = `${mostRecentSession}_quickQuizAnswers_sector_5`;
            const sector5Data = localStorage.getItem(sector5Key);
            if (sector5Data) {
              const sector5Answers = JSON.parse(sector5Data);
              console.log(`Found data for sector 5`);
              
              // Convert sector 5 data to required format
              let interestIds: string[] = [];
              const interestValue = Object.values(sector5Answers)[0];
              
              if (typeof interestValue === 'string') {
                interestIds = interestValue.split(',');
              } else if (Array.isArray(interestValue)) {
                interestIds = interestValue;
              }
              
              if (interestIds.length > 0) {
                // Format for algorithm
                responses.sector5 = interestIds.map(id => ({
                  interest: id,
                  percentage: 100
                }));
              }
            }
            
            // Process the responses if we have any
            if (Object.keys(responses).length > 0) {
              console.log(`Processing quiz responses for ${userEmail}`);
              const results = processQuizResponses(responses);
              const matches = generateCareerMatches(results);
              
              // Use the top 5 matches
              const topMatches = matches.slice(0, 5).map(match => ({
                id: match.id || match.title.toLowerCase().replace(/\s+/g, '_'),
                title: match.title,
                match: Math.round(match.match),
                description: match.description,
                skills: match.skills || ["Problem Solving", "Communication", "Teamwork"],
                education: match.education || "Educational requirements vary",
                salary: match.salary || "Varies by experience and location",
                outlook: match.growth || "Average",
                category: match.category || "Various",
                workSchedule: match.workSchedule || "Typically 40 hours/week",
                youMightLike: match.youMightLike || [
                  "Enjoy problem-solving and critical thinking",
                  "Are detail-oriented and analytical",
                  "Like working with teams on meaningful projects"
                ],
                challenges: match.challenges || [
                  "May involve tight deadlines and pressure",
                  "Requires ongoing learning to stay current",
                  "Can require adaptation to changing demands"
                ],
                workplaces: match.workplaces || [
                  "Corporate environments",
                  "Small to medium businesses",
                  "Remote/work from home options",
                  "Industry-specific settings"
                ],
                colleagues: match.colleagues || [
                  "Project managers and leaders",
                  "Fellow specialists in your field",
                  "Cross-functional team members",
                  "Clients and stakeholders"
                ],
                educationPaths: match.educationPaths || [
                  "Bachelor's degree in related field",
                  "Associate degree + industry certification",
                  "Technical training + experience",
                  "Self-taught + portfolio (for some positions)"
                ],
                certifications: match.certifications || [
                  "Industry-standard certifications",
                  "Specialized technical credentials",
                  "Professional licenses or designations",
                  "Advanced training certifications"
                ],
                advancementPaths: match.advancementPaths || [
                  "Entry Level: Junior position with basic responsibilities",
                  "Mid Level: Increased responsibilities and specialized skills",
                  "Senior Level: Leadership and mentoring responsibilities",
                  "Management: Strategy development and team oversight"
                ]
              })) as CareerMatch[];
              
              setCareers(topMatches);
              
              // Save the generated matches
              localStorage.setItem('savedResults', JSON.stringify(topMatches));
              return;
            }
          }
        }
        
        // If all else fails, use our default mock data
        const mockCareerMatches: CareerMatch[] = [
          {
            id: "software_developer",
            title: "Software Developer",
            match: 95,
            description: "Create applications and systems that power our digital world. Software developers build, test, and maintain software for various platforms.",
            skills: ["Problem Solving", "Coding", "Critical Thinking", "Collaboration", "Adaptability"],
            education: "Bachelor's in Computer Science or equivalent experience",
            salary: "$110,140",
            outlook: "+22% (2020-2030)",
            category: "Technology",
            workSchedule: "Typically 40 hours/week, flexible in many companies",
            youMightLike: [
              "Enjoy solving complex problems with code",
              "Like building things that people use",
              "Want to work in a rapidly evolving field"
            ],
            challenges: [
              "Keeping up with rapidly changing technologies",
              "Managing complex projects and deadlines",
              "Debugging and troubleshooting issues"
            ],
            workplaces: [
              "Tech companies and startups",
              "Enterprise corporations",
              "Government agencies",
              "Remote work opportunities"
            ],
            colleagues: [
              "Other developers and engineers",
              "Product managers and designers",
              "Quality assurance specialists",
              "Project managers"
            ],
            educationPaths: [
              "Computer Science degree (Bachelor's or Master's)",
              "Coding bootcamp + self-study",
              "Self-taught + portfolio of projects",
              "Associate's degree + certifications"
            ],
            certifications: [
              "AWS Certified Developer",
              "Microsoft Certified: Azure Developer",
              "Oracle Certified Professional: Java Developer",
              "Language-specific certifications (e.g., Python, JavaScript)"
            ],
            advancementPaths: [
              "Junior Developer: Entry-level coding and learning",
              "Mid-level Developer: Complex features and systems",
              "Senior Developer: Architecture and mentoring",
              "Lead Developer/Architect: System design and team leadership"
            ]
          },
          {
            id: "ux_ui_designer",
            title: "UX/UI Designer",
            match: 92,
            description: "Create intuitive and engaging user experiences for digital products. UX/UI designers focus on how users interact with applications and websites.",
            skills: ["Creativity", "User Empathy", "Visual Design", "Wireframing", "User Research"],
            education: "Bachelor's in Design, HCI, or equivalent experience",
            salary: "$85,650",
            outlook: "+13% (2020-2030)",
            category: "Creative Technology",
            workSchedule: "Typically 40 hours/week with project-based flexibility",
            youMightLike: [
              "Love creating visually appealing designs",
              "Enjoy understanding how people interact with technology",
              "Want to combine creativity with technical skills"
            ],
            challenges: [
              "Balancing aesthetics with functionality",
              "Advocating for user needs in business decisions",
              "Keeping up with design trends and tools"
            ],
            workplaces: [
              "Design agencies",
              "Tech companies",
              "In-house design teams",
              "Freelance opportunities"
            ],
            colleagues: [
              "Product managers",
              "Developers and engineers",
              "Content strategists",
              "Market researchers"
            ],
            educationPaths: [
              "Design, HCI, or related degree",
              "UX/UI bootcamp + portfolio",
              "Self-taught with strong portfolio",
              "Graphic design background + UX training"
            ],
            certifications: [
              "Nielsen Norman Group UX Certification",
              "Google UX Design Certificate",
              "Interaction Design Foundation Certification",
              "Adobe Certified Expert in design tools"
            ],
            advancementPaths: [
              "Junior Designer: Learning fundamentals and supporting projects",
              "Mid-level Designer: Leading design for features or products",
              "Senior Designer: Establishing design systems and mentoring",
              "Design Lead/Manager: Setting direction and managing teams"
            ]
          },
          {
            id: "content_creator",
            title: "Content Creator",
            match: 90,
            description: "Develop engaging digital content for social media, websites, and other platforms to build audience and drive engagement.",
            skills: ["Storytelling", "Visual Communication", "Audience Building", "Social Media", "Trend Analysis"],
            education: "Various paths available - degree in Communications/Media or practical experience",
            salary: "$63,400 (varies widely)",
            outlook: "+17% (2020-2030)",
            category: "Creative",
            workSchedule: "Flexible, often project-based or self-directed",
            youMightLike: [
              "Enjoy expressing yourself creatively",
              "Love building communities around shared interests",
              "Want independence and creative control"
            ],
            challenges: [
              "Building and maintaining a consistent audience",
              "Keeping up with platform changes and trends",
              "Managing irregular income streams"
            ],
            workplaces: [
              "Self-employed/entrepreneur",
              "Digital media companies",
              "Marketing agencies",
              "Brand partnerships"
            ],
            colleagues: [
              "Other creators and collaborators",
              "Editors and producers",
              "Brand managers and sponsors",
              "Community managers"
            ],
            educationPaths: [
              "Communications or media studies degree",
              "Self-taught with portfolio of content",
              "Marketing or journalism background",
              "Industry-specific knowledge + content skills"
            ],
            certifications: [
              "Platform-specific certifications (e.g., YouTube Creator Academy)",
              "Digital marketing certifications",
              "Media production training",
              "Specialized industry knowledge certifications"
            ],
            advancementPaths: [
              "Building initial audience and content library",
              "Monetization through ads, sponsorships, or subscriptions",
              "Expanding to multiple platforms and formats",
              "Launching products, services, or media companies"
            ]
          },
          {
            id: "data_scientist",
            title: "Data Scientist",
            match: 88,
            description: "Extract valuable insights from complex data to drive business decisions. Data scientists use statistical analysis and machine learning.",
            skills: ["Analytics", "Programming", "Statistics", "Problem Solving", "Communication"],
            education: "Bachelor's or Master's in Data Science or related field",
            salary: "$100,560",
            outlook: "+28% (2020-2030)",
            category: "Technology",
            workSchedule: "Typically 40 hours/week, project-dependent",
            youMightLike: [
              "Enjoy analyzing complex information",
              "Like using data to solve real-world problems",
              "Want to work with cutting-edge technologies"
            ],
            challenges: [
              "Working with messy, incomplete data",
              "Translating technical findings for non-technical stakeholders",
              "Balancing theoretical approaches with practical solutions"
            ],
            workplaces: [
              "Tech companies",
              "Financial institutions",
              "Healthcare organizations",
              "Research institutions"
            ],
            colleagues: [
              "Data engineers and analysts",
              "Machine learning engineers",
              "Business intelligence specialists",
              "Domain experts and stakeholders"
            ],
            educationPaths: [
              "Statistics, Computer Science, or Mathematics degree",
              "Specialized Data Science degree (Bachelor's or Master's)",
              "Engineering background + data science training",
              "Domain expertise + data analysis skills"
            ],
            certifications: [
              "IBM Data Science Professional Certificate",
              "Microsoft Certified: Azure Data Scientist Associate",
              "Google Data Analytics Professional Certificate",
              "Machine learning specializations"
            ],
            advancementPaths: [
              "Data Analyst: Basic data analysis and reporting",
              "Data Scientist: Complex modeling and insights",
              "Senior Data Scientist: Advanced models and team leadership",
              "Lead Data Scientist/Director: Strategy and organizational impact"
            ]
          },
          {
            id: "entrepreneur",
            title: "Entrepreneur/Business Owner",
            match: 85,
            description: "Build and run your own business ventures, identifying opportunities and bringing innovative ideas to market.",
            skills: ["Leadership", "Strategic Planning", "Financial Management", "Marketing", "Risk Assessment"],
            education: "Various paths available - degree in Business/relevant field or practical experience",
            salary: "Variable (median $59,800 with potential for significant growth)",
            outlook: "+8% (2020-2030)",
            category: "Business",
            workSchedule: "Highly variable, often exceeding 40 hours/week",
            youMightLike: [
              "Want to build something of your own",
              "Enjoy taking risks for potential rewards",
              "Like solving problems through innovation"
            ],
            challenges: [
              "Securing financing and managing cash flow",
              "Dealing with uncertainty and risk",
              "Balancing diverse responsibilities and workload"
            ],
            workplaces: [
              "Your own business location",
              "Coworking spaces",
              "Home office",
              "Incubators and accelerators"
            ],
            colleagues: [
              "Co-founders and business partners",
              "Employees and contractors",
              "Mentors and advisors",
              "Investors and stakeholders"
            ],
            educationPaths: [
              "Business or entrepreneurship degree",
              "Industry-specific expertise + business training",
              "Self-taught business skills + practical experience",
              "Apprenticeship or employment in similar businesses"
            ],
            certifications: [
              "Business management certifications",
              "Industry-specific licenses and credentials",
              "Financial management training",
              "Marketing and sales certifications"
            ],
            advancementPaths: [
              "Small business or startup founder",
              "Growing business and building team",
              "Expanding to multiple locations or products",
              "Serial entrepreneurship or investor role"
            ]
          }
        ];
        
        setCareers(mockCareerMatches);
        
        // Save these matches
        localStorage.setItem('savedResults', JSON.stringify(mockCareerMatches));
        console.log("Using default mock career matches");
      } catch (error) {
        console.error("Error loading career matches:", error);
        toast({
          title: "Error loading career matches",
          description: "Please take the career quiz again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCareerMatches();
    
    // Check if a career was previously selected
    const storedCareerId = localStorage.getItem('selectedCareerId');
    if (storedCareerId && !viewingDetail) {
      // If coming back from another page with a selected career, show the detail view
      const career = careers.find(c => c.id === storedCareerId);
      if (career) {
        setSelectedCareer(career);
        setViewingDetail(true);
        trackEvent('career_select', {
          careerId: career.id,
          careerTitle: career.title,
          matchPercentage: career.match,
          source: 'returning_to_detail_view'
        });
      }
    }
  }, [navigate, toast, trackEvent]);

  // If viewing career detail
  if (viewingDetail && selectedCareer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-duo-green-100 to-duo-blue-50 animate-gradient-x py-10 px-4">
        <div className="container mx-auto p-4 max-w-5xl">
          <CareerDetailView 
            career={selectedCareer} 
            onBack={() => {
              // Track return to dashboard
              trackEvent('button_click', {
                buttonId: 'return_to_dashboard',
                buttonText: 'Back to Dashboard',
                context: 'career_detail',
                careerId: selectedCareer.id,
                careerTitle: selectedCareer.title
              });
              
              setViewingDetail(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-duo-green-100 to-duo-blue-50 animate-gradient-x py-10 px-4">
      {/* Guest mode notification */}
      {isGuestMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md shadow-sm max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You're viewing your career results as a guest. Create an account to save your progress and access more features.
                </p>
              </div>
            </div>
            <Link href="/login" className="ml-6">
              <Button className="bg-duo-purple-600 hover:bg-duo-purple-700 text-white font-medium">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <div className="container mx-auto p-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 text-duo-green-600">
              Welcome to Your Career Dashboard
            </h1>
            <p className="text-xl text-duo-purple-600">
              Hey {userName}, here's your personalized career journey hub!
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-duo-green-200 transition-all hover:border-duo-green-400 hover:shadow-xl">
              <CardHeader className="bg-duo-green-50 rounded-t-xl">
                <CardTitle className="text-xl text-duo-green-700 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-duo-green-500" />
                  My Career Matches
                </CardTitle>
                <CardDescription>
                  Explore your top career matches based on your quiz results
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="py-6 flex justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-duo-green-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {careers.slice(0, 3).map((career, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2 bg-duo-green-50 rounded-lg cursor-pointer hover:bg-duo-green-100"
                          onClick={() => {
                            // If user selects Entrepreneur, record this preference
                            if (career.title === "Entrepreneur/Business Owner" || 
                                career.title.includes("Entrepreneur") || 
                                career.title.includes("Business Owner")) {
                              localStorage.setItem('hasEntrepreneurialExperience', 'true');
                            }
                            
                            setSelectedCareer(career);
                            setViewingDetail(true);
                            
                            trackEvent('career_select', {
                              careerId: career.id,
                              careerTitle: career.title,
                              matchPercentage: career.match,
                              source: 'dashboard_quick_card'
                            });
                          }}
                        >
                          <span className="font-medium text-duo-green-700">{career.title}</span>
                          <span className="bg-duo-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {career.match}%
                          </span>
                        </div>
                      ))}
                      {careers.length > 3 && (
                        <div className="text-center text-sm text-duo-green-600">
                          + {careers.length - 3} more matches
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/results" className="w-full" onClick={() => {
                  trackEvent('button_click', {
                    buttonId: 'view_all_matches',
                    buttonText: 'View All Matches',
                    context: 'dashboard_card',
                    source: 'top_matches_card'
                  });
                }}>
                  <Button className="w-full bg-duo-green-500 hover:bg-duo-green-600 text-white">
                    View All Matches
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-duo-purple-200 transition-all hover:border-duo-purple-400 hover:shadow-xl">
              <CardHeader className="bg-duo-purple-50 rounded-t-xl">
                <CardTitle className="text-xl text-duo-purple-700 flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 text-duo-purple-500" />
                  Take Quiz Again
                </CardTitle>
                <CardDescription>
                  Retake the career quiz to refine your results
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="p-4 bg-duo-purple-50 rounded-xl">
                  <p className="text-duo-purple-700 text-sm mb-2">
                    Why retake the quiz?
                  </p>
                  <ul className="text-xs space-y-1">
                    <li className="flex items-start">
                      <span className="text-duo-purple-500 mr-1">•</span>
                      Refine your results as your interests change
                    </li>
                    <li className="flex items-start">
                      <span className="text-duo-purple-500 mr-1">•</span>
                      Try different answers to see how they affect matches
                    </li>
                    <li className="flex items-start">
                      <span className="text-duo-purple-500 mr-1">•</span>
                      Discover careers you may not have considered before
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/career-quiz" className="w-full" onClick={() => {
                  trackEvent('button_click', {
                    buttonId: 'take_quiz_again',
                    buttonText: 'Start New Quiz',
                    context: 'dashboard_card',
                    source: 'retake_quiz_card'
                  });
                }}>
                  <Button className="w-full bg-duo-purple-500 hover:bg-duo-purple-600 text-white">
                    Start New Quiz
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-white rounded-2xl shadow-lg border-2 border-duo-blue-200 transition-all hover:border-duo-blue-400 hover:shadow-xl">
              <CardHeader className="bg-duo-blue-50 rounded-t-xl">
                <CardTitle className="text-xl text-duo-blue-700 flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-duo-blue-500" />
                  Voice Guide
                </CardTitle>
                <CardDescription>
                  Select or change your AI voice guidance assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="p-4 bg-duo-blue-50 rounded-xl">
                  <p className="text-duo-blue-700 text-sm mb-2">
                    How voice guidance helps:
                  </p>
                  <ul className="text-xs space-y-1">
                    <li className="flex items-start">
                      <span className="text-duo-blue-500 mr-1">•</span>
                      Get personalized advice about your career matches
                    </li>
                    <li className="flex items-start">
                      <span className="text-duo-blue-500 mr-1">•</span>
                      Hear detailed explanations of each career path
                    </li>
                    <li className="flex items-start">
                      <span className="text-duo-blue-500 mr-1">•</span>
                      Receive guidance tailored to your interests
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/voice-demo" className="w-full" onClick={() => {
                  trackEvent('button_click', {
                    buttonId: 'select_voice_guide',
                    buttonText: 'Select Voice Guide',
                    context: 'dashboard_card',
                    source: 'voice_guide_card'
                  });
                }}>
                  <Button className="w-full bg-duo-blue-500 hover:bg-duo-blue-600 text-white">
                    Select Voice Guide
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mb-10">
            <Card className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-duo-orange-200">
              <CardHeader className="bg-duo-orange-50">
                <CardTitle className="text-xl text-duo-orange-700 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-duo-orange-500" />
                  Career Matches Dashboard
                </CardTitle>
                <CardDescription>
                  Explore your top career matches and discover alternative options
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="py-20 flex justify-center">
                    <div className="animate-spin h-12 w-12 border-4 border-duo-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : careers.length > 0 ? (
                  <CareerDashboard 
                    currentMatches={careers} 
                    onSelectCareer={(careerId) => {
                      // Find and set the selected career
                      const career = careers.find(c => c.id === careerId);
                      if (career) {
                        setSelectedCareer(career);
                        setViewingDetail(true);
                        
                        // Save the selected career for reference in other views
                        localStorage.setItem('selectedCareerId', careerId);
                        
                        // Celebrate the selection
                        confetti({
                          particleCount: 80,
                          spread: 50,
                          origin: { y: 0.6 },
                          colors: ['#58a700', '#a560f0', '#1cb0f6', '#ff9600'] // Duolingo colors
                        });
                      }
                    }}
                    onRefreshMatches={() => {
                      trackEvent('button_click', {
                        buttonId: 'find_more_careers_dashboard',
                        buttonText: 'Find More Careers',
                        context: 'dashboard_main',
                        source: 'refresh_matches_button'
                      });
                      
                      toast({
                        title: "Looking for alternative careers",
                        description: "We're generating more career options based on your profile",
                        variant: "default",
                      });
                      
                      // Simulate finding alternatives (in a real app, this would call the backend)
                      setTimeout(() => {
                        // Navigate to results page which will show alternatives
                        localStorage.setItem('showAlternatives', 'true');
                        navigate('/results');
                      }, 1000);
                    }}
                  />
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-lg text-gray-600 mb-4">No career matches found. Please take the career quiz first.</p>
                    <Link href="/career-quiz" onClick={() => {
                      trackEvent('button_click', {
                        buttonId: 'take_career_quiz',
                        buttonText: 'Take Career Quiz',
                        context: 'dashboard_main',
                        source: 'no_matches_prompt'
                      });
                    }}>
                      <Button className="bg-duo-orange-500 hover:bg-duo-orange-600 text-white">
                        Take Career Quiz
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mb-10">
            <Link href="/" onClick={() => {
              trackEvent('button_click', {
                buttonId: 'back_to_home',
                buttonText: 'Back to Home',
                context: 'dashboard_footer'
              });
            }}>
              <Button variant="outline" className="border-2 border-duo-green-300 text-duo-green-700 hover:bg-duo-green-100 rounded-xl">
                <Home className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerDashboardPage;