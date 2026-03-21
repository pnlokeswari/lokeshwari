import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Sparkles, Coins } from 'lucide-react';
import { useAchievements } from '../context/AchievementsContext';

export const AchievementNotification: React.FC = () => {
  const { newAchievement, clearNewAchievement, claimAchievement } = useAchievements();

  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => {
        clearNewAchievement();
      }, 10000); // Changed to 10 seconds
      return () => clearTimeout(timer);
    }
  }, [newAchievement, clearNewAchievement]);

  return (
    <AnimatePresence>
      {newAchievement && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.5 }}
          animate={{ y: 20, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.5 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
        >
          <div className="bg-white rounded-[2rem] border-4 border-yellow-400 p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center gap-4">
              {/* Background Sparkles */}
              <div className="absolute -top-2 -left-2 text-yellow-200 opacity-50">
                <Sparkles size={48} fill="currentColor" />
              </div>
              
              <div className="bg-yellow-100 p-4 rounded-2xl border-2 border-yellow-200 relative z-10">
                <span className="text-4xl">{newAchievement.emoji}</span>
              </div>
              
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="text-yellow-600" size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600">Achievement Unlocked!</span>
                </div>
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
                  {newAchievement.title}
                </h4>
                <p className="text-slate-500 font-bold text-xs mt-1">
                  {newAchievement.description}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                claimAchievement(newAchievement.id);
                clearNewAchievement();
              }}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-colors relative z-10"
            >
              <Coins size={20} />
              COLLECT {newAchievement.reward} COINS!
            </motion.button>
            
            <div className="absolute -bottom-2 -right-2 text-yellow-200 opacity-50 rotate-12">
              <Star size={48} fill="currentColor" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
