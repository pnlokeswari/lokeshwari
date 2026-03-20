import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Trophy, RefreshCw, CheckCircle2, Sparkles, Gem } from 'lucide-react';

interface OppositePair {
  id: string;
  left: string;
  right: string;
  color: string;
}

const WORD_SETS: OppositePair[][] = [
  [
    { id: '1', left: 'Big', right: 'Small', color: 'bg-red-400' },
    { id: '2', left: 'Hot', right: 'Cold', color: 'bg-blue-400' },
    { id: '3', left: 'Fast', right: 'Slow', color: 'bg-yellow-400' },
    { id: '4', left: 'Happy', right: 'Sad', color: 'bg-green-400' },
  ],
  [
    { id: '5', left: 'Up', right: 'Down', color: 'bg-purple-400' },
    { id: '6', left: 'Day', right: 'Night', color: 'bg-orange-400' },
    { id: '7', left: 'Thick', right: 'Thin', color: 'bg-pink-400' },
    { id: '8', left: 'Tall', right: 'Short', color: 'bg-indigo-400' },
  ],
  [
    { id: '9', left: 'Hard', right: 'Soft', color: 'bg-emerald-400' },
    { id: '10', left: 'Heavy', right: 'Light', color: 'bg-amber-400' },
    { id: '11', left: 'Clean', right: 'Dirty', color: 'bg-rose-400' },
    { id: '12', left: 'Full', right: 'Empty', color: 'bg-cyan-400' },
  ]
];

const CELEBRATION_EMOJIS = ['😊', '😄', '⭐', '✨', '❤️', '🎉', '👍', '🚀', '🐶', '🦄', '🌈'];

export const OppositesGame: React.FC = () => {
  const [setIndex, setSetIndex] = useState(0);
  const [leftWords, setLeftWords] = useState<OppositePair[]>([]);
  const [rightWords, setRightWords] = useState<OppositePair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // leftId -> rightId
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [matchFeedback, setMatchFeedback] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);

  const calculateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines = Object.entries(matches).map(([leftId, rightId]) => {
      const leftEl = leftRefs.current[leftId];
      const rightEl = rightRefs.current[rightId];
      if (!leftEl || !rightEl) return null;

      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();

      return {
        x1: leftRect.right - containerRect.left,
        y1: leftRect.top + leftRect.height / 2 - containerRect.top,
        x2: rightRect.left - containerRect.left,
        y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        color: WORD_SETS[setIndex].find(p => p.id === leftId)?.color || 'bg-emerald-500'
      };
    }).filter(Boolean) as any[];
    setLines(newLines);
  };

  useEffect(() => {
    calculateLines();
    window.addEventListener('resize', calculateLines);
    return () => window.removeEventListener('resize', calculateLines);
  }, [matches, setIndex]);

  const initGame = (index: number) => {
    const currentSet = WORD_SETS[index];
    setLeftWords([...currentSet].sort(() => Math.random() - 0.5));
    setRightWords([...currentSet].sort(() => Math.random() - 0.5));
    setMatches({});
    setSelectedLeft(null);
    setIsComplete(false);
    setLines([]);
  };

  useEffect(() => {
    initGame(setIndex);
  }, [setIndex]);

  const handleLeftClick = (id: string) => {
    if (isComplete) return;
    // If already matched, don't allow re-selection for now (or allow to break match?)
    // Let's allow selection only if not matched
    if (matches[id]) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (!selectedLeft || isComplete) return;
    
    // Check if correct match
    if (selectedLeft === id) {
      const newMatches = { ...matches, [selectedLeft]: id };
      setMatches(newMatches);
      setSelectedLeft(null);
      setScore(s => s + 20);
      const emoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
      setMatchFeedback(emoji);
      setTimeout(() => setMatchFeedback(null), 1500);

      if (Object.keys(newMatches).length === leftWords.length) {
        setIsComplete(true);
        setTimeout(() => {
          if (setIndex < WORD_SETS.length - 1) {
            setSetIndex(s => s + 1);
          } else {
            // Loop back or stay at end
            setSetIndex(0);
          }
        }, 3000);
      }
    } else {
      // Wrong match animation?
      setSelectedLeft(null);
      setScore(s => Math.max(0, s - 5));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border-4 border-emerald-300 p-8 shadow-xl shadow-emerald-100 relative overflow-hidden"
    >
      {/* Decorations */}
      <div className="absolute top-2 right-2 text-emerald-100 rotate-12">
        <Sparkles size={48} fill="currentColor" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-2xl border-2 border-emerald-200">
            <Trophy className="text-emerald-600" size={20} />
            <span className="font-black text-emerald-800 uppercase tracking-wider text-sm">Score: {score}</span>
          </div>
          <button 
            onClick={() => initGame(setIndex)}
            className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <RefreshCw size={20} className="text-slate-600" />
          </button>
        </div>

        <h2 className="text-2xl font-black text-emerald-600 text-center mb-2 uppercase tracking-tight">
          Connect Opposites! 🔗
        </h2>
        <p className="text-center text-slate-500 font-bold text-sm mb-8">
          Match the words that are different!
        </p>

        <div ref={containerRef} className="grid grid-cols-2 gap-12 relative">
          {/* SVG Lines Overlay */}
          <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible">
            {lines.map((line, idx) => (
              <motion.line
                key={`line-${idx}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-emerald-400"
              />
            ))}
          </svg>

          {/* Left Column */}
          <div className="flex flex-col gap-4 relative z-10">
            {leftWords.map((pair) => (
              <motion.button
                key={`left-${pair.id}`}
                ref={el => leftRefs.current[pair.id] = el}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLeftClick(pair.id)}
                className={`h-16 rounded-2xl font-black text-lg uppercase tracking-wider transition-all border-4 ${
                  matches[pair.id] 
                    ? 'bg-emerald-500 border-emerald-600 text-white opacity-50 cursor-default'
                    : selectedLeft === pair.id
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-700 shadow-inner scale-105'
                    : 'bg-white border-slate-100 text-slate-700 hover:border-emerald-200'
                }`}
              >
                {pair.left}
              </motion.button>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 relative z-10">
            {rightWords.map((pair) => {
              const isMatched = Object.values(matches).includes(pair.id);
              return (
                <motion.button
                  key={`right-${pair.id}`}
                  ref={el => rightRefs.current[pair.id] = el}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRightClick(pair.id)}
                  className={`h-16 rounded-2xl font-black text-lg uppercase tracking-wider transition-all border-4 ${
                    isMatched
                      ? 'bg-emerald-500 border-emerald-600 text-white opacity-50 cursor-default'
                      : 'bg-white border-slate-100 text-slate-700 hover:border-emerald-200'
                  }`}
                >
                  {pair.right}
                </motion.button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {matchFeedback && (
            <motion.div
              initial={{ scale: 0, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: -20, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <span className="text-6xl drop-shadow-lg">{matchFeedback}</span>
              </motion.div>
              <span className="text-emerald-600 font-black text-xl uppercase tracking-widest mt-2">GREAT JOB! ✨</span>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center rounded-[2rem] p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex gap-4 mb-6"
              >
                <span className="text-6xl">🌈</span>
                <span className="text-6xl">🐶</span>
                <span className="text-6xl">✨</span>
              </motion.div>
              <h3 className="text-4xl font-black text-emerald-600 uppercase tracking-tighter">
                AMAZING JOB! 🌟
              </h3>
              <p className="text-slate-500 font-bold mt-4 text-lg">You're a superstar! ❤️</p>
              <p className="text-slate-400 font-bold mt-2">Next level coming up... 🚀</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
