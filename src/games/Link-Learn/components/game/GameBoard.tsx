import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

interface Pos { x: number; y: number; }
interface Connection { fromIdx: number; toIdx: number; fromPos: Pos; toPos: Pos; correct: boolean; }

interface GameBoardProps {
  boardRef: React.RefObject<HTMLDivElement>;
  level: { phase: number; hasObstacle?: boolean; hasNoCross?: boolean };
  pairs: { left: string; right: string }[];
  shuffledRight: number[];
  connections: Connection[];
  crossingIndices: number[];
  dragging: { side: "left" | "right"; idx: number; pos: Pos } | null;
  dragPos: Pos | null;
  onPointerDown: (side: "left" | "right", idx: number, e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

const phaseInk: Record<number, { primary: string; light: string; correct: string; correctLight: string }> = {
  1: { primary: "#4A7C59", light: "rgba(74,124,89,0.14)",  correct: "#3A6B48", correctLight: "rgba(74,124,89,0.2)" },
  2: { primary: "#5A6E8C", light: "rgba(90,110,140,0.14)", correct: "#4A5E7C", correctLight: "rgba(90,110,140,0.2)" },
  3: { primary: "#8C6239", light: "rgba(140,98,57,0.14)",  correct: "#7A5028", correctLight: "rgba(140,98,57,0.2)" },
  4: { primary: "#7A4E8C", light: "rgba(122,78,140,0.14)", correct: "#6A3E7C", correctLight: "rgba(122,78,140,0.2)" },
  5: { primary: "#8C3A3A", light: "rgba(140,58,58,0.14)",  correct: "#7A2A2A", correctLight: "rgba(140,58,58,0.2)" },
};

const wrongMessages = [
  "Pas tout à fait… réessaie !",
  "Oups ! Ce n'est pas la bonne paire.",
  "Cherche encore un peu 🔍",
  "Hmm, essaie autre chose !",
  "Presque ! Continue…",
];

function inkPath(from: Pos, to: Pos): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const wobble = Math.min(len * 0.06, 10);
  const nx = -dy / len;
  const ny = dx / len;
  return `M ${from.x} ${from.y} Q ${mx + nx * wobble} ${my + ny * wobble} ${to.x} ${to.y}`;
}

function WordBubble({
  text, side, index, isConnected, isCorrect, isDragging, phase, onPointerDown,
}: {
  text: string; side: "left" | "right"; index: number;
  isConnected: boolean; isCorrect: boolean; isDragging: boolean;
  phase: number; onPointerDown: (e: React.PointerEvent) => void;
}) {
  const ink = phaseInk[phase] || phaseInk[1];

  let bg = "rgba(255, 252, 244, 0.95)";
  let border = "2px solid rgba(160, 130, 90, 0.35)";
  let color = "#2A1A08";
  let shadow = "2px 3px 0 rgba(140,110,60,0.22), 0 1px 8px rgba(100,80,40,0.08)";

  if (isConnected && isCorrect) {
    bg = ink.correctLight;
    border = `2px solid ${ink.primary}77`;
    color = ink.correct;
    shadow = `2px 3px 0 ${ink.primary}44, 0 0 0 3px ${ink.primary}20`;
  } else if (isConnected) {
    bg = "rgba(255, 242, 238, 0.95)";
    border = "2px solid rgba(180,60,30,0.45)";
    color = "#8C2A10";
    shadow = "2px 3px 0 rgba(180,60,30,0.22)";
  }

  if (isDragging) {
    shadow = `3px 5px 0 rgba(140,110,60,0.3), 0 4px 16px rgba(100,80,40,0.15)`;
  }

  return (
    <motion.div
      data-item={`${side}-${index}`}
      initial={{ opacity: 0, x: side === "left" ? -20 : 20, rotate: side === "left" ? -1 : 1 }}
      animate={{
        opacity: 1,
        x: 0,
        rotate: isDragging ? (side === "left" ? -2 : 2) : 0,
        scale: isDragging ? 1.05 : 1,
      }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 22 }}
      whileHover={{ scale: 1.04, y: -1, rotate: side === "left" ? -0.5 : 0.5 }}
      onPointerDown={onPointerDown}
      style={{
        position: "relative",
        padding: "10px 20px",
        borderRadius: "5px",
        background: bg,
        border,
        color,
        boxShadow: shadow,
        cursor: "grab",
        userSelect: "none",
        fontFamily: "'Kalam', 'Patrick Hand', cursive",
        fontWeight: 700,
        fontSize: "15px",
        letterSpacing: "0.01em",
        textAlign: side === "right" ? "right" : "left",
        transition: "background 0.2s, border 0.2s, color 0.2s",
        minWidth: "90px",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          position: "absolute",
          [side === "left" ? "right" : "left"]: "-7px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: isConnected && isCorrect ? ink.primary
            : isConnected ? "rgba(180,60,30,0.7)"
            : "rgba(160,130,90,0.45)",
          border: "2.5px solid rgba(245,240,230,1)",
          boxShadow: isConnected ? `0 0 0 2px ${isCorrect ? ink.primary : "rgba(180,60,30,0.4)"}44` : "none",
          transition: "background 0.2s",
        }}
      />
      {text}
    </motion.div>
  );
}

