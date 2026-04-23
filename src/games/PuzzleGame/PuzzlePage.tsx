// src/pages/PuzzlePage.tsx
import { GameProvider, useGame } from "@/games/PuzzleGame/contexts/GameContext";
import MainMenu from "@/games/PuzzleGame/components/game/MainMenu";
import LevelSelect from "@/games/PuzzleGame/components/game/LevelSelect";
import PuzzleBoard from "@/games/PuzzleGame/components/game/PuzzleBoard";
import CompletionScreen from "@/games/PuzzleGame/components/game/CompletionScreen";

function GameRouter() {
  const { screen } = useGame();

  switch (screen) {
    case "menu":
      return <MainMenu />;
    case "level":
      return <LevelSelect />;
    case "puzzle":
      return <PuzzleBoard />;
    case "complete":
      return <CompletionScreen />;
    default:
      return <MainMenu />;
  }
}

export default function PuzzlePage() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
