import { useEffect, useState } from "react";
import { Classe } from "@/games/Mots-Meles-Sciences/game/types";
import { ClassSelect } from "@/games/Mots-Meles-Sciences/components/games/ClassSelect";
import { LevelSelect } from "@/games/Mots-Meles-Sciences/components/games/LevelSelect";
import { GameScreen } from "@/games/Mots-Meles-Sciences/components/games/GameScreen";
import { loadProgress, saveProgress, bestScoreKey } from "@/games/Mots-Meles-Sciences/game/storage";
import { GameProgress } from "@/games/Mots-Meles-Sciences/game/types";

type View =
  | { kind: "classes" }
  | { kind: "levels"; classe: Classe }
  | { kind: "game"; classe: Classe; level: number };

const Index = () => {
  const [view, setView] = useState<View>({ kind: "classes" });
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress());

  // Listen for in-game next-level event
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

  function handleSelectClass(c: Classe) {
    setView({ kind: "levels", classe: c });
    const p = { ...progress, classe: c };
    setProgress(p);
    saveProgress(p);
  }

  function handleSelectLevel(level: number) {
    if (view.kind !== "levels") return;
    setView({ kind: "game", classe: view.classe, level });
  }

  function handleLevelComplete(level: number, score: number) {
    const p = loadProgress();
    const key = bestScoreKey(p.classe, level);
    if (!p.bestScores[key] || score > p.bestScores[key]) {
      p.bestScores[key] = score;
    }
    p.totalScore = (p.totalScore ?? 0) + score;
    saveProgress(p);
    setProgress(p);
  }

  function handleQuitGame() {
    if (view.kind === "game") {
      setView({ kind: "levels", classe: view.classe });
    } else {
      setView({ kind: "classes" });
    }
  }

  if (view.kind === "classes") {
    return <ClassSelect onSelect={handleSelectClass} />;
  }
  if (view.kind === "levels") {
    return (
      <LevelSelect
        classe={view.classe}
        progress={progress}
        onSelect={handleSelectLevel}
        onBack={() => setView({ kind: "classes" })}
      />
    );
  }
  return (
    <GameScreen
      key={`${view.classe}-${view.level}`}
      classe={view.classe}
      level={view.level}
      onQuit={handleQuitGame}
      onLevelComplete={handleLevelComplete}
    />
  );
};

export default Index;
