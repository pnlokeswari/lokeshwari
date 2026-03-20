import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Trophy, RefreshCw, CheckCircle2, Heart, Apple, Sun, Moon, Cloud, 
  Ghost, Rocket, Zap, Anchor, Bell, Bike, Bird, Bone, Cake, Car, Cat, 
  Cherry, Coffee, Cookie, Crown, Dog, Fish, Flower, Gift, IceCream, 
  Leaf, Music, Pizza, Plane, Rabbit, Shell, Ship,  Smile, Snowflake, 
  Citrus, Umbrella 
} from 'lucide-react';

const ICONS = [
  { icon: Star, color: 'text-yellow-400' },
  { icon: Heart, color: 'text-red-400' },
  { icon: Apple, color: 'text-rose-500' },
  { icon: Sun, color: 'text-amber-400' },
  { icon: Moon, color: 'text-indigo-400' },
  { icon: Cloud, color: 'text-sky-400' },
  { icon: Ghost, color: 'text-slate-400' },
  { icon: Rocket, color: 'text-orange-500' },
  { icon: Zap, color: 'text-yellow-500' },
  { icon: Anchor, color: 'text-blue-600' },
  { icon: Bell, color: 'text-yellow-600' },
  { icon: Bike, color: 'text-emerald-500' },
  { icon: Bird, color: 'text-sky-500' },
  { icon: Bone, color: 'text-stone-400' },
  { icon: Cake, color: 'text-pink-400' },
  { icon: Car, color: 'text-red-500' },
  { icon: Cat, color: 'text-orange-400' },
  { icon: Cherry, color: 'text-rose-600' },
  { icon: Coffee, color: 'text-amber-800' },
  { icon: Cookie, color: 'text-amber-700' },
  { icon: Crown, color: 'text-yellow-500' },
  { icon: Dog, color: 'text-amber-600' },
  { icon: Fish, color: 'text-cyan-500' },
  { icon: Flower, color: 'text-pink-500' },
  { icon: Gift, color: 'text-purple-500' },
  { icon: IceCream, color: 'text-pink-300' },
  { icon: Leaf, color: 'text-green-500' },
  { icon: Music, color: 'text-violet-500' },
  { icon: Pizza, color: 'text-orange-600' },
  { icon: Plane, color: 'text-blue-400' },
  { icon: Rabbit, color: 'text-slate-300' },
  { icon: Shell, color: 'text-teal-400' },
  { icon: Ship, color: 'text-blue-700' },
  { icon: Smile, color: 'text-yellow-400' },
  { icon: Snowflake, color: 'text-blue-200' },
  { icon: Citrus, color: 'text-orange-400' },
  { icon: Umbrella, color: 'text-indigo-500' },
];

interface MatchItem {
  id: string;
  value: number;
  type: 'number' | 'target';
}

const NUMBER_WORDS: Record<number, string> = {
  1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten'
};

const CELEBRATION_EMOJIS = ['😊', '😄', '⭐', '✨', '❤️', '🎉', '👍', '🚀', '🐶', '🦄', '🌈'];

