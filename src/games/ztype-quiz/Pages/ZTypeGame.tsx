// src/games/ztype-quiz/pages/ZTypeGame.tsx

import React, { useCallback } from 'react';

import GameCanvas from '../components/GameCanva';
import HUD from '../components/HUD';
import AnswerInput from '../components/AnswerInput';

import { useZTypeGame } from '../hooks/useZTypeGame';
import type { GameResults } from '../hooks/useZTypeGame';

import anglaisQuestionsRaw from '../data/questions/anglais.json';
import culturegeneraleQuestionRaw from '../data/questions/Culture-General.json';

import type { Question } from '../engine/WaveManager';
const anglaisQuestions = anglaisQuestionsRaw as Question[];
const culturegeneraleQuestion = culturegeneraleQuestionRaw as Question[];


import galaxyBg  from '../assets/images/background-galaxy.jpg';
import gridCyber from '../assets/images/grid-cyber.png';
import shipSprite   from '../assets/images/ship.png';
import plasmaSprite from '../assets/images/plasma.png';

import { getDifficultyConfig } from '../config/difficulty';

type Mode       = 'sante' | 'academique' | 'anglais' | 'culture';
type Difficulty = 'easy' | 'medium' | 'hard';

interface ZTypeGameProps {
  mode:       Mode;
  difficulty: Difficulty;
  onGameOver: (results: GameResults) => void;
}

function getQuestionsForMode(mode: Mode): Question[] {
  switch (mode) {
    case 'anglais': return anglaisQuestions;
    case 'culture': return culturegeneraleQuestion;
    default:        return anglaisQuestions;
  }
}

const ZTypeGame: React.FC<ZTypeGameProps> = ({ mode, difficulty, onGameOver }) => {
  const questions  = getQuestionsForMode(mode);
  const diffConfig = getDifficultyConfig(difficulty);

  const {
    gameStatus,
    score,
    lives,
    combo,
    wave,
    currentQuestion,
    initGame,
    handleKeyPress,
    pause,
    resume,
    cleanup,
  } = useZTypeGame(mode, difficulty, questions, onGameOver, galaxyBg, gridCyber, shipSprite, plasmaSprite);

  const handleContextReady = useCallback(
    (ctx: CanvasRenderingContext2D) => initGame(ctx),
    [initGame]
  );

  const handleResize = useCallback((_w: number, _h: number) => {}, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (gameStatus === 'playing') pause();
      else if (gameStatus === 'paused') resume();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameStatus, pause, resume]);

  return (
    <div
      className="w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#012515ff' }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          height: 'min(80vh, 100vw * 16 / 9)',
          aspectRatio: '9 / 16',
          boxShadow: `
            0 0 0 1px rgba(0, 255, 200, 0.15),
            0 0 40px rgba(0, 200, 255, 0.08),
            0 0 80px rgba(0, 150, 200, 0.05),
            inset 0 0 60px rgba(0, 0, 0, 0.4)
          `,
          borderRadius: '4px',
        }}
      >
        <GameCanvas onContextReady={handleContextReady} onResize={handleResize} />

        {gameStatus !== 'idle' && (
          <HUD
            lives={lives}
            maxLives={diffConfig.startingLives}
            combo={combo}
            mode={mode}
            currentQuestion={currentQuestion}
          />
        )}

        <AnswerInput
          onKeyPress={handleKeyPress}
          isActive={gameStatus === 'playing'}
        />

        {gameStatus === 'paused' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <h2 className="text-4xl font-black text-cyan-400 tracking-[8px] mb-8">⏸ PAUSE</h2>
            <div className="flex gap-6 mb-8 text-center">
              <div>
                <div className="text-xl font-bold text-cyan-400">{score.toLocaleString()}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">Score</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-400">{wave}/5</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">Vague</div>
              </div>
              <div>
                <div className="text-xl font-bold text-pink-400">x{combo}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">Combo</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={resume} className="px-8 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider uppercase transition-all duration-200">
                ▶ Reprendre
              </button>
              <button
                onClick={() => { cleanup(); onGameOver({ score, wave, correctAnswers: 0, totalAttempts: 0, accuracy: 0, maxCombo: combo, duration: 0, isVictory: false }); }}
                className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold text-sm tracking-wider uppercase border border-gray-700/50 transition-all duration-200"
              >
                🏠 Quitter
              </button>
            </div>
            <p className="mt-5 text-gray-600 text-xs">
              Appuie sur <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-400">Échap</kbd> pour reprendre
            </p>
          </div>
        )}

        {gameStatus === 'waveTransition' && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center">
            <div className="text-center animate-pulse">
              <h2 className="text-5xl font-black text-cyan-400 tracking-[10px] mb-3">VAGUE {wave}</h2>
              <p className="text-gray-400 tracking-wider">Prépare-toi !</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZTypeGame;