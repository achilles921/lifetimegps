import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { VoiceAssistant } from "@/components/ui/VoiceAssistant";
import { 
  FiArrowRight, 
  FiDownload, 
  FiShare2, 
  FiCalendar, 
  FiDollarSign, 
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiActivity,
  FiAward,
  FiBook,
  FiUsers,
  FiAlertTriangle,
  FiFlag
} from "react-icons/fi";
import { avatars } from "@/data/avatarData";
import { isTradeCareer } from "@/data/careerData";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import milestonesImage from '@assets/GPS MILESTONES.png';

interface RoadmapData {
  careerPath: string;
  timeline: string;
  investment: string;
  difficulty: string;
  phases: {
    title: string;
    description: string;
    steps: {
      title: string;
      description: string;
      completed: boolean;
    }[];
  }[];
}

export function Roadmap() {
  const { avatarId, voiceType, setScreen } = useUser();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  
  // Get current avatar
  const currentAvatar = avatars.find(avatar => avatar.id === avatarId);
  
  // AI assistant message
  const aiMessage = `Your personalized career roadmap is ready! This outlines the key phases and steps you'll need to take to achieve your career goals faster. The timeline, investment, and difficulty estimates are personalized based on your quiz responses and selected career path.`;
  
  useEffect(() => {
    // Simulate API call to get roadmap data
    const fetchRoadmapData = async () => {
      setIsLoading(true);
      
      try {
        // This would normally be an API call to generate a roadmap
        // For demo purposes, we'll use a mock
        setTimeout(() => {
          setRoadmapData(mockRoadmap);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        setIsLoading(false);
      }
    };
    
    fetchRoadmapData();
  }, []);
  
  // Calculate overall progress
  const calculateProgress = () => {
    if (!roadmapData) return 0;
    
    let totalSteps = 0;
    let completedSteps = 0;
    
    roadmapData.phases.forEach(phase => {
      totalSteps += phase.steps.length;
      completedSteps += phase.steps.filter(step => step.completed).length;
    });
    
    return Math.round((completedSteps / totalSteps) * 100);
  };
  
  // toggle step completion
  const toggleStepCompletion = (phaseIndex: number, stepIndex: number) => {
    if (!roadmapData) return;
    
    const updatedRoadmap = {...roadmapData};
    const currentStatus = updatedRoadmap.phases[phaseIndex].steps[stepIndex].completed;
    
    updatedRoadmap.phases[phaseIndex].steps[stepIndex].completed = !currentStatus;
    setRoadmapData(updatedRoadmap);
  };
  
  // Mock roadmap data
  const mockRoadmap: RoadmapData = {
    careerPath: "Software Developer",
    timeline: "4-6 years",
    investment: "$5,000 - $15,000",
    difficulty: "Moderate",
    phases: [
      {
        title: "Foundation Building",
        description: "Building core skills and understanding of the field",
        steps: [
          {
            title: "Learn Programming Fundamentals",
            description: "Complete an introductory programming course in a language like Python or JavaScript",
            completed: true
          },
          {
            title: "Build First Projects",
            description: "Create 2-3 small portfolio projects to demonstrate basic skills",
            completed: false
          },
          {
            title: "Join Coding Communities",
            description: "Participate in online forums, Discord servers, or local meetups",
            completed: false
          },
          {
            title: "Complete CS Fundamentals Course",
            description: "Learn basics of algorithms, data structures, and computer science principles",
            completed: false
          }
        ]
      },
      {
        title: "Skill Development",
        description: "Deepening knowledge and specializing in specific areas",
        steps: [
          {
            title: "Choose Specialization Path",
            description: "Decide on front-end, back-end, mobile, or full-stack development",
            completed: false
          },
          {
            title: "Advanced Technical Courses",
            description: "Take specialized courses in your chosen path through platforms like Udemy or Coursera",
            completed: false
          },
          {
            title: "Collaborative Project",
            description: "Work with others on a team project using version control (GitHub)",
            completed: false
          },
          {
            title: "Build Complex Application",
            description: "Create a substantial project that demonstrates your technical abilities",
            completed: false
          }
        ]
      },
      {
        title: "Professional Experience",
        description: "Gaining real-world experience and professional credentials",
        steps: [
          {
            title: "Internship or Volunteer Work",
            description: "Secure an internship or volunteer to work on real projects",
            completed: false
          },
          {
            title: "Build Professional Network",
            description: "Connect with industry professionals on LinkedIn and at events",
            completed: false
          },
          {
            title: "Technical Certifications",
            description: "Obtain relevant certifications in your specialization",
            completed: false
          },
          {
            title: "Create Professional Portfolio",
            description: "Develop a polished portfolio website showcasing your best work",
            completed: false
          }
        ]
      },
      {
        title: "Career Launch",
        description: "Transitioning into a full professional role",
        steps: [
          {
            title: "Job Application Strategy",
            description: "Create targeted resumes and prepare for technical interviews",
            completed: false
          },
          {
            title: "Join Industry Organizations",
            description: "Become member of professional software development associations",
            completed: false
          },
          {
            title: "Secure Entry-Level Position",
            description: "Land your first full-time role in software development",
            completed: false
          },
          {
            title: "Ongoing Learning Plan",
            description: "Establish a system for continuous education and skill development",
            completed: false
          }
        ]
      }
    ]
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-primary">Career Roadmap</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center">
              <FiDownload className="mr-1 h-4 w-4" />
              Save PDF
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <FiShare2 className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6 animate-fadeIn">
          {/* Voice AI Assistant */}
          {currentAvatar && (
            <VoiceAssistant 
              message={aiMessage}
              avatarSrc={currentAvatar.src}
              autoPlay={voiceType !== 'none'}
              name={currentAvatar.gender === 'female' ? 'Sophia' : 'Alex'}
            />
          )}
          
          {isLoading ? (
            /* Loading state */
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Generating Your Roadmap</h2>
              <p className="text-gray-600">This personalized roadmap is being created based on your profile and career choice...</p>
            </div>
          ) : roadmapData ? (
            <>
              {/* Roadmap overview */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      Career Path: {roadmapData.careerPath}
                      <div className="ml-3 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium">
                        Perfect Match
                      </div>
                    </h2>
                    <p className="text-gray-600 mt-1">Your personalized roadmap to success</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center bg-indigo-50 rounded-full py-1 px-3">
                    <div className="mr-2 h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-indigo-800">
                      {calculateProgress()}% Complete
                    </span>
                  </div>
                </div>
                
                {/* Progress visualization */}
                <div className="w-full h-2.5 bg-gray-200 rounded-full mb-6">
                  <div 
                    className="h-2.5 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                
                {/* Key information cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FiClock className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
                        <p className="text-lg font-semibold text-blue-700">{roadmapData.timeline}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <FiDollarSign className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Investment</h3>
                        <p className="text-lg font-semibold text-green-700">{roadmapData.investment}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <FiBarChart2 className="text-amber-600 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Difficulty</h3>
                        <p className="text-lg font-semibold text-amber-700">{roadmapData.difficulty}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Journey visualization */}
                <div className="relative mb-10">
                  <h3 className="text-lg font-semibold mb-3">Your Career Journey</h3>
                  
                  <div className="h-32 bg-gradient-to-r from-muted/50 to-muted flex items-center rounded-lg overflow-hidden relative">
                    {/* Journey track with lane markers */}
                    <div className="absolute inset-0 flex px-4">
                      <div className="w-full h-full border-t-2 border-b-2 border-dashed border-muted-foreground/20"></div>
                    </div>
                    
                    {/* Start marker */}
                    <div className="absolute left-0 -top-2 flex flex-col items-center z-10">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FiFlag className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-xs font-medium mt-1">START</span>
                    </div>
                    
                    {/* Finish marker */}
                    <div className="absolute right-0 -top-2 flex flex-col items-center z-10">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiAward className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium mt-1">CAREER GOAL</span>
                    </div>
                    
                    {/* Phase milestones */}
                    <div className="flex justify-between w-full px-16 relative">
                      {roadmapData.phases.map((phase, index) => {
                        // Calculate phase completion percentage
                        const steps = phase.steps.length;
                        const completedSteps = phase.steps.filter(step => step.completed).length;
                        const phaseProgress = steps > 0 ? (completedSteps / steps) * 100 : 0;
                        const isCurrent = index === currentPhase;
                        const isCompleted = phaseProgress === 100;
                        
                        // Get appropriate colors based on phase index
                        const colors = [
                          'from-blue-500 to-cyan-400',
                          'from-purple-500 to-indigo-400',
                          'from-green-500 to-emerald-400',
                          'from-amber-500 to-yellow-400'
                        ];
                        const color = colors[index % colors.length];
                        
                        return (
                          <div 
                            key={index}
                            className={`flex flex-col items-center cursor-pointer transition-all duration-300
                              ${isCurrent ? 'scale-110 z-20' : ''}
                              ${isCompleted ? '' : 'opacity-80'}
                            `}
                            onClick={() => setCurrentPhase(index)}
                          >
                            <div className={`
                              h-12 w-12 rounded-full flex items-center justify-center mb-1 shadow-md
                              ${isCompleted 
                                ? `bg-gradient-to-br ${color} text-white` 
                                : isCurrent 
                                  ? `bg-white border-2 border-dashed ${phaseProgress > 0 ? 'border-primary' : 'border-gray-300'}`
                                  : 'bg-muted text-muted-foreground'
                              }
                              ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                            `}>
                              {isCompleted ? (
                                <FiCheckCircle className="h-6 w-6" />
                              ) : (
                                <div className="text-lg font-bold">{index + 1}</div>
                              )}
                            </div>
                            <span className={`
                              text-xs font-medium whitespace-nowrap max-w-[80px] text-center leading-tight
                              ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                              ${isCurrent ? 'text-primary font-semibold' : ''}
                            `}>
                              {phase.title}
                            </span>
                            {phaseProgress > 0 && phaseProgress < 100 && (
                              <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${color}`}
                                  style={{ width: `${phaseProgress}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Progress line connecting milestones */}
                    <div className="absolute top-1/2 left-10 right-10 h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0">
                      {roadmapData.phases.map((phase, index) => {
                        // Calculate segment width
                        const segmentWidth = 100 / (roadmapData.phases.length - 1);
                        const startPos = index * segmentWidth;
                        
                        // Only draw line segments up to current phase
                        if (index < currentPhase) {
                          return (
                            <div 
                              key={index}
                              className="absolute h-1 bg-primary rounded-full transition-all duration-500"
                              style={{ 
                                left: `${startPos}%`, 
                                width: `${segmentWidth}%` 
                              }}
                            ></div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phase details */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
                  <h2 className="font-bold text-lg">{roadmapData?.phases[currentPhase]?.title || 'Phase Title'}</h2>
                  <p className="text-white text-opacity-80 text-sm">
                    {roadmapData?.phases[currentPhase]?.description || 'Phase description'}
                  </p>
                </div>
                
                <div className="p-5">
                  <div className="space-y-4">
                    {roadmapData?.phases[currentPhase]?.steps?.map((step, index) => (
                      <div 
                        key={index}
                        className={`border rounded-lg p-4 transition-all ${
                          step.completed 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 hover:border-primary hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start">
                          <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3 cursor-pointer ${
                              step.completed 
                                ? 'bg-green-100 text-green-600' 
                                : 'border border-gray-300 text-gray-400 hover:border-primary hover:text-primary'
                            }`}
                            onClick={() => toggleStepCompletion(currentPhase, index)}
                          >
                            {step.completed && <FiCheckCircle className="w-5 h-5" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-800'}`}>
                                {step.title}
                              </h3>
                              <div className="ml-4 flex-shrink-0 inline-flex gap-2">
                                {/* Resource icons/links could go here */}
                                {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <FiLink className="h-4 w-4 text-gray-400" />
                                </Button> */}
                              </div>
                            </div>
                            <p className={`text-sm mt-1 ${step.completed ? 'text-green-700' : 'text-gray-600'}`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
                      disabled={currentPhase === 0}
                      className={currentPhase === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      Previous Phase
                    </Button>
                    <Button
                      onClick={() => setCurrentPhase(Math.min((roadmapData?.phases?.length || 1) - 1, currentPhase + 1))}
                      disabled={!roadmapData?.phases || currentPhase === (roadmapData?.phases?.length || 1) - 1}
                      className={`bg-gradient-to-r from-primary to-secondary text-white ${
                        !roadmapData?.phases || currentPhase === (roadmapData?.phases?.length || 1) - 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Next Phase
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Trade Career Section - conditionally displayed for trade-related careers */}
              {roadmapData && isTradeCareer(roadmapData.careerPath) && (
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 -mb-8 -ml-8 bg-white/5 rounded-full"></div>
                    <div className="relative z-10">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2">
                              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                            </svg>
                            Apprenticeship Opportunity
                          </h2>
                          <p className="text-white/90 mb-6">
                            Your career path is in the trades, where apprenticeships offer <strong>paid training</strong> and <strong>faster career entry</strong> without college debt. Earn while you learn valuable skills directly from experienced professionals.
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
                              Paid Training
                            </div>
                            <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
                              Hands-On Experience
                            </div>
                            <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
                              Earn While Learning
                            </div>
                            <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
                              Industry Certification
                            </div>
                          </div>
                          
                          <Button 
                            className="bg-white text-blue-600 hover:bg-blue-50"
                            onClick={() => setScreen("apprenticeships")}
                          >
                            Explore Apprenticeships
                            <FiArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                        <div className="hidden md:block ml-6">
                          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                            <path d="m12 6 3 3-3 3"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Resources section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <FiBook className="mr-2 text-primary" />
                  Recommended Resources
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmapData && isTradeCareer(roadmapData.careerPath) ? (
                    <>
                      <div className="border rounded-lg p-4 hover:shadow-sm transition-all">
                        <h3 className="font-medium text-primary">Training Programs</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Hands-on skill development opportunities
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-gray-700">Local Trade Schools & Community Colleges</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-gray-700">Online Technical Certification Courses</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-gray-700">Hands-On Workshops & Boot Camps</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-sm transition-all">
                        <h3 className="font-medium text-primary">Apprenticeship Programs</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Earn while you learn opportunities
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="text-gray-700">Union Apprenticeship Programs</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="text-gray-700">Non-Union Contractor Training</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="text-gray-700">Government-Sponsored Programs</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-sm transition-all">
                        <h3 className="font-medium text-primary">Industry Certifications</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Credentials for career advancement
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-700">Trade-Specific Licensing Requirements</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-700">Safety Certifications (OSHA, etc.)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-700">Specialized Equipment Certifications</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-sm transition-all">
                        <h3 className="font-medium text-primary">Industry Organizations</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Connections to trade communities
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-gray-700">Trade Associations & Unions</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-gray-700">Local Chapters of National Organizations</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-gray-700">Trade Shows & Industry Events</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border rounded-lg p-4 hover:shadow-sm transition-all">
                        <h3 className="font-medium text-primary">Online Courses</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Structured learning from top platforms
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-gray-700">Coursera - Computer Science Fundamentals</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-gray-700">Udemy - Full Stack Web Development</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-gray-700">edX - Programming Fundamentals</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-sm transition-all">
                        <h3 className="font-medium text-primary">Communities</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Connect with peers and mentors
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="text-gray-700">GitHub - Open source project collaboration</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="text-gray-700">Stack Overflow - Programming community</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="text-gray-700">Dev.to - Developer community forum</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-sm transition-all">
                        <h3 className="font-medium text-primary">Certifications</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Industry-recognized credentials
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-700">Microsoft Certified: Azure Developer</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-700">AWS Certified Developer</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-700">Google Associate Android Developer</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-sm transition-all">
                        <h3 className="font-medium text-primary">Mentorship</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Guidance from industry professionals
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-gray-700">MentorCruise - Paid mentorship platform</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-gray-700">ADPList - Free mentorship sessions</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-gray-700">Coding Bootcamp mentorship programs</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Motivational call to action */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-6 text-white">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <FiAward className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold mb-2">Your Journey Begins Today</h2>
                    <p className="text-white/80 mb-4">
                      Every step on your roadmap brings you one step closer to your dream career. 
                      Start with small, consistent actions - they add up to remarkable results!
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        className="bg-white text-indigo-700 hover:bg-indigo-50"
                        onClick={() => {
                          // Focus on getting started with first uncompleted step
                          const firstIncompletePhase = roadmapData.phases.findIndex(
                            phase => phase.steps.some(step => !step.completed)
                          );
                          
                          if (firstIncompletePhase !== -1) {
                            setCurrentPhase(firstIncompletePhase);
                          }
                        }}
                      >
                        Focus on Next Steps
                      </Button>
                      
                      {roadmapData && isTradeCareer(roadmapData.careerPath) && (
                        <Button 
                          variant="outline" 
                          className="border-white text-white hover:bg-white/10"
                          onClick={() => setScreen("apprenticeships")}
                        >
                          Find Apprenticeships
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Error state */
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Unable to Load Roadmap</h2>
              <p className="text-gray-600 mb-4">
                There was a problem generating your career roadmap. Please try again.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-primary text-white"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        active="roadmap"
        onNavigate={(screen) => setScreen(screen)}
      />
    </div>
  );
}