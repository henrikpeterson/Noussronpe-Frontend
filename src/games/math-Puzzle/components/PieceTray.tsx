// src/games/math-Puzzle/components/PieceTray.tsx
//
// Refonte visuelle :
// - Pièces plus grandes et plus distinctes
// - Couleur par type d'opération (+, -, ×, ÷, √, ^, ln, ||)
// - Légère rotation aléatoire par pièce — effet "éparpillé sur une table"
// - Hover : redressement + élévation
// - Animation d'entrée en cascade depuis le bas
// - Label "opération" plus lisible avec drop-shadow

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { MathPiece } from "@/games/math-Puzzle/lib/mathOperations";

interface PieceTrayProps {
  pieces: MathPiece[];
  solved: Set<number>;
}

// ─────────────────────────────────────────────
// Couleur par type d'opération
// Détecte le symbole dominant dans l'opération
// ─────────────────────────────────────────────
function getPieceStyle(operation: string): { gradient: string; shadow: string } {
  if (operation.includes("+"))
    return {
      gradient: "from-[hsl(145,72%,40%)] to-[hsl(160,70%,32%)]",
      shadow:   "shadow-[0_4px_18px_hsl(145,72%,40%/0.45)]",
    };
  if (operation.includes("-") && !operation.includes("√"))
    return {
      gradient: "from-[hsl(0,75%,55%)] to-[hsl(10,70%,48%)]",
      shadow:   "shadow-[0_4px_18px_hsl(0,75%,55%/0.45)]",
    };
  if (operation.includes("×") || operation.includes("*"))
    return {
      gradient: "from-[hsl(210,85%,55%)] to-[hsl(225,80%,48%)]",
      shadow:   "shadow-[0_4px_18px_hsl(210,85%,55%/0.45)]",
    };
  if (operation.includes("÷") || operation.includes("/"))
    return {
      gradient: "from-[hsl(270,65%,55%)] to-[hsl(280,60%,48%)]",
      shadow:   "shadow-[0_4px_18px_hsl(270,65%,55%/0.45)]",
    };
  if (operation.includes("√"))
    return {
      gradient: "from-[hsl(175,70%,38%)] to-[hsl(185,65%,32%)]",
      shadow:   "shadow-[0_4px_18px_hsl(175,70%,38%/0.45)]",
    };
  if (operation.includes("^") || operation.includes("²") || operation.includes("³"))
    return {
      gradient: "from-[hsl(45,95%,50%)] to-[hsl(35,90%,44%)]",
      shadow:   "shadow-[0_4px_18px_hsl(45,95%,50%/0.45)]",
    };
  if (operation.includes("ln") || operation.includes("log"))
    return {
      gradient: "from-[hsl(340,75%,56%)] to-[hsl(350,70%,50%)]",
      shadow:   "shadow-[0_4px_18px_hsl(340,75%,56%/0.45)]",
    };
  if (operation.includes("|") || operation.includes("abs"))
    return {
      gradient: "from-[hsl(25,90%,55%)] to-[hsl(15,85%,48%)]",
      shadow:   "shadow-[0_4px_18px_hsl(25,90%,55%/0.45)]",
    };
  // Défaut
  return {
    gradient: "from-[hsl(200,70%,48%)] to-[hsl(215,65%,42%)]",
    shadow:   "shadow-[0_4px_18px_hsl(200,70%,48%/0.45)]",
  };
}

// ─────────────────────────────────────────────
// Rotation aléatoire mais stable par pièce
// (basée sur l'id pour ne pas changer au re-render)
// ─────────────────────────────────────────────
function getPieceRotation(id: number): number {
  // Rotation entre -6° et +6° basée sur l'id
  const seed = ((id * 137.508) % 12) - 6;
  return Math.round(seed * 10) / 10;
}

const handleDragStart = (e: React.DragEvent, pieceId: number) => {
  e.dataTransfer.setData("pieceId", pieceId.toString());
  e.dataTransfer.effectAllowed = "move";
};

export default function PieceTray({ pieces, solved }: PieceTrayProps) {
  const unsolved = useMemo(
    () => pieces.filter((p) => !solved.has(p.id)),
    [pieces, solved]
  );

  if (unsolved.length === 0) return null;

  return (
    <div className="w-full max-w-[540px] mx-auto mt-5">

      {/* Compteur restant */}
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <div className="h-px flex-1 bg-border/50 rounded" />
        <span className="text-xs font-bold text-muted-foreground px-2">
          {unsolved.length} pièce{unsolved.length > 1 ? "s" : ""} restante{unsolved.length > 1 ? "s" : ""}
        </span>
        <div className="h-px flex-1 bg-border/50 rounded" />
      </div>

      {/* Pièces */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center">
        {unsolved.map((piece, i) => {
          const { gradient, shadow } = getPieceStyle(piece.operation);
          const rotation             = getPieceRotation(piece.id);

          return (
            <motion.div
              key={piece.id}
              draggable
              onDragStart={(e) =>
                handleDragStart(e as unknown as React.DragEvent, piece.id)
              }
              className={`
                bg-gradient-to-br ${gradient}
                px-4 py-2.5 sm:px-5 sm:py-3
                rounded-2xl
                cursor-grab active:cursor-grabbing
                select-none
                ${shadow}
                border border-white/20
                relative overflow-hidden
              `}
              style={{ rotate: rotation }}
              whileHover={{
                scale:  1.1,
                rotate: 0,          // se redresse au hover
                y:      -6,
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
              whileTap={{ scale: 0.9, rotate: 0 }}
              layout
              initial={{ opacity: 0, y: 24, rotate: rotation - 5 }}
              animate={{ opacity: 1, y: 0,  rotate: rotation }}
              exit={{   opacity: 0, scale: 0.4, rotate: rotation + 15 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Shimmer interne sur la pièce */}
              <motion.div
                className="absolute inset-0 -skew-x-12 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                  width: "30%",
                }}
                animate={{ x: ["-100%", "500%"] }}
                transition={{
                  duration:    2,
                  repeat:      Infinity,
                  repeatDelay: piece.id * 0.3 + 1,
                  ease:        "easeInOut",
                }}
              />

              {/* Texte de l'opération */}
              <span className="relative z-10 text-sm sm:text-base font-bold text-white whitespace-nowrap drop-shadow-sm tracking-tight">
                {piece.operation}
              </span>
              
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}