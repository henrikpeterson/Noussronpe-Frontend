import { motion } from "framer-motion";
import { AssistanceRequest } from "@/api";
import {
  BookOpen,
  PenLine,
  Brain,
  MessageCircle,
  Clock,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface DemandeCardProps {
  demande: AssistanceRequest;
  onClick: () => void;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURATION DES STATUTS
// Définit l'apparence visuelle de chaque statut possible
// ═══════════════════════════════════════════════════════════

const STATUT_CONFIG: Record<
  string,
  {
    label: string;
    dotColor: string;
    badgeClasses: string;
    borderClasses: string;
    animate: boolean;
  }
> = {
  en_attente: {
    label: "En attente",
    dotColor: "bg-yellow-400",
    badgeClasses: "bg-yellow-100 text-yellow-700 border-yellow-200",
    borderClasses: "border-l-yellow-400",
    animate: true, // Point clignotant
  },
  en_cours: {
    label: "En cours",
    dotColor: "bg-blue-400",
    badgeClasses: "bg-blue-100 text-blue-700 border-blue-200",
    borderClasses: "border-l-blue-400",
    animate: true, // Point clignotant
  },
  repondue: {
    label: "Répondue",
    dotColor: "bg-green-400",
    badgeClasses: "bg-green-100 text-green-700 border-green-200",
    borderClasses: "border-l-green-400",
    animate: false,
  },
  fermé: {
    label: "Fermée",
    dotColor: "bg-gray-400",
    badgeClasses: "bg-gray-100 text-gray-500 border-gray-200",
    borderClasses: "border-l-gray-300",
    animate: false,
  },
};

// ═══════════════════════════════════════════════════════════
// CONFIGURATION DES TYPES DE QUESTIONS
// Icône et style visuel pour chaque type de question
// ═══════════════════════════════════════════════════════════

const TYPE_CONFIG: Record<
  string,
  {
    icon: React.ReactNode;
    label: string;
    classes: string;
  }
> = {
  cours: {
    icon: <BookOpen size={11} />,
    label: "Cours",
    classes: "bg-blue-50 text-blue-600",
  },
  exercice: {
    icon: <PenLine size={11} />,
    label: "Exercice",
    classes: "bg-orange-50 text-orange-600",
  },
  comprehension: {
    icon: <Brain size={11} />,
    label: "Compréhension",
    classes: "bg-purple-50 text-purple-600",
  },
  autres: {
    icon: <MessageCircle size={11} />,
    label: "Autres",
    classes: "bg-slate-100 text-slate-500",
  },
};

// ═══════════════════════════════════════════════════════════
// UTILITAIRE : FORMATAGE DE DATE
// Retourne un texte relatif lisible depuis une date ISO
// Ex : "Il y a 2 heures", "Il y a 3 jours"
// ═══════════════════════════════════════════════════════════

const formaterDate = (dateISO: string): string => {
  const date = new Date(dateISO);
  const maintenant = new Date();
  const diffMs = maintenant.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffJ = Math.floor(diffH / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffJ < 7) return `Il y a ${diffJ} jour${diffJ > 1 ? "s" : ""}`;

  // Au-delà de 7 jours → date complète
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════

const DemandeCard = ({ demande, onClick }: DemandeCardProps) => {
  // ─── Récupération des configs avec fallback ───
  const statutConfig =
    STATUT_CONFIG[demande.statut] ?? STATUT_CONFIG.en_attente;

  const typeConfig =
    TYPE_CONFIG[demande.type_question] ?? TYPE_CONFIG.autres;

  // ─── Nombre de réponses reçues ───
  const nbReponses = demande.reponses?.length ?? 0;

  // ─── Indique si la demande a une image jointe ───
  const aUneImage = Boolean(demande.image);

  return (
    <motion.button
      onClick={onClick}
      // ── Animations d'interaction ──
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      className={`
        w-full text-left bg-white rounded-2xl
        border border-slate-200 border-l-4
        ${statutConfig.borderClasses}
        px-4 py-4 shadow-sm
        hover:shadow-md hover:border-slate-300
        active:shadow-sm transition-all duration-200
        focus:outline-none focus:ring-2
        focus:ring-blue-200 focus:ring-offset-1
      `}
      aria-label={`Voir la demande : ${demande.titre}`}
    >
      <div className="flex items-start gap-3">

        {/* ══════════════════════════════════════
            COLONNE GAUCHE : Contenu principal
        ══════════════════════════════════════ */}
        <div className="flex-1 min-w-0">

          {/* ── LIGNE 1 : Badge statut ── */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`
                inline-flex items-center gap-1.5
                text-[11px] font-bold px-2 py-0.5
                rounded-full border ${statutConfig.badgeClasses}
              `}
            >
              {/* Point indicateur (animé si en_attente ou en_cours) */}
              <span
                className={`
                  w-1.5 h-1.5 rounded-full ${statutConfig.dotColor}
                  ${statutConfig.animate ? "animate-pulse" : ""}
                `}
              />
              {statutConfig.label}
            </span>

            {/* Badge image jointe si présente */}
            {aUneImage && (
              <span className="text-[11px] text-slate-400 font-medium">
                📎
              </span>
            )}
          </div>

          {/* ── LIGNE 2 : Titre de la demande ── */}
          <h3
            className="text-sm sm:text-base font-bold text-slate-800
                       leading-snug line-clamp-2 mb-2"
          >
            {demande.titre}
          </h3>

          {/* ── LIGNE 3 : Métadonnées (matière + type + date) ── */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">

            {/* Badge matière */}
            <span className="flex items-center gap-1 text-xs
                             font-medium text-slate-500">
              <BookOpen size={11} className="text-slate-400" />
              {demande.matiere_nom}
            </span>

            {/* Séparateur visuel */}
            <span className="text-slate-300 text-xs">•</span>

            {/* Badge type de question */}
            <span
              className={`
                flex items-center gap-1 text-[11px]
                font-semibold px-2 py-0.5 rounded-full
                ${typeConfig.classes}
              `}
            >
              {typeConfig.icon}
              {typeConfig.label}
            </span>

            {/* Séparateur visuel */}
            <span className="text-slate-300 text-xs">•</span>

            {/* Date relative */}
            <span className="flex items-center gap-1 text-xs
                             text-slate-400 font-medium">
              <Clock size={11} />
              {formaterDate(demande.created_at)}
            </span>
          </div>

          {/* ── LIGNE 4 : Compteur de réponses ── */}
          {nbReponses > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <MessageSquare size={12} className="text-slate-400" />
              <span className="text-xs text-slate-400 font-medium">
                {nbReponses} réponse{nbReponses > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            COLONNE DROITE : Chevron navigation
        ══════════════════════════════════════ */}
        <div
          className="flex items-center justify-center shrink-0
                     self-center w-8 h-8 rounded-full
                     bg-slate-50 group-hover:bg-slate-100
                     transition-colors"
        >
          <ChevronRight
            size={16}
            className="text-slate-400"
          />
        </div>
      </div>
    </motion.button>
  );
};

export default DemandeCard;