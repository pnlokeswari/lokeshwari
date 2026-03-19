import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, X, Globe } from 'lucide-react';
import { City } from '../types';
import { ALL_CITIES } from '../constants';

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (city: City) => void;
  existingIds: string[];
}

export const AddCityModal: React.FC<AddCityModalProps> = ({ isOpen, onClose, onAdd, existingIds }) => {
  const [search, setSearch] = useState('');

  const filteredCities = ALL_CITIES.filter(city => 
    (city.name.toLowerCase().includes(search.toLowerCase()) || 
     city.country.toLowerCase().includes(search.toLowerCase())) &&
    !existingIds.includes(city.id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Add City</h2>
              <p className="text-sm text-slate-500">Track time across the world</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              autoFocus
              type="text"
              placeholder="Search by city or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {filteredCities.length > 0 ? (
              filteredCities.map(city => (
                <button
                  key={city.id}
                  onClick={() => {
                    onAdd(city);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50 group transition-all text-left"
                >
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {city.name}
                    </div>
                    <div className="text-sm text-slate-500">{city.country} • {city.timezone}</div>
                  </div>
                  <div className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Plus size={18} />
                  </div>
                </button>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-400">No cities found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