function ObstacleBlock() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -5 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      style={{
        position: "absolute",
        left: "calc(50% - 32px)", top: "calc(50% - 44px)",
        width: 64, height: 88, zIndex: 2,
        borderRadius: "3px",
        border: "2px solid rgba(160, 80, 40, 0.4)",
        background: "rgba(255, 245, 235, 0.9)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "4px",
        boxShadow: "2px 3px 0 rgba(160,100,40,0.2)",
        overflow: "hidden",
      }}
    >
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
        {[0,8,16,24,32,40,48,56,64,72,80,88].map(y => (
          <line key={y} x1="0" y1={y} x2="64" y2={y - 20} stroke="#8C4020" strokeWidth="1" />
        ))}
      </svg>
      <span style={{ fontSize: "22px", zIndex: 1 }}>🚧</span>
      <span style={{ fontFamily: "'Kalam', cursive", fontSize: "8px", color: "#8C4020", opacity: 0.7, zIndex: 1 }}>bloqué</span>
    </motion.div>
  );
}

// ── Instruction bubble ───────────────────────────────────────────────────────
function InstructionBubble({ phase }: { phase: number }) {
  const ink = phaseInk[phase] || phaseInk[1];
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
      style={{
        position: "absolute",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 20px",
        borderRadius: "24px",
        background: "rgba(255, 252, 244, 0.97)",
        border: `1.5px dashed ${ink.primary}66`,
        boxShadow: `2px 3px 0 ${ink.primary}1A, 0 2px 12px rgba(100,80,40,0.09)`,
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M10 2.5L12.5 5L5.5 12H3V9.5L10 2.5Z" stroke={ink.primary} strokeWidth="1.4" strokeLinejoin="round" fill={`${ink.primary}18`}/>
        <path d="M8.5 4L11 6.5" stroke={ink.primary} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <span style={{
        fontFamily: "'Kalam', 'Patrick Hand', cursive",
        fontWeight: 700,
        fontSize: "13px",
        color: ink.correct,
      }}>
        Relie chaque mot à sa traduction !
      </span>
      {/* Speech bubble tail */}
      <span style={{
        position: "absolute",
        bottom: "-9px",
        left: "50%",
        transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
        borderTop: `9px solid rgba(255,252,244,0.97)`,
        filter: `drop-shadow(0 2px 0 ${ink.primary}33)`,
      }} />
    </motion.div>
  );
}

// ── Wrong connection toast ───────────────────────────────────────────────────
function WrongToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      style={{
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "11px 22px",
        borderRadius: "6px",
        background: "rgba(255, 248, 244, 0.99)",
        border: "2px solid rgba(180, 60, 30, 0.45)",
        boxShadow: "2px 4px 0 rgba(180,60,30,0.18), 0 6px 20px rgba(100,40,20,0.12)",
        whiteSpace: "nowrap",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="rgba(180,60,30,0.6)" strokeWidth="1.5" fill="rgba(180,60,30,0.07)"/>
        <path d="M6 6L12 12M12 6L6 12" stroke="rgba(180,60,30,0.85)" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
      <span style={{
        fontFamily: "'Kalam', 'Patrick Hand', cursive",
        fontWeight: 700,
        fontSize: "14px",
        color: "#8C2A10",
      }}>
        {message}
      </span>
      {/* Wobbly underline decoration */}
      <svg
        style={{ position: "absolute", bottom: "5px", left: "40px", right: "16px", pointerEvents: "none" }}
        height="4"
        width="100%"
        preserveAspectRatio="none"
      >
        <path
          d="M0 2 Q20 0.5 40 2 Q60 3.5 80 2 Q100 0.5 120 2 Q140 3.5 160 2 Q180 0.5 200 2"
          stroke="rgba(180,60,30,0.25)" strokeWidth="1.2" fill="none"
        />
      </svg>
    </motion.div>
  );
}

export default function GameBoard({
  boardRef, level, pairs, shuffledRight, connections, crossingIndices,
  dragging, dragPos, onPointerDown, onPointerMove, onPointerUp,
}: GameBoardProps) {
  const ink = phaseInk[level.phase] || phaseInk[1];

  // Wrong-connection toast state
  const [wrongMsg, setWrongMsg] = useState<string | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const prevConnCount = React.useRef(0);

  useEffect(() => {
    if (connections.length > prevConnCount.current) {
      const latest = connections[connections.length - 1];
      if (latest && !latest.correct) {
        const msg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
        setWrongMsg(msg);
        setToastKey(k => k + 1);
      }
    }
    prevConnCount.current = connections.length;
  }, [connections]);

  return (
    <div
      ref={boardRef}
      className="flex-1 relative select-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        touchAction: "none",
        background: "#F5F0E8",
        backgroundImage: `
          repeating-linear-gradient(0deg,
            transparent, transparent 27px,
            rgba(160, 130, 90, 0.13) 27px,
            rgba(160, 130, 90, 0.13) 28px
          ),
          repeating-linear-gradient(90deg,
            transparent, transparent calc(100% - 1px),
            rgba(160, 130, 90, 0.06) calc(100% - 1px),
            rgba(160, 130, 90, 0.06) 100%
          )
        `,
      }}
    >
      {/* Left margin red line */}
      <div style={{
        position: "absolute", left: "52px", top: 0, bottom: 0,
        width: "1.5px", background: "rgba(200, 80, 60, 0.2)", zIndex: 0,
      }} />

      {/* Page corner fold */}
      <div style={{
        position: "absolute", bottom: 0, right: 0, width: 0, height: 0,
        borderStyle: "solid", borderWidth: "0 0 28px 28px",
        borderColor: "transparent transparent rgba(160,130,90,0.2) transparent", zIndex: 1,
      }} />

      {/* Instruction bubble */}
      <InstructionBubble phase={level.phase} />

      {/* SVG ink lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <filter id="ink-wobble" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.02" numOctaves="2" result="noise" seed="2"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="ink-wobble-active" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.015" numOctaves="2" result="noise" seed="5"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>

        {connections.map((conn, i) => {
          const isCrossing = crossingIndices.includes(i);
          const pathD = inkPath(conn.fromPos, conn.toPos);
          return (
            <motion.path
              key={`${conn.fromIdx}-${conn.toIdx}`}
              d={pathD}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              fill="none"
              stroke={
                isCrossing ? "rgba(180, 50, 30, 0.8)"
                : conn.correct ? ink.primary
                : "rgba(180, 50, 30, 0.6)"
              }
              strokeWidth={conn.correct ? 2.2 : 2}
              strokeLinecap="round"
              strokeDasharray={!conn.correct && !isCrossing ? "5 4" : undefined}
              filter="url(#ink-wobble)"
              opacity={isCrossing ? 0.9 : conn.correct ? 0.85 : 0.65}
            />
          );
        })}

        {dragging && dragPos && (
          <line
            x1={dragging.pos.x} y1={dragging.pos.y}
            x2={dragPos.x} y2={dragPos.y}
            stroke="rgba(80, 60, 30, 0.35)"
            strokeWidth={1.5} strokeLinecap="round"
            strokeDasharray="6 5"
            filter="url(#ink-wobble-active)"
          />
        )}
      </svg>

      {/* Obstacle */}
      {level.hasObstacle && <ObstacleBlock />}

      {/* ── Word columns — constrained width, centered on desktop ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingTop: "64px", paddingBottom: "36px", zIndex: 3 }}
      >
        <div style={{
          width: "100%",
          maxWidth: "540px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "16px",
          paddingRight: "16px",
          gap: "24px",
        }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pairs.map((pair, i) => {
              const conn = connections.find(c => c.fromIdx === i);
              return (
                <WordBubble
                  key={`left-${i}`}
                  text={pair.left}
                  side="left"
                  index={i}
                  isConnected={!!conn}
                  isCorrect={!!conn?.correct}
                  isDragging={dragging?.side === "left" && dragging.idx === i}
                  phase={level.phase}
                  onPointerDown={(e) => onPointerDown("left", i, e)}
                />
              );
            })}
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
            {shuffledRight.map((origIdx, displayIdx) => {
              const conn = connections.find(c => c.toIdx === displayIdx);
              return (
                <WordBubble
                  key={`right-${displayIdx}`}
                  text={pairs[origIdx].right}
                  side="right"
                  index={displayIdx}
                  isConnected={!!conn}
                  isCorrect={!!conn?.correct}
                  isDragging={dragging?.side === "right" && dragging.idx === displayIdx}
                  phase={level.phase}
                  onPointerDown={(e) => onPointerDown("right", displayIdx, e)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: "7px", zIndex: 4,
      }}>
        {pairs.map((_, i) => {
          const conn = connections.find(c => c.fromIdx === i);
          return (
            <motion.div
              key={i}
              animate={{ scale: conn?.correct ? [1, 1.5, 1] : 1 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: conn?.correct ? ink.primary
                  : conn ? "rgba(180,60,30,0.45)"
                  : "rgba(160,130,90,0.25)",
                border: `1.5px solid ${conn?.correct ? ink.primary + "66" : conn ? "rgba(180,60,30,0.35)" : "rgba(160,130,90,0.3)"}`,
                transition: "background 0.3s",
              }}
            />
          );
        })}
      </div>

      {/* Wrong-connection toast */}
      <AnimatePresence>
        {wrongMsg && (
          <WrongToast
            key={toastKey}
            message={wrongMsg}
            onDone={() => setWrongMsg(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}