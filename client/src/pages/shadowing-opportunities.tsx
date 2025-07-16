import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Award,
  GraduationCap,
  Calendar,
  Building,
  Clock,
  ExternalLink
} from 'lucide-react';

const ShadowingOpportunitiesPage: React.FC = () => {
  const { toast } = useToast();
  
  // Function to handle applying for shadowing opportunities
  const handleApply = (organization: string, url: string) => {
    // Open the URL in a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Show a success toast
    toast({
      title: "Application Started",
      description: `You're being redirected to ${organization}'s application page.`,
      variant: "default",
    });
    
    // Track this activity (in a real app)
    console.log(`User applied for shadowing at: ${organization}`);
  };
  
  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-screen pt-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Virtual Shadowing Opportunities</h1>
          <p className="text-muted-foreground max-w-2xl">
            Experience firsthand what it's like to work in your matched careers through our curated 
            virtual shadowing opportunities.
          </p>
        </div>
        <Link href="/results">
          <Button variant="outline" className="mt-4 md:mt-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" /> 
              What is Virtual Shadowing?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Virtual shadowing allows you to observe and learn from professionals in their day-to-day work 
              environment without being physically present. It's a great way to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Gain firsthand insight into careers you're interested in</li>
              <li>Learn about the day-to-day responsibilities and challenges</li>
              <li>Build connections with professionals in your field of interest</li>
              <li>Make more informed decisions about your career path</li>
            </ul>
            <p>
              Browse through our available opportunities below and sign up for sessions 
              that match your interests and availability.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-primary" /> 
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <span className="font-medium">Browse Opportunities:</span> 
                <p className="text-sm text-muted-foreground">Explore available shadowing sessions in your areas of interest.</p>
              </li>
              <li>
                <span className="font-medium">Sign Up:</span> 
                <p className="text-sm text-muted-foreground">Register for sessions that fit your schedule.</p>
              </li>
              <li>
                <span className="font-medium">Prepare:</span> 
                <p className="text-sm text-muted-foreground">Review any materials provided and prepare questions.</p>
              </li>
              <li>
                <span className="font-medium">Attend:</span> 
                <p className="text-sm text-muted-foreground">Join the virtual session via the provided link at the scheduled time.</p>
              </li>
              <li>
                <span className="font-medium">Reflect:</span> 
                <p className="text-sm text-muted-foreground">Complete a post-session reflection to solidify your learning.</p>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Upcoming Opportunities</h2>
      
      <div className="space-y-6">
        {/* Entrepreneurial Shadowing Opportunity - FEATURED */}
        <Card className="border-2 border-duo-orange-300 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-duo-orange-500 text-white px-4 py-1 rounded-bl-md font-semibold text-sm">
            FEATURED
          </div>
          <CardHeader className="bg-duo-orange-50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Startup Founder Experience: From Idea to Launch</CardTitle>
                <CardDescription>Hosted by Founders Network</CardDescription>
              </div>
              <Badge className="bg-duo-orange-100 text-duo-orange-800 dark:bg-duo-orange-900 dark:text-duo-orange-200">
                Entrepreneurship
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-duo-orange-600 mr-2" />
                  <span className="text-sm">May 20, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-duo-orange-600 mr-2" />
                  <span className="text-sm">1:00 PM - 3:30 PM EST</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-duo-orange-600 mr-2" />
                  <span className="text-sm">Virtual (Zoom)</span>
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">
                  Follow serial entrepreneur Jordan Taylor through the process of launching a new startup. 
                  Observe pitch meetings, product development discussions, and marketing strategy planning.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-duo-orange-50 border-duo-orange-200 text-duo-orange-700">Business Strategy</Badge>
                  <Badge variant="outline" className="bg-duo-orange-50 border-duo-orange-200 text-duo-orange-700">Leadership</Badge>
                  <Badge variant="outline" className="bg-duo-orange-50 border-duo-orange-200 text-duo-orange-700">Risk Management</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleApply("Founders Network", "https://www.founders-network.com/virtual-shadowing")}
              className="w-full bg-duo-orange-500 hover:bg-duo-orange-600"
            >
              Apply for This Opportunity <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Small Business Owner Shadowing */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Small Business Management: Retail Store Operations</CardTitle>
                <CardDescription>Hosted by Local Business Alliance</CardDescription>
              </div>
              <Badge className="bg-duo-blue-100 text-duo-blue-800 dark:bg-duo-blue-900 dark:text-duo-blue-200">
                Business
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-duo-blue-600 mr-2" />
                  <span className="text-sm">June 5, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-duo-blue-600 mr-2" />
                  <span className="text-sm">9:00 AM - 11:00 AM EST</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-duo-blue-600 mr-2" />
                  <span className="text-sm">Virtual (Microsoft Teams)</span>
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">
                  Join small business owner Emma Rodriguez as she manages her successful boutique shop. Experience 
                  inventory management, customer relations, staff supervision, and financial planning.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Retail Operations</Badge>
                  <Badge variant="outline">Financial Management</Badge>
                  <Badge variant="outline">Customer Service</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleApply("Local Business Alliance", "https://www.localbusinessalliance.org/shadow-program")}
              className="w-full"
            >
              Apply for This Opportunity <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Software Developer Shadowing */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>A Day in the Life of a Software Developer</CardTitle>
                <CardDescription>Hosted by TechCorp Industries</CardDescription>
              </div>
              <Badge className="bg-duo-green-100 text-duo-green-800 dark:bg-duo-green-900 dark:text-duo-green-200">
                Technology
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-duo-green-600 mr-2" />
                  <span className="text-sm">June 15, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-duo-green-600 mr-2" />
                  <span className="text-sm">1:00 PM - 3:00 PM EST</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-duo-green-600 mr-2" />
                  <span className="text-sm">Virtual (Zoom)</span>
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">
                  Join senior software developer Alex Chen as they navigate through a typical workday. 
                  Observe coding sessions, team meetings, and problem-solving in real-time.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Coding</Badge>
                  <Badge variant="outline">Team Collaboration</Badge>
                  <Badge variant="outline">Problem Solving</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleApply("TechCorp Industries", "https://www.techcorp-industries.com/shadowing")}
              className="w-full"
            >
              Apply for This Opportunity <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Venture Capital Shadowing - Entrepreneurship Related */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Inside Venture Capital: Funding the Next Big Idea</CardTitle>
                <CardDescription>Hosted by Innovation Ventures</CardDescription>
              </div>
              <Badge className="bg-duo-purple-100 text-duo-purple-800 dark:bg-duo-purple-900 dark:text-duo-purple-200">
                Finance & Entrepreneurship
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-duo-purple-600 mr-2" />
                  <span className="text-sm">June 10, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-duo-purple-600 mr-2" />
                  <span className="text-sm">10:00 AM - 12:30 PM EST</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-duo-purple-600 mr-2" />
                  <span className="text-sm">Virtual (Google Meet)</span>
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">
                  Observe venture capitalist Dr. Marcus Patel evaluate startup pitches and make investment decisions. 
                  Learn about funding strategies, market analysis, and what investors look for in entrepreneurs.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Investment Analysis</Badge>
                  <Badge variant="outline">Strategic Planning</Badge>
                  <Badge variant="outline">Business Valuation</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleApply("Innovation Ventures", "https://www.innovation-ventures.com/virtual-shadow")}
              className="w-full"
            >
              Apply for This Opportunity <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        {/* UX/UI Design Shadowing */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>UX/UI Design Process Walkthrough</CardTitle>
                <CardDescription>Hosted by DesignHub Creative</CardDescription>
              </div>
              <Badge className="bg-duo-purple-100 text-duo-purple-800 dark:bg-duo-purple-900 dark:text-duo-purple-200">
                Creative
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-duo-purple-600 mr-2" />
                  <span className="text-sm">June 20, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-duo-purple-600 mr-2" />
                  <span className="text-sm">10:00 AM - 12:00 PM EST</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-duo-purple-600 mr-2" />
                  <span className="text-sm">Virtual (Google Meet)</span>
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">
                  Follow UX Designer Mia Jackson as she works through a design project from concept to completion. 
                  Learn about user research, wireframing, prototyping, and user testing.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Design Thinking</Badge>
                  <Badge variant="outline">Prototyping</Badge>
                  <Badge variant="outline">User Testing</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleApply("DesignHub Creative", "https://www.designhub-creative.com/shadowing")}
              className="w-full"
            >
              Apply for This Opportunity <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10 text-center">
        <h3 className="text-xl font-semibold mb-4">Looking for more opportunities?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We're constantly adding new virtual shadowing sessions across different industries.
          Check back regularly or sign up for alerts when new opportunities in your fields of interest become available.
        </p>
        <Button 
          variant="outline" 
          className="mx-auto"
          onClick={() => handleApply("Lifetime GPS", "https://www.lifetimegps.com/all-shadowing-opportunities")}
        >
          <ExternalLink className="mr-2 h-4 w-4" /> Browse All Opportunities
        </Button>
      </div>
      
      {/* Special Entrepreneurial Resources Section */}
      <div className="mt-16 bg-duo-orange-50 p-6 rounded-2xl border border-duo-orange-200">
        <h3 className="text-xl font-bold text-duo-orange-700 mb-4">Special Entrepreneurial Resources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Startup Mentorship</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Connect with experienced entrepreneurs who can guide you through the challenges of starting your own business.</p>
              <button 
                onClick={() => handleApply("SCORE", "https://www.score.org/find-mentor")}
                className="text-duo-orange-600 hover:text-duo-orange-800 font-medium text-sm mt-3 inline-flex items-center bg-transparent border-0 p-0 cursor-pointer"
              >
                Find a Mentor <ExternalLink className="ml-1 h-3 w-3" />
              </button>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Funding Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Discover grants, loans, and investment opportunities specifically designed for new entrepreneurs and small business owners.</p>
              <button 
                onClick={() => handleApply("Small Business Administration", "https://www.sba.gov/funding-programs")}
                className="text-duo-orange-600 hover:text-duo-orange-800 font-medium text-sm mt-3 inline-flex items-center bg-transparent border-0 p-0 cursor-pointer"
              >
                Explore Funding <ExternalLink className="ml-1 h-3 w-3" />
              </button>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Business Plan Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Access customizable business plan templates to help structure your entrepreneurial vision and strategy.</p>
              <button 
                onClick={() => handleApply("BPlans", "https://www.bplans.com/business-plan-templates/")}
                className="text-duo-orange-600 hover:text-duo-orange-800 font-medium text-sm mt-3 inline-flex items-center bg-transparent border-0 p-0 cursor-pointer"
              >
                Download Templates <ExternalLink className="ml-1 h-3 w-3" />
              </button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-duo-orange-600 italic">
            "Entrepreneurship is about turning what excites you in life into capital, so that you can do more of it and move forward." - Richard Branson
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShadowingOpportunitiesPage;