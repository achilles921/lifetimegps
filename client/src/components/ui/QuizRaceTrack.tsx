import { useState, useEffect } from 'react';
import { FiMapPin, FiFlag, FiAward } from 'react-icons/fi';
import { 
  BsStars,
  BsCarFrontFill,
  BsTrophyFill,
  BsFlagFill
} from 'react-icons/bs';
import finishLineImage from '@assets/Finish Line.png';
import startImage from '@assets/Start.png';
import milestonesImage from '@assets/GPS MILESTONES.png';

interface QuizRaceTrackProps {
  currentSector: number;
  currentQuestion: number;
  totalQuestions: number;
  sectorQuestions: any[];
}

export function QuizRaceTrack({ 
  currentSector, 
  currentQuestion, 
  totalQuestions, 
  sectorQuestions 
}: QuizRaceTrackProps) {
  const [progress, setProgress] = useState<number>(0);
  const [totalQuestionsDone, setTotalQuestionsDone] = useState<number>(0);
  
  useEffect(() => {
    // Calculate total questions done so far
    let questionsDone = 0;
    
    // Add completed sectors
    for (let i = 1; i < currentSector; i++) {
      // For each previous sector, get the number of questions
      const sectorQuestionsCount = sectorQuestions.filter(q => q.sector === i).length;
      questionsDone += sectorQuestionsCount;
    }
    
    // Add current sector progress
    questionsDone += currentQuestion;
    
    setTotalQuestionsDone(questionsDone);
    setProgress((questionsDone / totalQuestions) * 100);
  }, [currentSector, currentQuestion, sectorQuestions, totalQuestions]);
  
  // Define the milestones (specific percentages)
  const milestones = [
    { percent: 0, label: "Start", icon: <BsFlagFill className="text-green-600" /> },
    { percent: 25, label: "Work Style", icon: <BsStars className="text-blue-600" /> },
    { percent: 50, label: "Cognitive", icon: <BsStars className="text-purple-600" /> },
    { percent: 75, label: "Social", icon: <BsStars className="text-green-600" /> },
    { percent: 100, label: "Finish", icon: <BsTrophyFill className="text-amber-600" /> }
  ];
  
  // Find milestones that apply to the current progress
  const reachedMilestones = milestones.filter(m => progress >= m.percent);
  const nextMilestone = milestones.find(m => m.percent > progress);
  
  // Calculate the position of the car
  const carPosition = `${Math.min(Math.max(progress, 0), 100)}%`;
  
  return (
    <div className="mb-4 animate-fadeIn">
      {/* Race track */}
      <div className="relative h-12 mx-4">
        {/* Background track */}
        <div className="absolute inset-0 h-2 bg-gray-200 rounded-full top-5"></div>
        
        {/* Progress track */}
        <div 
          className="absolute h-2 bg-gradient-to-r from-primary to-secondary rounded-full top-5 transition-all duration-500 ease-out"
          style={{ width: carPosition }}
        ></div>
        
        {/* Milestones */}
        {milestones.map((milestone, index) => (
          <div 
            key={index}
            className={`absolute transform -translate-x-1/2 flex flex-col items-center transition-all duration-300 ${
              progress >= milestone.percent ? 'opacity-100' : 'opacity-40'
            }`}
            style={{ left: `${milestone.percent}%`, top: 0 }}
          >
            <div className={`w-4 h-4 rounded-full z-10 flex items-center justify-center ${
              progress >= milestone.percent 
                ? 'bg-primary text-white' 
                : 'bg-gray-300'
            }`}>
              {index === 0 && <span className="text-[8px]">S</span>}
              {index === milestones.length - 1 && <span className="text-[8px]">F</span>}
              {index !== 0 && index !== milestones.length - 1 && <span className="text-[8px]">{index}</span>}
            </div>
            <span className="text-xs font-medium mt-6 text-gray-600">{milestone.label}</span>
          </div>
        ))}
        
        {/* Car */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500 ease-out animate-bounce-subtle"
          style={{ left: carPosition, top: '25%' }}
        >
          <BsCarFrontFill className="text-primary w-6 h-6" />
        </div>
        
        {/* Progress text */}
        <div className="absolute top-8 right-0 text-xs text-gray-500">
          {totalQuestionsDone} / {totalQuestions} questions
        </div>
      </div>
    </div>
  );
}