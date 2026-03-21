import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Star, Trophy, RefreshCw, CheckCircle2, Heart, Apple, Sun, Moon, Cloud, 
  Ghost, Rocket, Zap, Anchor, Bell, Bike, Bird, Bone, Cake, Car, Cat, 
  Cherry, Coffee, Cookie, Crown, Dog, Fish, Flower, Gift, IceCream, 
  Leaf, Music, Pizza, Plane, Rabbit, Shell, Ship,  Smile, Snowflake, 
  Citrus, Umbrella, Activity, AlarmClock, Aperture, Archive, Award, 
  Battery, Book, BookOpen, Box, Briefcase, Calendar, Camera, Clock, 
  Compass, Cpu, CreditCard, Crosshair, Database, Disc, DollarSign, 
  Droplet, Eye, Feather, Flag, Folder, Globe, Grid, HardDrive, Hash, 
  Headphones, Home, Image, Inbox, Key, Layers, Layout, LifeBuoy, Link, 
  List, Lock, Mail, Map, MapPin, Menu, MessageCircle, Mic, Monitor, 
  MousePointer, Navigation, Package, Paperclip, Pause, PenTool, Phone, 
  PieChart, Play, Plus, Power, Printer, Radio, Save, Scissors, Search, 
  Send, Server, Settings, Share, Shield, ShoppingBag, ShoppingCart, 
  Shuffle, Smartphone, Speaker, Square, StopCircle, Tablet, Tag, 
  Target, Terminal, Thermometer, ThumbsUp, Ticket, Wrench, Trash, Triangle, 
  Truck, Tv, Unlock, Upload, User, Users, Video, Volume, Watch, Wifi, 
  Wind, ZapOff, ZoomIn, Gem
} from 'lucide-react';
import { useGems } from '../context/GemsContext';
import { useAchievements } from '../context/AchievementsContext';

