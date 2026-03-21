import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  claimed: boolean;
  reward: number;
  gameId?: string; // Optional: specific to a game
}

interface AchievementsContextType {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  claimAchievement: (id: string) => void;
  newAchievement: Achievement | null;
  clearNewAchievement: () => void;
  totalCoins: number;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Global
  { id: 'gem-collector', title: 'Gem Collector', description: 'Collect 100 Gems', emoji: '💎', unlocked: false, claimed: false, reward: 50 },
  { id: 'gem-hoarder', title: 'Gem Hoarder', description: 'Collect 500 Gems', emoji: '💰', unlocked: false, claimed: false, reward: 100 },
  
  // GK Quiz
  { id: 'quiz-whiz', title: 'Quiz Whiz', description: 'Finish 10 Quiz rounds', emoji: '🎓', unlocked: false, claimed: false, reward: 50, gameId: 'gk-quiz' },
  { id: 'perfect-score', title: 'Perfect Score', description: 'Reach 100 points in Quiz', emoji: '💯', unlocked: false, claimed: false, reward: 50, gameId: 'gk-quiz' },
  
  // Math Puzzle
  { id: 'math-genius', title: 'Math Genius', description: 'Get a streak of 10 in Math', emoji: '🧠', unlocked: false, claimed: false, reward: 50, gameId: 'math-puzzle' },
  { id: 'speed-math', title: 'Speed Math', description: 'Reach 200 points in Math', emoji: '⚡', unlocked: false, claimed: false, reward: 50, gameId: 'math-puzzle' },
  
  // Number Match
  { id: 'match-master', title: 'Match Master', description: 'Finish 10 Number Match rounds', emoji: '🧩', unlocked: false, claimed: false, reward: 50, gameId: 'number-match' },
  
  // Opposites Game
  { id: 'opposite-expert', title: 'Opposite Expert', description: 'Finish 10 Opposites rounds', emoji: '↔️', unlocked: false, claimed: false, reward: 50, gameId: 'opposites-game' },
  
  // Missing Numbers
  { id: 'island-explorer', title: 'Island Explorer', description: 'Reach Level 5 in Number Path', emoji: '🏝️', unlocked: false, claimed: false, reward: 50, gameId: 'missing-numbers' },
  
  // Food Group Game
  { id: 'nutritionist', title: 'Nutritionist', description: 'Finish 10 Food Group rounds', emoji: '🍎', unlocked: false, claimed: false, reward: 50, gameId: 'food-group-game' },
];

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge saved with initial to handle new achievements added in code
      return INITIAL_ACHIEVEMENTS.map(initial => {
        const found = parsed.find((p: Achievement) => p.id === initial.id);
        return found ? { ...initial, unlocked: found.unlocked, claimed: found.claimed ?? false } : initial;
      });
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [totalCoins, setTotalCoins] = useState(() => {
    const saved = localStorage.getItem('total-coins');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('total-coins', totalCoins.toString());
  }, [achievements, totalCoins]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const index = prev.findIndex(a => a.id === id);
      if (index !== -1 && !prev[index].unlocked) {
        const updated = [...prev];
        updated[index] = { ...updated[index], unlocked: true };
        
        // Use setTimeout to defer side effects and avoid "update while rendering" warnings
        setTimeout(() => {
          setNewAchievement(updated[index]);
          
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF4500']
          });
        }, 0);

        return updated;
      }
      return prev;
    });
  };

  const claimAchievement = (id: string) => {
    setAchievements(prev => {
      const index = prev.findIndex(a => a.id === id);
      if (index !== -1 && prev[index].unlocked && !prev[index].claimed) {
        const updated = [...prev];
        updated[index] = { ...updated[index], claimed: true };
        
        // Reward coins
        setTotalCoins(c => c + updated[index].reward);

        // Extra celebration for claiming
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#FFD700', '#FFFFFF']
        });

        return updated;
      }
      return prev;
    });
  };

  const clearNewAchievement = () => setNewAchievement(null);

  return (
    <AchievementsContext.Provider value={{ achievements, unlockAchievement, claimAchievement, newAchievement, clearNewAchievement, totalCoins }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};
