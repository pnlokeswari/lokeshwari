import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Globe2, Settings2, Github, LayoutGrid, List, Clock } from 'lucide-react';
import { City } from './types';
import { ALL_CITIES, DEFAULT_CITIES } from './constants';
import { CityCard } from './components/CityCard';
import { AddCityModal } from './components/AddCityModal';
import { TimeConverter } from './components/TimeConverter';
import { MathPuzzle } from './components/MathPuzzle';
import { OppositesGame } from './components/OppositesGame';
import { MissingNumbers } from './components/MissingNumbers';
import { NumberMatch } from './components/NumberMatch';
import { FoodGroupGame } from './components/FoodGroupGame';
import { GKQuiz } from './components/GKQuiz';
import { AnimalSoundsGame } from './components/AnimalSoundsGame';
import { GemsProvider } from './context/GemsContext';
import { AchievementsProvider } from './context/AchievementsContext';
import { AchievementNotification } from './components/AchievementNotification';
import { TrophyRoom } from './components/TrophyRoom';

export default function App() {
  const [addedCities, setAddedCities] = useState<City[]>(() => {
    const saved = localStorage.getItem('world-clock-cities');
    if (saved) return JSON.parse(saved);
    return ALL_CITIES.filter(c => DEFAULT_CITIES.includes(c.id));
  });

  const [baseTime, setBaseTime] = useState(new Date());
  const [isConverterActive, setIsConverterActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Real-time update
  useEffect(() => {
    if (isConverterActive) return;

    const timer = setInterval(() => {
      setBaseTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isConverterActive]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('world-clock-cities', JSON.stringify(addedCities));
  }, [addedCities]);

  const handleAddCity = (city: City) => {
    setAddedCities(prev => [...prev, city]);
  };

  const handleRemoveCity = (id: string) => {
    setAddedCities(prev => prev.filter(c => c.id !== id));
  };

  const handleTimeChange = (newTime: Date) => {
    setIsConverterActive(true);
    setBaseTime(newTime);
  };

  const handleResetTime = () => {
    setIsConverterActive(false);
    setBaseTime(new Date());
  };

  return (
    <AchievementsProvider>
      <GemsProvider>
        <div className="min-h-screen bg-sky-50 text-slate-900 font-sans selection:bg-yellow-200 selection:text-yellow-900">
          <AchievementNotification />
          {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-4 border-sky-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-yellow-200 border-2 border-white"
              >
                <Clock size={28} strokeWidth={3} />
              </motion.div>
              <div className="flex flex-col">
                <h1 className="text-base sm:text-xl font-black tracking-tight text-indigo-600 leading-none">
                  Chirla Joshnav Reddy and Chirla Rama Reddy
                </h1>
                <span className="text-[10px] sm:text-xs font-black text-orange-500 uppercase tracking-[0.3em] mt-1">
                  🌟 World Clock Adventure 🌟
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-green-200 active:scale-90 border-b-4 border-green-700"
              >
                <Plus size={20} strokeWidth={3} />
                <span className="hidden sm:inline uppercase tracking-wider">Add City</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Clocks & Converter */}
          <div className="lg:col-span-8 space-y-8">
            <TimeConverter 
              baseTime={baseTime} 
              onTimeChange={handleTimeChange} 
              onReset={handleResetTime}
              isActive={isConverterActive}
            />

            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
              : "flex flex-col gap-4"
            }>
              <AnimatePresence mode="popLayout">
                {addedCities.map((city) => (
                  <CityCard
                    key={city.id}
                    city={city}
                    time={baseTime}
                    onRemove={handleRemoveCity}
                    isBase={!isConverterActive}
                  />
                ))}
              </AnimatePresence>

              {addedCities.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-flex p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                    <Globe2 size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">No cities added</h3>
                  <p className="text-slate-500 mt-2">Start by adding a city to track its time.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 text-indigo-600 font-medium hover:underline"
                  >
                    Add your first city
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Games */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <MathPuzzle />
              <AnimalSoundsGame />
              <TrophyRoom />
              <GKQuiz />
              <FoodGroupGame />
              <NumberMatch />
              <OppositesGame />
              <MissingNumbers />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-500">
            © 2026 Chirla Joshnav Reddy and Chirla Rama Reddy. Built for global teams.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
              <Settings2 size={20} />
            </a>
          </div>
        </div>
      </footer>

      <AddCityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCity}
        existingIds={addedCities.map(c => c.id)}
      />
    </div>
      </GemsProvider>
    </AchievementsProvider>
  );
}
