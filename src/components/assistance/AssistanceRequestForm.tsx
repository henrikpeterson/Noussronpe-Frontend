import { useState } from "react";
import { Loader2, Image as ImageIcon, Mic, X, Send } from "lucide-react";
import { toast } from "sonner";
import { useReferenceData } from "@/hooks/useReferenceData";

// Map couleurs & emojis par slug/nom de matière
const MATIERE_STYLES: Record<string, { color: string; gradient: string; emoji: string; textColor: string }> = {
  default:          { gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#6366f1", emoji: "📚", textColor: "#6366f1" },
  mathematiques:    { gradient: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#3b82f6", emoji: "📐", textColor: "#3b82f6" },
  maths:            { gradient: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#3b82f6", emoji: "📐", textColor: "#3b82f6" },
  physique:         { gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#f59e0b", emoji: "⚗️", textColor: "#f59e0b" },
  "physique chimie":{ gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#f59e0b", emoji: "⚗️", textColor: "#f59e0b" },
  chimie:           { gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#f59e0b", emoji: "🧪", textColor: "#f59e0b" },
  svt:              { gradient: "linear-gradient(135deg,#10b981,#34d399)", color: "#10b981", emoji: "🌿", textColor: "#059669" },
  "histoire-géographie": { gradient: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#f97316", emoji: "🌍", textColor: "#f97316" },
  "histoire-geographie":{ gradient: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#f97316", emoji: "🌍", textColor: "#f97316" },
  histoire:         { gradient: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#f97316", emoji: "🏛️", textColor: "#f97316" },
  géographie:       { gradient: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#f97316", emoji: "🗺️", textColor: "#f97316" },
  anglais:          { gradient: "linear-gradient(135deg,#0ea5e9,#38bdf8)", color: "#0ea5e9", emoji: "🇬🇧", textColor: "#0284c7" },
  francais:         { gradient: "linear-gradient(135deg,#8b5cf6,#a78bfa)", color: "#8b5cf6", emoji: "✍️", textColor: "#7c3aed" },
  français:         { gradient: "linear-gradient(135deg,#8b5cf6,#a78bfa)", color: "#8b5cf6", emoji: "✍️", textColor: "#7c3aed" },
  philosophie:      { gradient: "linear-gradient(135deg,#ec4899,#f43f5e)", color: "#ec4899", emoji: "🧠", textColor: "#db2777" },
  "éducation civique": { gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)", color: "#14b8a6", emoji: "⚖️", textColor: "#0f766e" },
  "education civique":{ gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)", color: "#14b8a6", emoji: "⚖️", textColor: "#0f766e" },
  "éducation civique et morale":{ gradient: "linear-gradient(135deg,#14b8a6,#06b6d4)", color: "#14b8a6", emoji: "⚖️", textColor: "#0f766e" },
  informatique:     { gradient: "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "#1d4ed8", emoji: "💻", textColor: "#1d4ed8" },
};

function getMatiereStyle(nom: string) {
  const key = nom.toLowerCase().trim();
  return MATIERE_STYLES[key] || MATIERE_STYLES.default;
}

interface AssistanceRequestFormProps {
  onSubmit: (data: {
    titre: string;
    type_question: string;
    description: string;
    matiere: number;
    image?: File;
  }) => Promise<void>;
}

const AssistanceRequestForm = ({ onSubmit }: AssistanceRequestFormProps) => {
  const [description, setDescription] = useState("");
  const [matiere, setMatiere] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const { matieres, loading: loadingReferences } = useReferenceData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !matiere) {
      toast.error("Choisis une matière et explique ton problème ! ✨");
      return;
    }
    setSubmitting(true);
    try {
      const selectedMatiere = matieres.find((m) => m.id === matiere);
      const autoTitre = `Aide en ${selectedMatiere?.nom || "Matière"} - ${new Date().toLocaleDateString()}`;

      await onSubmit({
        titre: autoTitre,
        type_question: "exercice",
        description,
        matiere,
        image: image || undefined,
      });

      setDescription("");
      setMatiere(null);
      setImage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingReferences) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <p className="text-slate-400 text-sm font-medium">Chargement des matières…</p>
      </div>
    );
  }

  const selectedStyle = matiere
    ? getMatiereStyle(matieres.find((m) => m.id === matiere)?.nom || "")
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* ÉTAPE 1 : Matière */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            1
          </div>
          <h3 className="text-base font-black text-slate-700">C'est pour quelle matière ?</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {matieres.map((m) => {
            const style = getMatiereStyle(m.nom);
            const isSelected = matiere === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMatiere(m.id)}
                className="relative p-3.5 rounded-2xl transition-all duration-200 flex flex-col items-center gap-2 text-center active:scale-95"
                style={
                  isSelected
                    ? {
                        background: style.gradient,
                        boxShadow: `0 6px 20px ${style.color}55`,
                        border: "2px solid transparent",
                        transform: "scale(0.97)",
                      }
                    : {
                        background: "rgba(248,250,252,0.9)",
                        border: "2px solid rgba(226,232,240,0.8)",
                      }
                }
              >
                {/* Emoji */}
                <span className="text-2xl leading-none">{style.emoji}</span>
                <span
                  className="font-bold text-[11px] uppercase tracking-tight leading-tight"
                  style={{ color: isSelected ? "white" : style.textColor }}
                >
                  {m.nom}
                </span>
                {isSelected && (
                  <span
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[9px]"
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ÉTAPE 2 : Description */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}
          >
            2
          </div>
          <h3 className="text-base font-black text-slate-700">Explique ton problème</h3>
        </div>

        <div className="relative">
          <textarea
            placeholder="Décris ton problème ou ta question ici… Plus tu es précis, mieux le prof peut t'aider !"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[130px] p-4 pr-14 text-sm text-slate-700 rounded-2xl outline-none resize-none transition-all duration-200"
            style={{
              background: "rgba(248,250,252,0.9)",
              border: description
                ? "2px solid #a855f7"
                : "2px solid rgba(226,232,240,0.8)",
              boxShadow: description ? "0 0 0 4px rgba(168,85,247,0.08)" : "none",
            }}
          />
          <button
            type="button"
            onClick={() => {
              setIsRecording(!isRecording);
              if (!isRecording) toast.info("Micro activé ! (Simulé)");
            }}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90"
            style={
              isRecording
                ? { background: "#ef4444", color: "white", boxShadow: "0 0 0 4px rgba(239,68,68,0.2)" }
                : { background: "rgba(226,232,240,0.8)", color: "#94a3b8" }
            }
          >
            <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
          </button>
        </div>
        {description && (
          <p className="text-right text-xs text-slate-400 font-medium">{description.length} caractères</p>
        )}
      </div>

      {/* ÉTAPE 3 : Photo facultative */}
      <div className="space-y-2">
        <input
          id="img-up"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <label
          htmlFor="img-up"
          className="flex items-center justify-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200"
          style={
            image
              ? { background: "rgba(240,253,244,0.9)", border: "2px solid #86efac" }
              : { background: "rgba(248,250,252,0.9)", border: "2px dashed rgba(203,213,225,0.8)" }
          }
          onMouseEnter={(e) => {
            if (!image) {
              (e.currentTarget as HTMLElement).style.borderColor = "#c4b5fd";
              (e.currentTarget as HTMLElement).style.background = "rgba(237,233,254,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!image) {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(203,213,225,0.8)";
              (e.currentTarget as HTMLElement).style.background = "rgba(248,250,252,0.9)";
            }
          }}
        >
          {image ? (
            <>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)" }}
              >
                <ImageIcon className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-bold text-green-700 truncate flex-1 min-w-0">{image.name}</span>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setImage(null); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:bg-red-100"
                style={{ color: "#94a3b8" }}
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#ede9fe,#fce7f3)" }}
              >
                <ImageIcon className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-600">Ajouter une photo de l'exercice</p>
                <p className="text-xs text-slate-400">Facultatif · JPG, PNG, HEIC</p>
              </div>
            </>
          )}
        </label>
      </div>

      {/* Bouton Envoyer */}
      <button
        type="submit"
        disabled={submitting || !description || !matiere}
        className="w-full h-14 rounded-2xl text-white font-black text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
        style={
          !description || !matiere
            ? { background: "rgba(203,213,225,0.6)", cursor: "not-allowed", color: "#94a3b8" }
            : selectedStyle
            ? {
                background: selectedStyle.gradient,
                boxShadow: `0 6px 24px ${selectedStyle.color}50`,
              }
            : {
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                boxShadow: "0 6px 24px rgba(99,102,241,0.45)",
              }
        }
      >
        {submitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Send className="h-4 w-4" />
            ENVOYER MA QUESTION
          </>
        )}
      </button>
    </form>
  );
};

export default AssistanceRequestForm;