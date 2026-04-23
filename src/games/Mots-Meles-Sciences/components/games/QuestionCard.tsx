import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Tag } from "lucide-react";
import { PlacedWord } from "@/games/Mots-Meles-Sciences/game/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface QuestionCardProps {
  pw: PlacedWord;
  index: number;
  cardColorIndex?: number;
  onHint: (placedIndex: number) => void;
}

const CARD_BORDER_COLORS = [
  "border-l-[hsl(217,90%,60%)]",
  "border-l-[hsl(30,95%,55%)]",
  "border-l-[hsl(270,70%,60%)]",
];

const CARD_DOT_STYLES: React.CSSProperties[] = [
  { backgroundColor: "hsl(217 90% 60%)" },
  { backgroundColor: "hsl(30 95% 55%)" },
  { backgroundColor: "hsl(270 70% 60%)" },
];

export const QuestionCard = forwardRef<HTMLDivElement, QuestionCardProps>(
  ({ pw, index, cardColorIndex, onHint }, ref) => {
    const hintsLeft = 3 - pw.hintsUsed;
    const colorIdx = cardColorIndex ?? 0;
    
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, x: 60, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -80, scale: 0.85, transition: { duration: 0.3 } }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="paper-card rounded-2xl p-3 sm:p-4 flex flex-col gap-2 min-w-0 flex-1 sm:max-w-sm border-l-4"
        style={{ borderLeftColor: CARD_DOT_STYLES[colorIdx]?.backgroundColor }}
      >
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={CARD_DOT_STYLES[colorIdx]}
            />
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30 text-[10px] sm:text-xs font-semibold truncate">
              <Tag className="w-3 h-3 mr-1 shrink-0" />
              <span className="truncate">{pw.question.categorie}</span>
            </Badge>
          </div>
          <span className="text-xs font-bold text-muted-foreground shrink-0">
            {pw.word.length} lettres
          </span>
        </div>

        <p className="text-sm sm:text-base font-semibold text-foreground leading-snug line-clamp-3">
          {pw.question.question}
        </p>

        <AnimatePresence>
          {pw.hintsUsed > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-accent/15 border border-accent/30 rounded-lg px-2.5 py-1.5"
            >
              <p className="text-xs sm:text-sm font-medium text-foreground italic">
                💡 {pw.question.indices[pw.hintsUsed - 1]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="outline"
          size="sm"
          disabled={hintsLeft === 0}
          onClick={() => onHint(index)}
          className="btn-touch border-accent/40 hover:bg-accent/15 text-accent-foreground font-semibold"
        >
          <Lightbulb className="w-4 h-4 mr-1.5" />
          Indice
          <span className="ml-1.5 text-xs opacity-70">({hintsLeft}/3)</span>
        </Button>
      </motion.div>
    );
  }
);

QuestionCard.displayName = "QuestionCard";