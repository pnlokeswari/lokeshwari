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

  const [audioError, setAudioError] = useState<string | null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const [audioStatus, setAudioStatus] = useState<'locked' | 'ready'>('locked');

  useEffect(() => {
    const checkStatus = () => {
      if (audioContextRef.current) {
        setAudioStatus(audioContextRef.current.state === 'running' ? 'ready' : 'locked');
      }
    };
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => setAudioStatus('ready'));
    } else {
      setAudioStatus('ready');
    }
    return audioContextRef.current;
  };

  const testAudio = async () => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
      console.log('Test beep played');
      setAudioError(null);
    } catch (e) {
      console.error('Audio test failed:', e);
      setAudioError('Audio blocked by browser');
    }
  };

  const pcmToWavBase64 = (pcmData: Uint8Array, sampleRate: number = 24000) => {
    const buffer = new ArrayBuffer(44 + pcmData.length);
    const view = new DataView(buffer);

    // RIFF identifier
    view.setUint32(0, 0x52494646, false); // "RIFF"
    // file length
    view.setUint32(4, 36 + pcmData.length, true);
    // RIFF type
    view.setUint32(8, 0x57415645, false); // "WAVE"
    // format chunk identifier
    view.setUint32(12, 0x666d7420, false); // "fmt "
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (PCM = 1)
    view.setUint16(20, 1, true);
    // channel count (Mono = 1)
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    view.setUint32(36, 0x64617461, false); // "data"
    // data chunk length
    view.setUint32(40, pcmData.length, true);

    // write the PCM data
    for (let i = 0; i < pcmData.length; i++) {
      view.setUint8(44 + i, pcmData[i]);
    }

    // Convert to base64
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playSound = async () => {
    if (isLoading) return;
    setAudioError(null);
    
    // Force resume context
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
    
    if (audioUrl && audioUrl.startsWith('data:audio/wav')) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => {
        console.error('Cached play failed:', e);
        setAudioError('Click again');
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: currentAnimal.sound }] }],
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
        const binaryString = atob(base64Audio);
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          uint8Array[i] = binaryString.charCodeAt(i);
        }
        
        const wavBase64 = pcmToWavBase64(uint8Array, 24000);
        const dataUri = `data:audio/wav;base64,${wavBase64}`;
        setAudioUrl(dataUri);
        
        const audio = new Audio(dataUri);
        audio.play().catch(e => {
          console.warn('HTMLAudio failed, trying WebAudio fallback:', e);
          playPcm(base64Audio);
        });
      } else {
        setAudioError('No sound data');
      }
    } catch (error) {
      console.error('Error:', error);
      setAudioError('Sound failed');
    } finally {
      setIsLoading(false);
    }
  };

  const playPcm = async (base64Data: string) => {
    try {
      const ctx = getAudioContext();
      console.log('Playing PCM, context state:', ctx.state);
      
      const binaryString = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      
      const dataView = new DataView(arrayBuffer);
      const float32Data = new Float32Array(binaryString.length / 2);
      
      for (let i = 0; i < float32Data.length; i++) {
        float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }
      
      const buffer = ctx.createBuffer(1, float32Data.length, 24000);
      buffer.getChannelData(0).set(float32Data);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) {
      console.error('Failed to play PCM audio:', e);
      setAudioError('Playback error');
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

  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    getAudioContext();
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] border-4 border-pink-300 p-12 shadow-xl shadow-pink-100 flex flex-col items-center justify-center text-center gap-8 min-h-[400px]"
      >
        <div className="bg-pink-100 p-6 rounded-[2rem] border-4 border-pink-200">
          <Volume2 className="text-pink-600" size={64} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-2">Sound Safari</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest">Ready to hear the animals?</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="bg-pink-500 hover:bg-pink-600 text-white font-black py-4 px-12 rounded-2xl shadow-lg border-b-8 border-pink-700 uppercase tracking-widest text-xl"
        >
          Start Safari 🦁
        </motion.button>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
          Clicking start enables sound for the game
        </p>
      </motion.div>
    );
  }

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
                : audioError 
                ? 'bg-red-500 border-red-700 text-white'
                : 'bg-pink-500 hover:bg-pink-600 border-pink-700 text-white'
            }`}
          >
            {isLoading ? (
              <Loader2 size={48} className="animate-spin" />
            ) : (
              <Volume2 size={48} />
            )}
          </motion.button>

          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-600 font-black uppercase tracking-widest text-sm">
              {isLoading ? 'Generating Sound...' : audioError ? `Error: ${audioError}` : 'Click to hear the animal!'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {audioStatus === 'locked' && (
                <button 
                  onClick={() => getAudioContext()}
                  className="text-xs font-black text-pink-500 underline uppercase tracking-wider"
                >
                  Unlock Audio
                </button>
              )}
              <button 
                onClick={() => {
                  audioContextRef.current = null;
                  getAudioContext();
                  testAudio();
                }}
                className="text-xs font-black text-orange-500 underline uppercase tracking-wider"
              >
                Force Reset Sound
              </button>
              <button 
                onClick={testAudio}
                className="text-xs font-black text-slate-400 underline uppercase tracking-wider"
              >
                Test Beep
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-2">
              🔊 Check your device volume & silent mode
            </p>
          </div>

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
