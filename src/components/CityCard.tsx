import React from 'react';
import { motion } from 'motion/react';
import { X, Clock, Sun, Moon, CloudSun } from 'lucide-react';
import { City } from '../types';

interface CityCardProps {
  city: City;
  time: Date;
  onRemove: (id: string) => void;
  isBase?: boolean;
}

export const CityCard: React.FC<CityCardProps> = ({ city, time, onRemove, isBase }) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: city.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: isBase ? '2-digit' : undefined,
    hour12: true,
  });

  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: city.timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const hour24 = parseInt(new Intl.DateTimeFormat('en-US', {
    timeZone: city.timezone,
    hour: 'numeric',
    hour12: false,
  }).format(time));

  const isNight = hour24 >= 20 || hour24 < 6;
  const isGoldenHour = (hour24 >= 6 && hour24 < 8) || (hour24 >= 18 && hour24 < 20);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
      whileHover={{ scale: 1.05, rotate: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`relative group p-6 rounded-[2rem] border-4 transition-all duration-300 ${
        isNight 
          ? 'bg-indigo-950 border-indigo-800 text-indigo-100 shadow-xl' 
          : isGoldenHour
            ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-lg'
            : 'bg-white border-sky-200 text-slate-900 shadow-lg shadow-sky-100'
      }`}
    >
      <button
        onClick={() => onRemove(city.id)}
        className="absolute -top-2 -right-2 p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all active:scale-90 z-10"
      >
        <X size={16} strokeWidth={3} />
      </button>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{city.emoji}</span>
          <div>
            <h3 className="text-xl font-black tracking-tight">{city.name}</h3>
            <p className={`text-[10px] font-bold uppercase tracking-widest opacity-70`}>
              {city.country}
            </p>
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${isNight ? 'bg-indigo-800' : isGoldenHour ? 'bg-amber-200' : 'bg-sky-100'}`}>
          {isNight ? <Moon size={24} className="text-yellow-300" /> : isGoldenHour ? <CloudSun size={24} className="text-orange-500" /> : <Sun size={24} className="text-yellow-500" />}
        </div>
      </div>

      <div className="space-y-2 bg-black/5 rounded-2xl p-4">
        <div className="text-3xl font-black font-mono tabular-nums tracking-tighter text-center">
          {formatter.format(time)}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-bold opacity-70">
          <Clock size={14} />
          <span>{dayFormatter.format(time)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t-2 border-dashed border-current border-opacity-20 flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
        <span className="opacity-70">{city.timezone.split('/')[0]}</span>
        <span className={`px-3 py-1 rounded-full ${isNight ? 'bg-indigo-800' : 'bg-current bg-opacity-10'}`}>
          {new Intl.DateTimeFormat('en-US', {
            timeZone: city.timezone,
            timeZoneName: 'short',
          }).format(time).split(' ').pop()}
        </span>
      </div>
    </motion.div>
  );
};
