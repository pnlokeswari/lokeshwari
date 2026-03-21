import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAchievements } from './AchievementsContext';

interface GemsContextType {
  totalGems: number;
  addGems: (amount: number) => void;
}

const GemsContext = createContext<GemsContextType | undefined>(undefined);

export const GemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { unlockAchievement } = useAchievements();
  const [totalGems, setTotalGems] = useState(() => {
    const saved = localStorage.getItem('total-gems');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('total-gems', totalGems.toString());
    
    // Check for achievements
    if (totalGems >= 100) unlockAchievement('gem-collector');
    if (totalGems >= 500) unlockAchievement('gem-hoarder');
  }, [totalGems, unlockAchievement]);

  const addGems = (amount: number) => {
    setTotalGems(prev => prev + amount);
  };

  return (
    <GemsContext.Provider value={{ totalGems, addGems }}>
      {children}
    </GemsContext.Provider>
  );
};

export const useGems = () => {
  const context = useContext(GemsContext);
  if (context === undefined) {
    throw new Error('useGems must be used within a GemsProvider');
  }
  return context;
};
