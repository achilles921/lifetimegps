import React from 'react';

// Different avatar emojis
const avatarEmojis = [
  '👨‍🎨', // Artist
  '👩‍💼', // Business woman
  '👨‍💼', // Business man
  '👩‍🔬', // Scientist woman
  '👨‍🔬', // Scientist man
  '👩‍🏫', // Teacher woman
  '👨‍🏫', // Teacher man
  '👩‍⚕️', // Healthcare woman
  '👨‍⚕️', // Healthcare man
  '👩‍🔧', // Mechanic woman
  '👨‍🔧', // Mechanic man
  '👩‍🚀', // Astronaut woman
  '👨‍🚀', // Astronaut man
  '👩‍🌾', // Farmer woman
  '👨‍🌾', // Farmer man
  '👩‍🍳', // Chef woman
  '👨‍🍳', // Chef man
  '👩‍🎤', // Singer woman
  '👨‍🎤', // Singer man
  '🧑‍💻', // Developer
];

// Role-specific emojis for better representation
const roleToEmoji: Record<string, number> = {
  // Education roles
  'Teacher': 5, // Teacher woman
  'Student & Teacher': 5, // Teacher woman
  'Parent & Teacher': 6, // Teacher man
  'High School Teacher': 6, // Teacher man
  
  // Student roles
  'Student': 11, // Astronaut woman (representing exploration)
  'High School Student': 11, // Astronaut woman
  'College Student': 12, // Astronaut man
  
  // Parent roles
  'Parent': 0, // Artist (representing creativity in parenting)
  'Parent of Teen': 0, // Artist
  'Working Parent': 14, // Farmer man
  'Stay-at-home Parent': 13, // Farmer woman
  
  // Professional roles
  'Business Professional': 2, // Business man
  'Employer': 1, // Business woman
  'Client': 2, // Business man
  'Healthcare Professional': 7, // Healthcare woman
  'Doctor': 8, // Healthcare man
  'Engineer': 10, // Mechanic man
  'Scientist': 4, // Scientist man
  'Chef': 16, // Chef man
  'Developer': 19, // Developer
};

type AvatarEmojiProps = {
  index?: number; // Optional index for deterministic selection
  size?: 'sm' | 'md' | 'lg'; // Size variants
  className?: string; // Additional classes
  role?: string; // Optional role for role-specific avatars
};

const AvatarEmoji: React.FC<AvatarEmojiProps> = ({ 
  index, 
  size = 'md',
  className = '',
  role
}) => {
  // First check if we have a role-specific emoji
  let emojiIndex = index;
  
  if (role && roleToEmoji[role] !== undefined) {
    // Use role-specific emoji
    emojiIndex = roleToEmoji[role];
  } else if (index === undefined) {
    // No index and no role match, so random
    emojiIndex = Math.floor(Math.random() * avatarEmojis.length);
  }
  
  // Select the emoji
  const emoji = avatarEmojis[emojiIndex! % avatarEmojis.length];
  
  // Size classes
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };
  
  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 ${sizeClasses[size]} ${className}`}
    >
      <span role="img" aria-label="Avatar emoji">
        {emoji}
      </span>
    </div>
  );
};

export default AvatarEmoji;