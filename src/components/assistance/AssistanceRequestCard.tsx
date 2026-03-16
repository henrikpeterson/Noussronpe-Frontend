import { useState, useRef } from "react";
import { AssistanceRequest } from "@/api";
import { Clock, CheckCircle, Lock, MessageSquare, ChevronDown, ChevronUp, Star, Send, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { createPortal } from "react-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface AssistanceRequestCardProps {
  request: AssistanceRequest;
  onView: (request: AssistanceRequest) => void;
}

// Même helper de style que dans le Form
const MATIERE_STYLES: Record<string, { gradient: string; color: string; lightBg: string }> = {
  default:          { gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#6366f1", lightBg: "#eef2ff" },
  mathematiques:    { gradient: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#3b82f6", lightBg: "#eff6ff" },
  maths:            { gradient: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#3b82f6", lightBg: "#eff6ff" },
  physique:         { gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#f59e0b", lightBg: "#fffbeb" },
  "physique chimie":{ gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#f59e0b", lightBg: "#fffbeb" },
  chimie:           { gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#f59e0b", lightBg: "#fffbeb" },
  svt:              { gradient: "linear-gradient(135deg,#10b981,#34d399)", color: "#10b981", lightBg: "#f0fdf4" },
  "histoire-géographie": { gradient: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#f97316", lightBg: "#fff7ed" },
  "histoire-geographie": { gradient: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#f97316", lightBg: "#fff7ed" },
  anglais:          { gradient: "linear-gradient(135deg,#0ea5e9,#38bdf8)", color: "#0ea5e9", lightBg: "#f0f9ff" },
  francais:         { gradient: "linear-gradient(135deg,#8b5cf6,#a78bfa)", color: "#8b5cf6", lightBg: "#faf5ff" },
  français:         { gradient: "linear-gradient(135deg,#8b5cf6,#a78bfa)", color: "#8b5cf6", lightBg: "#faf5ff" },
  philosophie:      { gradient: "linear-gradient(135deg,#ec4899,#f43f5e)", color: "#ec4899", lightBg: "#fdf2f8" },
  "éducation civique":      { gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)", color: "#14b8a6", lightBg: "#f0fdfa" },
  "education civique":      { gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)", color: "#14b8a6", lightBg: "#f0fdfa" },
  "éducation civique et morale": { gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)", color: "#14b8a6", lightBg: "#f0fdfa" },
};

function getMatiereStyle(nom: string) {
  const key = nom?.toLowerCase().trim() || "";
  return MATIERE_STYLES[key] || MATIERE_STYLES.default;
}

const STATUS_CONFIG = {
  repondue: { label: "Répondu", bg: "#dcfce7", color: "#16a34a", icon: <CheckCircle className="h-3 w-3" />, barGradient: "linear-gradient(90deg,#22c55e,#10b981)" },
  fermé:    { label: "Fermé",   bg: "#f1f5f9", color: "#64748b", icon: <Lock className="h-3 w-3" />,        barGradient: "linear-gradient(90deg,#94a3b8,#64748b)" },
  default:  { label: "En attente", bg: "#fef9c3", color: "#d97706", icon: <Clock className="h-3 w-3" />,   barGradient: "linear-gradient(90deg,#fbbf24,#f59e0b)" },
};

function getStatus(statut: string) {
  return STATUS_CONFIG[statut as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.default;
}

const AssistanceRequestCard = ({ request }: AssistanceRequestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showReplyField, setShowReplyField] = useState(false);
  const [followUpMessage, setFollowUpMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const status = getStatus(request.statut);
  const mStyle = getMatiereStyle(request.matiere_nom || "");

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1.5px solid rgba(226,232,240,0.7)",
        boxShadow: isExpanded
          ? "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)"
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Barre colorée top par matière */}
      <div className="h-1 w-full" style={{ background: mStyle.gradient }} />

      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap gap-1.5 items-center">
            {/* Badge statut */}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide"
              style={{ background: status.bg, color: status.color }}
            >
              {status.icon}
              {status.label}
            </span>
            {/* Badge matière */}
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: mStyle.lightBg, color: mStyle.color }}
            >
              {request.matiere_nom}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium flex-shrink-0 mt-0.5">
            {format(new Date(request.created_at), "d MMM · HH:mm", { locale: fr })}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-tight">
          {request.titre}
        </h3>
      </div>

      {/* Bulle question */}
      <div className="px-4 pb-3">
        <div
          className="p-3.5 rounded-2xl rounded-tl-none text-sm text-slate-600 italic leading-relaxed"
          style={{ background: "rgba(241,245,249,0.7)", border: "1px solid rgba(226,232,240,0.5)" }}
        >
          "{request.description}"
        </div>
      </div>

      {/* Image si présente */}
      {request.image && (
        <div className="px-4 pb-3">
          <div
            className="rounded-xl overflow-hidden border-2 cursor-zoom-in"
            style={{ borderColor: "rgba(226,232,240,0.7)" }}
            onClick={() => setIsZoomed(true)}
          >
            <img
              src={request.image.startsWith("http") ? request.image : `${apiBaseUrl}${request.image}`}
              alt="Photo du problème"
              className="w-full max-h-48 object-contain bg-slate-50"
            />
          </div>
        </div>
      )}

      {/* Lightbox zoom */}
       {/* Lightbox zoom avec Portal */}
        {isZoomed && request.image && createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 w-screen h-screen"
            style={{ 
              animation: "fadeIn .2s ease",
              position: 'fixed',
              top: 0,
              left: 0
            }}
            onClick={() => setIsZoomed(false)}
          >
            {/* Bouton de fermeture plus visible */}
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/20"
              onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image centrée avec contrainte de taille */}
            <img
              src={request.image.startsWith("http") ? request.image : `${apiBaseUrl}${request.image}`}
              alt="Zoom"
              className="max-w-[95%] max-h-[85vh] rounded-lg shadow-2xl object-contain border-4 border-white/5"
              onClick={(e) => e.stopPropagation()}
            />

            <p className="absolute bottom-8 text-white/60 text-sm font-bold tracking-widest uppercase">
              Appuie n'importe où pour fermer
            </p>
          </div>,
          document.body // On l'injecte directement dans le body
        )}

      {/* Section expandable : échanges */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4" style={{ animation: "fadeSlideIn .2s ease" }}>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <MessageSquare className="h-3 w-3" />
            Échanges ({request.reponses.length})
          </div>

          {request.reponses.length === 0 ? (
            <div
              className="text-center py-8 rounded-2xl"
              style={{ background: "rgba(241,245,249,0.5)", border: "2px dashed rgba(203,213,225,0.6)" }}
            >
              <p className="text-2xl mb-1">⏳</p>
              <p className="text-xs font-bold text-slate-500">Un enseignant va te répondre très bientôt !</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {request.reponses.map((rep) => (
                <div key={rep.id} className={`flex ${rep.is_from_teacher ? "justify-start" : "justify-end"}`}>
                  <div
                    className="max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm"
                    style={
                      rep.is_from_teacher
                        ? {
                            background: "white",
                            border: `2px solid ${mStyle.lightBg}`,
                            borderRadius: "16px 16px 16px 4px",
                          }
                        : {
                            background: mStyle.gradient,
                            color: "white",
                            borderRadius: "16px 16px 4px 16px",
                          }
                    }
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <span
                        className="text-[9px] font-black uppercase tracking-wide"
                        style={{ color: rep.is_from_teacher ? mStyle.color : "rgba(255,255,255,0.7)" }}
                      >
                        {rep.is_from_teacher ? "👨‍🏫 Enseignant" : "👤 Toi"}
                      </span>
                      <span className="text-[9px] opacity-60">
                        {format(new Date(rep.created_at), "HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <p>{rep.message}</p>
                    {rep.image && (
                      <img
                        src={rep.image}
                        alt="Explication"
                        className="mt-2 rounded-xl border border-white/20 max-h-40 w-full object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}

              {/* Feedback */}
              {request.statut === "repondue" && !feedbackGiven && (
                <div className="mt-4">
                  {!showReplyField ? (
                    <div
                      className="p-4 rounded-2xl text-center"
                      style={{ background: mStyle.lightBg, border: `1.5px solid ${mStyle.color}22` }}
                    >
                      <p className="text-sm font-black text-slate-700 mb-3">L'explication est-elle claire ? ✨</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="py-2.5 rounded-xl text-white text-sm font-black transition-all active:scale-95"
                          style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}
                          onClick={() => {
                            setFeedbackGiven(true);
                            toast.success("Super ! Notion validée. 🥳");
                          }}
                        >
                          ✅ OUI !
                        </button>
                        <button
                          className="py-2.5 rounded-xl text-sm font-black transition-all active:scale-95"
                          style={{
                            background: "white",
                            border: `2px solid ${mStyle.color}44`,
                            color: mStyle.color,
                          }}
                          onClick={() => {
                            setShowReplyField(true);
                            setTimeout(() => textareaRef.current?.focus(), 100);
                          }}
                        >
                          🤔 Pas encore
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2" style={{ animation: "fadeSlideIn .15s ease" }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wide" style={{ color: mStyle.color }}>
                          Ta précision au prof :
                        </span>
                        <button
                          className="text-xs text-slate-400 hover:underline"
                          onClick={() => setShowReplyField(false)}
                        >
                          Annuler
                        </button>
                      </div>
                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          value={followUpMessage}
                          onChange={(e) => setFollowUpMessage(e.target.value)}
                          placeholder="Dis-nous ce que tu n'as pas compris…"
                          className="w-full min-h-[90px] p-3.5 pr-14 text-sm rounded-2xl outline-none resize-none transition-all"
                          style={{
                            background: "rgba(248,250,252,0.9)",
                            border: `2px solid ${mStyle.color}44`,
                            boxShadow: `0 0 0 4px ${mStyle.color}10`,
                          }}
                        />
                        <button
                          disabled={!followUpMessage.trim()}
                          onClick={() => {
                            toast.success("Message envoyé au prof !");
                            setFollowUpMessage("");
                            setShowReplyField(false);
                          }}
                          className="absolute bottom-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 disabled:opacity-40"
                          style={{ background: mStyle.gradient }}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {feedbackGiven && (
                <div
                  className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-black"
                  style={{ background: "#dcfce7", color: "#16a34a", border: "1.5px solid #bbf7d0" }}
                >
                  <Star className="h-4 w-4 fill-green-500" />
                  NOTION VALIDÉE ! BRAVO ! 🎉
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bouton toggle */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200"
          style={{
            background: isExpanded ? "rgba(241,245,249,0.8)" : "transparent",
            color: isExpanded ? "#64748b" : mStyle.color,
            border: isExpanded ? "1.5px solid rgba(226,232,240,0.6)" : `1.5px solid ${mStyle.color}33`,
          }}
        >
          {isExpanded ? (
            <><ChevronUp className="h-3.5 w-3.5" /> Réduire</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" /> Voir la réponse ({request.reponses.length})</>
          )}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  );
};

export default AssistanceRequestCard;