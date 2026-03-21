import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Music, CheckCircle2, XCircle, Trophy, Sparkles, Loader2 } from 'lucide-react';
import { useAchievements } from '../context/AchievementsContext';
import { GoogleGenAI, Modality } from "@google/genai";

const ANIMALS = [
  { id: 'dog', name: 'Dog', emoji: '🐶', sound: 'Woof Woof!' },
  { id: 'cat', name: 'Cat', emoji: '🐱', sound: 'Meow Meow!' },
  { id: 'cow', name: 'Cow', emoji: '🐮', sound: 'Moo Moo!' },
  { id: 'lion', name: 'Lion', emoji: '🦁', sound: 'Roar!' },
  { id: 'duck', name: 'Duck', emoji: '🦆', sound: 'Quack Quack!' },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', sound: 'Baa Baa!' },
  { id: 'pig', name: 'Pig', emoji: '🐷', sound: 'Oink Oink!' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', sound: 'Trumpet!' },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', sound: 'Ooh Ooh Aah Aah!' },
  { id: 'rooster', name: 'Rooster', emoji: '🐓', sound: 'Cock-a-doodle-doo!' },
];

export const AnimalSoundsGame: React.FC = () => {
  const { unlockAchievement } = useAchievements();
  const [currentAnimal, setCurrentAnimal] = useState(ANIMALS[0]);
  const [options, setOptions] = useState<typeof ANIMALS>([]);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateRound = useCallback(() => {
    const correct = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const others = ANIMALS.filter(a => a.id !== correct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const newOptions = [correct, ...others].sort(() => Math.random() - 0.5);
    
    setCurrentAnimal(correct);
    setOptions(newOptions);
    setFeedback(null);
    setAudioUrl(null);
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const playSound = async () => {
    if (isLoading) return;
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      return;
    }

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Make the sound of a ${currentAnimal.name}: ${currentAnimal.sound}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const url = `data:audio/wav;base64,${base64Audio}`;
        setAudioUrl(url);
        const audio = new Audio(url);
        audio.play();
      }
    } catch (error) {
      console.error('Error generating sound:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = (animalId: string) => {
    if (feedback) return;

    if (animalId === currentAnimal.id) {
      setFeedback('correct');
      setScore(s => s + 10);
      setRounds(r => {
        const next = r + 1;
        if (next >= 10) unlockAchievement('animal-expert');
        return next;
      });
      setTimeout(generateRound, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border-4 border-pink-300 p-8 shadow-xl shadow-pink-100 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Music size={120} className="text-pink-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-3 rounded-2xl border-2 border-pink-200">
              <Volume2 className="text-pink-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Sound Safari</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Listen & Identify</p>
            </div>
          </div>
          <div className="bg-pink-50 px-4 py-2 rounded-2xl border-2 border-pink-100 flex items-center gap-2">
            <Trophy size={16} className="text-pink-500" />
            <span className="font-black text-pink-700">{score}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 py-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playSound}
            disabled={isLoading}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-all border-b-8 ${
              isLoading 
                ? 'bg-slate-100 border-slate-300 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-600 border-pink-700 text-white'
            }`}
          >
            {isLoading ? (
              <Loader2 size={48} className="animate-spin" />
            ) : (
              <Volume2 size={48} />
            )}
          </motion.button>

          <p className="text-slate-600 font-black uppercase tracking-widest text-sm">
            {isLoading ? 'Generating Sound...' : 'Click to hear the animal!'}
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            {options.map((animal) => (
              <motion.button
                key={animal.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGuess(animal.id)}
                className={`p-6 rounded-3xl border-4 flex flex-col items-center gap-2 transition-all relative ${
                  feedback === 'correct' && animal.id === currentAnimal.id
                    ? 'bg-green-50 border-green-400 shadow-green-100'
                    : feedback === 'wrong' && animal.id !== currentAnimal.id
                    ? 'bg-red-50 border-red-200 opacity-50'
                    : 'bg-slate-50 border-slate-100 hover:border-pink-200 hover:bg-pink-50'
                }`}
              >
                <span className="text-4xl">{animal.emoji}</span>
                <span className="font-black text-slate-700 uppercase tracking-tight">{animal.name}</span>

                <AnimatePresence>
                  {feedback === 'correct' && animal.id === currentAnimal.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white shadow-lg"
                    >
                      <CheckCircle2 size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
            <span>Safari Progress</span>
            <span>{rounds}/10</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(rounds % 10) * 10}%` }}
              className="h-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Decorative Sparkles */}
      <div className="absolute bottom-4 left-4 text-pink-200">
        <Sparkles size={24} />
      </div>
    </motion.div>
  );
};
