import { useGame } from "@/games/PuzzleGame/contexts/GameContext";
import { LEVELS } from "@/games/PuzzleGame/data/puzzleData";
import { Star, Trophy, ArrowRight, RotateCcw } from "lucide-react";

export default function CompletionScreen() {
  const { currentLevel, currentImage, results, totalPoints, goToLevel, selectImage } = useGame();
  const level = LEVELS.find((l) => l.id === currentLevel);
  if (!currentImage || !level) return null;

  const result = results[currentImage.id];
  if (!result) return null;

  const currentIndex = level.images.findIndex((i) => i.id === currentImage.id);
  const nextImage = currentIndex < level.images.length - 1 ? level.images[currentIndex + 1] : null;

  return (
    <div className="min-h-screen african-pattern flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl p-6 max-w-sm w-full text-center animate-scale-in shadow-xl">
        <div className="text-5xl mb-3">
          {result.stars === 3 ? "🎉" : result.stars === 2 ? "👏" : "✅"}
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-1">
          {result.stars === 3 ? "Parfait !" : result.stars === 2 ? "Bien joué !" : "Complété !"}
        </h2>
        <p className="text-muted-foreground font-body text-sm mb-4">{currentImage.name}</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-10 h-10 star transition-all duration-500 ${s <= result.stars ? "earned" : "empty"}`}
              fill={s <= result.stars ? "currentColor" : "none"}
              style={{ animationDelay: `${s * 0.15}s` }}
            />
          ))}
        </div>

        {/* Points */}
        <div className="bg-muted rounded-2xl p-4 mb-4 space-y-2">
          <div className="flex justify-between font-body text-sm">
            <span className="text-muted-foreground">Points gagnés</span>
            <span className="font-bold text-foreground">+{result.points}</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span className="text-muted-foreground">Temps</span>
            <span className="font-bold text-foreground">{result.bestTime}s</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-display">
            <span className="text-muted-foreground flex items-center gap-1">
              <Trophy className="w-4 h-4 text-gold" /> Total
            </span>
            <span className="font-bold text-foreground">{totalPoints} pts</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => selectImage(currentImage)}
            className="btn-game-secondary w-full flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Rejouer
          </button>
          {nextImage && (
            <button
              onClick={() => selectImage(nextImage)}
              className="btn-game w-full flex items-center justify-center gap-2"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={goToLevel}
            className="w-full py-2 text-sm text-muted-foreground font-body hover:text-foreground transition-colors"
          >
            ← Retour aux images
          </button>
        </div>
      </div>
    </div>
  );
}
