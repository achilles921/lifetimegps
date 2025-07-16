import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  GraduationCap, 
  Book, 
  Clock, 
  DollarSign, 
  Building, 
  Award, 
  Wrench, 
  School,
  Share2
} from 'lucide-react';

import { careers } from '@/data/careerData';
import { useToast } from '@/hooks/use-toast';

// Maps career types to education paths
const educationPathsDB = {
  "Technology": {
    college: {
      degrees: [
        {
          name: "Bachelor of Science in Computer Science",
          duration: "4 years",
          cost: "$40,000 - $120,000",
          institutions: ["Massachusetts Institute of Technology", "Stanford University", "Carnegie Mellon University"],
          subjects: ["Algorithms", "Data Structures", "Software Engineering", "Operating Systems", "Database Systems"]
        },
        {
          name: "Bachelor of Science in Information Technology",
          duration: "4 years",
          cost: "$35,000 - $110,000",
          institutions: ["University of California - Berkeley", "University of Washington", "Georgia Tech"],
          subjects: ["Network Systems", "Programming", "Systems Analysis", "Cybersecurity", "Cloud Computing"]
        }
      ],
      certifications: ["AWS Certified Developer", "Google Cloud Professional", "Microsoft Certified: Azure"]
    },
    trade: {
      programs: [
        {
          name: "Coding Bootcamp",
          duration: "3-6 months (intensive)",
          cost: "$10,000 - $20,000",
          institutions: ["General Assembly", "Flatiron School", "App Academy", "Hack Reactor"],
          skills: ["Front-end Development", "Back-end Development", "Full Stack Integration", "Version Control"]
        },
        {
          name: "Technical Certificate in IT",
          duration: "1 year",
          cost: "$5,000 - $15,000",
          institutions: ["Community Colleges", "Technical Training Centers"],
          skills: ["IT Support", "Network Management", "Virtualization", "Cloud Services"]
        }
      ],
      certifications: ["CompTIA A+", "CompTIA Network+", "Cisco CCNA"]
    },
    selfStudy: {
      resources: [
        {
          name: "Free Online Courses",
          platforms: ["freeCodeCamp", "Khan Academy", "MIT OpenCourseWare", "Coursera (audit mode)"],
          subjects: ["HTML/CSS", "JavaScript", "Python", "Web Development", "Mobile Development"]
        },
        {
          name: "Paid Learning Platforms",
          platforms: ["Udemy", "Pluralsight", "LinkedIn Learning", "Codecademy Pro"],
          cost: "$15-$40/month or $10-$20 per course",
          subjects: ["Full Stack Development", "Cloud Computing", "DevOps", "Mobile Development"]
        }
      ]
    }
  },
  "Trades": {
    college: {
      degrees: [
        {
          name: "Associate of Applied Science",
          duration: "2 years",
          cost: "$10,000 - $30,000",
          institutions: ["Community Colleges", "Technical Colleges"],
          subjects: ["Technical Writing", "Applied Mathematics", "Blueprint Reading", "Safety Standards"]
        }
      ],
      certifications: ["OSHA Safety Certification", "EPA Certification"]
    },
    trade: {
      programs: [
        {
          name: "Apprenticeship Programs",
          duration: "3-5 years",
          cost: "Paid training (earn while you learn)",
          institutions: ["Union Apprenticeships", "Non-union Apprenticeships", "Employer-sponsored Programs"],
          skills: ["Hands-on Technical Skills", "Safety Procedures", "Tool Operation", "Trade-specific Knowledge"]
        },
        {
          name: "Trade School Certificate",
          duration: "6 months - 2 years",
          cost: "$5,000 - $15,000",
          institutions: ["Technical Schools", "Vocational Centers"],
          skills: ["Trade-specific Skills", "Safety Training", "Equipment Operation", "Field Experience"]
        }
      ],
      certifications: ["Trade-specific Licenses", "Industry Certifications"]
    },
    selfStudy: {
      resources: [
        {
          name: "Online Tutorials",
          platforms: ["YouTube", "Home Improvement Sites", "Trade Forums"],
          subjects: ["Basic Skills", "Tool Usage", "Safety Procedures"]
        },
        {
          name: "Hands-on Practice",
          platforms: ["Volunteering", "Helper Positions", "DIY Projects"],
          subjects: ["Practical Application", "Real-world Problem Solving"]
        }
      ]
    }
  },
  "Healthcare": {
    college: {
      degrees: [
        {
          name: "Bachelor of Science in Nursing",
          duration: "4 years",
          cost: "$40,000 - $100,000",
          institutions: ["Johns Hopkins University", "University of Pennsylvania", "Duke University"],
          subjects: ["Anatomy", "Physiology", "Pharmacology", "Patient Care", "Clinical Practice"]
        },
        {
          name: "Bachelor/Master of Science in Healthcare",
          duration: "4-6 years",
          cost: "$40,000 - $150,000",
          institutions: ["Mayo Clinic College", "Harvard Medical School", "Stanford Medicine"],
          subjects: ["Medical Sciences", "Healthcare Management", "Clinical Skills", "Research Methods"]
        }
      ],
      certifications: ["BLS/CPR Certification", "Specialty Certifications"]
    },
    trade: {
      programs: [
        {
          name: "Certified Nursing Assistant (CNA)",
          duration: "4-12 weeks",
          cost: "$1,000 - $2,000",
          institutions: ["Community Colleges", "Vocational Schools", "Healthcare Facilities"],
          skills: ["Patient Care", "Vital Signs Monitoring", "Personal Care", "Communication"]
        },
        {
          name: "Medical Assistant Training",
          duration: "9 months - 2 years",
          cost: "$5,000 - $15,000",
          institutions: ["Technical Schools", "Community Colleges"],
          skills: ["Clinical Procedures", "Medical Office Management", "Patient Records", "Basic Medical Tests"]
        }
      ],
      certifications: ["Certified Medical Assistant", "Certified Nursing Assistant", "Phlebotomy Technician"]
    },
    selfStudy: {
      resources: [
        {
          name: "Online Healthcare Courses",
          platforms: ["Coursera", "edX", "Khan Academy"],
          subjects: ["Medical Terminology", "Human Anatomy", "Healthcare Ethics"]
        },
        {
          name: "Certification Preparation",
          platforms: ["AAPC Study Materials", "NHA Study Guides", "AMT Practice Tests"],
          cost: "$100 - $500",
          subjects: ["Certification Exam Preparation", "Continuing Education"]
        }
      ]
    }
  },
  "Business": {
    college: {
      degrees: [
        {
          name: "Bachelor of Business Administration",
          duration: "4 years",
          cost: "$40,000 - $120,000",
          institutions: ["University of Pennsylvania (Wharton)", "University of Michigan", "NYU Stern"],
          subjects: ["Management", "Marketing", "Finance", "Accounting", "Economics"]
        },
        {
          name: "Bachelor of Science in Marketing",
          duration: "4 years",
          cost: "$40,000 - $120,000",
          institutions: ["Northwestern University", "University of Texas at Austin", "University of California Berkeley"],
          subjects: ["Consumer Behavior", "Market Research", "Digital Marketing", "Brand Management"]
        }
      ],
      certifications: ["Project Management Professional (PMP)", "Certified Public Accountant (CPA)"]
    },
    trade: {
      programs: [
        {
          name: "Business Certificate Programs",
          duration: "3-12 months",
          cost: "$2,000 - $10,000",
          institutions: ["Community Colleges", "Professional Associations", "Continuing Education Centers"],
          skills: ["Business Communication", "Management Essentials", "Accounting Fundamentals"]
        },
        {
          name: "Specialized Business Training",
          duration: "1-6 months",
          cost: "$1,000 - $5,000",
          institutions: ["Industry Associations", "Professional Training Centers"],
          skills: ["Sales Techniques", "Customer Service", "Business Operations", "Financial Planning"]
        }
      ],
      certifications: ["Certified Marketing Professional", "Bookkeeping Certification", "HR Certification"]
    },
    selfStudy: {
      resources: [
        {
          name: "Business Courses",
          platforms: ["LinkedIn Learning", "Udemy", "Coursera", "HBR Online"],
          subjects: ["Entrepreneurship", "Leadership", "Marketing", "Finance"]
        },
        {
          name: "Business Books & Resources",
          platforms: ["Business Bestsellers", "Industry Publications", "Case Studies"],
          subjects: ["Business Strategy", "Management", "Innovation", "Industry-specific Knowledge"]
        }
      ]
    }
  },
  "Creative": {
    college: {
      degrees: [
        {
          name: "Bachelor of Fine Arts",
          duration: "4 years",
          cost: "$40,000 - $160,000",
          institutions: ["Rhode Island School of Design", "Parsons School of Design", "California Institute of the Arts"],
          subjects: ["Design Principles", "Art History", "Studio Practice", "Digital Media", "Portfolio Development"]
        },
        {
          name: "Bachelor of Arts in Graphic Design",
          duration: "4 years",
          cost: "$40,000 - $120,000",
          institutions: ["Savannah College of Art and Design", "School of Visual Arts", "ArtCenter College of Design"],
          subjects: ["Typography", "Color Theory", "Digital Design", "Visual Communication", "Web Design"]
        }
      ],
      certifications: ["Adobe Certified Expert", "Autodesk Certification"]
    },
    trade: {
      programs: [
        {
          name: "Design Bootcamp",
          duration: "3-6 months",
          cost: "$5,000 - $15,000",
          institutions: ["General Assembly", "Shillington", "Designation"],
          skills: ["Digital Design Tools", "UX/UI Design", "Portfolio Development", "Client Management"]
        },
        {
          name: "Creative Skills Certificate",
          duration: "6-12 months",
          cost: "$2,000 - $8,000",
          institutions: ["Art Schools", "Community Colleges", "Design Centers"],
          skills: ["Technical Skills", "Industry Software", "Creative Process", "Professional Practices"]
        }
      ],
      certifications: ["Google UX Design Certificate", "Graphic Design Certification"]
    },
    selfStudy: {
      resources: [
        {
          name: "Online Design Courses",
          platforms: ["Skillshare", "Domestika", "CreativeLive", "YouTube Tutorials"],
          subjects: ["Design Software", "Illustration", "Photography", "Animation"]
        },
        {
          name: "Design Community Resources",
          platforms: ["Behance", "Dribbble", "Design Forums", "Creative Challenges"],
          subjects: ["Portfolio Building", "Peer Feedback", "Industry Trends", "Creative Techniques"]
        }
      ]
    }
  }
};

