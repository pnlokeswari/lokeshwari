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
  }, [totalGems]);

  const addGems = (amount: number) => {
    setTotalGems(prev => {
      const next = prev + amount;
      if (next >= 100) unlockAchievement('gem-collector');
      if (next >= 500) unlockAchievement('gem-hoarder');
      return next;
    });
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
