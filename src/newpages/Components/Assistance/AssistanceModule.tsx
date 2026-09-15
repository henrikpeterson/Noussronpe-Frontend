import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssistance } from '@/hooks/useAssitance';
import { AssistanceReponse, AssistanceRequest } from "@/api";

import { LogIn, UserPlus, ShieldAlert } from "lucide-react";

import AssistanceList from "@/newpages/Components/Assistance/views/AssistanceList";
import NouvelleDemandeForm from "@/newpages/Components/Assistance/views/NouvelleDemandeForm";
import FilDiscussion from "@/newpages/Components/Assistance/views/FilDiscussion";
// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

/** Les 3 vues possibles dans le module assistance */
type VueActive = "liste" | "nouvelle-demande" | "fil-discussion";

// ═══════════════════════════════════════════════════════════
// UTILITAIRE : VÉRIFICATION DU TOKEN
// Vérifie la présence du token JWT dans localStorage
// Ne valide pas le token côté client (c'est le rôle du backend)
// ═══════════════════════════════════════════════════════════

const estConnecte = (): boolean => {
  try {
    const token = localStorage.getItem("students_access_token");
    // Vérifie que le token existe et n'est pas une chaîne vide
    return Boolean(token && token.trim().length > 0);
  } catch {
    // localStorage peut être inaccessible dans certains contextes
    // (navigation privée restrictive, iframes, etc.)
    return false;
  }
};

// ═══════════════════════════════════════════════════════════
// SOUS-COMPOSANT : ÉTAT NON CONNECTÉ
// Affiché quand aucun token n'est trouvé dans localStorage
// ═══════════════════════════════════════════════════════════

