import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Gem, Compass, Trophy, RefreshCw, CheckCircle2, XCircle, Search, Sparkles } from 'lucide-react';
import { useGems } from '../context/GemsContext';
import { useAchievements } from '../context/AchievementsContext';

interface GameState {
  sequence: (number | null)[];
  missingIndices: number[];
  options: number[];
  correctAnswers: Record<number, number>;
}

const CELEBRATION_EMOJIS = ['😊', '😄', '⭐', '✨', '❤️', '🎉', '👍', '🚀', '🐶', '🦄', '🌈'];

export const MissingNumbers: React.FC = () => {
  const { totalGems, addGems } = useGems();
  const { unlockAchievement } = useAchievements();
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('missing-numbers-level');
    return saved ? parseInt(saved) : 1;
  });
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeGapIdx, setActiveGapIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ idx: number; type: 'correct' | 'wrong'; emoji?: string } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [matchFeedback, setMatchFeedback] = useState<string | null>(null);

  const generateGame = (currentLevel: number) => {
    const sequenceLength = 5;
    const maxNum = currentLevel * 15 + 5;
    const start = Math.floor(Math.random() * (maxNum - sequenceLength)) + 1;
    
    const fullSequence = Array.from({ length: sequenceLength }, (_, i) => start + i);
    const missingCount = Math.min(currentLevel, 2); // Keep it simple: 1 or 2 missing
    const missingIndices: number[] = [];
    
    while (missingIndices.length < missingCount) {
      const idx = Math.floor(Math.random() * sequenceLength);
      if (!missingIndices.includes(idx)) {
        missingIndices.push(idx);
      }
    }

    const sequence = fullSequence.map((num, idx) => missingIndices.includes(idx) ? null : num);
    const correctAnswers: Record<number, number> = {};
    missingIndices.forEach(idx => {
      correctAnswers[idx] = fullSequence[idx];
    });

    const optionsSet = new Set(Object.values(correctAnswers));
    while (optionsSet.size < 6) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const randomOption = Math.max(1, fullSequence[0] + offset + Math.floor(Math.random() * sequenceLength));
      optionsSet.add(randomOption);
    }
    const options = Array.from(optionsSet).sort((a, b) => a - b);

    setGameState({ sequence, missingIndices, options, correctAnswers });
    setSelectedAnswers({});
    setActiveGapIdx(missingIndices[0]); // Auto-select first gap
    setFeedback(null);
    setIsComplete(false);
  };

  useEffect(() => {
    generateGame(level);
  }, [level]);

  const handleGapClick = (idx: number) => {
    if (isComplete) return;
    setActiveGapIdx(idx);
  };

  const handleOptionClick = (option: number) => {
    if (activeGapIdx === null || isComplete || !gameState) return;

    const isCorrect = option === gameState.correctAnswers[activeGapIdx];
    
    if (isCorrect) {
      const newAnswers = { ...selectedAnswers, [activeGapIdx]: option };
      setSelectedAnswers(newAnswers);
      const emoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
      setFeedback({ idx: activeGapIdx, type: 'correct', emoji });
      setScore(s => s + 20);
      addGems(4);
      setMatchFeedback(emoji);
      setTimeout(() => setMatchFeedback(null), 1000);

      // Find next empty gap
      const nextGap = gameState.missingIndices.find(idx => !newAnswers[idx]);
      if (nextGap !== undefined) {
        setTimeout(() => {
          setActiveGapIdx(nextGap);
          setFeedback(null);
        }, 600);
      } else {
        setIsComplete(true);
        if (level >= 5) {
          unlockAchievement('island-explorer');
        }
        setTimeout(() => {
          setLevel(l => {
            const next = l + 1;
            localStorage.setItem('missing-numbers-level', next.toString());
            return next;
          });
        }, 2000);
      }
    } else {
      setFeedback({ idx: activeGapIdx, type: 'wrong', emoji: '🚀' });
      setScore(s => s - 5);
      addGems(-1);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-amber-50 rounded-[3rem] border-8 border-amber-200 p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Total Gems Box */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-2xl border-2 border-yellow-200 shadow-sm z-20">
        <Gem className="text-yellow-600" size={18} />
        <span className="font-black text-yellow-800 text-sm">{totalGems}</span>
      </div>

      {/* Thematic Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-amber-200/50" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-amber-200/50" />

      <div className="relative z-10">
        {/* Header Stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">Adventure Score</span>
            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border-2 border-amber-200 shadow-sm">
              <Trophy className="text-amber-500" size={16} />
              <span className="font-black text-amber-900 text-lg">{score}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Current Island</span>
            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border-2 border-blue-200 shadow-sm">
              <Compass className="text-blue-500" size={16} />
              <span className="font-black text-blue-900 text-lg">{level}</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-amber-800 uppercase tracking-tighter leading-none mb-2">
            Number Path 🗺️
          </h2>
          <p className="text-amber-600/70 font-bold text-xs uppercase tracking-widest">
            Fill the holes to find the treasure!
          </p>
        </div>

        {gameState && (
          <div className="space-y-12">
            {/* The Path (Number Line) */}
            <div className="flex justify-center items-center gap-3">
              {gameState.sequence.map((num, idx) => {
                const isGap = gameState.missingIndices.includes(idx);
                const isSelected = activeGapIdx === idx;
                const isCorrect = selectedAnswers[idx] !== undefined;
                const isWrong = feedback?.idx === idx && feedback.type === 'wrong';

                return (
                  <div key={idx} className="relative group">
                    {isGap ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGapClick(idx)}
                        animate={isSelected && !isCorrect ? { 
                          boxShadow: ["0 0 0px #fbbf24", "0 0 20px #fbbf24", "0 0 0px #fbbf24"],
                          scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl font-black transition-all relative ${
                          isCorrect 
                            ? 'bg-green-500 border-green-600 text-white shadow-lg' 
                            : isSelected
                            ? 'bg-white border-amber-500 text-amber-500 shadow-xl z-20'
                            : isWrong
                            ? 'bg-red-50 border-red-400 text-red-500 animate-shake'
                            : 'bg-amber-100/50 border-amber-200 text-amber-300 border-dashed'
                        }`}
                      >
                        {isCorrect ? selectedAnswers[idx] : isSelected ? '?' : ''}
                        
                        {/* Status Icons */}
                        {isCorrect && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md"
                          >
                            <CheckCircle2 className="text-green-500" size={16} />
                          </motion.div>
                        )}
                      </motion.button>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white border-4 border-amber-100 flex items-center justify-center text-2xl font-black text-amber-900/40 shadow-inner">
                        {num}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* The Treasure Chest (Options) */}
            <div className="bg-amber-100/50 rounded-[2rem] p-6 border-4 border-amber-200">
              <div className="text-center mb-4">
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Choose a stone</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {gameState.options.map((option) => {
                  const isUsed = Object.values(selectedAnswers).includes(option);
                  return (
                    <motion.button
                      key={option}
                      whileHover={!isUsed ? { scale: 1.1, y: -5 } : {}}
                      whileTap={!isUsed ? { scale: 0.9 } : {}}
                      disabled={isUsed}
                      onClick={() => handleOptionClick(option)}
                      className={`h-16 rounded-2xl text-2xl font-black transition-all shadow-lg ${
                        isUsed
                          ? 'bg-amber-200 text-amber-400 cursor-not-allowed opacity-50'
                          : 'bg-white border-4 border-white text-amber-800 hover:border-amber-400 active:shadow-inner'
                      }`}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
              {matchFeedback && (
                <motion.div
                  key={`match-${matchFeedback}`}
                  initial={{ scale: 0, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: -40, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 0.4, repeat: 2 }}
                  >
                    <span className="text-7xl drop-shadow-xl">{matchFeedback}</span>
                  </motion.div>
                  <span className="text-amber-600 font-black text-2xl uppercase tracking-tighter mt-2">GREAT JOB! ✨</span>
                </motion.div>
              )}

              {isComplete && (
                <motion.div
                  key="game-complete"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-50 bg-amber-900/40 backdrop-blur-md flex items-center justify-center p-8"
                >
                  <motion.div 
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="bg-white rounded-[3rem] p-10 text-center shadow-2xl border-8 border-amber-400 max-w-sm w-full"
                  >
                    <div className="flex justify-center gap-4 mb-6">
                      <span className="text-6xl">🌈</span>
                      <span className="text-6xl">🦄</span>
                      <span className="text-6xl">🎉</span>
                    </div>
                    <h3 className="text-4xl font-black text-amber-900 uppercase tracking-tighter mb-2 leading-none">
                      ISLAND CLEARED! 🌟
                    </h3>
                    <p className="text-amber-600 font-bold text-lg mt-4">You're a master explorer! ❤️</p>
                    <p className="text-amber-400 font-bold mt-2">Next island loading... 🚀</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center">
              <button
                onClick={() => generateGame(level)}
                className="p-4 bg-white rounded-2xl border-4 border-amber-200 text-amber-600 hover:bg-amber-50 transition-all active:scale-90 shadow-md"
              >
                <RefreshCw size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
    </motion.div>
  );
};
