import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Gem, Compass, Trophy, RefreshCw, CheckCircle2, XCircle, Search } from 'lucide-react';

interface GameState {
  sequence: (number | null)[];
  missingIndices: number[];
  options: number[];
  correctAnswers: Record<number, number>;
}

export const MissingNumbers: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const generateGame = (currentLevel: number) => {
    const sequenceLength = 6;
    const maxNum = currentLevel * 15 + 5; // Level 1: up to 20, Level 2: up to 35, Level 3: up to 50
    const start = Math.floor(Math.random() * (maxNum - sequenceLength)) + 1;
    
    const fullSequence = Array.from({ length: sequenceLength }, (_, i) => start + i);
    const missingCount = Math.min(currentLevel, 3);
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

    // Generate options (correct answers + some random close numbers)
    const optionsSet = new Set(Object.values(correctAnswers));
    while (optionsSet.size < missingCount + 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const randomOption = Math.max(1, fullSequence[0] + offset + Math.floor(Math.random() * sequenceLength));
      optionsSet.add(randomOption);
    }
    const options = Array.from(optionsSet).sort((a, b) => a - b);

    setGameState({ sequence, missingIndices, options, correctAnswers });
    setSelectedAnswers({});
    setFeedback(null);
    setIsComplete(false);
  };

  useEffect(() => {
    generateGame(level);
  }, [level]);

  const handleOptionClick = (option: number) => {
    if (isComplete) return;

    // Find the first empty missing index
    const firstEmptyIdx = gameState?.missingIndices.find(idx => !selectedAnswers[idx]);
    if (firstEmptyIdx !== undefined) {
      const newAnswers = { ...selectedAnswers, [firstEmptyIdx]: option };
      setSelectedAnswers(newAnswers);

      // If all filled, check
      if (Object.keys(newAnswers).length === gameState?.missingIndices.length) {
        const isAllCorrect = gameState.missingIndices.every(idx => newAnswers[idx] === gameState.correctAnswers[idx]);
        if (isAllCorrect) {
          setFeedback('correct');
          setScore(s => s + 30);
          setIsComplete(true);
          setTimeout(() => {
            if (level < 3) setLevel(l => l + 1);
            else generateGame(level);
          }, 2000);
        } else {
          setFeedback('wrong');
          setScore(s => Math.max(0, s - 10));
          setTimeout(() => {
            setSelectedAnswers({});
            setFeedback(null);
          }, 1500);
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border-4 border-orange-300 p-8 shadow-xl shadow-orange-100 relative overflow-hidden"
    >
      {/* Treasure Map Background */}
      <div className="absolute -top-4 -right-4 text-orange-100 rotate-12 opacity-50">
        <Map size={80} fill="currentColor" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-2xl border-2 border-orange-200">
            <Trophy className="text-orange-600" size={20} />
            <span className="font-black text-orange-800 uppercase tracking-wider text-sm">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-2xl border-2 border-blue-200">
            <Compass className="text-blue-600 animate-spin-slow" size={20} />
            <span className="font-black text-blue-800 uppercase tracking-wider text-sm">Level: {level}</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-orange-600 text-center mb-2 uppercase tracking-tight">
          Number Treasure Hunt! 🗺️
        </h2>
        <p className="text-center text-slate-500 font-bold text-sm mb-8">
          Find the missing numbers in the sequence!
        </p>

        {gameState && (
          <div className="flex flex-col items-center gap-8">
            {/* Number Line */}
            <div className="flex flex-wrap justify-center gap-3">
              {gameState.sequence.map((num, idx) => (
                <div key={idx} className="relative">
                  {num === null ? (
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-4 border-dashed flex items-center justify-center text-2xl font-black transition-all ${
                      selectedAnswers[idx] 
                        ? 'bg-orange-50 border-orange-400 text-orange-600' 
                        : 'bg-slate-50 border-slate-200 text-slate-300'
                    }`}>
                      {selectedAnswers[idx] || '?'}
                    </div>
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-4 border-orange-100 flex items-center justify-center text-2xl font-black text-slate-700 shadow-sm">
                      {num}
                    </div>
                  )}
                  {idx < gameState.sequence.length - 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-orange-200">
                      <Search size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[300px]">
              {gameState.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOptionClick(option)}
                  className="h-14 rounded-2xl bg-white border-4 border-orange-200 text-xl font-black text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition-all shadow-md active:shadow-inner"
                >
                  {option}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {feedback === 'correct' && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="flex flex-col items-center gap-2 text-green-500 font-black text-2xl"
                >
                  <div className="flex items-center gap-2">
                    <Gem size={32} className="animate-bounce" />
                    <span>TREASURE FOUND! 💎</span>
                  </div>
                </motion.div>
              )}
              {feedback === 'wrong' && (
                <motion.div
                  initial={{ x: [-10, 10, -10, 10, 0] }}
                  className="flex items-center gap-2 text-red-500 font-black text-2xl"
                >
                  <XCircle size={32} strokeWidth={3} />
                  <span>KEEP LOOKING! 🔍</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => generateGame(level)}
              className="mt-4 p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all text-slate-600 active:scale-90"
            >
              <RefreshCw size={24} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
