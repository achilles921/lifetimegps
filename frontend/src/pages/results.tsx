import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Trophy,
  Award,
  BarChart3,
  Star,
  Sparkles,
  Share2,
  X,
  CheckCircle2,
  BookOpen,
  Wrench,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import VoiceGuidance from "@/components/VoiceGuidance";
import CareerDashboard from "@/components/CareerDashboard";

// Dialog components removed as education details are now shown directly on the page

import { careers } from "@/data/careerData";
import { processQuizResponses, generateCareerMatches } from "@/utils/quizLogic";
import { interestOptions } from "@/data/quizData";

// Process all quiz responses from local storage
// COMPLETELY REWRITTEN getAllResponses function for guaranteed user-specific results
const getAllResponses = () => {
  const responses: any = {};

  // IMPORTANT FIX: For dlennox@webstars.org, always return his own unique career preferences
  const userEmail = localStorage.getItem("userEmail");

  // Always use the most recent quiz session ID to ensure we're getting the latest results
  // This ensures retake quiz results are based on new answers, not previous sessions
  let currentSessionId =
    localStorage.getItem("currentQuizSessionId") || "default";
 //  console.log("Using current quiz session ID:", currentSessionId);

  // Get sector 1-4 answers (traditional format)
  for (let i = 1; i <= 4; i++) {
    const sectorKey = `${currentSessionId}_quickQuizAnswers_sector_${i}`;
    const sectorData = localStorage.getItem(sectorKey);
    if (sectorData) {
      try {
        const parsedData = JSON.parse(sectorData);
       //  console.log(
        //   `Loaded sector ${i} data from session ${currentSessionId}:`,
        //   parsedData,
        // );
        responses[`sector${i}`] = parsedData;
      } catch (e) {
        console.error(`Error parsing sector ${i} data:`, e);
      }
    } else {
     //  console.log(
      //   `No data found for sector ${i} in session ${currentSessionId}`,
      // );
    }
  }

  // Get sector 5 (interests) in required format for the algorithm
  const sector5Key = `${currentSessionId}_quickQuizAnswers_sector_5`;
  const sector5Data = localStorage.getItem(sector5Key);
  if (sector5Data) {
    try {
      const sector5Answers = JSON.parse(sector5Data);
     //  console.log(
      //   `Loaded sector 5 (interests) data from session ${currentSessionId}:`,
      //   sector5Answers,
      // );

      // Handle different possible formats of sector5 data
      let interestIds: string[] = [];

      // Get the first property value from the answers object (which should be the interests)
      const interestValue = Object.values(sector5Answers)[0];

      // If it's a string (comma-separated IDs), split it
      if (typeof interestValue === "string") {
        interestIds = interestValue.split(",");
      }
      // If it's already an array, use it directly
      else if (Array.isArray(interestValue)) {
        interestIds = interestValue;
      }

      if (interestIds.length > 0) {
        // Convert to array of interest objects with percentage
        responses.sector5 = interestIds.map((id) => {
          // Convert string ID to number for comparison
          const numId = typeof id === "string" ? parseInt(id) : id;
          const interestName =
            interestOptions.find((opt) => opt.id === numId)?.name || "Unknown";
          return {
            interest: interestName,
            percentage: 100, // Since all selected interests have equal weight in this implementation
          };
        });

       //  console.log("PROCESSED INTERESTS:", responses.sector5);
      }
    } catch (e) {
      console.error(`Error parsing sector 5 data:`, e);
    }
  } else {
   //  console.log(`No interest data found in session ${currentSessionId}`);
  }

 //  console.log("ALL QUIZ RESPONSES:", JSON.stringify(responses, null, 2));
  return responses;
};

// IMPROVED: Process quiz responses and generate career matches with special handling
const processAndGenerateMatches = () => {
  const userEmail = localStorage.getItem("userEmail");

  // NORMAL PROCESSING FOR OTHER USERS
  const responses = getAllResponses();
  if (Object.keys(responses).length === 0) {
    return [];
  }

  // Process the responses as they are without any modifications

  const results = processQuizResponses(responses);
  const matches = generateCareerMatches(results);

  // Store all career matches in localStorage for later access (up to 15 matches)
  const allMatches = matches.slice(0, 15).map((match) => ({
    id: match.id,
    title: match.title,
    match: Math.round(match.match),
    description: match.description,
    skills: match.skills,
    education: match.education || "Educational requirements vary",
    salary: match.salary,
    outlook: match.growth || "Average",
    category: match.category || "Various",
  }));

  // Career matches are selected purely based on quiz responses and matching algorithm
  // No special handling or boosting for any specific career types

  // Save both top 5 and additional matches to localStorage
  localStorage.setItem("allCareerMatches", JSON.stringify(allMatches));

  // Return only the top 5 for the results page
  return allMatches.slice(0, 5);
};

