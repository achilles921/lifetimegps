import React from 'react';
import MiniGameLayout from '@/components/mini-games/MiniGameLayout';
import ColorDashGame from '@/components/mini-games/ColorDash/ColorDashGame';
import { BrainCog } from 'lucide-react';

const ColorDashPage: React.FC = () => {
  return (
    <MiniGameLayout
      title="Color Dash"
      description="Test your visual perception and reaction time by matching colors and patterns."
      icon={<BrainCog className="w-8 h-8 text-white" />}
      themeColor="bg-gradient-to-r from-purple-600 to-indigo-700"
      showExitConfirmation={true}
    >
      <ColorDashGame />
    </MiniGameLayout>
  );
};

export default ColorDashPage;