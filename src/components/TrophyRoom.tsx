import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Lock, CheckCircle2, Coins, Gift, Sparkles } from 'lucide-react';
import { useAchievements } from '../context/AchievementsContext';

export const TrophyRoom: React.FC = () => {
  const { achievements, totalCoins } = useAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.5rem] border-4 border-yellow-300 p-8 shadow-xl shadow-yellow-100 relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Achievements List */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-3 rounded-2xl border-2 border-yellow-200">
              <Trophy className="text-yellow-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Quest Master</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Your Epic Achievements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-2xl border-4 transition-all flex items-center gap-4 ${
                  achievement.unlocked
                    ? 'bg-yellow-50 border-yellow-200 shadow-md'
                    : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                }`}
              >
                <div className={`text-3xl p-2 rounded-xl ${achievement.unlocked ? 'bg-white' : 'bg-slate-200'}`}>
                  {achievement.unlocked ? achievement.emoji : <Lock size={24} className="text-slate-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-black uppercase tracking-tight leading-none ${achievement.unlocked ? 'text-yellow-700' : 'text-slate-500'}`}>
                      {achievement.title}
                    </h4>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200">
                      <Coins size={10} className="text-yellow-600" />
                      <span className="text-[10px] font-black text-yellow-700">+{achievement.reward}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <CheckCircle2 className="text-green-500" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coins Box / Quest Rewards */}
        <div className="lg:w-64 flex flex-col gap-4">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
              <Gift size={80} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Coins size={20} className="text-yellow-200" />
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-100">Quest Rewards</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter">{totalCoins}</span>
                <span className="text-sm font-bold uppercase opacity-80">Coins</span>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                  <span>Quest Progress</span>
                  <span>{unlockedCount}/{achievements.length}</span>
                </div>
                <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  />
                </div>
              </div>
            </div>

            {/* Sparkle effects */}
            <div className="absolute top-2 left-2 animate-pulse">
              <Sparkles size={16} className="text-yellow-200" />
            </div>
            <div className="absolute bottom-4 right-4 animate-bounce">
              <Sparkles size={20} className="text-yellow-100" />
            </div>
          </div>

          <div className="bg-sky-50 rounded-3xl p-6 border-2 border-sky-100">
            <h5 className="text-xs font-black text-sky-800 uppercase tracking-widest mb-2">Next Reward</h5>
            <p className="text-[10px] font-bold text-sky-600 leading-relaxed">
              Complete more quests to fill your coin box! Each achievement gives you <span className="text-sky-800 font-black">EXTRA COINS</span>.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