// Generate career matches from quiz data
const careerMatches =
  processAndGenerateMatches().length > 0
    ? processAndGenerateMatches()
    : // Fallback sample matches if no quiz data found
      [
        {
          id: "software_developer",
          title: "Software Developer",
          match: 95,
          description:
            "Create applications and systems that power our digital world. Software developers build, test, and maintain software for various platforms.",
          skills: [
            "Problem Solving",
            "Coding",
            "Critical Thinking",
            "Collaboration",
            "Adaptability",
          ],
          education: "Bachelor's in Computer Science or equivalent experience",
          salary: "$110,140",
          outlook: "+22% (2020-2030)",
          category: "Technology",
        },
        {
          id: "ux_ui_designer",
          title: "UX/UI Designer",
          match: 92,
          description:
            "Create intuitive and engaging user experiences for digital products. UX/UI designers focus on how users interact with applications and websites.",
          skills: [
            "Creativity",
            "User Empathy",
            "Visual Design",
            "Wireframing",
            "User Research",
          ],
          education: "Bachelor's in Design, HCI, or equivalent experience",
          salary: "$85,650",
          outlook: "+13% (2020-2030)",
          category: "Creative Technology",
        },
        {
          id: "data_scientist",
          title: "Data Scientist",
          match: 88,
          description:
            "Extract valuable insights from complex data to drive business decisions. Data scientists use statistical analysis and machine learning.",
          skills: [
            "Analytics",
            "Programming",
            "Statistics",
            "Problem Solving",
            "Communication",
          ],
          education: "Bachelor's or Master's in Data Science or related field",
          salary: "$100,560",
          outlook: "+28% (2020-2030)",
          category: "Technology",
        },
        {
          id: "entrepreneur",
          title: "Entrepreneur/Business Owner",
          match: 85,
          description:
            "Build and run your own business ventures, identifying opportunities and bringing innovative ideas to market.",
          skills: [
            "Leadership",
            "Strategic Planning",
            "Financial Management",
            "Marketing",
            "Risk Assessment",
          ],
          education:
            "Various paths available - degree in Business/relevant field or practical experience",
          salary:
            "Variable (median $59,800 with potential for significant growth)",
          outlook: "+8% (2020-2030)",
          category: "Business",
        },
        {
          id: "marketing_manager",
          title: "Marketing Manager",
          match: 82,
          description:
            "Plan and execute marketing strategies to promote products, services, or brands and connect with target audiences.",
          skills: [
            "Strategic Thinking",
            "Communication",
            "Creativity",
            "Analytics",
            "Project Management",
          ],
          education: "Bachelor's in Marketing, Business, or related field",
          salary: "$135,030",
          outlook: "+10% (2020-2030)",
          category: "Business",
        },
      ];

// Helper function to get interest name from ID
function getInterestName(interestId: string): string {
  // First try to parse the ID as a number if it's a string
  const id = typeof interestId === "string" ? parseInt(interestId) : interestId;

  // Look up the interest in the interestOptions array from quizData
  const interest = interestOptions.find((opt) => opt.id === id);

  // Return the name if found, or fall back to a simpler map for legacy data
  if (interest) {
    return interest.name;
  }

  // Fallback map with all interest options for completeness
  // This ensures we always show accurate names regardless of data format
  const interestMap: Record<string, string> = {
    "1": "Emergency Services / First Responder",
    "2": "Military / Defense",
    "3": "Skilled Trades",
    "4": "Building / Construction",
    "5": "Vehicles / Aviation",
    "6": "Real Estate / Brokerage",
    "7": "Sports / Fitness",
    "8": "Arts / Performance",
    "9": "Animals / Nature",
    "10": "Health / Wellness",
    "11": "Gaming / Interactive Media",
    "12": "Teaching / Coaching",
    "13": "Software Development",
    "14": "Hardware Technology",
    "15": "Content Creation",
    "16": "Finance / Data",
    "17": "Writing / Communication",
    "18": "Architectural Design / City Planning",
    "19": "Engineering",
    "20": "Renewable Energy / Science",
    "21": "Information / Cyber Security",
    "22": "Attorney / Law",
  };

  return interestMap[interestId] || `Interest ${interestId}`;
}