// Helper function to get career category
const getCareerCategory = (career: any): string => {
  // Based on career attributes, determine its category
  if (career.id.includes('software') || career.title.includes('Software') || 
      career.id.includes('developer') || career.title.includes('Data')) {
    return 'Technology';
  } else if (career.id.includes('electrician') || career.id.includes('plumber') || 
             career.id.includes('carpenter') || career.id.includes('hvac') || 
             career.id.includes('welder') || career.id.includes('automotive')) {
    return 'Trades';
  } else if (career.id.includes('nurse') || career.id.includes('therapist') || 
             career.title.includes('Nurse') || career.title.includes('Therapist')) {
    return 'Healthcare';
  } else if (career.id.includes('market') || career.title.includes('Marketing') || 
             career.title.includes('Business')) {
    return 'Business';
  } else if (career.id.includes('design') || career.title.includes('Design') || 
             career.id.includes('ux') || career.id.includes('ui') || 
             career.id.includes('game')) {
    return 'Creative';
  }
  
  // Default fallback
  return 'Technology';
};

const EducationRequirements: React.FC = () => {
  const { id } = useParams();
  const [career, setCareer] = useState<any>(null);
  const [educationPaths, setEducationPaths] = useState<any>(null);
  const [referrer, setReferrer] = useState<string>('/results');
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Education page - Career ID received:", id);
    
    // Capture the referrer URL if it exists in session storage
    const storedReferrer = sessionStorage.getItem('educationPageReferrer');
    if (storedReferrer) {
      setReferrer(storedReferrer);
      console.log("Retrieved referrer from session storage:", storedReferrer);
    } else {
      // If no referrer is stored, try to use document.referrer
      const docReferrer = document.referrer;
      if (docReferrer && docReferrer.includes(window.location.host)) {
        const path = new URL(docReferrer).pathname;
        if (path && path !== '/') {
          setReferrer(path);
          console.log("Using document referrer:", path);
        }
      }
    }
    
    // First try to find directly in careers array
    let foundCareer = careers.find(c => c.id === id);
    
    // If not found, check if there's a partial match
    if (!foundCareer && id) {
      console.log("Direct match not found, trying partial match...");
      foundCareer = careers.find(c => 
        c.id.includes(id.toLowerCase()) || 
        id.toLowerCase().includes(c.id) ||
        c.title.toLowerCase().includes(id.toLowerCase())
      );
    }
    
    // If still not found, use sample career
    if (!foundCareer) {
      console.log("Using sample career as fallback");
      // Default to software developer if nothing matches
      foundCareer = careers.find(c => c.id === "software_developer") || careers[0];
    }
    
    console.log("Found career:", foundCareer);
    
    if (foundCareer) {
      setCareer(foundCareer);
      
      // Get the career category and associated education paths
      const category = getCareerCategory(foundCareer);
      const paths = educationPathsDB[category];
      console.log("Career category:", category);
      
      if (paths) {
        setEducationPaths(paths);
      }
    }
  }, [id]);
  
  if (!career || !educationPaths) {
    return (
      <div className="container mx-auto p-4 max-w-4xl min-h-screen pt-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading career education info...</h1>
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="mb-4">If nothing loads after a few seconds, the career might not be found.</p>
        <Link href={referrer}>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </Link>
      </div>
    );
  }
  
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `Education Requirements for ${career.title}`,
        text: `Check out education pathways to become a ${career.title}`,
        url: window.location.href
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: "Link copied to clipboard",
            description: "You can now share this education pathway information.",
            variant: "default",
          });
        })
        .catch((error) => console.error('Failed to copy: ', error));
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl min-h-screen pt-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Education Requirements</h1>
          <p className="text-muted-foreground max-w-2xl">
            For {career.title} careers
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleShareClick}>
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Link href={referrer}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5 text-primary" />
            {career.title}
          </CardTitle>
          <CardDescription>
            {career.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Book className="h-5 w-5 text-primary mr-2" />
                <div>
                  <span className="font-medium">Education Path:</span>
                  <p className="text-sm text-muted-foreground">{career.educationPath}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-primary mr-2" />
                <div>
                  <span className="font-medium">Salary Range:</span>
                  <p className="text-sm text-muted-foreground">{career.salary}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-primary mr-2" />
                <div>
                  <span className="font-medium">Work Environment:</span>
                  <p className="text-sm text-muted-foreground">{career.workEnvironment}</p>
                </div>
              </div>
              <div>
                <span className="font-medium flex items-center">
                  <Wrench className="h-5 w-5 text-primary mr-2" />
                  Top Skills:
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {career.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-primary/10">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="college" className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="college" className="flex items-center">
            <School className="mr-2 h-4 w-4" /> College/University
          </TabsTrigger>
          <TabsTrigger value="trade" className="flex items-center">
            <Wrench className="mr-2 h-4 w-4" /> Trade/Vocational
          </TabsTrigger>
          <TabsTrigger value="self" className="flex items-center">
            <Book className="mr-2 h-4 w-4" /> Self-Study
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="college" className="space-y-4">
          <h2 className="text-xl font-semibold text-primary mb-4">College & University Pathways</h2>
          
          <div className="space-y-6">
            {educationPaths.college.degrees.map((degree: any, index: number) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{degree.name}</CardTitle>
                  <CardDescription className="flex flex-wrap gap-4 mt-1">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> {degree.duration}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" /> {degree.cost}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-1">Recommended Institutions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {degree.institutions.map((institution: string, idx: number) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {institution}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Key Subjects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {degree.subjects.map((subject: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-primary/5">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" /> Recommended Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {educationPaths.college.certifications.map((cert: string, index: number) => (
                  <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trade" className="space-y-4">
          <h2 className="text-xl font-semibold text-primary mb-4">Trade & Vocational Training</h2>
          
          <div className="space-y-6">
            {educationPaths.trade.programs.map((program: any, index: number) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription className="flex flex-wrap gap-4 mt-1">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> {program.duration}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" /> {program.cost}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-1">Training Providers:</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.institutions.map((institution: string, idx: number) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {institution}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Skills Development:</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.skills.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-primary/5">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" /> Industry Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {educationPaths.trade.certifications.map((cert: string, index: number) => (
                  <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="self" className="space-y-4">
          <h2 className="text-xl font-semibold text-primary mb-4">Self-Study Options</h2>
          
          <div className="space-y-6">
            {educationPaths.selfStudy.resources.map((resource: any, index: number) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{resource.name}</CardTitle>
                  {resource.cost && (
                    <CardDescription className="flex flex-wrap gap-4 mt-1">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" /> {resource.cost}
                      </span>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-1">Learning Platforms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {resource.platforms.map((platform: string, idx: number) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Topics to Focus On:</h4>
                      <div className="flex flex-wrap gap-2">
                        {resource.subjects.map((subject: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-primary/5">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Award className="mr-2 h-5 w-5 text-primary" /> 
                  Portfolio Development Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">
                  For this career path, building a strong portfolio of work is crucial for self-taught professionals. Here are some tips:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Start with personal projects that showcase your skills</li>
                  <li>Contribute to open-source projects or community initiatives</li>
                  <li>Document your learning journey and show your growth</li>
                  <li>Create case studies of your problem-solving process</li>
                  <li>Seek feedback from professionals in the field</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationRequirements;