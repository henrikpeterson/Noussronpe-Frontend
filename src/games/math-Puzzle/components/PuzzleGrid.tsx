// src/games/math-Puzzle/components/PuzzleGrid.tsx
//
// Refonte visuelle :
// - Image mystère floutée visible sur toutes les cases non résolues
//   → filtre blur(10px) + brightness(0.35) + overlay texte résultat
//   → quand résolue : animation de défloutage spectaculaire (blur → 0)
// - Shimmer effect sur les cellules non résolues
// - Shake animation sur mauvaise réponse (wrongCell)
// - Highlight pulse sur bonne réponse (highlightCell)
// - Bordures et ombres plus riches

import { motion } from "framer-motion";
import type { MathPiece } from "@/games/math-Puzzle/lib/mathOperations";
import puzzleImage from "@/games/math-Puzzle/assets/GOKU.png";

interface PuzzleGridProps {
  pieces:       MathPiece[];
  solved:       Set<number>;
  gridSize:     number;
  highlightCell: number | null;
  wrongCell:    number | null;
  onDrop:       (pieceId: number, cellIndex: number, dropX?: number, dropY?: number) => void;
}

export default function PuzzleGrid({
  pieces,
  solved,
  gridSize,
  highlightCell,
  wrongCell,
  onDrop,
}: PuzzleGridProps) {

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, cellIndex: number) => {
    e.preventDefault();
    const pieceId = parseInt(e.dataTransfer.getData("pieceId"), 10);
    if (!isNaN(pieceId)) {
      // Passer les coordonnées du drop pour le sparkle effect
      onDrop(pieceId, cellIndex, e.clientX, e.clientY);
    }
  };

  return (
    <div
      className="grid gap-1 sm:gap-1.5 w-full max-w-[500px] aspect-square mx-auto p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-[hsl(160,40%,96%)] to-[hsl(200,50%,94%)] shadow-xl border border-border/30"
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
    >
      {pieces.map((piece, index) => {
        const isSolved      = solved.has(piece.id);
        const isHighlighted = highlightCell === index;
        const isWrong       = wrongCell === index;
        const row           = Math.floor(index / gridSize);
        const col           = index % gridSize;

        // Position bg pour révéler la bonne portion de l'image
        const bgPosX = (col / (gridSize - 1)) * 100;
        const bgPosY = (row / (gridSize - 1)) * 100;

        return (
          <motion.div
            key={piece.id}
            className="relative rounded-xl overflow-hidden aspect-square flex items-center justify-center cursor-default select-none"
            onDragOver={!isSolved ? handleDragOver : undefined}
            onDrop={!isSolved ? (e) => handleDrop(e, index) : undefined}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale:   isHighlighted ? [1, 1.06, 1] : isWrong ? 1 : 1,
              x:       isWrong ? [-6, 6, -4, 4, 0] : 0,
            }}
            transition={{
              opacity: { delay: index * 0.025, duration: 0.3 },
              scale:   { duration: 0.35 },
              x:       { duration: 0.4, ease: "easeOut" },
            }}
            style={{
              // Ring coloré selon l'état
              boxShadow: isHighlighted
                ? "0 0 0 2.5px hsl(var(--game-teal)), 0 0 20px hsl(var(--game-teal) / 0.4)"
                : isWrong
                ? "0 0 0 2.5px hsl(var(--destructive)), 0 0 12px hsl(var(--destructive) / 0.3)"
                : isSolved
                ? "0 2px 8px hsl(var(--game-green) / 0.25)"
                : "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            {isSolved ? (
              // ── Case résolue : image révélée avec animation de défloutage ──
              <motion.div
                className="absolute inset-0"
                initial={{ filter: "blur(10px) brightness(0.4)", scale: 1.1 }}
                animate={{ filter: "blur(0px) brightness(1)",    scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                style={{
                  backgroundImage:    `url(${puzzleImage})`,
                  backgroundSize:     `${gridSize * 100}%`,
                  backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                }}
              />
            ) : (
              // ── Case non résolue : image floue + résultat + shimmer ──
              <>
                {/* Image mystère très floue en fond */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:    `url(${puzzleImage})`,
                    backgroundSize:     `${gridSize * 100}%`,
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    filter:             "blur(8px) brightness(0.28) saturate(0.6)",
                  }}
                />

                {/* Overlay dégradé pour accentuer le contraste */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 rounded-xl" />

                {/* Shimmer effect animé */}
                <motion.div
                  className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
                  style={{ opacity: 0.15 }}
                >
                  <motion.div
                    className="absolute inset-0 -skew-x-12"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
                      width: "40%",
                    }}
                    animate={{ x: ["-100%", "350%"] }}
                    transition={{
                      duration:   2.5,
                      repeat:     Infinity,
                      repeatDelay: index * 0.15 + 0.5,
                      ease:       "easeInOut",
                    }}
                  />
                </motion.div>

                {/* Bordure en pointillé avec hover */}
                <div className="absolute inset-0 rounded-xl border-2 border-dashed border-white/20 hover:border-primary/60 transition-colors duration-200 group-hover:border-primary/60" />

                {/* Résultat attendu — bien visible */}
                <span className="relative z-10 text-sm sm:text-base font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] select-none tracking-tight">
                  {piece.resultDisplay ?? piece.result}
                </span>

                {/* Icône drop hint au survol */}
                <div className="absolute bottom-1 right-1 opacity-0 hover:opacity-60 transition-opacity">
                  <span className="text-[8px] text-white font-bold">↓</span>
                </div>
              </>
            )}

            {/* Flash vert bonne réponse */}
            {isHighlighted && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-[hsl(var(--game-green))]"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}

            {/* Flash rouge mauvaise réponse */}
            {isWrong && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-destructive"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}