const ResultsPage: React.FC = () => {
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState<boolean>(true);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  // Check if user is logged in or in guest mode
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in by looking for a user email in localStorage
    const userEmail = localStorage.getItem("userEmail");
    setIsLoggedIn(!!userEmail);

    // Check if user is in guest mode (completed quiz without login)
    const quizCompleted =
      localStorage.getItem("quizFullyCompleted") === "true" ||
      localStorage.getItem("quizCompleted") === "true";
    const isGuest = !userEmail && quizCompleted;
    setIsGuestMode(isGuest);
  }, []);

  // Trigger confetti effect when page loads
  useEffect(() => {
    if (showAnimation) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#58a700", "#a560f0", "#1cb0f6", "#ff9600"], // Duolingo colors
      });

      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  // Load quiz answers from localStorage
  useEffect(() => {
    try {
      // Get the current quiz session ID
      const currentSessionId =
        localStorage.getItem("currentQuizSessionId") || "default";
     //  console.log("Loading interests for session:", currentSessionId);

      // Retrieve sector 5 answers (interests)
      const sector5Data = localStorage.getItem(
        `${currentSessionId}_quickQuizAnswers_sector_5`,
      );
      if (sector5Data) {
        const sector5Answers = JSON.parse(sector5Data);
        // Extract interests from the comma-separated value
        const interestIds = Object.values(sector5Answers)[0] as string;
        if (interestIds) {
          setInterests(interestIds.split(","));
        }
      } else {
       //  console.log(
        //   "No interest data found in localStorage for current session",
        // );
      }
    } catch (error) {
      console.error("Error parsing quiz data:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-duo-green-100 to-duo-blue-50 animate-gradient-x py-10 px-4">
      {/* Guest mode notification */}
      {isGuestMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md shadow-sm max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You're viewing your career results as a guest. Create an
                  account to save your progress and access more features.
                </p>
              </div>
            </div>
            <Link href="/login" className="ml-6">
              <Button className="bg-duo-purple-600 hover:bg-duo-purple-700 text-white font-medium">
                Create Accountqq
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 max-w-5xl">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-duo-green-600 mb-2">
              🎉 Your Career Matches 🎉
            </h1>
            <p className="text-xl text-duo-purple-600 max-w-2xl">
              Based on your career race, here are the careers that match your
              unique skills and interests!
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Link href="/dashboard">
              <Button className="mt-4 md:mt-0 bg-duo-green-500 hover:bg-duo-green-600 text-white rounded-xl">
                <BarChart3 className="mr-2 h-4 w-4" /> Go to Dashboard
              </Button>
            </Link>
            <Link href="/career-quiz">
              <Button
                variant="outline"
                className="mt-4 md:mt-0 border-2 border-duo-purple-300 text-duo-purple-700 hover:bg-duo-purple-100 rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Career Race
              </Button>
            </Link>
          </div>
        </div>

        {/* AI Voice Guidance */}
        <div className="mb-6 bg-white p-6 rounded-2xl shadow-lg">
          <VoiceGuidance
            selectedCareer={
              selectedCareer
                ? careerMatches.find((c) => c.id === selectedCareer)?.title
                : null
            }
            interests={interests}
            getInterestName={getInterestName}
            onFeedbackSubmit={(feedback) => {
             //  console.log("User feedback:", feedback);
              toast({
                title: "Feedback Received",
                description:
                  "Thank you for sharing your thoughts about your career matches!",
                variant: "default",
              });
            }}
          />
        </div>

        {/* Guidance Banner for All Users */}
        <div className="mb-6 p-4 bg-duo-blue-100 border-2 border-duo-blue-300 rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-duo-blue-800 mb-1">
                Explore Your Career Matches
              </h3>
              <p className="text-duo-blue-700">
                Choose the career that appeals to you most to explore further.
                Your results are automatically saved to your profile.
              </p>
            </div>
            <Button
              className="bg-duo-blue-500 hover:bg-duo-blue-600 text-white rounded-xl px-6 py-2 text-lg whitespace-nowrap"
              onClick={() => {
                // Scroll to career matches section
                document
                  .getElementById("career-matches")
                  ?.scrollIntoView({ behavior: "smooth" });

                // Show toast with guidance
                toast({
                  title: "Career Matches Ready",
                  description:
                    "Click on any career card to see more details about that path.",
                  variant: "default",
                });
              }}
            >
              <Briefcase className="mr-2 h-5 w-5" /> View Careers
            </Button>
          </div>
        </div>

        {/* Career Results with both Classic and Dashboard Views */}
        <Tabs defaultValue="classic" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="classic" className="text-base">
              Classic View
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="text-base">
              Career Dashboard
            </TabsTrigger>
          </TabsList>

          {/* Classic View - Original UI */}
          <TabsContent value="classic">
            <div
              id="career-matches"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2 space-y-6">
                {careerMatches.map((career, index) => (
                  <div
                    key={career.id}
                    id={`career-${career.id}`}
                    className="animate-scaleIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card
                      className={`rounded-2xl hover:shadow-xl transition-all cursor-pointer border-2 ${
                        selectedCareer === career.id
                          ? "border-duo-green-500 bg-duo-green-50"
                          : "border-gray-200 hover:border-duo-green-300"
                      }`}
                      onClick={() => {
                       //  console.log("Career selected:", career.id);
                        setSelectedCareer(career.id);

                        // Trigger confetti for celebration when selecting career
                        confetti({
                          particleCount: 80,
                          spread: 50,
                          origin: { y: 0.6 },
                          colors: ["#58a700", "#a560f0", "#1cb0f6", "#ff9600"], // Duolingo colors
                        });

                        // Scroll to education section with a short delay to allow state update
                        setTimeout(() => {
                          document
                            .getElementById("education-section")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }, 300);
                      }}
                    >
                      <CardHeader className="pb-2 relative">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-2xl font-bold text-duo-purple-700">
                            {career.title}
                          </CardTitle>
                          <div className="bg-duo-green-500 text-white px-3 py-1 rounded-full font-bold">
                            {career.match}% Match
                          </div>
                        </div>
                        <CardDescription className="text-gray-700 text-base mt-2">
                          {career.description}
                        </CardDescription>
                        {selectedCareer === career.id && (
                          <div className="absolute -right-2 -top-2 bg-duo-orange-500 text-white p-2 rounded-full">
                            <Star className="h-4 w-4" />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-duo-blue-50 p-3 rounded-xl border border-duo-blue-200">
                            <div className="flex items-center gap-2 mb-1 text-duo-blue-700 font-medium">
                              <GraduationCap className="h-5 w-5" />
                              Education
                            </div>
                            <p className="text-duo-blue-800">
                              {career.education}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-duo-purple-50 p-3 rounded-xl border border-duo-purple-200">
                              <div className="flex items-center gap-2 text-duo-purple-700 font-medium">
                                <Briefcase className="h-5 w-5" />
                                Salary
                              </div>
                              <p className="text-duo-purple-800 font-bold">
                                {career.salary}
                              </p>
                            </div>

                            <div className="bg-duo-orange-50 p-3 rounded-xl border border-duo-orange-200">
                              <div className="flex items-center gap-2 text-duo-orange-700 font-medium">
                                <BarChart3 className="h-5 w-5" />
                                Outlook
                              </div>
                              <p className="text-duo-orange-800 font-bold">
                                {career.outlook}
                              </p>
                            </div>
                          </div>

                          <div>
                            <div className="mb-2 font-medium text-duo-green-700 flex items-center gap-2">
                              <Trophy className="h-5 w-5" />
                              Match Strength
                            </div>
                            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-duo-green-500 to-duo-blue-500 rounded-full animate-pulse-slow"
                                style={{ width: `${career.match}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="px-3 py-1 bg-duo-green-100 border border-duo-green-200 text-duo-green-700 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="md:col-span-1 space-y-6">
                <Card className="rounded-2xl border-2 border-duo-purple-200 shadow-lg overflow-hidden">
                  <CardHeader className="bg-duo-purple-100">
                    <CardTitle className="text-xl text-duo-purple-700 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-duo-purple-500" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <Link href="/mini-games" className="w-full">
                      <Button className="w-full bg-duo-green-500 hover:bg-duo-green-600 text-white rounded-xl font-bold">
                        <Trophy className="mr-2 h-5 w-5" /> Explore Career Paths
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-duo-blue-300 text-duo-blue-700 hover:bg-duo-blue-100 rounded-xl font-medium"
                      onClick={() => {
                        if (selectedCareer) {
                          // Find the selected career to get its education requirements
                          const career = careerMatches.find(
                            (c) => c.id === selectedCareer,
                          );

                          // Scroll to the education section
                          document
                            .getElementById("education-section")
                            ?.scrollIntoView({ behavior: "smooth" });

                          // Scroll to the selected career card and highlight it
                          const selectedCareerElement = document.getElementById(
                            `career-${selectedCareer}`,
                          );
                          if (selectedCareerElement) {
                            setTimeout(() => {
                              selectedCareerElement.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              selectedCareerElement.classList.add(
                                "highlight-pulse",
                              );

                              // Remove highlight class after animation
                              setTimeout(() => {
                                selectedCareerElement.classList.remove(
                                  "highlight-pulse",
                                );
                              }, 2000);
                            }, 1000);
                          }
                        } else {
                          // Ask to select a career first
                          toast({
                            title: "Select a Career First",
                            description:
                              "Please select a career from the list to view education requirements.",
                            variant: "default",
                          });
                        }
                      }}
                    >
                      <GraduationCap className="mr-2 h-5 w-5" /> Education
                      Requirements
                    </Button>

                    <Link href="/shadowing-opportunities" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-duo-orange-300 text-duo-orange-700 hover:bg-duo-orange-100 rounded-xl font-medium"
                      >
                        <Award className="mr-2 h-5 w-5" /> Virtual Shadowing
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-duo-purple-300 text-duo-purple-700 hover:bg-duo-purple-100 rounded-xl font-medium"
                      onClick={() => {
                        localStorage.setItem(
                          "savedResults",
                          JSON.stringify(careerMatches),
                        );
                        toast({
                          title: "Results Saved!",
                          description:
                            "Your career match results have been saved successfully.",
                          variant: "default",
                        });

                        // Celebration confetti
                        confetti({
                          particleCount: 100,
                          spread: 70,
                          origin: { y: 0.8 },
                          colors: ["#58a700", "#a560f0", "#1cb0f6", "#ff9600"], // Duolingo colors
                        });
                      }}
                    >
                      <Star className="mr-2 h-5 w-5" /> Save Results
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-2 border-duo-blue-200 shadow-lg overflow-hidden">
                  <CardHeader className="bg-duo-blue-100">
                    <CardTitle className="text-xl text-duo-blue-700 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-duo-blue-500" />
                      Your Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4 font-medium">
                      You selected these interest areas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {interests.length > 0 ? (
                        interests.map((interest, index) => (
                          <div
                            key={index}
                            className="px-3 py-1 bg-duo-green-100 border border-duo-green-200 text-duo-green-700 rounded-full text-sm font-bold animate-bounceIn"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {getInterestName(interest)}
                          </div>
                        ))
                      ) : (
                        <span className="text-sm italic text-gray-500">
                          No interests selected
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-2 border-duo-orange-200 shadow-lg overflow-hidden">
                  <CardHeader className="bg-duo-orange-100">
                    <CardTitle className="text-xl text-duo-orange-700 flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-duo-orange-500" />
                      Share Your Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-6">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-pink-300 text-pink-700 hover:bg-pink-50 rounded-xl font-medium"
                      onClick={() => {
                        // Generate share text based on top matches
                        const topCareer = careerMatches[0]
                          ? careerMatches[0].title
                          : "amazing careers";

                        // For Instagram, create a shareable message that can be copied
                        const shareText = `I just discovered that my top career match is ${topCareer} using Lifetime GPS! 🚀\n\nFind your perfect career match at ${window.location.origin} #LifetimeGPS #CareerDiscovery #FindYourPath`;

                        // Copy to clipboard
                        navigator.clipboard
                          .writeText(shareText)
                          .then(() => {
                            toast({
                              title: "Instagram Text Copied!",
                              description:
                                "We've copied your Instagram caption to clipboard! Open Instagram, create a story or post, and paste this text.",
                              variant: "default",
                            });
                          })
                          .catch((err) => {
                            toast({
                              title: "Clipboard Error",
                              description:
                                "Could not copy text to clipboard. Please try again.",
                              variant: "destructive",
                            });
                          });
                      }}
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-pink-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                      Instagram
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
                      onClick={() => {
                        // Generate share text based on top matches
                        const topCareer = careerMatches[0]
                          ? careerMatches[0].title
                          : "amazing careers";

                        // For TikTok, similar to Instagram, create a shareable message that can be copied
                        const shareText = `I just took the Lifetime GPS career race and discovered my top match is ${topCareer}! 🚀\n\nFind your perfect career match at ${window.location.origin}\n\n#LifetimeGPS #CareerTok #FindYourPath #CareerAdvice`;

                        // Copy to clipboard
                        navigator.clipboard
                          .writeText(shareText)
                          .then(() => {
                            toast({
                              title: "TikTok Caption Copied!",
                              description:
                                "We've copied your TikTok caption to clipboard! Open TikTok, create a video, and paste this text.",
                              variant: "default",
                            });
                          })
                          .catch((err) => {
                            toast({
                              title: "Clipboard Error",
                              description:
                                "Could not copy text to clipboard. Please try again.",
                              variant: "destructive",
                            });
                          });
                      }}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                      TikTok
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-red-300 text-red-700 hover:bg-red-50 rounded-xl font-medium"
                      onClick={() => {
                        // Generate share text based on top matches
                        const topCareer = careerMatches[0]
                          ? careerMatches[0].title
                          : "amazing careers";

                        // For YouTube video descriptions
                        const shareText = `I just took the Lifetime GPS career race and discovered my top match is ${topCareer}! 🚀\n\nFind your perfect career match at ${window.location.origin}\n\nLifetime GPS helps you discover careers that match your skills, interests, and personality through a fun and engaging race-themed assessment.\n\n#LifetimeGPS #CareerDiscovery #FindYourPath #CareerAdvice`;

                        // Copy to clipboard
                        navigator.clipboard
                          .writeText(shareText)
                          .then(() => {
                            toast({
                              title: "YouTube Description Copied!",
                              description:
                                "We've copied your YouTube video description to clipboard! Create a video about your experience and paste this text in the description.",
                              variant: "default",
                            });
                          })
                          .catch((err) => {
                            toast({
                              title: "Clipboard Error",
                              description:
                                "Could not copy text to clipboard. Please try again.",
                              variant: "destructive",
                            });
                          });
                      }}
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      YouTube
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-xl font-medium"
                      onClick={() => {
                        // Generate share text based on top matches
                        const topCareer = careerMatches[0]
                          ? careerMatches[0].title
                          : "amazing careers";
                        const secondCareer = careerMatches[1]
                          ? careerMatches[1].title
                          : "";

                        let shareText = `I discovered my top career match is ${topCareer}`;
                        if (secondCareer) {
                          shareText += ` followed by ${secondCareer}`;
                        }
                        shareText += ` using Lifetime GPS! Take the career race to find your perfect match:`;

                        // X (Twitter) sharing URL
                        const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`;

                        // Open share dialog in new window
                        window.open(xUrl, "_blank", "width=600,height=400");

                        toast({
                          title: "Sharing to X",
                          description:
                            "Thanks for sharing Lifetime GPS with your network!",
                          variant: "default",
                        });
                      }}
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-black"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      X
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl font-medium"
                      onClick={() => {
                        // Generate share text based on top matches
                        const topCareer = careerMatches[0]
                          ? careerMatches[0].title
                          : "amazing careers";

                        // LinkedIn sharing URL
                        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent("Lifetime GPS Career Results")}&summary=${encodeURIComponent(`I discovered my top career match is ${topCareer} using Lifetime GPS! Take the career race to find your perfect match.`)}`;

                        // Open share dialog in new window
                        window.open(
                          linkedInUrl,
                          "_blank",
                          "width=600,height=400",
                        );

                        toast({
                          title: "Sharing to LinkedIn",
                          description:
                            "Thanks for sharing Lifetime GPS with your professional network!",
                          variant: "default",
                        });
                      }}
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-blue-700"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl font-medium"
                      onClick={() => {
                        // Generate share text based on top matches
                        const topCareer = careerMatches[0]
                          ? careerMatches[0].title
                          : "amazing careers";
                        const secondCareer = careerMatches[1]
                          ? careerMatches[1].title
                          : "";

                        let shareText = `I discovered my top career match is ${topCareer}`;
                        if (secondCareer) {
                          shareText += ` followed by ${secondCareer}`;
                        }
                        shareText += ` using Lifetime GPS! Take the career race to find your perfect match: ${window.location.origin}`;

                        // Facebook sharing URL
                        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;

                        // Open share dialog in new window
                        window.open(
                          facebookUrl,
                          "_blank",
                          "width=600,height=400",
                        );

                        toast({
                          title: "Sharing to Facebook",
                          description:
                            "Thanks for sharing Lifetime GPS with your network!",
                          variant: "default",
                        });
                      }}
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
                      onClick={() => {
                        // Generate share text based on top matches
                        const topCareer = careerMatches[0]
                          ? careerMatches[0].title
                          : "amazing careers";
                        const secondCareer = careerMatches[1]
                          ? careerMatches[1].title
                          : "";

                        let subject =
                          "My Career Match Results from Lifetime GPS";

                        let body = `I just took the Lifetime GPS career assessment and discovered my top match is ${topCareer}`;
                        if (secondCareer) {
                          body += ` followed by ${secondCareer}`;
                        }
                        body += `!\n\nLifetime GPS helped me identify careers that match my unique skills, interests, and personality through a fun and engaging race-themed assessment.\n\nYou should try it too! Find your perfect career match at: ${window.location.origin}`;

                        // Email sharing URL (mailto protocol)
                        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                        // Open email client
                        window.location.href = mailtoUrl;

                        toast({
                          title: "Opening Email Client",
                          description:
                            "Your email app should open with your career results ready to share!",
                          variant: "default",
                        });
                      }}
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      Email
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Dashboard View - New Component for Career Exploration */}
          <TabsContent value="dashboard">
            <CareerDashboard
              currentMatches={careerMatches}
              onSelectCareer={(careerId) => setSelectedCareer(careerId)}
              onRefreshMatches={() => {
                toast({
                  title: "Looking for alternative careers",
                  description:
                    "We're generating more career options based on your profile",
                  variant: "default",
                });

                // Generate new career matches
                const responses = getAllResponses();
                if (Object.keys(responses).length > 0) {
                  const results = processQuizResponses(responses);

                  // Use slightly different weighting to get alternative matches
                  // This would normally be more sophisticated in a production app
                  const alternativeMatches = generateCareerMatches(results);

                  // Show new matches by redirecting to refresh page
                  const currentSessionId =
                    localStorage.getItem("currentQuizSessionId") || "default";
                  localStorage.setItem(
                    `${currentSessionId}_show_alternatives`,
                    "true",
                  );

                  // Refresh the page to show new matches (simple approach)
                  window.location.reload();
                }
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Educational Requirements Section (directly on page, not in a dialog) */}
        {selectedCareer && (
          <div id="education-section" className="mt-12 animate-fadeIn">
            <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-duo-blue-200">
              <h2 className="text-2xl font-bold text-duo-purple-700 flex items-center gap-2 mb-6">
                <GraduationCap className="h-6 w-6 text-duo-purple-600" />
                Education Requirements for{" "}
                {careerMatches.find((c) => c.id === selectedCareer)?.title ||
                  "Selected Career"}
              </h2>

              <div className="space-y-6">
                {/* Overview */}
                <div className="bg-duo-blue-50 p-5 rounded-xl border border-duo-blue-200">
                  <h3 className="font-bold text-duo-blue-700 flex items-center gap-2 mb-3 text-lg">
                    <BookOpen className="h-5 w-5" /> Overview
                  </h3>
                  <p className="text-duo-blue-800">
                    {careerMatches.find((c) => c.id === selectedCareer)
                      ?.education ||
                      "Education requirements vary based on employer and location"}
                  </p>
                </div>

                {/* College/University Path */}
                <div className="bg-duo-purple-50 p-5 rounded-xl border border-duo-purple-200">
                  <h3 className="font-bold text-duo-purple-700 flex items-center gap-2 mb-3 text-lg">
                    <GraduationCap className="h-5 w-5" /> College/University
                    Path
                  </h3>
                  <div className="space-y-3 text-duo-purple-800">
                    {selectedCareer === "urban_planner" && (
                      <>
                        <p>
                          <span className="font-semibold">
                            Bachelor's Degree:
                          </span>{" "}
                          Urban Planning, Geography, Architecture, or
                          Environmental Studies
                        </p>
                        <p>
                          <span className="font-semibold">
                            Master's Degree:
                          </span>{" "}
                          Urban Planning or Urban Design (highly recommended)
                        </p>
                        <p>
                          <span className="font-semibold">Estimated Cost:</span>{" "}
                          $24,000-$50,000 (Bachelor's), $30,000-$60,000
                          (Master's)
                        </p>
                        <p>
                          <span className="font-semibold">Time Required:</span>{" "}
                          6-7 years (4-year Bachelor's + 2-3 year Master's)
                        </p>
                      </>
                    )}

                    {selectedCareer === "machine_learning_engineer" && (
                      <>
                        <p>
                          <span className="font-semibold">
                            Bachelor's Degree:
                          </span>{" "}
                          Computer Science, Mathematics, or related field
                        </p>
                        <p>
                          <span className="font-semibold">Master's/PhD:</span>{" "}
                          Computer Science with focus on AI/ML (recommended)
                        </p>
                        <p>
                          <span className="font-semibold">Estimated Cost:</span>{" "}
                          $25,000-$60,000 (Bachelor's), $30,000-$70,000
                          (Master's)
                        </p>
                        <p>
                          <span className="font-semibold">Time Required:</span>{" "}
                          4-8 years (depending on degree level)
                        </p>
                      </>
                    )}

                    {selectedCareer === "ux_researcher" && (
                      <>
                        <p>
                          <span className="font-semibold">
                            Bachelor's Degree:
                          </span>{" "}
                          Psychology, Human-Computer Interaction, Design, or
                          related field
                        </p>
                        <p>
                          <span className="font-semibold">
                            Master's Degree:
                          </span>{" "}
                          HCI, UX Design, or Cognitive Psychology (beneficial)
                        </p>
                        <p>
                          <span className="font-semibold">Estimated Cost:</span>{" "}
                          $20,000-$50,000 (Bachelor's), $30,000-$60,000
                          (Master's)
                        </p>
                        <p>
                          <span className="font-semibold">Time Required:</span>{" "}
                          4-6 years (depending on degree level)
                        </p>
                      </>
                    )}

                    {selectedCareer === "marketing_manager" && (
                      <>
                        <p>
                          <span className="font-semibold">
                            Bachelor's Degree:
                          </span>{" "}
                          Marketing, Business, Communications, or related field
                        </p>
                        <p>
                          <span className="font-semibold">MBA:</span> With
                          Marketing concentration (beneficial for advancement)
                        </p>
                        <p>
                          <span className="font-semibold">Estimated Cost:</span>{" "}
                          $20,000-$45,000 (Bachelor's), $30,000-$80,000 (MBA)
                        </p>
                        <p>
                          <span className="font-semibold">Time Required:</span>{" "}
                          4-6 years (depending on degree level)
                        </p>
                      </>
                    )}

                    {selectedCareer === "registered_nurse" && (
                      <>
                        <p>
                          <span className="font-semibold">
                            Associate's Degree (ADN):
                          </span>{" "}
                          Nursing (minimum requirement)
                        </p>
                        <p>
                          <span className="font-semibold">
                            Bachelor's Degree (BSN):
                          </span>{" "}
                          Nursing (preferred by many employers)
                        </p>
                        <p>
                          <span className="font-semibold">Estimated Cost:</span>{" "}
                          $15,000-$25,000 (ADN), $30,000-$60,000 (BSN)
                        </p>
                        <p>
                          <span className="font-semibold">Time Required:</span>{" "}
                          2-4 years (depending on degree level)
                        </p>
                        <p>
                          <span className="font-semibold">Additional:</span>{" "}
                          Must pass NCLEX-RN exam and obtain state license
                        </p>
                      </>
                    )}

                    {![
                      "urban_planner",
                      "machine_learning_engineer",
                      "ux_researcher",
                      "marketing_manager",
                      "registered_nurse",
                    ].includes(selectedCareer) && (
                      <p>
                        College pathway details for this specific career are
                        currently being developed. Typically requires 2-4 year
                        degree with costs ranging from $20,000-$60,000 depending
                        on the institution and program.
                      </p>
                    )}
                  </div>
                </div>

                {/* Alternative Pathways */}
                <div className="bg-duo-orange-50 p-5 rounded-xl border border-duo-orange-200">
                  <h3 className="font-bold text-duo-orange-700 flex items-center gap-2 mb-3 text-lg">
                    <GraduationCap className="h-5 w-5" /> Alternative Pathways
                  </h3>
                  <div className="space-y-4 text-duo-orange-800">
                    {selectedCareer === "urban_planner" && (
                      <>
                        <div className="mb-4">
                          <p className="font-semibold mb-1">
                            Certificate Programs:
                          </p>
                          <p>
                            Urban Planning certificates from accredited
                            institutions
                          </p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $4,000-$12,000
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> 6-12
                            months
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Self-Study Path:</p>
                          <p>
                            Geographic Information Systems (GIS) certifications
                            + internships in planning departments
                          </p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $500-$3,000 for certifications
                          </p>
                          <p>
                            <span className="font-semibold">Note:</span> Will
                            likely still need some formal education for career
                            advancement
                          </p>
                        </div>
                      </>
                    )}

                    {selectedCareer === "machine_learning_engineer" && (
                      <>
                        <div className="mb-4">
                          <p className="font-semibold mb-1">Bootcamps:</p>
                          <p>
                            Data Science/Machine Learning bootcamps (intensive
                            programs)
                          </p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $10,000-$20,000
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> 3-6
                            months
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Self-Study Path:</p>
                          <p>
                            Online courses (Coursera, edX), specialized ML
                            certifications (AWS, Google), open-source
                            contributions
                          </p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $500-$5,000 for courses and certifications
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> 1-2
                            years of dedicated learning
                          </p>
                        </div>
                      </>
                    )}

                    {selectedCareer === "ux_researcher" && (
                      <>
                        <div className="mb-4">
                          <p className="font-semibold mb-1">Bootcamps:</p>
                          <p>
                            UX Research bootcamps and certification programs
                          </p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $8,000-$15,000
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> 3-6
                            months
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Self-Study Path:</p>
                          <p>
                            Online UX courses, research methods training,
                            psychology courses, building a portfolio of case
                            studies
                          </p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $1,000-$4,000 for courses and certifications
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> 1-2
                            years
                          </p>
                        </div>
                      </>
                    )}

                    {selectedCareer === "marketing_manager" && (
                      <>
                        <div className="mb-4">
                          <p className="font-semibold mb-1">Certifications:</p>
                          <p>
                            Digital Marketing certificates (Google, HubSpot,
                            Facebook), Project Management certificates
                          </p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $1,000-$5,000
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> 3-12
                            months
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Self-Study Path:</p>
                          <p>
                            Marketing courses, building campaigns, freelance
                            marketing work, creating a portfolio
                          </p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $500-$3,000
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> 1-3
                            years (including experience building)
                          </p>
                        </div>
                      </>
                    )}

                    {selectedCareer === "registered_nurse" && (
                      <>
                        <div className="mb-4">
                          <p className="font-semibold mb-1">
                            Diploma Programs:
                          </p>
                          <p>Hospital-based nursing programs</p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $10,000-$30,000
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> 2-3
                            years
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Bridge Programs:</p>
                          <p>
                            LPN to RN programs for those already working as
                            Licensed Practical Nurses
                          </p>
                          <p>
                            <span className="font-semibold">Cost:</span>{" "}
                            $10,000-$25,000
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> 1-2
                            years after LPN
                          </p>
                        </div>
                      </>
                    )}

                    {![
                      "urban_planner",
                      "machine_learning_engineer",
                      "ux_researcher",
                      "marketing_manager",
                      "registered_nurse",
                    ].includes(selectedCareer) && (
                      <p>
                        Alternative pathway details for this specific career are
                        currently being developed. Most careers offer
                        certificate programs, specialized bootcamps, or
                        self-study options that can range from $500-$15,000
                        depending on the field.
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    className="bg-duo-green-500 hover:bg-duo-green-600 text-white rounded-xl font-bold"
                    onClick={() => {
                      // Save educational path
                      localStorage.setItem(
                        "savedEducationPath",
                        selectedCareer,
                      );
                      toast({
                        title: "Educational Path Saved",
                        description:
                          "This educational path has been saved to your profile.",
                        variant: "default",
                      });

                      // Celebration confetti
                      confetti({
                        particleCount: 50,
                        spread: 50,
                        origin: { y: 0.7 },
                        colors: ["#58a700", "#a560f0", "#1cb0f6", "#ff9600"],
                      });
                    }}
                  >
                    <Star className="mr-2 h-5 w-5" /> Save Educational Path
                  </Button>

                  <Button
                    variant="outline"
                    className="border-2 border-duo-blue-300 text-duo-blue-700 hover:bg-duo-blue-100 rounded-xl font-medium"
                    onClick={() => {
                      // Scroll back to top of career matches
                      document
                        .getElementById("career-matches")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back to Career
                    Matches
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
