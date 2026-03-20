import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, Trophy, RefreshCw, CheckCircle2, Sparkles, Gem, Heart } from 'lucide-react';

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
  ],
  [
    { id: '13', left: 'Open', right: 'Closed', color: 'bg-sky-400' },
    { id: '14', left: 'In', right: 'Out', color: 'bg-lime-400' },
    { id: '15', left: 'On', right: 'Off', color: 'bg-slate-400' },
    { id: '16', left: 'Yes', right: 'No', color: 'bg-red-500' },
  ],
  [
    { id: '17', left: 'Left', right: 'Right', color: 'bg-blue-500' },
    { id: '18', left: 'Front', right: 'Back', color: 'bg-green-500' },
    { id: '19', left: 'Top', right: 'Bottom', color: 'bg-yellow-500' },
    { id: '20', left: 'Near', right: 'Far', color: 'bg-purple-500' },
  ],
  [
    { id: '21', left: 'Old', right: 'New', color: 'bg-orange-500' },
    { id: '22', left: 'Rich', right: 'Poor', color: 'bg-emerald-500' },
    { id: '23', left: 'Strong', right: 'Weak', color: 'bg-indigo-500' },
    { id: '24', left: 'Quiet', right: 'Loud', color: 'bg-pink-500' },
  ],
  [
    { id: '25', left: 'Sweet', right: 'Sour', color: 'bg-amber-500' },
    { id: '26', left: 'Smooth', right: 'Rough', color: 'bg-stone-500' },
    { id: '27', left: 'Dry', right: 'Wet', color: 'bg-cyan-500' },
    { id: '28', left: 'Bright', right: 'Dim', color: 'bg-yellow-400' },
  ],
  [
    { id: '29', left: 'Young', right: 'Old', color: 'bg-rose-400' },
    { id: '30', left: 'Alive', right: 'Dead', color: 'bg-slate-600' },
    { id: '31', left: 'First', right: 'Last', color: 'bg-blue-600' },
    { id: '32', left: 'True', right: 'False', color: 'bg-green-600' },
  ],
  [
    { id: '33', left: 'Win', right: 'Lose', color: 'bg-yellow-600' },
    { id: '34', left: 'Buy', right: 'Sell', color: 'bg-emerald-600' },
    { id: '35', left: 'Give', right: 'Take', color: 'bg-purple-600' },
    { id: '36', left: 'Push', right: 'Pull', color: 'bg-orange-600' },
  ],
  [
    { id: '37', left: 'Start', right: 'Finish', color: 'bg-red-600' },
    { id: '38', left: 'Float', right: 'Sink', color: 'bg-blue-400' },
    { id: '39', left: 'Laugh', right: 'Cry', color: 'bg-pink-400' },
    { id: '40', left: 'Sleep', right: 'Wake', color: 'bg-indigo-400' },
  ],
  [
    { id: '41', left: 'Sharp', right: 'Dull', color: 'bg-slate-400' },
    { id: '42', left: 'Deep', right: 'Shallow', color: 'bg-cyan-600' },
    { id: '43', left: 'Wide', right: 'Narrow', color: 'bg-lime-600' },
    { id: '44', left: 'Straight', right: 'Crooked', color: 'bg-amber-600' },
  ],
  [
    { id: '45', left: 'Safe', right: 'Dangerous', color: 'bg-green-700' },
    { id: '46', left: 'Easy', right: 'Difficult', color: 'bg-blue-700' },
    { id: '47', left: 'Cheap', right: 'Expensive', color: 'bg-yellow-700' },
    { id: '48', left: 'Brave', right: 'Scared', color: 'bg-red-700' },
  ],
  [
    { id: '49', left: 'Kind', right: 'Cruel', color: 'bg-pink-600' },
    { id: '50', left: 'Smart', right: 'Silly', color: 'bg-purple-700' },
    { id: '51', left: 'Clean', right: 'Messy', color: 'bg-emerald-700' },
    { id: '52', left: 'Pretty', right: 'Ugly', color: 'bg-rose-700' },
  ],
  [
    { id: '53', left: 'Early', right: 'Late', color: 'bg-orange-700' },
    { id: '54', left: 'Empty', right: 'Full', color: 'bg-cyan-700' },
    { id: '55', left: 'Loose', right: 'Tight', color: 'bg-indigo-700' },
    { id: '56', left: 'More', right: 'Less', color: 'bg-lime-700' },
  ],
  [
    { id: '57', left: 'Above', right: 'Below', color: 'bg-sky-700' },
    { id: '58', left: 'Inside', right: 'Outside', color: 'bg-amber-700' },
    { id: '59', left: 'Before', right: 'After', color: 'bg-stone-700' },
    { id: '60', left: 'Always', right: 'Never', color: 'bg-slate-700' },
  ]
];

