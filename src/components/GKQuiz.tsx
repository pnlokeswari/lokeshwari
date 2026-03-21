import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, RefreshCw, Star, CheckCircle2, Sparkles, 
  HelpCircle, Zap, Heart, Gem
} from 'lucide-react';
import { useGems } from '../context/GemsContext';
import { useAchievements } from '../context/AchievementsContext';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  emoji: string;
}

const QUESTIONS: Question[] = [
  { id: '1', question: 'How many legs does a spider have?', options: ['4', '6', '8', '10'], answer: '8', emoji: '🕷️' },
  { id: '2', question: 'Which planet do we live on?', options: ['Mars', 'Venus', 'Earth', 'Jupiter'], answer: 'Earth', emoji: '🌍' },
  { id: '3', question: 'What is the color of an emerald?', options: ['Red', 'Blue', 'Green', 'Yellow'], answer: 'Green', emoji: '💚' },
  { id: '4', question: 'How many days are in a week?', options: ['5', '6', '7', '8'], answer: '7', emoji: '📅' },
  { id: '5', question: 'Which animal is known as the King of the Jungle?', options: ['Tiger', 'Elephant', 'Lion', 'Giraffe'], answer: 'Lion', emoji: '🦁' },
  { id: '6', question: 'What do bees make?', options: ['Milk', 'Honey', 'Juice', 'Water'], answer: 'Honey', emoji: '🐝' },
  { id: '7', question: 'How many colors are in a rainbow?', options: ['5', '6', '7', '8'], answer: '7', emoji: '🌈' },
  { id: '8', question: 'Which is the largest land animal?', options: ['Lion', 'Elephant', 'Hippo', 'Rhino'], answer: 'Elephant', emoji: '🐘' },
  { id: '9', question: 'What is the baby of a dog called?', options: ['Kitten', 'Cub', 'Puppy', 'Calf'], answer: 'Puppy', emoji: '🐶' },
  { id: '10', question: 'Which fruit is yellow and long?', options: ['Apple', 'Banana', 'Orange', 'Grape'], answer: 'Banana', emoji: '🍌' },
  { id: '11', question: 'What is the frozen form of water?', options: ['Steam', 'Ice', 'Rain', 'Cloud'], answer: 'Ice', emoji: '🧊' },
  { id: '12', question: 'How many months are in a year?', options: ['10', '11', '12', '13'], answer: '12', emoji: '🗓️' },
  { id: '13', question: 'Which bird can mimic human speech?', options: ['Eagle', 'Parrot', 'Owl', 'Penguin'], answer: 'Parrot', emoji: '🦜' },
  { id: '14', question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Rome'], answer: 'Paris', emoji: '🗼' },
  { id: '15', question: 'Which shape has three sides?', options: ['Square', 'Circle', 'Triangle', 'Rectangle'], answer: 'Triangle', emoji: '📐' },
  { id: '16', question: 'What do you use to see things far away?', options: ['Microscope', 'Telescope', 'Glasses', 'Mirror'], answer: 'Telescope', emoji: '🔭' },
  { id: '17', question: 'Which gas do humans breathe in to live?', options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Helium'], answer: 'Oxygen', emoji: '🌬️' },
  { id: '18', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 'Pacific', emoji: '🌊' },
  { id: '19', question: 'How many primary colors are there?', options: ['2', '3', '4', '5'], answer: '3', emoji: '🎨' },
  { id: '20', question: 'Which organ pumps blood in our body?', options: ['Brain', 'Lungs', 'Heart', 'Stomach'], answer: 'Heart', emoji: '❤️' },
];

export const GKQuiz: React.FC = () => {
  const { totalGems, addGems } = useGems();
  const { unlockAchievement } = useAchievements();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('gk-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [roundsPlayed, setRoundsPlayed] = useState(() => {
    const saved = localStorage.getItem('gk-rounds');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('gk-level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const progress = useMemo(() => (roundsPlayed % 10) + 1, [roundsPlayed]);

  const initGame = useCallback(() => {
    const availableQuestions = QUESTIONS.filter(q => !history.includes(q.id));
    const pool = availableQuestions.length > 0 ? availableQuestions : QUESTIONS;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    setCurrentQuestion(selected);
    setIsComplete(false);
    setFeedback(null);
  }, [history]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleAnswer = (option: string) => {
    if (isComplete || feedback) return;

    if (option === currentQuestion?.answer) {
      const newScore = score + 20;
      setScore(newScore);
      addGems(5);
      
      if (newScore >= 100) {
        unlockAchievement('perfect-score');
      }

      setFeedback({ isCorrect: true, text: 'Correct! +5 Gems ✨' });
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.7 }
      });
      
      setTimeout(() => {
        const newRounds = roundsPlayed + 1;
        setRoundsPlayed(newRounds);
        localStorage.setItem('gk-rounds', newRounds.toString());

        const newHistory = [currentQuestion.id, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('gk-history', JSON.stringify(newHistory));

        if (newRounds >= 10) {
          unlockAchievement('quiz-whiz');
        }

        const nextLevel = level + 1;
        setLevel(nextLevel);
        localStorage.setItem('gk-level', nextLevel.toString());

        if (newRounds % 10 === 0) {
          setIsComplete(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          initGame();
        }
      }, 1500);
    } else {
      setScore(s => s - 10); // Score can go below 0
      addGems(-2); // Decrease gems
      setFeedback({ isCorrect: false, text: 'Oops! Try again! -10 Score, -2 Gems' });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  if (!currentQuestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border-4 border-purple-300 p-8 shadow-xl shadow-purple-100 relative overflow-hidden flex flex-col min-h-[500px]"
    >
      {/* Total Gems Box */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-2xl border-2 border-yellow-200 shadow-sm z-20">
        <Gem className="text-yellow-600" size={18} />
        <span className="font-black text-yellow-800 text-sm">{totalGems}</span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">
              {roundsPlayed % 10 === 0 && roundsPlayed > 0 ? 'Quiz Master! 🎓' : `${progress}/10 Brainy Questions!`}
            </span>
          </div>
          <div className="h-2 bg-purple-50 rounded-full overflow-hidden border border-purple-100 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(progress / 10) * 100}%` }}
              className="h-full bg-purple-500 shadow-lg"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-2xl border-2 border-purple-200">
            <Trophy className="text-purple-600" size={20} />
            <span className="font-black text-purple-800 uppercase tracking-wider text-sm">Score: {score}</span>
          </div>
          <button 
            onClick={initGame}
            className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <RefreshCw size={20} className="text-slate-600" />
          </button>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Level</span>
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-2xl border-2 border-purple-200">
              <Star className="text-purple-600" size={16} />
              <span className="font-black text-purple-800 text-sm">{level}</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4 drop-shadow-md">{currentQuestion.emoji}</div>
          <h2 className="text-xl font-black text-purple-600 uppercase tracking-tight leading-tight">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          {currentQuestion.options.map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(option)}
              className="bg-white border-4 border-slate-100 rounded-2xl p-4 font-black text-slate-700 hover:border-purple-200 hover:bg-purple-50 transition-all uppercase tracking-wider"
            >
              {option}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-30 rounded-[2rem]"
            >
              <div className={`p-8 rounded-[2rem] border-4 flex flex-col items-center gap-4 shadow-2xl ${
                feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <span className="text-6xl">{feedback.isCorrect ? '🌟' : '🤔'}</span>
                <span className={`text-xl font-black uppercase tracking-widest text-center ${
                  feedback.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {feedback.text}
                </span>
              </div>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 z-40 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center rounded-[2rem] p-8 text-center"
            >
              <div className="text-7xl mb-6">🎓✨🏆</div>
              <h3 className="text-4xl font-black text-purple-600 uppercase tracking-tighter">
                QUIZ MASTER!
              </h3>
              <p className="text-slate-500 font-bold mt-4 text-lg">
                You finished 10 questions! You're so smart! ❤️
              </p>
              <button
                onClick={initGame}
                className="mt-8 bg-purple-500 hover:bg-purple-600 text-white font-black px-10 py-5 rounded-[2rem] shadow-xl shadow-purple-200 transition-all active:scale-95 uppercase tracking-widest border-b-8 border-purple-700 text-lg"
              >
                Start New Quiz! 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
