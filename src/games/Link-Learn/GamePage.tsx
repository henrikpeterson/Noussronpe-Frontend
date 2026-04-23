import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getLevel } from "@/games/Link-Learn/data/levels";
import { useGameProgress } from "@/games/Link-Learn/hooks/useGameProgress";
import { checkAnyCrossing, lineIntersectsRect } from "@/games/Link-Learn/utils/geometry";
import GameBoard from "@/games/Link-Learn/components/game/GameBoard";
import GameHeader from "@/games/Link-Learn/components/game/GameHeader";
import GameOverlay from "@/games/Link-Learn/components/game/GameOverlay";
import { Variants } from "framer-motion";
interface Pos { x: number; y: number; }
interface Connection { fromIdx: number; toIdx: number; fromPos: Pos; toPos: Pos; correct: boolean; }

// Notebook page-turn transition
const pageVariants = {
  initial: {
    opacity: 0,
    rotateY: -20,
    x: -10,
    transformOrigin: "left",
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    transformOrigin: "left",
    transition: {
      duration: 0.6,
      // Le "as const" indique à TS que c'est un tuple fixe de 4 nombres
      ease: [0.43, 0.13, 0.23, 0.96] as const, 
    },
  },
  exit: {
    opacity: 0,
    rotateY: 20,
    x: 10,
    transformOrigin: "right",
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
};

export default function GamePage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { completeLevel } = useGameProgress();
  const levelNum = parseInt(levelId || "1");
  const level = getLevel(levelNum);

  const boardRef = useRef<HTMLDivElement>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragging, setDragging] = useState<{ side: "left" | "right"; idx: number; pos: Pos } | null>(null);
  const [dragPos, setDragPos] = useState<Pos | null>(null);
  const [crossingIndices, setCrossingIndices] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(level?.timerSeconds || 0);
  const [timerActive, setTimerActive] = useState(false);
  const [shuffledRight, setShuffledRight] = useState<number[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pairs = level?.pairs || [];

  useEffect(() => {
    const indices = pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledRight(indices);
    setConnections([]);
    setCrossingIndices([]);
    setCompleted(false);
    if (level?.timerSeconds) {
      setTimer(level.timerSeconds);
      setTimerActive(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelNum]);

  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { setTimerActive(false); setConnections([]); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const getItemPos = useCallback((side: "left" | "right", idx: number): Pos => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const el = boardRef.current.querySelector(`[data-item="${side}-${idx}"]`);
    if (!el) return { x: 0, y: 0 };
    const boardRect = boardRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: side === "left" ? elRect.right - boardRect.left : elRect.left - boardRect.left,
      y: elRect.top + elRect.height / 2 - boardRect.top,
    };
  }, []);

  const handlePointerDown = useCallback((side: "left" | "right", idx: number, e: React.PointerEvent) => {
    e.preventDefault();
    setConnections(prev => prev.filter(c => side === "left" ? c.fromIdx !== idx : c.toIdx !== idx));
    setCrossingIndices([]);
    const pos = getItemPos(side, idx);
    setDragging({ side, idx, pos });
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (boardRect) setDragPos({ x: e.clientX - boardRect.left, y: e.clientY - boardRect.top });
  }, [getItemPos]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    setDragPos({ x: e.clientX - boardRect.left, y: e.clientY - boardRect.top });
  }, [dragging]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging || !boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const dropX = e.clientX - boardRect.left;
    const dropY = e.clientY - boardRect.top;
    const targetSide = dragging.side === "left" ? "right" : "left";

    let closestIdx = -1;
    let closestDist = 50;
    for (let i = 0; i < pairs.length; i++) {
      const pos = getItemPos(targetSide, i);
      const dist = Math.sqrt((pos.x - dropX) ** 2 + (pos.y - dropY) ** 2);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    }

    if (closestIdx >= 0) {
      const fromIdx = dragging.side === "left" ? dragging.idx : closestIdx;
      const toIdx = dragging.side === "left" ? closestIdx : dragging.idx;
      const fromPos = getItemPos("left", fromIdx);
      const toPos = getItemPos("right", toIdx);
      const filtered = connections.filter(c => dragging.side === "left" ? c.toIdx !== toIdx : c.fromIdx !== fromIdx);
      const correct = fromIdx === shuffledRight[toIdx];

      if (level?.hasObstacle && boardRef.current) {
        const bw = boardRef.current.clientWidth;
        const bh = boardRef.current.clientHeight;
        const obsRect = { x: bw / 2 - 32, y: bh / 2 - 44, w: 64, h: 88 };
        if (lineIntersectsRect(fromPos, toPos, obsRect)) {
          setDragging(null); setDragPos(null); return;
        }
      }

      const newConn: Connection = { fromIdx, toIdx, fromPos, toPos, correct };
      const newConns = [...filtered, newConn];
      setConnections(newConns);

      if (level?.hasNoCross) {
        const crossing = checkAnyCrossing(newConns.map(c => ({ fromPos: c.fromPos, toPos: c.toPos })));
        setCrossingIndices(crossing);
      }

      if (newConns.length === pairs.length) {
        const allCorrect = newConns.every(c => c.correct);
        const noCrossIssue = level?.hasNoCross
          ? checkAnyCrossing(newConns.map(c => ({ fromPos: c.fromPos, toPos: c.toPos }))).length === 0
          : true;
        if (allCorrect && noCrossIssue) {
          const stars = timer > 30 ? 3 : timer > 15 ? 2 : 1;
          setCompleted(true);
          setTimerActive(false);
          completeLevel(levelNum, level?.timerSeconds ? stars : 3);
        }
      }
    }

    setDragging(null);
    setDragPos(null);
  }, [dragging, connections, pairs, shuffledRight, level, getItemPos, completeLevel, levelNum, timer]);

  if (!level) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F5F0E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(160,130,90,0.13) 27px, rgba(160,130,90,0.13) 28px)`,
        }}
      >
        <div style={{
          fontFamily: "'Kalam', cursive",
          fontSize: "18px",
          color: "#5C4520",
          padding: "20px 32px",
          border: "1.5px dashed rgba(140,110,60,0.4)",
          borderRadius: "4px",
          background: "rgba(255,252,244,0.8)",
        }}>
          Page introuvable…
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={levelNum}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        // Outer cover — slightly darker cream
        background: "#EDE8DC",
        // Spiral binding shadow on left
        boxShadow: "inset 6px 0 14px rgba(100,80,40,0.1)",
        position: "relative",
      }}
    >
      {/* Spiral binding holes decoration */}
      <div
        style={{
          position: "absolute",
          left: "14px",
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          paddingTop: "60px",
          paddingBottom: "20px",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#D5CCB8",
              border: "1.5px solid rgba(160,130,90,0.4)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.12), 1px 1px 0 rgba(255,255,255,0.6)",
            }}
          />
        ))}
      </div>

      <GameHeader
        level={level}
        levelNum={levelNum}
        timer={timer}
        onBack={() => navigate("/levels")}
      />

      <GameBoard
        boardRef={boardRef}
        level={level}
        pairs={pairs}
        shuffledRight={shuffledRight}
        connections={connections}
        crossingIndices={crossingIndices}
        dragging={dragging}
        dragPos={dragPos}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      <GameOverlay
        completed={completed}
        timerExpired={!!level.timerSeconds && timer === 0 && !completed}
        levelNum={levelNum}
        onNavigateLevels={() => navigate("/levels")}
        onNextLevel={() => navigate(`/game/${levelNum + 1}`)}
        onRetry={() => {
          setConnections([]);
          setCrossingIndices([]);
          setTimer(level.timerSeconds!);
          setTimerActive(true);
        }}
      />
    </motion.div>
  );
}