const CELEBRATION_EMOJIS = ['😊', '😄', '⭐', '✨', '❤️', '🎉', '👍', '🚀', '🐶', '🦄', '🌈'];

export const OppositesGame: React.FC = () => {
  const [leftWords, setLeftWords] = useState<OppositePair[]>([]);
  const [rightWords, setRightWords] = useState<OppositePair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // leftId -> rightId
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [matchFeedback, setMatchFeedback] = useState<string | null>(null);
  const [isNewQuest, setIsNewQuest] = useState(false);
  const [currentSetId, setCurrentSetId] = useState<string>('');
  
  // History tracking
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('opposites-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [roundsPlayed, setRoundsPlayed] = useState(() => {
    const saved = localStorage.getItem('opposites-rounds');
    return saved ? parseInt(saved) : 0;
  });

  const progress = useMemo(() => (roundsPlayed % 10) + 1, [roundsPlayed]);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);

  const calculateLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines = Object.entries(matches).map(([leftId, rightId]) => {
      const leftEl = leftRefs.current[leftId];
      const rightEl = rightRefs.current[rightId];
      if (!leftEl || !rightEl) return null;

      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();

      // Find the color from the current set
      const currentSet = WORD_SETS.find(set => set.some(p => p.id === leftId));
      const color = currentSet?.find(p => p.id === leftId)?.color || 'bg-emerald-500';

      return {
        x1: leftRect.right - containerRect.left,
        y1: leftRect.top + leftRect.height / 2 - containerRect.top,
        x2: rightRect.left - containerRect.left,
        y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        color
      };
    }).filter(Boolean) as any[];
    setLines(newLines);
  }, [matches]);

  useEffect(() => {
    calculateLines();
    window.addEventListener('resize', calculateLines);
    return () => window.removeEventListener('resize', calculateLines);
  }, [calculateLines]);

  const initGame = useCallback(() => {
    // Filter out recent sets (last 10)
    // We'll use the first ID of the set as a unique identifier for the set
    const availableSets = WORD_SETS.filter(set => !history.includes(set[0].id));
    
    const pool = availableSets.length > 0 ? availableSets : WORD_SETS;
    const selectedSet = pool[Math.floor(Math.random() * pool.length)];
    const setId = selectedSet[0].id;

    setLeftWords([...selectedSet].sort(() => Math.random() - 0.5));
    setRightWords([...selectedSet].sort(() => Math.random() - 0.5));
    setMatches({});
    setSelectedLeft(null);
    setIsComplete(false);
    setLines([]);
    setMatchFeedback(null);
    setCurrentSetId(setId);
    setIsNewQuest(!history.includes(setId));
  }, [history]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleLeftClick = (id: string) => {
    if (isComplete) return;
    if (matches[id]) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (!selectedLeft || isComplete) return;
    
    if (selectedLeft === id) {
      const newMatches = { ...matches, [selectedLeft]: id };
      setMatches(newMatches);
      setSelectedLeft(null);
      setScore(s => s + 20);
      const emoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
      setMatchFeedback(emoji);
      setTimeout(() => setMatchFeedback(null), 1500);

      // Small confetti for each match
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { y: 0.7 }
      });

      if (Object.keys(newMatches).length === leftWords.length) {
        setIsComplete(true);
        
        // Update history and rounds
        const newRounds = roundsPlayed + 1;
        setRoundsPlayed(newRounds);
        localStorage.setItem('opposites-rounds', newRounds.toString());

        const newHistory = [currentSetId, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('opposites-history', JSON.stringify(newHistory));

        // Large confetti for 10 rounds
        if (newRounds % 10 === 0) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
          });
        }
      }
    } else {
      setSelectedLeft(null);
      setScore(s => Math.max(0, s - 5));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border-4 border-emerald-300 p-8 shadow-xl shadow-emerald-100 relative overflow-hidden min-h-[600px] flex flex-col"
    >
      {/* Decorations */}
      <div className="absolute top-2 right-2 text-emerald-100 rotate-12">
        <Sparkles size={48} fill="currentColor" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
              {roundsPlayed % 10 === 0 && roundsPlayed > 0 ? 'Quest Complete! 🎉' : `${progress}/10 Fun Rounds Ahead!`}
            </span>
            <span className="text-xs font-black text-slate-400">{roundsPlayed} Total</span>
          </div>
          <div className="h-3 bg-emerald-50 rounded-full overflow-hidden border-2 border-emerald-100 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(progress / 10) * 100}%` }}
              className="h-full bg-emerald-500 shadow-lg"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-2xl border-2 border-emerald-200">
            <Trophy className="text-emerald-600" size={20} />
            <span className="font-black text-emerald-800 uppercase tracking-wider text-sm">Score: {score}</span>
          </div>
          <div className="flex gap-3">
            {isNewQuest && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-yellow-400 text-white px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-tighter flex items-center gap-1 shadow-lg border-2 border-white"
              >
                <Star size={12} fill="currentColor" />
                New Adventure!
              </motion.div>
            )}
            <button 
              onClick={initGame}
              className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors active:scale-95"
            >
              <RefreshCw size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-black text-emerald-600 text-center mb-2 uppercase tracking-tight">
          Connect Opposites! 🔗
        </h2>
        <p className="text-center text-slate-500 font-bold text-sm mb-8">
          Match the words that are different!
        </p>

        <div ref={containerRef} className="grid grid-cols-2 gap-12 relative flex-1">
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
                strokeWidth="6"
                strokeLinecap="round"
                className="text-emerald-400"
              />
            ))}
          </svg>

          {/* Left Column */}
          <div className="flex flex-col gap-4 relative z-10">
            <span className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Word</span>
            {leftWords.map((pair) => (
              <motion.button
                key={`left-${pair.id}`}
                ref={el => leftRefs.current[pair.id] = el}
                whileHover={matches[pair.id] ? {} : { scale: 1.05 }}
                whileTap={matches[pair.id] ? {} : { scale: 0.95 }}
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
            <span className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Opposite</span>
            {rightWords.map((pair) => {
              const isMatched = Object.values(matches).includes(pair.id);
              return (
                <motion.button
                  key={`right-${pair.id}`}
                  ref={el => rightRefs.current[pair.id] = el}
                  whileHover={isMatched ? {} : { scale: 1.05 }}
                  whileTap={isMatched ? {} : { scale: 0.95 }}
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
              key={`match-${matchFeedback}`}
              initial={{ scale: 0, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: -20, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none"
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
              <span className="text-emerald-600 font-black text-xl uppercase tracking-widest mt-2 bg-white/80 px-4 py-1 rounded-full backdrop-blur-sm">GREAT JOB! ✨</span>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              key="game-complete"
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
                {roundsPlayed % 10 === 0 ? 'QUEST MASTER! 🏆' : 'AMAZING JOB! 🌟'}
              </h3>
              <p className="text-slate-500 font-bold mt-4 text-lg">
                {roundsPlayed % 10 === 0 
                  ? 'You finished 10 rounds! Time for a new adventure! ❤️' 
                  : "You're a superstar! ❤️"}
              </p>
              <button
                onClick={initGame}
                className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-10 py-5 rounded-[2rem] shadow-xl shadow-emerald-200 transition-all active:scale-95 uppercase tracking-widest border-b-8 border-emerald-700 text-lg"
              >
                {roundsPlayed % 10 === 0 ? 'Start New Quest! 🚀' : "Let's go again! 🚀"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

