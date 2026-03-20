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

const THEMES = [
  { name: 'Pink Kingdom', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', accent: 'bg-pink-100', emoji: '🏰' },
  { name: 'Ocean Quest', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', accent: 'bg-blue-100', emoji: '🌊' },
  { name: 'Jungle Safari', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', accent: 'bg-emerald-100', emoji: '🦁' },
  { name: 'Desert Treasure', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', accent: 'bg-amber-100', emoji: '🏜️' },
  { name: 'Space Voyage', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', accent: 'bg-purple-100', emoji: '🚀' },
  { name: 'Cloud Garden', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600', accent: 'bg-sky-100', emoji: '☁️' },
  { name: 'Dino Valley', bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-600', accent: 'bg-stone-100', emoji: '🦖' },
  { name: 'Rainbow Peak', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', accent: 'bg-rose-100', emoji: '🌈' },
  { name: 'Magic Forest', bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-600', accent: 'bg-lime-100', emoji: '🌲' },
  { name: 'Starry Night', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', accent: 'bg-indigo-100', emoji: '✨' },
];

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
  const [theme, setTheme] = useState(THEMES[0]);

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
    setTheme(THEMES[Math.floor(Math.random() * THEMES.length)]);
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
      className={`rounded-[3rem] border-8 ${theme.border} ${theme.bg} p-10 shadow-2xl relative overflow-hidden min-h-[800px] flex flex-col`}
    >
      <div className={`absolute -top-8 -right-8 ${theme.text} opacity-10 rotate-12`}>
        <Heart size={128} fill="currentColor" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <div className={`flex items-center gap-3 ${theme.accent} px-6 py-3 rounded-[2rem] border-4 ${theme.border} shadow-sm`}>
            <Trophy className={theme.text} size={28} />
            <span className={`font-black ${theme.text} uppercase tracking-widest text-xl`}>Score: {score}</span>
          </div>
          <button
            onClick={initGame}
            className="bg-white hover:bg-slate-50 text-slate-600 p-4 rounded-2xl transition-all active:scale-95 border-b-8 border-slate-200 shadow-lg"
          >
            <RefreshCw size={28} strokeWidth={4} />
          </button>
        </div>

        <h2 className={`text-5xl font-black ${theme.text} text-center mb-2 uppercase tracking-tighter drop-shadow-sm`}>
          {theme.name} {theme.emoji}
        </h2>
        <p className="text-center text-slate-400 font-bold mb-10 uppercase tracking-widest text-xs">
          Find the matching pairs!
        </p>

        <div className="grid grid-cols-2 gap-12 flex-1">
          {/* Numbers Column */}
          <div className="flex flex-col gap-6">
            <span className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">The Number</span>
            {shuffledNumbers.map((num) => (
              <motion.button
                key={`num-${num}`}
                whileHover={matches.includes(num) ? {} : { scale: 1.05, rotate: 2 }}
                whileTap={matches.includes(num) ? {} : { scale: 0.9 }}
                onClick={() => handleItemClick(num, 'number')}
                className={`h-36 rounded-[2.5rem] border-8 text-8xl font-black transition-all flex items-center justify-center shadow-xl ${
                  matches.includes(num)
                    ? 'bg-green-500 border-green-700 text-white cursor-default scale-95 opacity-50'
                    : selected?.id === `number-${num}`
                    ? 'bg-white border-blue-500 text-blue-600 ring-8 ring-blue-200'
                    : 'bg-white border-white text-slate-800 hover:border-slate-200'
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>

          {/* Targets Column */}
          <div className="flex flex-col gap-6">
            <span className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
              {gameMode === 'count' ? 'How Many?' : 'The Word'}
            </span>
            {shuffledTargets.map((num) => (
              <motion.button
                key={`target-${num}`}
                whileHover={matches.includes(num) ? {} : { scale: 1.05, rotate: -2 }}
                whileTap={matches.includes(num) ? {} : { scale: 0.9 }}
                onClick={() => handleItemClick(num, 'target')}
                className={`h-36 rounded-[2.5rem] border-8 transition-all flex items-center justify-center overflow-hidden shadow-xl ${
                  matches.includes(num)
                    ? 'bg-green-500 border-green-700 text-white cursor-default scale-95 opacity-50'
                    : selected?.id === `target-${num}`
                    ? 'bg-white border-blue-500 text-blue-600 ring-8 ring-blue-200'
                    : 'bg-white border-white text-slate-800 hover:border-slate-200'
                }`}
              >
                {gameMode === 'count' ? (
                  <div className="flex flex-wrap justify-center items-center gap-4 p-6 max-w-full">
                    {Array.from({ length: num }).map((_, i) => (
                      <motion.div
                        key={i}
                        whileTap={{ scale: 1.5 }}
                        animate={matches.includes(num) ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <IconComponent 
                          size={48} 
                          className={matches.includes(num) ? 'text-white' : iconColor}
                          fill={matches.includes(num) ? 'currentColor' : 'none'} 
                          strokeWidth={4} 
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <span className={`text-4xl font-black uppercase tracking-tighter ${matches.includes(num) ? 'text-white' : theme.text}`}>
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
              key={`match-${lastMatch.value}-${lastMatch.emoji}`}
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
              key="game-complete"
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
