import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, Briefcase, GraduationCap, Trophy, Award, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useActivity } from '@/context/ActivityContext';
// Using inline SVG components instead of external image files

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  type: 'education' | 'experience' | 'certification' | 'milestone';
  timeframe: string;
  icon: React.ReactNode;
}

interface CareerRoadmapProps {
  careerId: string;
  careerTitle: string;
}

const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ careerId, careerTitle }) => {
  const { toast } = useToast();
  const { trackEvent } = useActivity();
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // When a node is clicked, track the event and show more info
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      trackEvent('button_click', {
        buttonId: `roadmap_node_${nodeId}`,
        buttonText: node.title,
        context: 'career_roadmap',
        nodeType: node.type,
        careerId,
        careerTitle
      });
    }
  };
  
  useEffect(() => {
    // Track viewing of the roadmap
    trackEvent('career_roadmap_view', {
      careerId,
      careerTitle
    });
    
    // Generate a roadmap based on the career
    // In a real app, this would fetch from an API
    const generateRoadmap = () => {
      setIsLoading(true);
      
      // Example roadmap nodes based on career title
      // This would normally come from an API or be more dynamic
      const defaultNodes: RoadmapNode[] = [
        {
          id: 'education_1',
          title: 'Complete High School',
          description: 'Finish high school with a focus on relevant subjects',
          type: 'education',
          timeframe: 'Start',
          icon: <GraduationCap className="h-5 w-5 text-duo-blue-500" />
        },
        {
          id: 'education_2',
          title: `Pursue relevant ${careerTitle.includes('Developer') ? 'Computer Science' : 'Bachelor\'s'} Degree`,
          description: `Obtain a degree in ${careerTitle.includes('Developer') ? 'Computer Science, Software Engineering, or related field' : 'a relevant field for ' + careerTitle}`,
          type: 'education',
          timeframe: '4 years',
          icon: <GraduationCap className="h-5 w-5 text-duo-blue-500" />
        },
        {
          id: 'certification_1',
          title: 'Earn Professional Certification',
          description: `Obtain industry-recognized certification for ${careerTitle}`,
          type: 'certification',
          timeframe: '6 months',
          icon: <Award className="h-5 w-5 text-duo-purple-500" />
        },
        {
          id: 'experience_1',
          title: 'Entry Level Position',
          description: `Start as a Junior ${careerTitle} or in a related entry-level role`,
          type: 'experience',
          timeframe: '1-2 years',
          icon: <Briefcase className="h-5 w-5 text-duo-green-500" />
        },
        {
          id: 'milestone_1',
          title: 'Complete First Major Project',
          description: 'Successfully complete your first significant professional project',
          type: 'milestone',
          timeframe: 'Milestone',
          icon: <Trophy className="h-5 w-5 text-duo-orange-500" />
        },
        {
          id: 'experience_2',
          title: 'Mid-Level Role',
          description: `Advance to a mid-level ${careerTitle} position with more responsibilities`,
          type: 'experience',
          timeframe: '2-3 years',
          icon: <Briefcase className="h-5 w-5 text-duo-green-500" />
        },
        {
          id: 'certification_2',
          title: 'Advanced Specialization',
          description: 'Gain expertise in a specialized area through additional training',
          type: 'certification',
          timeframe: '1 year',
          icon: <Award className="h-5 w-5 text-duo-purple-500" />
        },
        {
          id: 'experience_3',
          title: 'Senior Role',
          description: `Become a Senior ${careerTitle} with leadership responsibilities`,
          type: 'experience',
          timeframe: '3-5 years',
          icon: <Briefcase className="h-5 w-5 text-duo-green-500" />
        },
        {
          id: 'milestone_2',
          title: 'Career Achievement',
          description: 'Reach a significant career milestone like leading a team or innovative project',
          type: 'milestone',
          timeframe: 'Ongoing',
          icon: <Star className="h-5 w-5 text-duo-orange-500" />
        }
      ];
      
      // Customize based on some career types (this would be more comprehensive in a real app)
      let customizedNodes = [...defaultNodes];
      
      if (careerTitle.toLowerCase().includes('developer') || careerTitle.toLowerCase().includes('engineer')) {
        // Add some tech-specific nodes
        customizedNodes.splice(2, 0, {
          id: 'education_specialized',
          title: 'Learn Coding Languages',
          description: 'Master programming languages and frameworks relevant to your specialty',
          type: 'education',
          timeframe: '1-2 years',
          icon: <GraduationCap className="h-5 w-5 text-duo-blue-500" />
        });
      } else if (careerTitle.toLowerCase().includes('designer')) {
        // Add some design-specific nodes
        customizedNodes.splice(2, 0, {
          id: 'education_specialized',
          title: 'Build Portfolio',
          description: 'Create a strong portfolio showcasing your design skills and creativity',
          type: 'education',
          timeframe: '1-2 years',
          icon: <GraduationCap className="h-5 w-5 text-duo-blue-500" />
        });
      } else if (careerTitle.toLowerCase().includes('manager') || careerTitle.toLowerCase().includes('director')) {
        // Add some management-specific nodes
        customizedNodes.splice(5, 0, {
          id: 'certification_management',
          title: 'Leadership Training',
          description: 'Complete management and leadership development programs',
          type: 'certification',
          timeframe: '1 year',
          icon: <Award className="h-5 w-5 text-duo-purple-500" />
        });
      }
      
      setTimeout(() => {
        setNodes(customizedNodes);
        setIsLoading(false);
      }, 500);
    };
    
    generateRoadmap();
  }, [careerId, careerTitle, trackEvent]);
  
  // Return loading state while generating roadmap
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin h-10 w-10 border-4 border-duo-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full relative">
      {/* Background with stylized pattern */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-duo-green-100 to-duo-blue-100 rounded-lg"></div>
      </div>
      
      {/* Start and finish visuals */}
      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center justify-center h-12 w-12 bg-duo-green-600 rounded-full text-white font-bold">
          START
        </div>
        <div className="flex-1 mx-4 h-2 bg-gradient-to-r from-duo-green-300 to-duo-blue-300 rounded-full"></div>
        <div className="flex items-center justify-center h-12 w-12 bg-duo-blue-600 rounded-full text-white font-bold">
          GOAL
        </div>
      </div>
      
      {/* Roadmap nodes */}
      <div className="relative grid grid-cols-1 gap-4 max-h-[320px] overflow-y-auto pr-4">
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-3 rounded-lg cursor-pointer transition-all
              ${selectedNode === node.id ? 'bg-white shadow-md border-l-4 border-duo-purple-500' : 'bg-white/80 hover:bg-white hover:shadow-sm border-l-4 border-gray-200'}
            `}
            onClick={() => handleNodeClick(node.id)}
          >
            <div className="flex items-start">
              <div className={`
                rounded-full p-2 mr-3
                ${node.type === 'education' ? 'bg-duo-blue-100' : 
                  node.type === 'experience' ? 'bg-duo-green-100' : 
                  node.type === 'certification' ? 'bg-duo-purple-100' : 'bg-duo-orange-100'}
              `}>
                {node.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`font-medium ${selectedNode === node.id ? 'text-duo-purple-700' : 'text-gray-800'}`}>
                    {node.title}
                  </h4>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {node.timeframe}
                  </span>
                </div>
                
                {selectedNode === node.id && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-sm text-gray-600 mt-2"
                  >
                    {node.description}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CareerRoadmap;