const ICONS = [
  { name: 'Star', icon: Star, color: 'text-yellow-400' },
  { name: 'Heart', icon: Heart, color: 'text-red-400' },
  { name: 'Apple', icon: Apple, color: 'text-rose-500' },
  { name: 'Sun', icon: Sun, color: 'text-amber-400' },
  { name: 'Moon', icon: Moon, color: 'text-indigo-400' },
  { name: 'Cloud', icon: Cloud, color: 'text-sky-400' },
  { name: 'Ghost', icon: Ghost, color: 'text-slate-400' },
  { name: 'Rocket', icon: Rocket, color: 'text-orange-500' },
  { name: 'Zap', icon: Zap, color: 'text-yellow-500' },
  { name: 'Anchor', icon: Anchor, color: 'text-blue-600' },
  { name: 'Bell', icon: Bell, color: 'text-yellow-600' },
  { name: 'Bike', icon: Bike, color: 'text-emerald-500' },
  { name: 'Bird', icon: Bird, color: 'text-sky-500' },
  { name: 'Bone', icon: Bone, color: 'text-stone-400' },
  { name: 'Cake', icon: Cake, color: 'text-pink-400' },
  { name: 'Car', icon: Car, color: 'text-red-500' },
  { name: 'Cat', icon: Cat, color: 'text-orange-400' },
  { name: 'Cherry', icon: Cherry, color: 'text-rose-600' },
  { name: 'Coffee', icon: Coffee, color: 'text-amber-800' },
  { name: 'Cookie', icon: Cookie, color: 'text-amber-700' },
  { name: 'Crown', icon: Crown, color: 'text-yellow-500' },
  { name: 'Dog', icon: Dog, color: 'text-amber-600' },
  { name: 'Fish', icon: Fish, color: 'text-cyan-500' },
  { name: 'Flower', icon: Flower, color: 'text-pink-500' },
  { name: 'Gift', icon: Gift, color: 'text-purple-500' },
  { name: 'IceCream', icon: IceCream, color: 'text-pink-300' },
  { name: 'Leaf', icon: Leaf, color: 'text-green-500' },
  { name: 'Music', icon: Music, color: 'text-violet-500' },
  { name: 'Pizza', icon: Pizza, color: 'text-orange-600' },
  { name: 'Plane', icon: Plane, color: 'text-blue-400' },
  { name: 'Rabbit', icon: Rabbit, color: 'text-slate-300' },
  { name: 'Shell', icon: Shell, color: 'text-teal-400' },
  { name: 'Ship', icon: Ship, color: 'text-blue-700' },
  { name: 'Smile', icon: Smile, color: 'text-yellow-400' },
  { name: 'Snowflake', icon: Snowflake, color: 'text-blue-200' },
  { name: 'Citrus', icon: Citrus, color: 'text-orange-400' },
  { name: 'Umbrella', icon: Umbrella, color: 'text-indigo-500' },
  { name: 'Activity', icon: Activity, color: 'text-rose-400' },
  { name: 'AlarmClock', icon: AlarmClock, color: 'text-red-400' },
  { name: 'Aperture', icon: Aperture, color: 'text-indigo-500' },
  { name: 'Archive', icon: Archive, color: 'text-amber-600' },
  { name: 'Award', icon: Award, color: 'text-yellow-500' },
  { name: 'Battery', icon: Battery, color: 'text-emerald-500' },
  { name: 'Book', icon: Book, color: 'text-blue-600' },
  { name: 'BookOpen', icon: BookOpen, color: 'text-sky-600' },
  { name: 'Box', icon: Box, color: 'text-orange-700' },
  { name: 'Briefcase', icon: Briefcase, color: 'text-stone-600' },
  { name: 'Calendar', icon: Calendar, color: 'text-rose-500' },
  { name: 'Camera', icon: Camera, color: 'text-slate-600' },
  { name: 'Clock', icon: Clock, color: 'text-blue-500' },
  { name: 'Compass', icon: Compass, color: 'text-teal-600' },
  { name: 'Cpu', icon: Cpu, color: 'text-purple-600' },
  { name: 'CreditCard', icon: CreditCard, color: 'text-indigo-600' },
  { name: 'Crosshair', icon: Crosshair, color: 'text-red-600' },
  { name: 'Database', icon: Database, color: 'text-blue-800' },
  { name: 'Disc', icon: Disc, color: 'text-slate-500' },
  { name: 'DollarSign', icon: DollarSign, color: 'text-green-600' },
  { name: 'Droplet', icon: Droplet, color: 'text-blue-400' },
  { name: 'Eye', icon: Eye, color: 'text-indigo-400' },
  { name: 'Feather', icon: Feather, color: 'text-slate-400' },
  { name: 'Flag', icon: Flag, color: 'text-red-500' },
  { name: 'Folder', icon: Folder, color: 'text-amber-500' },
  { name: 'Globe', icon: Globe, color: 'text-sky-500' },
  { name: 'Grid', icon: Grid, color: 'text-slate-400' },
  { name: 'HardDrive', icon: HardDrive, color: 'text-stone-500' },
  { name: 'Hash', icon: Hash, color: 'text-slate-400' },
  { name: 'Headphones', icon: Headphones, color: 'text-indigo-600' },
  { name: 'Home', icon: Home, color: 'text-amber-600' },
  { name: 'Image', icon: Image, color: 'text-emerald-400' },
  { name: 'Inbox', icon: Inbox, color: 'text-blue-500' },
  { name: 'Key', icon: Key, color: 'text-yellow-600' },
  { name: 'Layers', icon: Layers, color: 'text-purple-400' },
  { name: 'Layout', icon: Layout, color: 'text-blue-400' },
  { name: 'LifeBuoy', icon: LifeBuoy, color: 'text-orange-500' },
  { name: 'Link', icon: Link, color: 'text-slate-500' },
  { name: 'List', icon: List, color: 'text-indigo-500' },
  { name: 'Lock', icon: Lock, color: 'text-stone-600' },
  { name: 'Mail', icon: Mail, color: 'text-rose-400' },
  { name: 'Map', icon: Map, color: 'text-emerald-600' },
  { name: 'MapPin', icon: MapPin, color: 'text-red-500' },
  { name: 'Menu', icon: Menu, color: 'text-slate-600' },
  { name: 'MessageCircle', icon: MessageCircle, color: 'text-sky-400' },
  { name: 'Mic', icon: Mic, color: 'text-slate-600' },
  { name: 'Monitor', icon: Monitor, color: 'text-blue-500' },
  { name: 'MousePointer', icon: MousePointer, color: 'text-slate-600' },
  { name: 'Navigation', icon: Navigation, color: 'text-blue-600' },
  { name: 'Package', icon: Package, color: 'text-amber-700' },
  { name: 'Paperclip', icon: Paperclip, color: 'text-slate-400' },
  { name: 'Pause', icon: Pause, color: 'text-slate-600' },
  { name: 'PenTool', icon: PenTool, color: 'text-purple-500' },
  { name: 'Phone', icon: Phone, color: 'text-green-600' },
  { name: 'PieChart', icon: PieChart, color: 'text-rose-500' },
  { name: 'Play', icon: Play, color: 'text-emerald-500' },
  { name: 'Plus', icon: Plus, color: 'text-blue-500' },
  { name: 'Power', icon: Power, color: 'text-red-500' },
  { name: 'Printer', icon: Printer, color: 'text-slate-500' },
  { name: 'Radio', icon: Radio, color: 'text-indigo-500' },
  { name: 'Save', icon: Save, color: 'text-blue-600' },
  { name: 'Scissors', icon: Scissors, color: 'text-slate-600' },
  { name: 'Search', icon: Search, color: 'text-slate-500' },
  { name: 'Send', icon: Send, color: 'text-sky-500' },
  { name: 'Server', icon: Server, color: 'text-stone-600' },
  { name: 'Settings', icon: Settings, color: 'text-slate-500' },
  { name: 'Share', icon: Share, color: 'text-blue-400' },
  { name: 'Shield', icon: Shield, color: 'text-indigo-600' },
  { name: 'ShoppingBag', icon: ShoppingBag, color: 'text-pink-500' },
  { name: 'ShoppingCart', icon: ShoppingCart, color: 'text-blue-500' },
  { name: 'Shuffle', icon: Shuffle, color: 'text-purple-500' },
  { name: 'Smartphone', icon: Smartphone, color: 'text-slate-600' },
  { name: 'Speaker', icon: Speaker, color: 'text-slate-600' },
  { name: 'Square', icon: Square, color: 'text-slate-400' },
  { name: 'StopCircle', icon: StopCircle, color: 'text-red-500' },
  { name: 'Tablet', icon: Tablet, color: 'text-slate-600' },
  { name: 'Tag', icon: Tag, color: 'text-amber-500' },
  { name: 'Target', icon: Target, color: 'text-red-600' },
  { name: 'Terminal', icon: Terminal, color: 'text-emerald-600' },
  { name: 'Thermometer', icon: Thermometer, color: 'text-orange-500' },
  { name: 'ThumbsUp', icon: ThumbsUp, color: 'text-blue-500' },
  { name: 'Ticket', icon: Ticket, color: 'text-orange-400' },
  { name: 'Wrench', icon: Wrench, color: 'text-slate-600' },
  { name: 'Trash', icon: Trash, color: 'text-slate-400' },
  { name: 'Triangle', icon: Triangle, color: 'text-amber-500' },
  { name: 'Truck', icon: Truck, color: 'text-blue-600' },
  { name: 'Tv', icon: Tv, color: 'text-slate-600' },
  { name: 'Unlock', icon: Unlock, color: 'text-emerald-500' },
  { name: 'Upload', icon: Upload, color: 'text-blue-500' },
  { name: 'User', icon: User, color: 'text-indigo-500' },
  { name: 'Users', icon: Users, color: 'text-indigo-600' },
  { name: 'Video', icon: Video, color: 'text-slate-600' },
  { name: 'Volume', icon: Volume, color: 'text-slate-600' },
  { name: 'Watch', icon: Watch, color: 'text-stone-600' },
  { name: 'Wifi', icon: Wifi, color: 'text-blue-400' },
  { name: 'Wind', icon: Wind, color: 'text-sky-400' },
  { name: 'ZapOff', icon: ZapOff, color: 'text-slate-400' },
  { name: 'ZoomIn', icon: ZoomIn, color: 'text-slate-500' },
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
  { name: 'Sunset Bay', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', accent: 'bg-orange-100', emoji: '🌅' },
  { name: 'Frosty Peak', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', accent: 'bg-cyan-100', emoji: '🏔️' },
  { name: 'Autumn Grove', bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', accent: 'bg-orange-200', emoji: '🍂' },
  { name: 'Cherry Blossom', bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-400', accent: 'bg-rose-100', emoji: '🌸' },
  { name: 'Deep Sea', bg: 'bg-blue-900', border: 'border-blue-700', text: 'text-blue-100', accent: 'bg-blue-800', emoji: '🐙' },
  { name: 'Volcano Island', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', accent: 'bg-red-100', emoji: '🌋' },
  { name: 'Cyber City', bg: 'bg-slate-900', border: 'border-indigo-500', text: 'text-indigo-400', accent: 'bg-slate-800', emoji: '🏙️' },
  { name: 'Honey Meadow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', accent: 'bg-yellow-100', emoji: '🐝' },
  { name: 'Lavender Field', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-500', accent: 'bg-purple-100', emoji: '🪻' },
  { name: 'Emerald Isle', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'bg-green-100', emoji: '🍀' },
];

export const NumberMatch: React.FC = () => {
  const { totalGems, addGems } = useGems();
  const { unlockAchievement } = useAchievements();
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
  const [isNewQuest, setIsNewQuest] = useState(false);

  // History tracking
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('number-match-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [roundsPlayed, setRoundsPlayed] = useState(() => {
    const saved = localStorage.getItem('number-match-rounds');
    return saved ? parseInt(saved) : 0;
  });
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('number-match-level');
    return saved ? parseInt(saved) : 1;
  });

  const progress = useMemo(() => (roundsPlayed % 10) + 1, [roundsPlayed]);

  const initGame = useCallback(() => {
    // Filter out recent icons (last 10)
    const availableIcons = ICONS.filter(icon => !history.includes(icon.name));
    
    // If pool is too small, reset history or just pick from all
    const pool = availableIcons.length > 0 ? availableIcons : ICONS;
    const selectedIcon = pool[Math.floor(Math.random() * pool.length)];
    
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
    setActiveIcon(selectedIcon);
    setTheme(THEMES[Math.floor(Math.random() * THEMES.length)]);
    setLastMatch(null);
    setIsNewQuest(!history.includes(selectedIcon.name));
  }, [history]);

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
        addGems(3);
        setSelected(null);
        
        const randomEmoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
        setLastMatch({ value, emoji: randomEmoji });
        setTimeout(() => setLastMatch(null), 1000);
        
        if (newMatches.length === numbers.length) {
          setIsComplete(true);
          
          // Update history and rounds
          const newRounds = roundsPlayed + 1;
          setRoundsPlayed(newRounds);
          localStorage.setItem('number-match-rounds', newRounds.toString());
          
          const nextLevel = level + 1;
          setLevel(nextLevel);
          localStorage.setItem('number-match-level', nextLevel.toString());

          if (newRounds >= 10) {
            unlockAchievement('match-master');
          }

          const newHistory = [activeIcon.name, ...history].slice(0, 10);
          setHistory(newHistory);
          localStorage.setItem('number-match-history', JSON.stringify(newHistory));

          // Celebrate with confetti
          if (newRounds % 10 === 0) {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98']
            });
          } else {
            confetti({
              particleCount: 40,
              spread: 50,
              origin: { y: 0.7 }
            });
          }
        }
      } else {
        // Wrong match or same type clicked
        if (selected.type !== type && selected.value !== value) {
          setScore(s => s - 5);
          addGems(-1);
        }
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
      {/* Total Gems Box */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-2xl border-2 border-yellow-200 shadow-sm z-20">
        <Gem className="text-yellow-600" size={18} />
        <span className="font-black text-yellow-800 text-sm">{totalGems}</span>
      </div>

      <div className={`absolute -top-8 -right-8 ${theme.text} opacity-10 rotate-12`}>
        <Heart size={128} fill="currentColor" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-black uppercase tracking-widest ${theme.text}`}>
              {roundsPlayed % 10 === 0 && roundsPlayed > 0 ? 'Quest Complete! 🎉' : `${progress}/10 Fun Rounds Ahead!`}
            </span>
            <span className="text-xs font-black text-slate-400">{roundsPlayed} Total</span>
            <span className="text-xs font-black text-indigo-500 ml-4">Level {level}</span>
          </div>
          <div className="h-4 bg-white/50 rounded-full overflow-hidden border-2 border-white shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(progress / 10) * 100}%` }}
              className={`h-full ${theme.text.replace('text', 'bg')} shadow-lg`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-10">
          <div className={`flex items-center gap-3 ${theme.accent} px-6 py-3 rounded-[2rem] border-4 ${theme.border} shadow-sm`}>
            <Trophy className={theme.text} size={28} />
            <span className={`font-black ${theme.text} uppercase tracking-widest text-xl`}>Score: {score}</span>
          </div>
          <div className="flex gap-4">
            {isNewQuest && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-yellow-400 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-tighter flex items-center gap-2 shadow-lg border-2 border-white"
              >
                <Star size={14} fill="currentColor" />
                New Adventure!
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
              <h3 className="text-4xl font-black text-indigo-600 mb-2 tracking-tighter">
                {roundsPlayed % 10 === 0 ? 'QUEST MASTER! 🏆' : 'AMAZING! 🌈'}
              </h3>
              <p className="text-slate-600 font-bold mb-8 text-xl">
                {roundsPlayed % 10 === 0 
                  ? 'You finished 10 rounds! Time for a new adventure! ❤️' 
                  : 'You matched all the numbers! ❤️'}
              </p>
              <button
                onClick={initGame}
                className="bg-pink-500 hover:bg-pink-600 text-white font-black px-10 py-5 rounded-[2rem] shadow-xl shadow-pink-200 transition-all active:scale-95 uppercase tracking-widest border-b-8 border-pink-700 text-lg"
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
