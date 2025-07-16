import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface PerformanceContextType {
  // Device capabilities
  isLowPowerMode: boolean;
  
  // Voice settings
  enableVoice: boolean;
  voiceQuality: 'low' | 'medium' | 'high';
  
  // Functions
  setEnableVoice: (enable: boolean) => void;
  setVoiceQuality: (quality: 'low' | 'medium' | 'high') => void;
}

const defaultContext: PerformanceContextType = {
  // Default to NOT low power mode
  isLowPowerMode: false,
  
  // Voice enabled by default with medium quality
  enableVoice: true,
  voiceQuality: 'medium',
  
  // Default no-op functions to be replaced with actual implementations
  setEnableVoice: () => {},
  setVoiceQuality: () => {},
};

// Create the context
const PerformanceContext = createContext<PerformanceContextType>(defaultContext);

// Provider component
interface PerformanceProviderProps {
  children: ReactNode;
  initialSettings?: Partial<PerformanceContextType>;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  initialSettings,
}) => {
  // State
  const [isLowPowerMode, setIsLowPowerMode] = useState<boolean>(
    initialSettings?.isLowPowerMode ?? defaultContext.isLowPowerMode
  );
  const [enableVoice, setEnableVoice] = useState<boolean>(
    initialSettings?.enableVoice ?? defaultContext.enableVoice
  );
  const [voiceQuality, setVoiceQuality] = useState<'low' | 'medium' | 'high'>(
    initialSettings?.voiceQuality ?? defaultContext.voiceQuality
  );

  // Detect device capabilities on mount
  useEffect(() => {
    detectDeviceCapabilities();
  }, []);

  // Automatic detection of device capabilities
  const detectDeviceCapabilities = () => {
    // Check for battery API and low power mode
    if ('navigator' in window && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        // If battery level is below 20%, suggest low power mode
        if (battery.level < 0.2 && !battery.charging) {
          setIsLowPowerMode(true);
        }
      }).catch(() => {
        // Battery API not available
      });
    }

    // Check for slow connection - reduce quality automatically
    if ('connection' in navigator && (navigator as any).connection) {
      const connection = (navigator as any).connection;
      
      // On slow connections, reduce voice quality
      if (connection.downlink < 1 || connection.rtt > 500 || connection.effectiveType === '2g') {
        setVoiceQuality('low');
      }
      
      // Handle connection change events
      connection.addEventListener('change', () => {
        if (connection.downlink < 1 || connection.rtt > 500 || connection.effectiveType === '2g') {
          setVoiceQuality('low');
        } else if (connection.downlink > 5 && connection.rtt < 100) {
          setVoiceQuality('high');
        } else {
          setVoiceQuality('medium');
        }
      });
    }
  };

  // Context value
  const value: PerformanceContextType = {
    isLowPowerMode,
    enableVoice,
    voiceQuality,
    setEnableVoice,
    setVoiceQuality,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Hook to use the context
export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  
  return context;
};