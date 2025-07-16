import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Briefcase, 
  GraduationCap, 
  BarChart3, 
  MapPin, 
  Users, 
  Heart, 
  Clock, 
  PlayCircle,
  Route,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useActivity } from '@/context/ActivityContext';
import CareerRoadmap from '@/components/CareerRoadmap';

interface CareerDetailViewProps {
  career: any;
  onBack?: () => void;
}

const CareerDetailView: React.FC<CareerDetailViewProps> = ({ career, onBack }) => {
  const [location, navigate] = useLocation();
  const { trackEvent } = useActivity();
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'education'>('overview');

  if (!career) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-duo-purple-700 mb-4">Career Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find details for this career. Please try selecting another one.</p>
        <Button onClick={() => navigate('/dashboard')} className="bg-duo-green-500 hover:bg-duo-green-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleTabChange = (tab: 'overview' | 'roadmap' | 'education') => {
    setActiveTab(tab);
    trackEvent('button_click', {
      buttonId: `career_detail_tab_${tab}`,
      buttonText: tab.charAt(0).toUpperCase() + tab.slice(1),
      context: 'career_detail',
      careerId: career.id,
      careerTitle: career.title
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="mb-6 flex items-center">
        <Button 
          variant="outline" 
          className="border-2 border-duo-purple-300 text-duo-purple-700 hover:bg-duo-purple-100 rounded-xl"
          onClick={() => {
            trackEvent('button_click', {
              buttonId: 'career_detail_back',
              buttonText: 'Back to Dashboard',
              context: 'career_detail',
              careerId: career.id,
              careerTitle: career.title
            });
            
            if (onBack) {
              onBack();
            } else {
              navigate('/dashboard');
            }
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>

      <Card className="bg-white rounded-2xl shadow-lg border-2 border-duo-green-200 mb-8">
        <CardHeader className="bg-gradient-to-r from-duo-green-100 to-duo-blue-50 rounded-t-xl pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-duo-purple-700">{career.title}</CardTitle>
              <CardDescription className="text-gray-700 text-base mt-1">
                {career.match && <Badge className="bg-duo-green-500 text-white border-none mb-2">
                  {career.match}% Match
                </Badge>}
                <span className="ml-2 text-duo-green-800">{career.category}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <Button 
                variant="ghost" 
                className={`pb-2 px-4 -mb-px ${activeTab === 'overview' ? 'border-b-2 border-duo-purple-500 text-duo-purple-700 font-medium' : 'text-gray-500'}`}
                onClick={() => handleTabChange('overview')}
              >
                Overview
              </Button>
              <Button 
                variant="ghost" 
                className={`pb-2 px-4 -mb-px ${activeTab === 'roadmap' ? 'border-b-2 border-duo-purple-500 text-duo-purple-700 font-medium' : 'text-gray-500'}`}
                onClick={() => handleTabChange('roadmap')}
              >
                Career Roadmap
              </Button>
              <Button 
                variant="ghost" 
                className={`pb-2 px-4 -mb-px ${activeTab === 'education' ? 'border-b-2 border-duo-purple-500 text-duo-purple-700 font-medium' : 'text-gray-500'}`}
                onClick={() => handleTabChange('education')}
              >
                Education Paths
              </Button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">{career.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-duo-blue-50 p-4 rounded-xl border border-duo-blue-200">
                    <div className="flex items-center gap-2 mb-2 text-duo-blue-700 font-medium">
                      <Briefcase className="h-5 w-5" />
                      Salary Range
                    </div>
                    <p className="text-duo-blue-800 font-bold">{career.salary}</p>
                  </div>
                  
                  <div className="bg-duo-green-50 p-4 rounded-xl border border-duo-green-200">
                    <div className="flex items-center gap-2 mb-2 text-duo-green-700 font-medium">
                      <BarChart3 className="h-5 w-5" />
                      Job Outlook
                    </div>
                    <p className="text-duo-green-800 font-bold">{career.outlook || "Average"}</p>
                  </div>
                  
                  <div className="bg-duo-orange-50 p-4 rounded-xl border border-duo-orange-200">
                    <div className="flex items-center gap-2 mb-2 text-duo-orange-700 font-medium">
                      <Clock className="h-5 w-5" />
                      Work Schedule
                    </div>
                    <p className="text-duo-orange-800 font-bold">{career.workSchedule || "Typical 40 hours/week"}</p>
                  </div>
                </div>
                
                <div className="bg-duo-purple-50 p-5 rounded-xl border border-duo-purple-200">
                  <h3 className="font-semibold text-duo-purple-700 text-lg mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5" /> Is This Career Right For You?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    <div>
                      <h4 className="font-medium text-duo-purple-700 mb-1">You Might Like This If You:</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>{career.youMightLike?.[0] || "Enjoy problem-solving and critical thinking"}</li>
                        <li>{career.youMightLike?.[1] || "Are detail-oriented and organized"}</li>
                        <li>{career.youMightLike?.[2] || "Like working with a team on projects"}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-duo-purple-700 mb-1">Challenges to Consider:</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>{career.challenges?.[0] || "Can involve tight deadlines and pressure"}</li>
                        <li>{career.challenges?.[1] || "May require ongoing learning to stay current"}</li>
                        <li>{career.challenges?.[2] || "Some positions may require travel or relocation"}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-duo-green-700 text-lg mb-3">Key Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.skills?.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-duo-green-50 border-duo-green-200 text-duo-green-700 px-3 py-1 text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-duo-blue-700 text-lg mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> Where You Might Work
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {(career.workplaces || ["Corporate offices", "Remote/Work from home", "Technology companies", "Consulting firms"]).map((place: string, index: number) => (
                        <li key={index}>{place}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-duo-orange-700 text-lg mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5" /> Who You Might Work With
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {(career.colleagues || ["Project managers", "Designers", "Business analysts", "Clients and stakeholders"]).map((colleague: string, index: number) => (
                        <li key={index}>{colleague}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="bg-duo-purple-500 hover:bg-duo-purple-600 text-white"
                    onClick={() => {
                      trackEvent('button_click', {
                        buttonId: 'view_career_roadmap',
                        buttonText: 'View Career Roadmap',
                        context: 'career_detail',
                        careerId: career.id,
                        careerTitle: career.title
                      });
                      handleTabChange('roadmap');
                    }}
                  >
                    <Route className="mr-2 h-4 w-4" /> View Career Roadmap
                  </Button>
                </div>
              </div>
            )}

            {/* Roadmap Tab */}
            {activeTab === 'roadmap' && (
              <div className="space-y-6">
                <div className="bg-white p-2 rounded-xl">
                  <h3 className="text-xl font-semibold text-duo-green-700 mb-4">Career Path Roadmap</h3>
                  
                  <div className="h-[400px] w-full">
                    <CareerRoadmap careerId={career.id} careerTitle={career.title} />
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-duo-purple-700 mb-2">Advancement Opportunities</h4>
                    <p className="text-gray-700 mb-4">
                      As you grow in this career, you might advance to these positions:
                    </p>
                    <ul className="space-y-2">
                      {(career.advancementPaths || [
                        "Entry Level: Junior position with basic responsibilities",
                        "Mid Level: Increased responsibilities and specialized skills",
                        "Senior Level: Leadership and mentoring responsibilities",
                        "Expert/Management: Strategy development and team oversight"
                      ]).map((path: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-duo-green-100 rounded-full p-1 mr-2 mt-0.5">
                            <ChevronRight className="h-4 w-4 text-duo-green-600" />
                          </div>
                          <span className="text-gray-700">{path}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="bg-duo-blue-50 p-5 rounded-xl border border-duo-blue-200">
                  <h3 className="font-semibold text-duo-blue-700 text-xl mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" /> Education Requirements
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {career.education || "Education requirements vary by employer and specialty area."}
                  </p>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-duo-blue-700">Education Paths</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {(career.educationPaths || [
                        "Bachelor's degree in related field",
                        "Associate degree + industry certification",
                        "Bootcamp + portfolio (for certain positions)",
                        "Self-taught + relevant experience"
                      ]).map((path: string, index: number) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-duo-blue-100 shadow-sm">
                          <div className="flex items-start">
                            <div className="bg-duo-blue-100 rounded-full p-1 mr-2 mt-0.5">
                              <GraduationCap className="h-4 w-4 text-duo-blue-600" />
                            </div>
                            <div>
                              <span className="text-gray-700">{path}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Link 
                        href={`/education/${career.id}`} 
                        onClick={() => {
                          // Store the current path as the referrer for the education page
                          sessionStorage.setItem('educationPageReferrer', '/dashboard');
                          console.log('Stored referrer for education page from dashboard');
                        }}
                        className="mt-2"
                      >
                        <Button className="w-full bg-duo-blue-500 hover:bg-duo-blue-600 text-white">
                          <ExternalLink className="mr-2 h-4 w-4" /> View Full Education Requirements
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-duo-blue-700 mb-2">Certifications & Credentials</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(career.certifications || [
                        "Professional certification in the field",
                        "Specialized technical certifications",
                        "Project management credentials",
                        "Industry-recognized credentials"
                      ]).map((cert: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <Badge className="bg-duo-purple-100 text-duo-purple-700 border-none">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            Certification
                          </Badge>
                          <span className="ml-2 text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-duo-orange-50 p-5 rounded-xl border border-duo-orange-200">
                  <h3 className="font-semibold text-duo-orange-700 text-lg mb-3 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" /> Virtual Shadowing Opportunity
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Learn more about this career through our virtual job shadowing experience with professionals in the field.
                  </p>
                  <Link href={`/shadowing-opportunities?career=${encodeURIComponent(career.title)}`}>
                    <Button className="bg-duo-orange-500 hover:bg-duo-orange-600 text-white">
                      Explore Virtual Shadowing
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <Button 
            variant="outline" 
            className="border-2 border-duo-purple-300 text-duo-purple-700 hover:bg-duo-purple-100"
            onClick={() => {
              trackEvent('button_click', {
                buttonId: 'career_detail_back_footer',
                buttonText: 'Back',
                context: 'career_detail_footer',
                careerId: career.id,
                careerTitle: career.title
              });
              
              if (onBack) {
                onBack();
              } else {
                navigate('/dashboard');
              }
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Link href="/">
            <Button className="bg-duo-green-500 hover:bg-duo-green-600 text-white">
              Explore More Careers
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CareerDetailView;