export const NumberMatch: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);
  const [shuffledTargets, setShuffledTargets] = useState<number[]>([]);
  const [selected, setSelected] = useState<MatchItem | null>(null);
  const [matches, setMatches] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [activeIcon, setActiveIcon] = useState(ICONS[0]);
  const [lastMatch, setLastMatch] = useState<{ value: number; emoji: string } | null>(null);
  const [gameMode, setGameMode] = useState<'count' | 'word'>('count');

  const initGame = useCallback(() => {
    // Randomly choose between 1-5 or 6-10
    const startNum = Math.random() > 0.5 ? 1 : 6;
    const nums = Array.from({ length: 5 }, (_, i) => startNum + i);
    
    // Randomly choose mode
    const mode = Math.random() > 0.5 ? 'count' : 'word';
    setGameMode(mode as 'count' | 'word');
    
    setNumbers(nums);
    setShuffledNumbers([...nums].sort(() => Math.random() - 0.5));
    setShuffledTargets([...nums].sort(() => Math.random() - 0.5));
    setSelected(null);
    setMatches([]);
    setIsComplete(false);
    setActiveIcon(ICONS[Math.floor(Math.random() * ICONS.length)]);
    setLastMatch(null);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleItemClick = (value: number, type: 'number' | 'target') => {
    if (matches.includes(value)) return;

    if (!selected) {
      setSelected({ id: `${type}-${value}`, value, type });
    } else {
      if (selected.type !== type && selected.value === value) {
        // Correct match
        const newMatches = [...matches, value];
        setMatches(newMatches);
        setScore(s => s + 20);
        setSelected(null);
        
        const randomEmoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
        setLastMatch({ value, emoji: randomEmoji });
        setTimeout(() => setLastMatch(null), 1000);
        
        if (newMatches.length === numbers.length) {
          setIsComplete(true);
        }
      } else {
        // Wrong match or same type clicked
        setSelected({ id: `${type}-${value}`, value, type });
      }
    }
  };

  const { icon: IconComponent, color: iconColor } = activeIcon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-[2.5rem] border-4 border-pink-300 p-8 shadow-xl shadow-pink-100 relative overflow-hidden"
    >
      <div className="absolute -top-4 -right-4 text-pink-200 opacity-50 rotate-12">
        <Heart size={64} fill="currentColor" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-2xl border-2 border-pink-200">
            <Trophy className="text-pink-600" size={20} />
            <span className="font-black text-pink-800 uppercase tracking-wider text-sm">Score: {score}</span>
          </div>
          <button
            onClick={initGame}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-all active:scale-95 border-b-4 border-slate-300"
          >
            <RefreshCw size={18} strokeWidth={3} />
          </button>
        </div>

        <h2 className="text-2xl font-black text-pink-600 text-center mb-6 uppercase tracking-tight">
          Match the Numbers! 🎨
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Numbers Column */}
          <div className="flex flex-col gap-4">
            <span className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Number</span>
            {shuffledNumbers.map((num) => (
              <motion.button
                key={`num-${num}`}
                whileHover={{ scale: matches.includes(num) ? 1 : 1.05 }}
                whileTap={{ scale: matches.includes(num) ? 1 : 0.95 }}
                onClick={() => handleItemClick(num, 'number')}
                className={`h-16 rounded-2xl border-4 text-2xl font-black transition-all flex items-center justify-center ${
                  matches.includes(num)
                    ? 'bg-green-100 border-green-400 text-green-600 cursor-default'
                    : selected?.id === `number-${num}`
                    ? 'bg-pink-500 border-pink-700 text-white shadow-lg'
                    : 'bg-white border-pink-100 text-slate-700 hover:border-pink-300'
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>

          {/* Targets Column */}
          <div className="flex flex-col gap-4">
            <span className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {gameMode === 'count' ? 'Count' : 'Word'}
            </span>
            {shuffledTargets.map((num) => (
              <motion.button
                key={`target-${num}`}
                whileHover={{ scale: matches.includes(num) ? 1 : 1.05 }}
                whileTap={{ scale: matches.includes(num) ? 1 : 0.95 }}
                onClick={() => handleItemClick(num, 'target')}
                className={`h-16 rounded-2xl border-4 transition-all flex items-center justify-center overflow-hidden ${
                  matches.includes(num)
                    ? 'bg-green-100 border-green-400 text-green-600 cursor-default'
                    : selected?.id === `target-${num}`
                    ? 'bg-pink-500 border-pink-700 text-white shadow-lg'
                    : 'bg-white border-pink-100 text-slate-700 hover:border-pink-300'
                }`}
              >
                {gameMode === 'count' ? (
                  <div className="flex flex-wrap justify-center gap-1 p-2">
                    {Array.from({ length: num }).map((_, i) => (
                      <IconComponent 
                        key={i} 
                        size={14} 
                        className={matches.includes(num) ? iconColor : 'text-slate-300'}
                        fill={matches.includes(num) ? 'currentColor' : 'none'} 
                        strokeWidth={3} 
                      />
                    ))}
                  </div>
                ) : (
                  <span className={`text-lg font-black ${matches.includes(num) ? 'text-green-600' : 'text-slate-700'}`}>
                    {NUMBER_WORDS[num]}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {lastMatch !== null && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1.5, opacity: 1, y: -50 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="bg-green-500 text-white px-6 py-3 rounded-full font-black flex flex-col items-center gap-1 shadow-xl border-4 border-white">
                <span className="text-3xl">{lastMatch.emoji}</span>
                <span className="text-xs uppercase tracking-widest">Great job!</span>
              </div>
            </motion.div>
          )}
          
          {isComplete && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6 flex gap-4"
              >
                <span className="text-6xl">🌈</span>
                <span className="text-6xl">🦄</span>
                <span className="text-6xl">🎉</span>
              </motion.div>
              <h3 className="text-4xl font-black text-indigo-600 mb-2 tracking-tighter">AMAZING! 🌈</h3>
              <p className="text-slate-600 font-bold mb-8 text-xl">You matched all the numbers! ❤️</p>
              <button
                onClick={initGame}
                className="bg-pink-500 hover:bg-pink-600 text-white font-black px-10 py-5 rounded-[2rem] shadow-xl shadow-pink-200 transition-all active:scale-95 uppercase tracking-widest border-b-8 border-pink-700 text-lg"
              >
                Let's go again! 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
