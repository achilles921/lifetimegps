import { useUser } from "@/context/UserContext";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  // Calculate percentage
  const percentage = Math.round((current / total) * 100);
  
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        {label && (
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        )}
        <span className="text-sm font-medium text-primary">{percentage}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-3 progress-animated">
        <div 
          className="progress-bar h-3 rounded-full transition-all duration-700" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </header>
  );
}

export function QuizProgressBar() {
  const { currentSector } = useUser();
  
  const percentage = currentSector * 20;
  const sectorLabels = {
    1: "Work Style",
    2: "Cognitive Strengths",
    3: "Social Approach",
    4: "Motivation",
    5: "Interests"
  };
  
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-sm font-medium text-foreground">
            {sectorLabels[currentSector as keyof typeof sectorLabels]}
          </span>
          <span className="ml-2 badge-gradient">
            {currentSector}/5
          </span>
        </div>
        <span className="text-sm font-medium text-primary">{percentage}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-3 progress-animated">
        <div 
          className="progress-bar h-3 rounded-full transition-all duration-700" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </header>
  );
}