const EtatNonConnecte = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="w-full py-6 max-w-2xl mx-auto"
  >
    {/* ── En-tête ── */}
    <h2 className="text-2xl font-black font-fredoka uppercase text-slate-800 mb-6 tracking-tight">
      Mon Assistance
    </h2>

    {/* ── Carte principale 3D ── */}
    <div
      className="relative flex flex-col items-center justify-center text-center
                 bg-white border-2 border-slate-200 border-b-[6px]
                 rounded-3xl px-6 py-10 mb-6 transition-all"
    >
      {/* Icône dans une tuile 3D */}
      <div
        className="w-16 h-16 bg-blue-50 border-2 border-blue-200 border-b-4
                   rounded-2xl flex items-center justify-center mb-5 text-blue-500"
      >
        <ShieldAlert size={32} strokeWidth={2.5} />
      </div>

      {/* Titre */}
      <h3 className="text-xl font-black font-fredoka text-slate-800 mb-2 uppercase tracking-tight">
        Connectez-vous pour accéder à l'assistance
      </h3>

      {/* Description */}
      <p className="text-sm font-bold text-slate-500 max-w-sm mb-8 leading-relaxed">
        Posez vos questions à vos enseignants et suivez vos demandes en vous connectant à votre compte.
      </p>

      {/* ── Boutons d'action 3D ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
        
        {/* Bouton Se connecter (Style Bleu Tactile) */}
        <a
          href="/login"
          className="flex items-center justify-center gap-2.5 px-8 h-12
                     bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-widest
                     rounded-2xl border-b-[5px] border-blue-600
                     active:border-b-0 active:translate-y-1 transition-all"
        >
          <LogIn size={18} strokeWidth={2.5} />
          <span>Se connecter</span>
        </a>

        {/* Bouton Créer un compte (Style Bloc Blanc 3D) */}
        <a
          href="/register"
          className="flex items-center justify-center gap-2.5 px-8 h-12
                     bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest
                     rounded-2xl border-2 border-slate-200 border-b-[5px]
                     active:border-b-0 active:translate-y-1 transition-all"
        >
          <UserPlus size={18} strokeWidth={2.5} />
          <span>Créer un compte</span>
        </a>

      </div>
    </div>

    {/* ── Fonctionnalités sous forme de Briques 3D ── */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        {
          emoji: '💬',
          titre: 'Posez vos questions',
          description: 'Envoyez vos questions directement à vos enseignants',
        },
        {
          emoji: '📎',
          titre: 'Joignez des images',
          description: 'Illustrez vos problèmes avec des captures d’écran',
        },
        {
          emoji: '🔔',
          titre: 'Suivez vos demandes',
          description: 'Consultez l’historique de vos échanges',
        },
      ].map((feature) => (
        <div
          key={feature.titre}
          className="flex flex-col items-center text-center
                     bg-white border-2 border-slate-200 border-b-4 rounded-2xl
                     p-5 transition-all hover:-translate-y-0.5"
        >
          {/* Tuile Emoji */}
          <div className="w-12 h-12 bg-slate-50 border-2 border-slate-200 border-b-2 rounded-xl flex items-center justify-center text-2xl mb-3">
            {feature.emoji}
          </div>

          <p className="text-xs font-black font-fredoka uppercase text-slate-800 mb-1">
            {feature.titre}
          </p>

          <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : ORCHESTRATEUR
// ═══════════════════════════════════════════════════════════

const AssistanceModule = () => {
  // ═══════════════════════════════════════
  // VÉRIFICATION AUTH EN PREMIER
  // Avant tout rendu ou appel API
  // ═══════════════════════════════════════
  const utilisateurConnecte = estConnecte();

  // ═══════════════════════════════════════
  // ÉTAT DE NAVIGATION
  // ═══════════════════════════════════════
  const [vueActive, setVueActive] = useState<VueActive>("liste");
  const [demandeSelectionnee, setDemandeSelectionnee] =
    useState<AssistanceRequest | null>(null);

  // ═══════════════════════════════════════
  // HOOK ASSISTANCE
  // Appelé uniquement si l'utilisateur est connecté
  // Evite un appel API inutile avec autoLoad
  // ═══════════════════════════════════════
  const {
    demandes,
    loading,
    error,
    creeDemande,
    repondre,
    recharger,
    clearError,
    demandesEnAttente,
    demandesResolues,
  } = useAssistance(utilisateurConnecte);
  //                 ↑
  // autoLoad = true  si connecté  → charge les demandes
  // autoLoad = false si non connecté → aucun appel API

  // ═══════════════════════════════════════
  // GARDE : Utilisateur non connecté
  // Affiche l'état non connecté et stoppe le rendu
  // ═══════════════════════════════════════
  if (!utilisateurConnecte) {
    return <EtatNonConnecte />;
  }

  // ═══════════════════════════════════════
  // HANDLERS DE NAVIGATION
  // ═══════════════════════════════════════

  // Ouvrir le fil de discussion d'une demande
  const handleVoirDemande = (demande: AssistanceRequest) => {
    setDemandeSelectionnee(demande);
    setVueActive("fil-discussion");
  };

  // Aller vers le formulaire nouvelle demande
  const handleNouvelleDeamande = () => {
    setVueActive("nouvelle-demande");
  };

  // Retour vers la liste
  const handleRetourListe = () => {
    setVueActive("liste");
    setDemandeSelectionnee(null);
  };

  // Soumission d'une nouvelle demande
  const handleSoumettreDeamande = async (data: {
    titre: string;
    type_question: string;
    description: string;
    matiere: number;
    image?: File;
  }) => {
    await creeDemande(data);
    // Retour automatique à la liste après création
    handleRetourListe();
  };

  // Soumission d'une réponse dans le fil de discussion
  const handleRepondre = async (
    assistanceId: number,
    data: { message: string; image?: File }
  ): Promise<AssistanceReponse> => {
    const nouvelleReponse = await repondre(assistanceId, data);

    // Mise à jour locale de la demande sélectionnée
    // pour refléter immédiatement la nouvelle réponse
    if (demandeSelectionnee?.id === assistanceId) {
      setDemandeSelectionnee((prev) =>
        prev
          ? {
              ...prev,
              reponses: [...prev.reponses, nouvelleReponse],
              statut: "repondue",
            }
          : null
      );
    }

    return nouvelleReponse;
  };

  // ═══════════════════════════════════════
  // CONFIGURATION DES ANIMATIONS
  // Direction différente selon la vue active
  // ═══════════════════════════════════════

  const variants = {
    // Navigation vers l'avant (liste → formulaire/fil)
    entrerDroite: {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -40 },
    },
    // Retour vers la liste
    entrerGauche: {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 40 },
    },
  };

  const currentVariant =
    vueActive === "liste"
      ? variants.entrerGauche
      : variants.entrerDroite;

  // ═══════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={vueActive}
          initial={currentVariant.initial}
          animate={currentVariant.animate}
          exit={currentVariant.exit}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {/* ── ÉTAPE 1 : Liste des demandes ── */}
          {vueActive === "liste" && (
            <AssistanceList
              demandes={demandes}
              loading={loading}
              error={error}
              demandesEnAttente={demandesEnAttente}
              demandesResolues={demandesResolues}
              onVoirDemande={handleVoirDemande}
              onNouvelleDeamande={handleNouvelleDeamande}
              onRecharger={recharger}
              onClearError={clearError}
            />
          )}

          {/* ── ÉTAPE 2 : Formulaire nouvelle demande ── */}
          {vueActive === "nouvelle-demande" && (
            <NouvelleDemandeForm
              loading={loading}
              error={error}
              onSoumettre={handleSoumettreDeamande}
              onRetour={handleRetourListe}
              onClearError={clearError}
            />
          )}

          {/* ── ÉTAPE 3 : Fil de discussion ── */}
          {vueActive === "fil-discussion" && demandeSelectionnee && (
            <FilDiscussion
              demande={demandeSelectionnee}
              loading={loading}
              error={error}
              onRepondre={handleRepondre}
              onRetour={handleRetourListe}
              onClearError={clearError}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AssistanceModule;