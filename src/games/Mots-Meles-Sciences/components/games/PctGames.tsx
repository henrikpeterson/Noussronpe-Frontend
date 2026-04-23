/**
 * PctGame — Composant autonome qui encapsule tout le jeu "PCT en Poche".
 * Usage dans ton app :
 *   import PctGame from "@/components/game/PctGame";
 *   <Route path="/jeu-pct" element={<PctGame />} />
 *
 * Pour quitter le jeu et revenir à ta plateforme, passe onExit :
 *   <PctGame onExit={() => navigate("/dashboard")} />
 */
import { useEffect, useState, useCallback } from "react";
import { Classe, GameProgress } from "@/games/Mots-Meles-Sciences/game/types";
import { ClassSelect } from "@/games/Mots-Meles-Sciences/components/games/ClassSelect";
import { LevelSelect } from "@/games/Mots-Meles-Sciences/components/games/LevelSelect";
import { GameScreen } from "@/games/Mots-Meles-Sciences/components/games/GameScreen";
import { loadProgress, saveProgress, bestScoreKey } from "@/games/Mots-Meles-Sciences/game/storage";
// Import du CSS scopé du jeu
import "@/games/Mots-Meles-Sciences/styles/pct-games.css";
interface PctGameProps {
  /** Callback appelé quand l'utilisateur veut quitter le jeu (retour plateforme) */
  onExit?: () => void;
}
type View =
  | { kind: "classes" }
  | { kind: "levels"; classe: Classe }
  | { kind: "game"; classe: Classe; level: number };
export default function PctGame({ onExit }: PctGameProps) {
  const [view, setView] = useState<View>({ kind: "classes" });
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress());
  // Écouter l'événement de passage au niveau suivant
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { level: number };
      if (view.kind === "game") {
        setView({ kind: "game", classe: view.classe, level: detail.level });
      }
    };
    window.addEventListener("pct-go-level", handler);
    return () => window.removeEventListener("pct-go-level", handler);
  }, [view]);
  const handleSelectClass = useCallback((c: Classe) => {
    setView({ kind: "levels", classe: c });
    const p = { ...loadProgress(), classe: c };
    setProgress(p);
    saveProgress(p);
  }, []);
  const handleSelectLevel = useCallback((level: number) => {
    setView((prev) => {
      if (prev.kind !== "levels") return prev;
      return { kind: "game", classe: prev.classe, level };
    });
  }, []);
  const handleLevelComplete = useCallback((level: number, score: number) => {
    const p = loadProgress();
    const key = bestScoreKey(p.classe, level);
    if (!p.bestScores[key] || score > p.bestScores[key]) {
      p.bestScores[key] = score;
    }
    p.totalScore = (p.totalScore ?? 0) + score;
    saveProgress(p);
    setProgress(p);
  }, []);
  const handleQuitGame = useCallback(() => {
    if (view.kind === "game") {
      setView({ kind: "levels", classe: view.classe });
    } else if (onExit) {
      onExit();
    } else {
      setView({ kind: "classes" });
    }
  }, [view, onExit]);
  return (
    <div className="pct-game">
      {view.kind === "classes" && (
        <ClassSelect onSelect={handleSelectClass} />
      )}
      {view.kind === "levels" && (
        <LevelSelect
          classe={view.classe}
          progress={progress}
          onSelect={handleSelectLevel}
          onBack={() => onExit ? onExit() : setView({ kind: "classes" })}
        />
      )}
      {view.kind === "game" && (
        <GameScreen
          key={`${view.classe}-${view.level}`}
          classe={view.classe}
          level={view.level}
          onQuit={handleQuitGame}
          onLevelComplete={handleLevelComplete}
        />
      )}
    </div>
  );
}