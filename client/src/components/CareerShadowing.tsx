import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { careers, type Career } from "@/data/careerData";
import { VoiceAssistant } from "@/components/ui/VoiceAssistant";
import { avatars } from "@/data/avatarData";
import { 
  FiVideo, 
  FiMapPin, 
  FiSearch, 
  FiLink2, 
  FiCalendar, 
  FiArrowRight,
  FiExternalLink
} from "react-icons/fi";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BottomNavigation } from "@/components/ui/BottomNavigation";

interface ShadowingOpportunity {
  id: string;
  title: string;
  organization: string;
  type: 'virtual' | 'in-person';
  location?: string;
  availability: string;
  description: string;
  requirements: string[];
  link: string;
  industry: string;
  imageUrl: string;
}

export function CareerShadowing() {
  const { avatarId, voiceType, careerMatches, setScreen } = useUser();
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<ShadowingOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<ShadowingOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationType, setLocationType] = useState<string>("all");
  const [industry, setIndustry] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Get current avatar
  const currentAvatar = avatars.find(avatar => avatar.id === avatarId);
  
  // Get matched careers
  const matchedCareers = careerMatches?.map(match => {
    const career = careers.find(c => c.title === match.title);
    return career || null;
  }).filter(Boolean) as Career[];
  
  // AI assistant message
  const aiMessage = "Virtual job shadowing gives you a real-world glimpse into your potential career. Watch professionals in action or find local shadowing opportunities to understand what the day-to-day work is really like. This experience is invaluable in confirming your career choice!";
  
  useEffect(() => {
    // Set default selected career to the first match
    if (matchedCareers && matchedCareers.length > 0 && !selectedCareer) {
      setSelectedCareer(matchedCareers[0].title);
    }
    
    // Simulate API call to fetch shadowing opportunities
    const fetchOpportunities = async () => {
      setIsLoading(true);
      
      try {
        // This would normally be an API call
        // Simulating network delay
        setTimeout(() => {
          setOpportunities(mockOpportunities);
          setFilteredOpportunities(mockOpportunities);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching shadowing opportunities:", error);
        setIsLoading(false);
      }
    };
    
    fetchOpportunities();
  }, [matchedCareers, selectedCareer]);
  
  // Filter opportunities based on search, location type, and industry
  useEffect(() => {
    let filtered = opportunities;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(query) || 
        opp.organization.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by location type
    if (locationType !== "all") {
      filtered = filtered.filter(opp => opp.type === locationType);
    }
    
    // Filter by industry
    if (industry !== "all") {
      filtered = filtered.filter(opp => opp.industry === industry);
    }
    
    // Filter by selected career
    if (selectedCareer) {
      const career = careers.find(c => c.title === selectedCareer);
      if (career) {
        // Match opportunities that include any of the career's skills
        filtered = filtered.filter(opp => {
          const relevantSkills = career.skills.some(skill => 
            opp.description.toLowerCase().includes(skill.toLowerCase()) ||
            opp.title.toLowerCase().includes(skill.toLowerCase())
          );
          
          return relevantSkills || opp.title.includes(career.title);
        });
      }
    }
    
    setFilteredOpportunities(filtered);
  }, [searchQuery, locationType, industry, opportunities, selectedCareer]);
  
  // Get unique industries for filter
  const uniqueIndustries = Array.from(
    new Set(opportunities.map(opp => opp.industry))
  );
  
  // Handle career selection change
  const handleCareerChange = (career: string) => {
    setSelectedCareer(career);
  };
  
  // Get current career
  const currentCareer = careers.find(c => c.title === selectedCareer);
  
  // Mock shadowing opportunities
  const mockOpportunities: ShadowingOpportunity[] = [
    {
      id: "1",
      title: "Software Developer Shadow Day",
      organization: "TechInnovate Inc.",
      type: "virtual",
      availability: "On-demand",
      description: "Experience a day in the life of a software developer. Watch real developers solve problems, attend meetings, and build features for a tech product.",
      requirements: ["Basic programming knowledge", "Reliable internet connection"],
      link: "https://techinnovate.example.com/shadow",
      industry: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "2",
      title: "Medical Assistant Shadowing",
      organization: "City Health Center",
      type: "in-person",
      location: "Chicago, IL",
      availability: "Weekly, Tuesday mornings",
      description: "Shadow medical assistants as they work with patients, manage records, and assist doctors in a busy health center.",
      requirements: ["16+ years old", "Signed confidentiality agreement", "Proof of immunizations"],
      link: "https://cityhealthcenter.example.com/shadows",
      industry: "Healthcare",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "3",
      title: "Marketing Team Virtual Shadow",
      organization: "Brand Builders Co.",
      type: "virtual",
      availability: "Monthly sessions",
      description: "Join our marketing team virtually to see how campaigns are created, social media is managed, and marketing analytics are used.",
      requirements: ["Interest in marketing", "Reliable internet connection"],
      link: "https://brandbuilders.example.com/shadow-program",
      industry: "Marketing",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "4",
      title: "Architect Shadowing Program",
      organization: "Urban Design Associates",
      type: "in-person",
      location: "Boston, MA",
      availability: "Summer program, June-August",
      description: "Shadow professional architects as they design buildings, meet with clients, and visit construction sites.",
      requirements: ["Architecture student or strong interest", "Portfolio review"],
      link: "https://urbandesign.example.com/shadow",
      industry: "Architecture & Design",
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "5",
      title: "Data Scientist Virtual Shadowing",
      organization: "DataSphere Analytics",
      type: "virtual",
      availability: "Bi-weekly sessions",
      description: "Learn how data scientists clean data, build models, and derive insights that drive business decisions.",
      requirements: ["Basic statistics knowledge", "Some programming experience"],
      link: "https://datasphere.example.com/shadow-a-data-scientist",
      industry: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "6",
      title: "Graphic Designer Shadowing",
      organization: "Creative Minds Studio",
      type: "in-person",
      location: "Austin, TX",
      availability: "Friday afternoons",
      description: "Shadow graphic designers as they create logos, websites, and marketing materials for various clients.",
      requirements: ["Interest in design", "Basic knowledge of design software"],
      link: "https://creativeminds.example.com/shadow-program",
      industry: "Design",
      imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "7",
      title: "Environmental Scientist Field Day",
      organization: "GreenEarth Research",
      type: "in-person",
      location: "Portland, OR",
      availability: "Monthly field trips",
      description: "Join environmental scientists for a day in the field collecting samples, monitoring ecosystems, and analyzing environmental data.",
      requirements: ["16+ years old", "Able to walk on uneven terrain", "Outdoor appropriate clothing"],
      link: "https://greenearth.example.com/shadow-days",
      industry: "Environmental Science",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "8",
      title: "Financial Analyst Shadow Program",
      organization: "Capital Growth Partners",
      type: "virtual",
      availability: "Quarterly sessions",
      description: "Experience the day-to-day activities of financial analysts as they evaluate investments, create financial models, and present to clients.",
      requirements: ["Basic understanding of finance", "Interest in financial markets"],
      link: "https://capitalgrowth.example.com/shadow",
      industry: "Finance",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-xl md:text-2xl font-bold text-primary">Career Shadowing</h1>
          <p className="text-gray-600">Explore real-world experiences in your potential career</p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Voice AI Assistant */}
          {currentAvatar && (
            <VoiceAssistant 
              message={aiMessage}
              avatarSrc={currentAvatar.src}
              autoPlay={voiceType !== 'none'}
              name={currentAvatar.gender === 'female' ? 'Sophia' : 'Alex'}
            />
          )}
          
          {/* Career Selection */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-3">Select a career to explore:</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {matchedCareers?.map((career) => (
                <div 
                  key={career.id}
                  onClick={() => handleCareerChange(career.title)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all 
                    ${selectedCareer === career.title 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                >
                  <h3 className="font-medium">{career.title}</h3>
                  <p className={`text-sm mt-0.5 ${selectedCareer === career.title ? 'text-white/80' : 'text-gray-600'}`}>
                    {career.workEnvironment}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected Career Video */}
          {currentCareer?.shadowingVideoUrl && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100">
                {/* This would typically be an iframe with the actual video */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <FiVideo className="w-16 h-16 text-primary/30 mx-auto mb-3" />
                    <p className="text-gray-500">Career shadowing video for {currentCareer.title}</p>
                    <Button variant="outline" className="mt-3">
                      <FiExternalLink className="mr-2 h-4 w-4" />
                      Watch Video
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">A Day in the Life: {currentCareer.title}</h3>
                <p className="text-gray-600 mt-1">
                  This video shows what a typical day looks like for professionals in this field, 
                  including common tasks, work environment, and required skills.
                </p>
              </div>
            </div>
          )}
          
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">Find Shadowing Opportunities</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Search input */}
              <div className="col-span-1 sm:col-span-3 md:col-span-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search opportunities" 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Location type filter */}
              <div>
                <Select
                  value={locationType}
                  onValueChange={(value) => setLocationType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Location Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Industry filter */}
              <div>
                <Select
                  value={industry}
                  onValueChange={(value) => setIndustry(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {uniqueIndustries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 text-sm">
                {filteredOpportunities.length} opportunities found
                {selectedCareer && ` for ${selectedCareer}`}
              </p>
              {locationType !== "all" && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {locationType === "virtual" ? "Virtual Only" : "In-Person Only"}
                </span>
              )}
            </div>
            
            {/* Opportunities */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : filteredOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="overflow-hidden h-full flex flex-col hover:shadow-md transition-all">
                    <div className="h-32 overflow-hidden bg-gray-100">
                      <img 
                        src={opportunity.imageUrl} 
                        alt={opportunity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                          <CardDescription>{opportunity.organization}</CardDescription>
                        </div>
                        <div className={`${
                          opportunity.type === 'virtual' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                          } px-2 py-1 rounded-full text-xs font-medium flex items-center`}
                        >
                          {opportunity.type === 'virtual' 
                            ? <FiVideo className="mr-1 h-3 w-3" /> 
                            : <FiMapPin className="mr-1 h-3 w-3" />
                          }
                          {opportunity.type === 'virtual' ? 'Virtual' : 'In-Person'}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                      
                      {opportunity.location && (
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <FiMapPin className="mr-1 h-3 w-3" />
                          <span>{opportunity.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="mr-1 h-3 w-3" />
                        <span>{opportunity.availability}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" className="w-full" asChild>
                        <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                          <FiLink2 className="mr-1 h-4 w-4" />
                          Apply for Shadowing
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">No opportunities found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setLocationType("all");
                  setIndustry("all");
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Career Roadmap CTA */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-md p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:flex-1 mb-4 md:mb-0 md:mr-6">
                <h2 className="text-xl font-bold mb-2">Ready for Your Career Journey?</h2>
                <p className="text-white/80 mb-2">
                  After shadowing and confirming your career choice, it's time to map out your path to success!
                </p>
                <Button 
                  onClick={() => setScreen("roadmap")} 
                  className="bg-white hover:bg-white/90 text-primary"
                >
                  Generate My Career Roadmap
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="M18.4 9.6a9 9 0 1 1 -16.2 5.4"></path>
                  <path d="M3 14h4v4"></path>
                  <path d="M21 3l-9 9"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        active="explore"
        onNavigate={(screen) => setScreen(screen)}
      />
    </div>
  );
}