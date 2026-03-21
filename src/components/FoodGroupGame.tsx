import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, RefreshCw, Star, CheckCircle2, Sparkles, 
  Apple, Carrot, Wheat, Beef, Milk, Utensils, Heart, Gem
} from 'lucide-react';
import { useGems } from '../context/GemsContext';
import { useAchievements } from '../context/AchievementsContext';

interface FoodItem {
  name: string;
  emoji: string;
}

interface FoodGroup {
  id: string;
  name: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  text: string;
  accent: string;
  items: FoodItem[];
}

const FOOD_GROUPS: FoodGroup[] = [
  {
    id: 'fruits',
    name: 'Fruits',
    icon: Apple,
    color: 'bg-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-600',
    accent: 'bg-rose-100',
    items: [
      { name: 'Apple', emoji: '🍎' },
      { name: 'Banana', emoji: '🍌' },
      { name: 'Grapes', emoji: '🍇' },
      { name: 'Orange', emoji: '🍊' },
      { name: 'Strawberry', emoji: '🍓' },
      { name: 'Watermelon', emoji: '🍉' },
      { name: 'Pineapple', emoji: '🍍' },
      { name: 'Mango', emoji: '🥭' },
      { name: 'Blueberry', emoji: '🫐' },
      { name: 'Kiwi', emoji: '🥝' },
    ]
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    icon: Carrot,
    color: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    accent: 'bg-emerald-100',
    items: [
      { name: 'Carrot', emoji: '🥕' },
      { name: 'Broccoli', emoji: '🥦' },
      { name: 'Corn', emoji: '🌽' },
      { name: 'Tomato', emoji: '🍅' },
      { name: 'Cucumber', emoji: '🥒' },
      { name: 'Potato', emoji: '🥔' },
      { name: 'Onion', emoji: '🧅' },
      { name: 'Peas', emoji: '🫛' },
      { name: 'Bell Pepper', emoji: '🫑' },
      { name: 'Eggplant', emoji: '🍆' },
    ]
  },
  {
    id: 'grains',
    name: 'Grains',
    icon: Wheat,
    color: 'bg-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    accent: 'bg-amber-100',
    items: [
      { name: 'Bread', emoji: '🍞' },
      { name: 'Rice', emoji: '🍚' },
      { name: 'Pasta', emoji: '🍝' },
      { name: 'Cereal', emoji: '🥣' },
      { name: 'Popcorn', emoji: '🍿' },
      { name: 'Bagel', emoji: '🥯' },
      { name: 'Pretzel', emoji: '🥨' },
      { name: 'Croissant', emoji: '🥐' },
      { name: 'Pancakes', emoji: '🥞' },
      { name: 'Waffle', emoji: '🧇' },
    ]
  },
  {
    id: 'protein',
    name: 'Protein',
    icon: Beef,
    color: 'bg-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    accent: 'bg-orange-100',
    items: [
      { name: 'Chicken', emoji: '🍗' },
      { name: 'Steak', emoji: '🥩' },
      { name: 'Fish', emoji: '🐟' },
      { name: 'Egg', emoji: '🥚' },
      { name: 'Shrimp', emoji: '🍤' },
      { name: 'Bacon', emoji: '🥓' },
      { name: 'Ham', emoji: '🍖' },
      { name: 'Tofu', emoji: '🧊' },
      { name: 'Nuts', emoji: '🥜' },
      { name: 'Beans', emoji: '🫘' },
    ]
  },
  {
    id: 'dairy',
    name: 'Dairy',
    icon: Milk,
    color: 'bg-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-600',
    accent: 'bg-sky-100',
    items: [
      { name: 'Milk', emoji: '🥛' },
      { name: 'Cheese', emoji: '🧀' },
      { name: 'Yogurt', emoji: '🍦' },
      { name: 'Butter', emoji: '🧈' },
      { name: 'Ice Cream', emoji: '🍨' },
      { name: 'Glass of Milk', emoji: '🥛' },
      { name: 'Cheese Wedge', emoji: '🧀' },
      { name: 'Milk Carton', emoji: '🧃' },
    ]
  }
];

