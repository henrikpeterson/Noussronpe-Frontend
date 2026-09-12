import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AssistanceRequest } from "@/api";
import DemandeCard from "@/newpages/Components/Assistance/Components/DemandeCard";
import { RefreshCw, Plus, Inbox } from "lucide-react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type FiltreStatut = "toutes" | "en_attente" | "en_cours" | "repondue" | "fermé";

interface AssistanceListProps {
  demandes: AssistanceRequest[];
  loading: boolean;
  error: string | null;
  demandesEnAttente: AssistanceRequest[];
  demandesResolues: AssistanceRequest[];
  onVoirDemande: (demande: AssistanceRequest) => void;
  onNouvelleDeamande: () => void;
  onRecharger: () => void;
  onClearError: () => void;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURATION DES FILTRES
// ═══════════════════════════════════════════════════════════

const FILTRES: { label: string; value: FiltreStatut; couleur: string }[] = [
  {
    label: "Toutes",
    value: "toutes",
    couleur: "bg-slate-100 text-slate-700 border-slate-300",
  },
  {
    label: "En attente",
    value: "en_attente",
    couleur: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  {
    label: "En cours",
    value: "en_cours",
    couleur: "bg-blue-100 text-blue-700 border-blue-300",
  },
  {
    label: "Répondues",
    value: "repondue",
    couleur: "bg-green-100 text-green-700 border-green-300",
  },
  {
    label: "Fermées",
    value: "fermé",
    couleur: "bg-gray-100 text-gray-500 border-gray-300",
  },
];

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════

const AssistanceList = ({
  demandes,
  loading,
  error,
  onVoirDemande,
  onNouvelleDeamande,
  onRecharger,
  onClearError,
}: AssistanceListProps) => {
  // ─── État local du filtre actif ───
  const [filtreActif, setFiltreActif] = useState<FiltreStatut>("toutes");

  // ─── État local de la recherche ───
  const [recherche, setRecherche] = useState("");

  // ═══════════════════════════════════════════════════════════
  // LOGIQUE DE FILTRAGE
  // Filtre les demandes selon le statut sélectionné
  // et le texte de recherche saisi par l'élève
  // ═══════════════════════════════════════════════════════════
  const demandesFiltrees = demandes
    .filter((d) => {
      // Filtre par statut
      if (filtreActif === "toutes") return true;
      return d.statut === filtreActif;
    })
    .filter((d) => {
      // Filtre par recherche (titre ou matière)
      if (!recherche.trim()) return true;
      const terme = recherche.toLowerCase();
      return (
        d.titre.toLowerCase().includes(terme) ||
        d.matiere_nom.toLowerCase().includes(terme)
      );
    });

  // ═══════════════════════════════════════════════════════════
  // RENDER - ÉTAT DE CHARGEMENT
  // ═══════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="w-full py-8">
        {/* En-tête avec titre */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black font-fredoka text-slate-800">
            Mon Assistance
          </h2>
        </div>

        {/* Squelettes de chargement */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full h-24 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="w-full py-8">

      {/* ── BANNIÈRE D'ERREUR ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between
                       bg-red-50 border border-red-200
                       text-red-700 rounded-xl px-4 py-3 mb-4"
          >
            <span className="text-sm font-medium">{error}</span>
            <button
              onClick={onClearError}
              className="text-red-400 hover:text-red-600
                         transition-colors ml-4 font-bold text-lg"
              aria-label="Fermer l'erreur"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          EN-TÊTE : Titre + Bouton Actualiser
      ══════════════════════════════════════ */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black font-fredoka text-slate-800">
          Mon Assistance
        </h2>

        {/* Bouton actualiser */}
        <button
          onClick={onRecharger}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium
                     text-slate-500 hover:text-blue-500
                     transition-colors disabled:opacity-50"
          aria-label="Actualiser les demandes"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
      </div>

      {/* ══════════════════════════════════════
          BARRE DE RECHERCHE
      ══════════════════════════════════════ */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2
                         text-slate-400 pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher par titre ou matière..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border
                     border-slate-200 bg-white text-sm
                     text-slate-700 placeholder-slate-400
                     focus:outline-none focus:ring-2
                     focus:ring-blue-300 focus:border-blue-300
                     transition-all"
        />
      </div>

      {/* ══════════════════════════════════════
          FILTRES PAR STATUT
          Onglets horizontaux scrollables
      ══════════════════════════════════════ */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1
                      scrollbar-hide">
        {FILTRES.map((filtre) => {
          const estActif = filtreActif === filtre.value;

          // Compteur de demandes par filtre
          const count =
            filtre.value === "toutes"
              ? demandes.length
              : demandes.filter((d) => d.statut === filtre.value).length;

          return (
            <button
              key={filtre.value}
              onClick={() => setFiltreActif(filtre.value)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-xs font-semibold border whitespace-nowrap
                transition-all duration-200 shrink-0
                ${
                  estActif
                    ? `${filtre.couleur} shadow-sm scale-105`
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }
              `}
            >
              {filtre.label}
              {/* Badge compteur */}
              {count > 0 && (
                <span
                  className={`
                  text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${estActif ? "bg-white/60" : "bg-slate-100"}
                `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════
          LISTE DES DEMANDES
      ══════════════════════════════════════ */}
      <AnimatePresence mode="popLayout">
        {demandesFiltrees.length > 0 ? (
          // ── Liste avec demandes ──
          <motion.div className="space-y-3">
            {demandesFiltrees.map((demande, index) => (
              <motion.div
                key={demande.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <DemandeCard
                  demande={demande}
                  onClick={() => onVoirDemande(demande)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // ── État vide ──
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center
                       py-16 text-center"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full
                            flex items-center justify-center mb-4">
              <Inbox size={28} className="text-slate-400" />
            </div>

            <p className="text-slate-600 font-semibold text-base mb-1">
              {recherche
                ? "Aucune demande trouvée"
                : filtreActif === "toutes"
                ? "Vous n'avez pas encore de demande"
                : `Aucune demande "${FILTRES.find((f) => f.value === filtreActif)?.label}"`}
            </p>

            <p className="text-slate-400 text-sm mb-6">
              {recherche
                ? "Essayez un autre terme de recherche"
                : "Posez votre première question à un enseignant"}
            </p>

            {/* Bouton créer si liste vraiment vide */}
            {!recherche && filtreActif === "toutes" && (
              <button
                onClick={onNouvelleDeamande}
                className="flex items-center gap-2 px-5 py-2.5
                           bg-blue-500 hover:bg-blue-600
                           text-white font-semibold text-sm
                           rounded-xl transition-colors shadow-sm"
              >
                <Plus size={16} />
                Nouvelle demande
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          BOUTON FLOTTANT : Nouvelle demande
          Visible uniquement si des demandes existent
      ══════════════════════════════════════ */}
      {demandes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={onNouvelleDeamande}
            className="flex items-center gap-2 px-6 py-3
                       bg-blue-500 hover:bg-blue-600 active:scale-95
                       text-white font-bold text-sm rounded-2xl
                       transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            Nouvelle demande
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AssistanceList;