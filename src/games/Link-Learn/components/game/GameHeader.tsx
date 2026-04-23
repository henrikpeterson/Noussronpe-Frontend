import { motion } from "framer-motion";
import { ChevronLeft, Clock, BookOpen } from "lucide-react";

interface GameHeaderProps {
  level: { phase: number; phaseName: string; level: number; category: string; timerSeconds?: number };
  levelNum: number;
  timer: number;
  onBack: () => void;
}

const phaseConfig: Record<number, { ink: string; label: string; stamp: string }> = {
  1: { ink: "#4A7C59",  label: "Découverte",  stamp: "🔍" },
  2: { ink: "#5A6E8C",  label: "Social",      stamp: "💬" },
  3: { ink: "#8C6239",  label: "Mots",         stamp: "✏️" },
  4: { ink: "#7A4E8C",  label: "Fluence",      stamp: "⚡" },
  5: { ink: "#8C3A3A",  label: "Maîtrise",     stamp: "🏆" },
};

export default function GameHeader({ level, levelNum, timer, onBack }: GameHeaderProps) {
  const phase = phaseConfig[level.phase] || phaseConfig[1];
  const isLow = timer <= 10;
  const isUrgent = timer <= 5;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-50"
      style={{
        background: "rgba(245, 240, 230, 0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "2px solid rgba(160, 130, 90, 0.25)",
        boxShadow: "0 2px 12px rgba(100, 80, 40, 0.08)",
      }}
    >
      {/* Ruled line decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, transparent 0%, ${phase.ink}55 20%, ${phase.ink}88 50%, ${phase.ink}55 80%, transparent 100%)`,
        }}
      />

      <div className="flex items-center justify-between px-4 py-3">
        {/* Back button — inked stamp style */}
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 group"
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1.5px solid rgba(140, 110, 60, 0.35)",
            background: "rgba(255, 250, 240, 0.8)",
            color: "#5C4520",
            fontSize: "12px",
            fontFamily: "'Kalam', 'Patrick Hand', cursive",
            cursor: "pointer",
            boxShadow: "1px 2px 0 rgba(140,110,60,0.15)",
          }}
        >
          <ChevronLeft size={14} />
          <span>Retour</span>
        </motion.button>

        {/* Center — notebook title block */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <BookOpen size={13} style={{ color: phase.ink, opacity: 0.7 }} />
            <span
              style={{
                fontFamily: "'Kalam', 'Patrick Hand', cursive",
                fontSize: "10px",
                color: phase.ink,
                opacity: 0.8,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {phase.label} · Niveau {levelNum}
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Syne', 'Georgia', serif",
              fontWeight: 800,
              fontSize: "17px",
              color: "#3A2A10",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {level.category}
          </h2>
          {/* Underline squiggle */}
          <svg width="80" height="6" viewBox="0 0 80 6" fill="none" style={{ marginTop: "1px" }}>
            <path
              d="M2 4 Q12 1 22 4 Q32 7 42 4 Q52 1 62 4 Q72 7 78 4"
              stroke={phase.ink}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Timer — stamped badge */}
        <motion.div
          animate={isUrgent ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 12px",
            borderRadius: "4px",
            border: `1.5px ${isLow ? "solid" : "dashed"} ${isLow ? "rgba(180,60,40,0.6)" : "rgba(140,110,60,0.4)"}`,
            background: isLow ? "rgba(255, 235, 230, 0.9)" : "rgba(255, 250, 240, 0.8)",
            boxShadow: isLow ? "1px 2px 0 rgba(180,60,40,0.15)" : "1px 2px 0 rgba(140,110,60,0.12)",
          }}
        >
          <Clock
            size={13}
            style={{ color: isLow ? "#B83020" : "#8C6239", flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: "'Syne', monospace",
              fontWeight: 800,
              fontSize: "14px",
              color: isLow ? "#B83020" : "#5C3A10",
              minWidth: "28px",
              textAlign: "center",
            }}
          >
            {timer}s
          </span>
        </motion.div>
      </div>

      {/* Bottom ruled lines */}
      <div
        style={{
          position: "absolute",
          bottom: "-6px",
          left: 0,
          right: 0,
          height: "6px",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(160,130,90,0.08) 2px, rgba(160,130,90,0.08) 3px)",
        }}
      />
    </motion.header>
  );
}