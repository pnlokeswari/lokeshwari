import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, RefreshCw, CheckCircle2, XCircle, Gem } from 'lucide-react';

export const MathPuzzle: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'impossible'>('easy');
  const [problem, setProblem] = useState({ n1: 0, n2: 0, op: '+', ans: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const generateProblem = (currentDiff?: 'easy' | 'medium' | 'hard' | 'impossible') => {
    const diff = currentDiff || difficulty;
    const ops = diff === 'easy' ? ['+', '-'] : ['+', '-', '*', '/'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1, n2, ans;

    if (diff === 'easy') {
      if (op === '+') {
        n1 = Math.floor(Math.random() * 20) + 1;
        n2 = Math.floor(Math.random() * 20) + 1;
        ans = n1 + n2;
      } else {
        n1 = Math.floor(Math.random() * 20) + 10;
        n2 = Math.floor(Math.random() * n1) + 1;
        ans = n1 - n2;
      }
    } else if (diff === 'medium') {
      if (op === '+') {
        n1 = Math.floor(Math.random() * 100) + 10;
        n2 = Math.floor(Math.random() * 100) + 10;
        ans = n1 + n2;
      } else if (op === '-') {
        n1 = Math.floor(Math.random() * 100) + 50;
        n2 = Math.floor(Math.random() * n1) + 1;
        ans = n1 - n2;
      } else if (op === '*') {
        n1 = Math.floor(Math.random() * 12) + 2;
        n2 = Math.floor(Math.random() * 12) + 2;
        ans = n1 * n2;
      } else {
        ans = Math.floor(Math.random() * 10) + 2;
        n2 = Math.floor(Math.random() * 10) + 2;
        n1 = ans * n2;
      }
    } else if (diff === 'hard') {
      if (op === '+') {
        n1 = Math.floor(Math.random() * 900) + 100;
        n2 = Math.floor(Math.random() * 900) + 100;
        ans = n1 + n2;
      } else if (op === '-') {
        n1 = Math.floor(Math.random() * 1000) + 500;
        n2 = Math.floor(Math.random() * n1) + 100;
        ans = n1 - n2;
      } else if (op === '*') {
        n1 = Math.floor(Math.random() * 25) + 10;
        n2 = Math.floor(Math.random() * 15) + 5;
        ans = n1 * n2;
      } else {
        ans = Math.floor(Math.random() * 20) + 5;
        n2 = Math.floor(Math.random() * 15) + 5;
        n1 = ans * n2;
      }
    } else {
      // Impossible
      if (op === '+') {
        n1 = Math.floor(Math.random() * 900000) + 100000;
        n2 = Math.floor(Math.random() * 900000) + 100000;
        ans = n1 + n2;
      } else if (op === '-') {
        n1 = Math.floor(Math.random() * 2000000) + 1000000;
        n2 = Math.floor(Math.random() * 900000) + 100000;
        ans = n1 - n2;
      } else if (op === '*') {
        n1 = Math.floor(Math.random() * 500) + 100;
        n2 = Math.floor(Math.random() * 100) + 50;
        ans = n1 * n2;
      } else {
        ans = Math.floor(Math.random() * 100) + 50;
        n2 = Math.floor(Math.random() * 100) + 50;
        n1 = ans * n2;
      }
    }

    setProblem({ n1, n2, op, ans });
    setUserInput('');
    setFeedback(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleDifficultyChange = (newDiff: 'easy' | 'medium' | 'hard' | 'impossible') => {
    setDifficulty(newDiff);
    generateProblem(newDiff);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAns = parseInt(userInput);
    if (numAns === problem.ans) {
      setFeedback('correct');
      setScore(s => s + 10);
      setStreak(s => s + 1);
      setTimeout(generateProblem, 1500);
    } else {
      setFeedback('wrong');
      setScore(s => s - 10);
      setStreak(0);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-[2.5rem] border-4 border-yellow-300 p-8 shadow-xl shadow-yellow-100 relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute -top-4 -left-4 text-yellow-200 opacity-50 rotate-12">
        <Star size={64} fill="currentColor" />
      </div>
      <div className="absolute -bottom-4 -right-4 text-sky-200 opacity-50 -rotate-12">
        <Star size={64} fill="currentColor" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-2xl border-2 border-yellow-200">
            <Trophy className="text-yellow-600" size={20} />
            <span className="font-black text-yellow-800 uppercase tracking-wider text-sm">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-2xl border-2 border-orange-200">
            <Star className="text-orange-600" size={20} />
            <span className="font-black text-orange-800 uppercase tracking-wider text-sm">Streak: {streak}</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-indigo-600 text-center mb-4 uppercase tracking-tight">
          Math Power-Up! ⚡
        </h2>

        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {(['easy', 'medium', 'hard', 'impossible'] as const).map((d) => (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                difficulty === d
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-indigo-100 text-indigo-300 hover:border-indigo-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="text-5xl sm:text-6xl font-black text-slate-800 flex items-center gap-4 bg-slate-50 p-6 sm:p-8 rounded-[2rem] border-4 border-slate-100 shadow-inner">
            <span>{problem.n1}</span>
            <span className="text-indigo-500">{problem.op === '*' ? '×' : problem.op === '/' ? '÷' : problem.op}</span>
            <span>{problem.n2}</span>
            <span className="text-indigo-500">=</span>
            <span className="text-indigo-300">?</span>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            <input
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Your answer..."
              className="w-full max-w-[200px] text-center text-3xl font-black p-4 rounded-2xl border-4 border-indigo-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
              autoFocus
            />
            
            <div className="flex gap-3 w-full max-w-[300px]">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 uppercase tracking-wider border-b-4 border-indigo-800"
              >
                Check!
              </button>
              <button
                type="button"
                onClick={generateProblem}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-4 rounded-2xl transition-all active:scale-95 border-b-4 border-slate-300"
              >
                <RefreshCw size={24} strokeWidth={3} />
              </button>
            </div>
          </form>

          <AnimatePresence mode="wait">
            {feedback === 'correct' && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                className="flex flex-col items-center gap-2 text-green-500 font-black text-2xl"
              >
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Gem size={48} className="text-emerald-500" />
                </motion.div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={32} strokeWidth={3} />
                  <span>SUPER! 🌈</span>
                </div>
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div
                initial={{ x: [-10, 10, -10, 10, 0] }}
                className="flex items-center gap-2 text-red-500 font-black text-2xl"
              >
                <XCircle size={32} strokeWidth={3} />
                <span>TRY AGAIN! 🚀</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
