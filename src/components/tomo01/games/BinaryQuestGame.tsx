import React, { useState, useEffect } from 'react';
import { Gamepad2, Award, Zap, Timer, RefreshCw, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

interface Question {
  type: 'BIN_TO_DEC' | 'DEC_TO_BIN' | 'HEX_TO_DEC' | 'DEC_TO_HEX';
  prompt: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

export const BinaryQuestGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'RECRUIT' | 'TECHNICIAN' | 'KERNEL_DEV'>('RECRUIT');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [highScore, setHighScore] = useState<number>(0);

  // Generate random questions based on difficulty
  const generateQuestion = (): Question => {
    let maxVal = 15; // 4 bits
    if (difficulty === 'TECHNICIAN') maxVal = 255; // 8 bits
    if (difficulty === 'KERNEL_DEV') maxVal = 4095; // 12 bits / hex

    const types: Question['type'][] = ['BIN_TO_DEC', 'DEC_TO_BIN'];
    if (difficulty !== 'RECRUIT') {
      types.push('HEX_TO_DEC', 'DEC_TO_HEX');
    }

    const type = types[Math.floor(Math.random() * types.length)];
    const val = Math.floor(Math.random() * (maxVal - 1)) + 1;

    let prompt = '';
    let correctAnswer = '';
    let explanation = '';

    const padBits = difficulty === 'RECRUIT' ? 4 : 8;

    if (type === 'BIN_TO_DEC') {
      const bin = val.toString(2).padStart(padBits, '0');
      prompt = `¿Qué valor decimal representa 0b${bin}?`;
      correctAnswer = val.toString(10);
      explanation = `Descomposición en potencias de 2: ${bin
        .split('')
        .map((b, i) => (b === '1' ? `2^${padBits - 1 - i}` : null))
        .filter(Boolean)
        .join(' + ')} = ${val}`;
    } else if (type === 'DEC_TO_BIN') {
      prompt = `¿Cuál es el valor binario de ${val}?`;
      correctAnswer = val.toString(2).padStart(padBits, '0');
      explanation = `${val} en binario se expresa encendiendo los bits correspondientes: 0b${correctAnswer}`;
    } else if (type === 'HEX_TO_DEC') {
      const hex = val.toString(16).toUpperCase().padStart(2, '0');
      prompt = `¿Qué valor decimal representa 0x${hex}?`;
      correctAnswer = val.toString(10);
      explanation = `0x${hex} = (${hex[0]} × 16) + ${hex[1]} = ${val}`;
    } else {
      prompt = `¿Cuál es el valor hexadecimal de ${val}?`;
      correctAnswer = val.toString(16).toUpperCase().padStart(2, '0');
      explanation = `${val} dividido por 16 da cociente y resto: 0x${correctAnswer}`;
    }

    // Generate 3 plausible distractors
    const optionsSet = new Set<string>([correctAnswer]);
    while (optionsSet.size < 4) {
      let offset = Math.floor(Math.random() * 5) - 2;
      if (offset === 0) offset = 1;
      const fakeVal = Math.max(1, Math.min(maxVal, val + offset));
      if (type === 'BIN_TO_DEC' || type === 'HEX_TO_DEC') {
        optionsSet.add(fakeVal.toString(10));
      } else if (type === 'DEC_TO_BIN') {
        optionsSet.add(fakeVal.toString(2).padStart(padBits, '0'));
      } else {
        optionsSet.add(fakeVal.toString(16).toUpperCase().padStart(2, '0'));
      }
    }

    const shuffled = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return {
      type,
      prompt,
      correctAnswer,
      options: shuffled,
      explanation,
    };
  };

  // Start / Reset Game
  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setGameActive(true);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setCurrentQuestion(generateQuestion());
  };

  // Timer countdown
  useEffect(() => {
    if (!gameActive || selectedAnswer !== null) return;

    if (timeLeft <= 0) {
      // Timeout
      setIsAnswerCorrect(false);
      setStreak(0);
      setTimeout(() => {
        setTimeLeft(15);
        setCurrentQuestion(generateQuestion());
      }, 1500);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft, selectedAnswer]);

  const handleSelectAnswer = (ans: string) => {
    if (!currentQuestion || selectedAnswer !== null) return;

    setSelectedAnswer(ans);
    const correct = ans === currentQuestion.correctAnswer;
    setIsAnswerCorrect(correct);

    if (correct) {
      const addedPoints = (10 + streak * 2) * (difficulty === 'KERNEL_DEV' ? 3 : difficulty === 'TECHNICIAN' ? 2 : 1);
      const newScore = score + addedPoints;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newScore > highScore) setHighScore(newScore);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setTimeLeft(15);
      setCurrentQuestion(generateQuestion());
    }, 1800);
  };

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                JUEGO TÉCNICO // RETO EN VIVO
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Generador Algorítmico Determinado" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              BINARY QUEST: DESAFÍO DE CONVERSIÓN RÁPIDA
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Entrená tus reflejos de ingeniero de sistemas. Convertí entre binario, decimal y hexadecimal a contrarreloj para acumular rachas y desbloquear la maestría en aritmética de silicio.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {(['RECRUIT', 'TECHNICIAN', 'KERNEL_DEV'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setDifficulty(lvl);
                  if (gameActive) startGame();
                }}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  difficulty === lvl
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lvl === 'RECRUIT' ? '4 BITS (FÁCIL)' : lvl === 'TECHNICIAN' ? '8 BITS (MEDIO)' : 'HEX/12B (PRO)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!gameActive ? (
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-10 text-center space-y-6">
          <Gamepad2 className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold font-mono text-white">¿Listo para el desafío?</h3>
            <p className="text-sm text-zinc-400">
              Tendrás 15 segundos por pregunta. Las respuestas correctas consecutivas aumentan el multiplicador de racha.
            </p>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            COMENZAR DESAFÍO BINARIO
          </button>
        </div>
      ) : (
        <div className="border border-zinc-800 bg-zinc-900/70 rounded-2xl p-6 space-y-6">
          {/* Top stats bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Puntaje</span>
                <span className="text-xl font-black text-amber-400">{score} pts</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Racha</span>
                <span className="text-xl font-black text-cyan-400 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-cyan-400 fill-current" /> {streak}x
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Récord</span>
                <span className="text-xl font-black text-zinc-300">{highScore} pts</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-zinc-700">
                <Timer className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-zinc-400'}`} />
                <span className={`text-base font-bold ${timeLeft <= 5 ? 'text-red-400 font-black' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
              <button
                type="button"
                onClick={startGame}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                title="Reiniciar"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <div className="space-y-6 max-w-2xl mx-auto py-4 text-center">
              <div className="p-6 bg-black/60 border border-zinc-800 rounded-2xl space-y-3">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  {currentQuestion.type.replace(/_/g, ' ')}
                </span>
                <h3 className="text-2xl font-mono font-black text-white">
                  {currentQuestion.prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  let btnStyle = 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:border-amber-500/60 hover:bg-zinc-800';

                  if (selectedAnswer !== null) {
                    if (option === currentQuestion.correctAnswer) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-black';
                    } else if (option === selectedAnswer) {
                      btnStyle = 'bg-red-950/60 border-red-500 text-red-300 line-through';
                    } else {
                      btnStyle = 'bg-black/30 border-zinc-800 text-zinc-600 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectAnswer(option)}
                      className={`p-4 rounded-xl border font-mono text-lg font-bold transition-all cursor-pointer ${btnStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {selectedAnswer !== null && (
                <div
                  className={`p-4 rounded-xl border text-sm font-mono space-y-1 ${
                    isAnswerCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/30 border-red-500/40 text-red-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 font-bold">
                    {isAnswerCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>¡CORRECTO! +{(10 + streak * 2) * (difficulty === 'KERNEL_DEV' ? 3 : difficulty === 'TECHNICIAN' ? 2 : 1)} PTS</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span>INCORRECTO (Respuesta correcta: {currentQuestion.correctAnswer})</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 font-sans">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
