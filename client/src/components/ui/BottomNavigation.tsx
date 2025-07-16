import { useUser } from "@/context/UserContext";

interface BottomNavigationProps {
  active: 'results' | 'explore' | 'roadmap' | 'profile';
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({ active, onNavigate }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-10">
      <div className="flex justify-around">
        <a 
          href="#results" 
          className={`flex flex-col items-center ${active === 'results' ? 'text-primary-600' : 'text-gray-400'}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate('results');
          }}
        >
          <i className="fas fa-chart-bar"></i>
          <span className="text-xs mt-1">Results</span>
        </a>
        <a 
          href="#explore" 
          className={`flex flex-col items-center ${active === 'explore' ? 'text-primary-600' : 'text-gray-400'}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate('explore');
          }}
        >
          <i className="fas fa-compass"></i>
          <span className="text-xs mt-1">Explore</span>
        </a>
        <a 
          href="#roadmap" 
          className={`flex flex-col items-center ${active === 'roadmap' ? 'text-primary-600' : 'text-gray-400'}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate('roadmap');
          }}
        >
          <i className="fas fa-map-marked-alt"></i>
          <span className="text-xs mt-1">Roadmap</span>
        </a>
        <a 
          href="#profile" 
          className={`flex flex-col items-center ${active === 'profile' ? 'text-primary-600' : 'text-gray-400'}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate('profile');
          }}
        >
          <i className="fas fa-user"></i>
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </nav>
  );
}
