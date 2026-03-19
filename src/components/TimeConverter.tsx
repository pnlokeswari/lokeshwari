import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Info } from 'lucide-react';

interface TimeConverterProps {
  baseTime: Date;
  onTimeChange: (newTime: Date) => void;
  onReset: () => void;
  isActive: boolean;
}

export const TimeConverter: React.FC<TimeConverterProps> = ({ baseTime, onTimeChange, onReset, isActive }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = parseInt(e.target.value);
    const newTime = new Date();
    newTime.setHours(hours, 0, 0, 0);
    onTimeChange(newTime);
  };

  const currentHour = baseTime.getHours();

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Meeting Planner</h2>
            <p className="text-sm text-slate-500">Slide to find the perfect time for everyone</p>
          </div>
        </div>
        
        {isActive && (
          <button
            onClick={onReset}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-xl bg-indigo-50 transition-colors"
          >
            Reset to Real-time
          </button>
        )}
      </div>

      <div className="relative pt-8 pb-4">
        <div className="absolute top-0 left-0 w-full flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="23"
          value={currentHour}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        
        <div className="mt-6 flex items-start gap-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            Adjusting the slider updates all clocks to show the relative time. 
            Use this to check availability across different time zones for your next global call.
          </p>
        </div>
      </div>
    </div>
  );
};
