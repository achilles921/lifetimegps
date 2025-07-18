import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { VoiceAssistant } from "@/components/ui/VoiceAssistant";
import { avatars } from "@/data/avatarData";
import { apprenticeships, tradeCategories, type Apprenticeship } from "@/data/apprenticeshipData";
import { careers, isTradeCareer } from "@/data/careerData";
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiSearch, 
  FiFilter, 
  FiCalendar, 
  FiDollarSign, 
  FiClock,
  FiBriefcase,
  FiClipboard,
  FiCheckSquare,
  FiStar,
  FiExternalLink
} from "react-icons/fi";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Apprenticeships() {
  const { avatarId, voiceType, careerMatches, setScreen } = useUser();
  const [apprenticeshipList, setApprenticeshipList] = useState<Apprenticeship[]>([]);
  const [filteredList, setFilteredList] = useState<Apprenticeship[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isPay, setIsPay] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  
  // Get current avatar
  const currentAvatar = avatars.find(avatar => avatar.id === avatarId);
  
  // AI assistant message
  const aiMessage = "Apprenticeships are a fantastic way to enter the trades without college debt. They offer paid, hands-on training while you earn industry certifications. Most apprenticeships lead directly to well-paying careers in high-demand fields!";
  
  // Get trade-related careers from matches
  const tradeMatches = careerMatches?.map(match => {
    const career = careers.find(c => c.title === match.title);
    return career && isTradeCareer(career) ? career : null;
  }).filter(Boolean) as Array<typeof careers[number]> | undefined;
  
  useEffect(() => {
    // Set default selected career if available
    if (tradeMatches && tradeMatches.length > 0 && !selectedCareer) {
      setSelectedCareer(tradeMatches[0].title);
    }
    
    // Simulate API call to fetch apprenticeships
    const fetchApprenticeships = async () => {
      setIsLoading(true);
      
      try {
        // This would be an API call in a real application
        setTimeout(() => {
          setApprenticeshipList(apprenticeships);
          setFilteredList(apprenticeships);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching apprenticeships:", error);
        setIsLoading(false);
      }
    };
    
    fetchApprenticeships();
  }, [tradeMatches, selectedCareer]);
  
  // Filter apprenticeships
  useEffect(() => {
    let filtered = apprenticeshipList;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.title.toLowerCase().includes(query) || 
        app.company.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(app => app.tradeCategory === selectedCategory);
    }
    
    // Filter by pay
    if (isPay === "high") {
      filtered = filtered.filter(app => {
        const payValue = parseInt(app.pay.replace(/[^0-9]/g, ''));
        return payValue >= 20;
      });
    } else if (isPay === "medium") {
      filtered = filtered.filter(app => {
        const payValue = parseInt(app.pay.replace(/[^0-9]/g, ''));
        return payValue >= 16 && payValue < 20;
      });
    } else if (isPay === "low") {
      filtered = filtered.filter(app => {
        const payValue = parseInt(app.pay.replace(/[^0-9]/g, ''));
        return payValue < 16;
      });
    }
    
    // Filter by selected career
    if (selectedCareer) {
      const career = careers.find(c => c.title === selectedCareer);
      if (career) {
        filtered = filtered.filter(app => 
          app.tradeCategory === career.title || 
          app.title.toLowerCase().includes(career.title.toLowerCase())
        );
      }
    }
    
    setFilteredList(filtered);
  }, [searchQuery, selectedCategory, isPay, apprenticeshipList, selectedCareer]);
  
  // Format requirements list
  const formatRequirementsList = (requirements: string[]) => {
    return (
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
        {requirements.map((req, i) => (
          <li key={i}>{req}</li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto max-w-4xl flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => setScreen("roadmap")}
          >
            <FiArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">Trade Apprenticeships</h1>
            <p className="text-gray-600">Discover paid training opportunities in the trades</p>
          </div>
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
          
          {/* Apprenticeship Benefits */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="p-6 text-white md:flex-1">
                <h2 className="text-xl font-bold mb-3">Why Choose an Apprenticeship?</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <FiDollarSign className="h-5 w-5 mr-2 text-white/80 flex-shrink-0 mt-0.5" />
                    <span>Earn while you learn (average starting pay: $15-20/hr)</span>
                  </li>
                  <li className="flex items-start">
                    <FiClipboard className="h-5 w-5 mr-2 text-white/80 flex-shrink-0 mt-0.5" />
                    <span>No college debt - training costs covered by employer</span>
                  </li>
                  <li className="flex items-start">
                    <FiClock className="h-5 w-5 mr-2 text-white/80 flex-shrink-0 mt-0.5" />
                    <span>Faster path to full salary (2-5 years vs. 4+ for college)</span>
                  </li>
                  <li className="flex items-start">
                    <FiBriefcase className="h-5 w-5 mr-2 text-white/80 flex-shrink-0 mt-0.5" />
                    <span>High job security in essential industries</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/3 bg-white/10 p-6 md:flex md:flex-col md:justify-center">
                <div className="text-white">
                  <h3 className="font-semibold text-lg mb-2">Average Trade Salaries</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Electrician</span>
                      <span className="font-bold">$60,040</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plumber</span>
                      <span className="font-bold">$59,880</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HVAC Technician</span>
                      <span className="font-bold">$50,590</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Welder</span>
                      <span className="font-bold">$46,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-4">Find Your Apprenticeship</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Search input */}
                <div className="col-span-1 sm:col-span-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Search apprenticeships" 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Category filter */}
                <div>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Trade Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {tradeCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Pay filter */}
                <div>
                  <Select
                    value={isPay}
                    onValueChange={(value) => setIsPay(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pay Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pay Ranges</SelectItem>
                      <SelectItem value="high">$20+/hr</SelectItem>
                      <SelectItem value="medium">$16-19/hr</SelectItem>
                      <SelectItem value="low">Under $16/hr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Results count */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm">
                {filteredList.length} apprenticeships found
              </p>
            </div>
            
            {/* Trade Career Tabs if trade matches exist */}
            {tradeMatches && tradeMatches.length > 0 && (
              <div className="mb-6">
                <Tabs defaultValue={tradeMatches[0].title} className="w-full">
                  <TabsList className="mb-4 w-full justify-start overflow-x-auto">
                    {tradeMatches.map((career) => (
                      <TabsTrigger 
                        key={career.id} 
                        value={career.title}
                        onClick={() => setSelectedCareer(career.title)}
                        className="px-4"
                      >
                        {career.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {tradeMatches.map((career) => (
                    <TabsContent key={career.id} value={career.title} className="mt-0">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-primary">{career.title} Career Path</h3>
                            <p className="text-sm text-gray-700 mt-1 mb-2">{career.description}</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div className="flex items-center">
                                <FiDollarSign className="mr-1 text-green-500 h-4 w-4" />
                                <span>Avg Salary: <span className="font-medium">{career.salary}</span></span>
                              </div>
                              <div className="flex items-center">
                                <FiArrowLeft className="mr-1 text-blue-500 h-4 w-4" />
                                <span>Growth: <span className="font-medium">{career.growth}</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 hidden sm:block">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(career.shadowingVideoUrl, '_blank')}
                            >
                              Watch Career Video
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
            
            {/* Apprenticeship Listings */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : filteredList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredList.map((apprenticeship) => (
                  <Card key={apprenticeship.id} className="overflow-hidden hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-lg">{apprenticeship.title}</CardTitle>
                          <CardDescription>{apprenticeship.company}</CardDescription>
                        </div>
                        <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center">
                          {apprenticeship.tradeCategory}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                        <div className="flex items-center">
                          <FiMapPin className="mr-1 text-gray-500 h-4 w-4" />
                          <span>{apprenticeship.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FiDollarSign className="mr-1 text-gray-500 h-4 w-4" />
                          <span>{apprenticeship.pay}</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="mr-1 text-gray-500 h-4 w-4" />
                          <span>{apprenticeship.duration}</span>
                        </div>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="details">
                          <AccordionTrigger className="text-sm py-2">View Details</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium text-sm">Description</h4>
                                <p className="text-sm text-gray-600">{apprenticeship.description}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-sm">Requirements</h4>
                                {formatRequirementsList(apprenticeship.requirements)}
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-sm">Benefits</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                  {apprenticeship.benefits.map((benefit, i) => (
                                    <li key={i}>{benefit}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter className="pt-1">
                      <Button className="w-full" asChild>
                        <a 
                          href={apprenticeship.applicationLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <FiExternalLink className="mr-2 h-4 w-4" />
                          Apply Now
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <FiFilter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">No apprenticeships found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setIsPay("all");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Additional Resources */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">Additional Resources</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Apprenticeship.gov</CardTitle>
                  <CardDescription>Official U.S. government resource for apprenticeships</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a 
                      href="https://www.apprenticeship.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">SkillsUSA</CardTitle>
                  <CardDescription>Career and technical student organization</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a 
                      href="https://www.skillsusa.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mike Rowe Works Foundation</CardTitle>
                  <CardDescription>Scholarships for skilled trades training</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a 
                      href="https://www.mikeroweworks.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Local Union Halls</CardTitle>
                  <CardDescription>Find apprenticeship programs through trade unions</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a 
                      href="https://aflcio.org/about-us/our-unions-and-allies" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Find Local Unions
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What exactly is an apprenticeship?</AccordionTrigger>
                <AccordionContent>
                  An apprenticeship is a paid job where you learn specific trade skills through a combination of on-the-job training and classroom instruction. You earn while you learn, gaining hands-on experience under the guidance of experienced professionals. Apprenticeships typically last 1-5 years, depending on the trade.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Do I need prior experience?</AccordionTrigger>
                <AccordionContent>
                  Most apprenticeships don't require prior experience in the trade, but some basic requirements like a high school diploma or GED, valid driver's license, and the ability to pass a drug test are common. Some programs may require basic math skills or physical requirements depending on the trade.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How much can I earn during an apprenticeship?</AccordionTrigger>
                <AccordionContent>
                  Apprentice pay typically starts at 40-50% of a journey worker's wage and increases progressively as you gain skills and experience. Starting pay is usually $15-22 per hour plus benefits, depending on the trade and location. By the end of your apprenticeship, you'll earn near-journeyman wages.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>What happens after I complete my apprenticeship?</AccordionTrigger>
                <AccordionContent>
                  Upon completing your apprenticeship, you'll receive a nationally recognized credential certifying your skills as a journey-level worker. Many apprentices continue working with their sponsoring employer, while others use their credentials to pursue opportunities with other companies or even start their own business.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Are apprenticeships only for certain trades?</AccordionTrigger>
                <AccordionContent>
                  While traditional apprenticeships are common in construction trades (electrician, plumber, carpenter), they're also available in manufacturing, healthcare, IT, energy, and many other industries. The U.S. Department of Labor recognizes over 1,000 occupations as apprenticeable.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
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