export const FoodGroupGame: React.FC = () => {
  const { totalGems, addGems } = useGems();
  const { unlockAchievement } = useAchievements();
  const [targetGroup, setTargetGroup] = useState<FoodGroup>(FOOD_GROUPS[0]);
  const [displayItems, setDisplayItems] = useState<(FoodItem & { isCorrect: boolean })[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isNewQuest, setIsNewQuest] = useState(false);
  const [feedback, setFeedback] = useState<{ emoji: string; text: string } | null>(null);

  // History tracking
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('food-group-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [roundsPlayed, setRoundsPlayed] = useState(() => {
    const saved = localStorage.getItem('food-group-rounds');
    return saved ? parseInt(saved) : 0;
  });
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('food-group-level');
    return saved ? parseInt(saved) : 1;
  });

  const progress = useMemo(() => (roundsPlayed % 10) + 1, [roundsPlayed]);

  const initGame = useCallback(() => {
    // Filter out recent groups
    const availableGroups = FOOD_GROUPS.filter(group => !history.includes(group.id));
    const pool = availableGroups.length > 0 ? availableGroups : FOOD_GROUPS;
    const selectedGroup = pool[Math.floor(Math.random() * pool.length)];

    // Pick 4 correct items
    const correctItems = [...selectedGroup.items]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map(item => ({ ...item, isCorrect: true }));

    // Pick 4 distractors from other groups
    const otherGroups = FOOD_GROUPS.filter(g => g.id !== selectedGroup.id);
    const distractors: (FoodItem & { isCorrect: boolean })[] = [];
    while (distractors.length < 4) {
      const randomGroup = otherGroups[Math.floor(Math.random() * otherGroups.length)];
      const randomItem = randomGroup.items[Math.floor(Math.random() * randomGroup.items.length)];
      if (!distractors.find(d => d.name === randomItem.name)) {
        distractors.push({ ...randomItem, isCorrect: false });
      }
    }

    // Shuffle all items
    const allItems = [...correctItems, ...distractors].sort(() => Math.random() - 0.5);

    setTargetGroup(selectedGroup);
    setDisplayItems(allItems);
    setSelectedIndices([]);
    setIsComplete(false);
    setFeedback(null);
    setIsNewQuest(!history.includes(selectedGroup.id));
  }, [history]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleItemClick = (index: number) => {
    if (isComplete) return;

    const item = displayItems[index];
    if (selectedIndices.includes(index)) {
      setSelectedIndices(prev => prev.filter(i => i !== index));
      return;
    }

    if (item.isCorrect) {
      const newSelected = [...selectedIndices, index];
      setSelectedIndices(newSelected);
      setScore(s => s + 10);
      addGems(2);
      
      // Check if all correct items are found
      const correctCount = displayItems.filter(i => i.isCorrect).length;
      if (newSelected.length === correctCount) {
        handleWin();
      }
    } else {
      // Wrong item
      setScore(s => s - 5);
      addGems(-1);
      setFeedback({ emoji: '❌', text: 'Oops! Not a ' + targetGroup.name.slice(0, -1) });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleWin = () => {
    setIsComplete(true);
    const newRounds = roundsPlayed + 1;
    setRoundsPlayed(newRounds);
    localStorage.setItem('food-group-rounds', newRounds.toString());

    const nextLevel = level + 1;
    setLevel(nextLevel);
    localStorage.setItem('food-group-level', nextLevel.toString());

    if (newRounds >= 10) {
      unlockAchievement('nutritionist');
    }

    const newHistory = [targetGroup.id, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('food-group-history', JSON.stringify(newHistory));

    // Celebrate
    if (newRounds % 10 === 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#10B981', '#F59E0B', '#3B82F6']
      });
    } else {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-[3rem] border-8 ${targetGroup.border} ${targetGroup.bg} p-10 shadow-2xl relative overflow-hidden min-h-[700px] flex flex-col`}
    >
      {/* Total Gems Box */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-2xl border-2 border-yellow-200 shadow-sm z-20">
        <Gem className="text-yellow-600" size={18} />
        <span className="font-black text-yellow-800 text-sm">{totalGems}</span>
      </div>

      {/* Decoration */}
      <div className={`absolute -top-10 -right-10 ${targetGroup.text} opacity-10 rotate-12`}>
        <Utensils size={160} fill="currentColor" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-black uppercase tracking-widest ${targetGroup.text}`}>
              {roundsPlayed % 10 === 0 && roundsPlayed > 0 ? 'Food Master! 👑' : `${progress}/10 Healthy Rounds!`}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400">{roundsPlayed} Total</span>
              <span className={`text-xs font-black ${targetGroup.text}`}>Level {level}</span>
            </div>
          </div>
          <div className="h-4 bg-white/50 rounded-full overflow-hidden border-2 border-white shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(progress / 10) * 100}%` }}
              className={`h-full ${targetGroup.color} shadow-lg`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center gap-3 ${targetGroup.accent} px-6 py-3 rounded-[2rem] border-4 ${targetGroup.border} shadow-sm`}>
            <Trophy className={targetGroup.text} size={28} />
            <span className={`font-black ${targetGroup.text} uppercase tracking-widest text-xl`}>Score: {score}</span>
          </div>
          <div className="flex gap-4">
            {isNewQuest && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-yellow-400 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-tighter flex items-center gap-2 shadow-lg border-2 border-white"
              >
                <Star size={14} fill="currentColor" />
                New Discovery!
              </motion.div>
            )}
            <button
              onClick={initGame}
              className="bg-white hover:bg-slate-50 text-slate-600 p-4 rounded-2xl transition-all active:scale-95 border-b-8 border-slate-200 shadow-lg"
            >
              <RefreshCw size={28} strokeWidth={4} />
            </button>
          </div>
        </div>

        <div className="text-center mb-10">
          <motion.div
            key={targetGroup.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-4 mb-4"
          >
            <div className={`${targetGroup.color} p-4 rounded-3xl text-white shadow-lg`}>
              <targetGroup.icon size={48} strokeWidth={3} />
            </div>
            <h2 className={`text-6xl font-black ${targetGroup.text} uppercase tracking-tighter`}>
              {targetGroup.name}
            </h2>
          </motion.div>
          <p className="text-slate-500 font-bold text-xl">
            Tick all the <span className={targetGroup.text}>{targetGroup.name}</span>!
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 flex-1">
          {displayItems.map((item, idx) => (
            <motion.button
              key={`${targetGroup.id}-${item.name}-${idx}`}
              whileHover={isComplete ? {} : { scale: 1.05, rotate: idx % 2 === 0 ? 2 : -2 }}
              whileTap={isComplete ? {} : { scale: 0.95 }}
              onClick={() => handleItemClick(idx)}
              className={`relative aspect-square rounded-[2.5rem] border-8 transition-all flex flex-col items-center justify-center gap-2 shadow-xl ${
                selectedIndices.includes(idx)
                  ? 'bg-green-500 border-green-700 text-white'
                  : 'bg-white border-white text-slate-800 hover:border-slate-100'
              } ${isComplete && !item.isCorrect ? 'opacity-30 grayscale' : ''}`}
            >
              <span className="text-7xl">{item.emoji}</span>
              <span className={`text-xs font-black uppercase tracking-widest ${selectedIndices.includes(idx) ? 'text-white' : 'text-slate-400'}`}>
                {item.name}
              </span>
              
              {selectedIndices.includes(idx) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 -right-4 bg-white text-green-600 rounded-full p-1 shadow-lg border-4 border-green-500"
                >
                  <CheckCircle2 size={32} fill="currentColor" className="text-white" />
                  <CheckCircle2 size={32} className="absolute inset-1" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1.2, opacity: 1, y: -50 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="bg-red-500 text-white px-8 py-4 rounded-full font-black flex flex-col items-center gap-1 shadow-2xl border-4 border-white">
                <span className="text-4xl">{feedback.emoji}</span>
                <span className="text-sm uppercase tracking-widest">{feedback.text}</span>
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
                <span className="text-7xl">🍎</span>
                <span className="text-7xl">🥦</span>
                <span className="text-7xl">🥛</span>
              </motion.div>
              <h3 className={`text-5xl font-black ${targetGroup.text} mb-2 tracking-tighter`}>
                {roundsPlayed % 10 === 0 ? 'FOOD EXPERT! 👑' : 'YUMMY! 😋'}
              </h3>
              <p className="text-slate-600 font-bold mb-8 text-2xl">
                {roundsPlayed % 10 === 0 
                  ? 'You know all your food groups! Amazing! ❤️' 
                  : `You found all the ${targetGroup.name}! ❤️`}
              </p>
              <button
                onClick={initGame}
                className={`${targetGroup.color} hover:opacity-90 text-white font-black px-12 py-6 rounded-[2.5rem] shadow-2xl transition-all active:scale-95 uppercase tracking-widest border-b-8 border-black/20 text-xl`}
              >
                {roundsPlayed % 10 === 0 ? 'Start New Quest! 🚀' : "Next Group! 🚀"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
