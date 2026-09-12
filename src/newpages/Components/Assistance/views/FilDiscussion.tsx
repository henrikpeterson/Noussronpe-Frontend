import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AssistanceRequest, AssistanceReponse } from "@/api";
import {
  ArrowLeft,
  Send,
  ImagePlus,
  X,
  Loader2,
  AlertCircle,
  BookOpen,
  PenLine,
  Brain,
  MessageCircle,
  Clock,
  CheckCheck,
  RefreshCw,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface FilDiscussionProps {
  demande: AssistanceRequest;
  loading: boolean;
  error: string | null;
  onRepondre: (
    assistanceId: number,
    data: { message: string; image?: File }
  ) => Promise<AssistanceReponse>;
  onRetour: () => void;
  onClearError: () => void;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURATION DES STATUTS
// Couleurs et labels pour chaque statut possible
// ═══════════════════════════════════════════════════════════

const STATUT_CONFIG: Record<
  string,
  { label: string; classes: string; dot: string }
> = {
  en_attente: {
    label: "En attente",
    classes: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
  },
  en_cours: {
    label: "En cours",
    classes: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  repondue: {
    label: "Répondue",
    classes: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-400",
  },
  fermé: {
    label: "Fermée",
    classes: "bg-gray-100 text-gray-500 border-gray-200",
    dot: "bg-gray-400",
  },
};

// ═══════════════════════════════════════════════════════════
// CONFIGURATION DES TYPES DE QUESTIONS
// ═══════════════════════════════════════════════════════════

const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; label: string; classes: string }
> = {
  cours: {
    icon: <BookOpen size={12} />,
    label: "Cours",
    classes: "bg-blue-50 text-blue-600",
  },
  exercice: {
    icon: <PenLine size={12} />,
    label: "Exercice",
    classes: "bg-orange-50 text-orange-600",
  },
  comprehension: {
    icon: <Brain size={12} />,
    label: "Compréhension",
    classes: "bg-purple-50 text-purple-600",
  },
  autres: {
    icon: <MessageCircle size={12} />,
    label: "Autres",
    classes: "bg-slate-100 text-slate-600",
  },
};

// ═══════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════

/**
 * Formate une date ISO en texte relatif lisible
 * Ex: "Il y a 2 heures", "Il y a 3 jours"
 */
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

  // Au-delà de 7 jours, affiche la date complète
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Formate une date ISO en heure locale
 * Ex: "10h30"
 */
const formaterHeure = (dateISO: string): string => {
  return new Date(dateISO).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ═══════════════════════════════════════════════════════════
// SOUS-COMPOSANT : BULLE DE MESSAGE
// Gère l'affichage différencié élève / enseignant
// ═══════════════════════════════════════════════════════════

interface MessageBubbleProps {
  reponse: AssistanceReponse;
  /** Prénom/nom affiché dans l'en-tête de la bulle */
  nomUtilisateur?: string;
}

const MessageBubble = ({ reponse, nomUtilisateur }: MessageBubbleProps) => {
  const estEnseignant = reponse.is_from_teacher;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col gap-1 ${estEnseignant ? "items-end" : "items-start"}`}
    >
      {/* ── En-tête de la bulle : avatar + nom + heure ── */}
      <div
        className={`flex items-center gap-2 px-1
          ${estEnseignant ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        <div
          className={`
            w-7 h-7 rounded-full flex items-center justify-center
            text-xs font-bold text-white shrink-0
            ${estEnseignant ? "bg-blue-500" : "bg-slate-400"}
          `}
        >
          {estEnseignant ? "👨‍🏫" : "👤"}
        </div>

        {/* Nom + heure */}
        <div
          className={`flex items-center gap-2
            ${estEnseignant ? "flex-row-reverse" : "flex-row"}`}
        >
          <span className="text-xs font-semibold text-slate-600">
            {estEnseignant ? "Professeur" : (nomUtilisateur ?? "Moi")}
          </span>
          <span className="text-xs text-slate-400">
            {formaterHeure(reponse.created_at)}
          </span>
        </div>
      </div>

      {/* ── Corps de la bulle ── */}
      <div
        className={`
          max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3
          ${
            estEnseignant
              ? // Bulle enseignant : droite, couleur accent
                "bg-blue-500 text-white rounded-tr-sm"
              : // Bulle élève : gauche, couleur neutre
                "bg-white text-slate-700 border border-slate-200 rounded-tl-sm"
          }
        `}
      >
        {/* Texte du message */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {reponse.message}
        </p>

        {/* Image jointe si présente */}
        {reponse.image && (
          <div className="mt-2">
            <img
              src={reponse.image}
              alt="Image jointe"
              className="rounded-xl max-h-48 w-auto object-contain
                         cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(reponse.image, "_blank")}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : FIL DE DISCUSSION
// ═══════════════════════════════════════════════════════════

const FilDiscussion = ({
  demande,
  loading,
  error,
  onRepondre,
  onRetour,
  onClearError,
}: FilDiscussionProps) => {
  // ═══════════════════════════════════════
  // ÉTATS DU FORMULAIRE DE RÉPONSE
  // ═══════════════════════════════════════
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingEnvoi, setLoadingEnvoi] = useState(false);
  const [erreurMessage, setErreurMessage] = useState<string | null>(null);

  // ─── Références DOM ───
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ─── Configuration du statut actuel de la demande ───
  const statutConfig = STATUT_CONFIG[demande.statut] ?? STATUT_CONFIG.en_attente;
  const typeConfig = TYPE_CONFIG[demande.type_question] ?? TYPE_CONFIG.autres;

  // ═══════════════════════════════════════
  // SCROLL AUTOMATIQUE
  // Descend automatiquement au dernier message
  // à chaque nouveau message dans le fil
  // ═══════════════════════════════════════
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [demande.reponses]);

  // ═══════════════════════════════════════
  // AUTO-RESIZE DU TEXTAREA
  // S'adapte au contenu saisi par l'élève
  // ═══════════════════════════════════════
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    // Reset la hauteur avant de recalculer
    textarea.style.height = "auto";
    // Applique la hauteur du contenu (max 120px)
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [message]);

  // ═══════════════════════════════════════
  // GESTION DE L'IMAGE
  // ═══════════════════════════════════════

  /**
   * Traite et valide un fichier image
   * Vérifie le type MIME et la taille max (5 Mo)
   */
  const traiterImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErreurMessage("Le fichier doit être une image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErreurMessage("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setImage(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) traiterImage(file);
  };

  const handleSupprimerImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Drag & Drop ──
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) traiterImage(file);
  };

  // ═══════════════════════════════════════
  // ENVOI DU MESSAGE
  // ═══════════════════════════════════════

  /**
   * Soumet le message de réponse
   * Valide que le message n'est pas vide
   * avant d'appeler onRepondre du parent
   */
  const handleEnvoyer = async () => {
    // Validation basique
    if (!message.trim() && !image) {
      setErreurMessage("Écrivez un message ou ajoutez une image");
      return;
    }

    setErreurMessage(null);
    setLoadingEnvoi(true);

    try {
      await onRepondre(demande.id, {
        message: message.trim(),
        ...(image && { image }),
      });

      // Reset du formulaire après envoi réussi
      setMessage("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      // L'erreur est gérée par le parent via onClearError
    } finally {
      setLoadingEnvoi(false);
    }
  };

  /**
   * Envoi du message avec Entrée (sans Shift)
   * Shift+Entrée = saut de ligne
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnvoyer();
    }
  };

  // ═══════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════
  return (
    <div className="w-full flex flex-col py-4 sm:py-8">

      {/* ── BANNIÈRE D'ERREUR API ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 bg-red-50 border
                       border-red-200 text-red-700 rounded-xl
                       px-4 py-3 mb-4"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="text-sm font-medium flex-1">{error}</span>
            <button
              onClick={onClearError}
              aria-label="Fermer l'erreur"
              className="text-red-400 hover:text-red-600
                         transition-colors shrink-0"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          EN-TÊTE : Retour + Infos de la demande
      ══════════════════════════════════════ */}
      <div className="flex items-start gap-3 mb-5">

        {/* Bouton retour */}
        <button
          onClick={onRetour}
          disabled={loadingEnvoi}
          className="flex items-center justify-center w-9 h-9
                     rounded-full bg-slate-100 hover:bg-slate-200
                     text-slate-600 transition-colors
                     disabled:opacity-50 shrink-0 mt-0.5"
          aria-label="Retour à la liste"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Informations de la demande */}
        <div className="flex-1 min-w-0">
          {/* Titre (tronqué si trop long) */}
          <h2
            className="text-lg sm:text-xl font-black font-fredoka
                       text-slate-800 leading-tight truncate"
          >
            {demande.titre}
          </h2>

          {/* Métadonnées : matière + type + date */}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">

            {/* Badge matière */}
            <span className="text-xs font-semibold text-slate-500 bg-slate-100
                             px-2 py-0.5 rounded-full">
              📖 {demande.matiere_nom}
            </span>

            {/* Badge type de question */}
            <span
              className={`flex items-center gap-1 text-xs font-semibold
                         px-2 py-0.5 rounded-full ${typeConfig.classes}`}
            >
              {typeConfig.icon}
              {typeConfig.label}
            </span>

            {/* Date d'envoi */}
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={11} />
              {formaterDate(demande.created_at)}
            </span>
          </div>

          {/* Badge statut */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs
                         font-semibold px-2.5 py-1 rounded-full border
                         ${statutConfig.classes}`}
            >
              {/* Point animé pour "en_attente" et "en_cours" */}
              <span
                className={`w-1.5 h-1.5 rounded-full ${statutConfig.dot}
                  ${demande.statut === "en_attente" || demande.statut === "en_cours"
                    ? "animate-pulse"
                    : ""
                  }`}
              />
              {statutConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FIL DE MESSAGES
          Zone scrollable contenant tous les échanges
      ══════════════════════════════════════ */}
      <div
        className="flex-1 overflow-y-auto min-h-[300px] max-h-[45vh]
                   sm:max-h-[50vh] space-y-4 px-1 py-4
                   scrollbar-thin scrollbar-thumb-slate-200
                   scrollbar-track-transparent"
      >
        {/* ── Message initial de l'élève ── */}
        {/* Affiché comme le premier message du fil */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-1 items-start"
        >
          {/* En-tête du message initial */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-full bg-slate-400 flex
                            items-center justify-center text-xs shrink-0">
              👤
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {demande.utilisateur_nom ?? "Moi"}
            </span>
            <span className="text-xs text-slate-400">
              {formaterHeure(demande.created_at)}
            </span>
          </div>

          {/* Bulle du message initial */}
          <div className="max-w-[85%] sm:max-w-[75%] bg-white
                          border border-slate-200 rounded-2xl
                          rounded-tl-sm px-4 py-3">
            <p className="text-sm text-slate-700 leading-relaxed
                          whitespace-pre-wrap break-words">
              {demande.description}
            </p>

            {/* Image jointe à la demande initiale */}
            {demande.image && (
              <div className="mt-2">
                <img
                  src={demande.image}
                  alt="Image de la demande"
                  className="rounded-xl max-h-48 w-auto object-contain
                             cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(demande.image, "_blank")}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Séparateur si des réponses existent ── */}
        {demande.reponses.length > 0 && (
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium shrink-0">
              <CheckCheck size={12} className="inline mr-1" />
              {demande.reponses.length} réponse
              {demande.reponses.length > 1 ? "s" : ""}
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        )}

        {/* ── Liste des réponses du fil ── */}
        <AnimatePresence>
          {demande.reponses.map((reponse) => (
            <MessageBubble
              key={reponse.id}
              reponse={reponse}
              nomUtilisateur={demande.utilisateur_nom}
            />
          ))}
        </AnimatePresence>

        {/* ── État vide : en attente de réponse ── */}
        {demande.reponses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center
                       py-8 text-center"
          >
            <div className="w-12 h-12 bg-yellow-50 rounded-full
                            flex items-center justify-center mb-3">
              <RefreshCw size={20} className="text-yellow-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">
              En attente de réponse
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Un enseignant vous répondra prochainement
            </p>
          </motion.div>
        )}

        {/* Ancre de scroll automatique */}
        <div ref={messagesEndRef} />
      </div>

      {/* ══════════════════════════════════════
          ZONE DE SAISIE
          Formulaire de réponse en bas du fil
          Masqué si la demande est fermée
      ══════════════════════════════════════ */}
      {demande.statut !== "fermé" ? (
        <div className="mt-4 border-t border-slate-100 pt-4">

          {/* ── Erreur locale du message ── */}
          <AnimatePresence>
            {erreurMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 bg-red-50
                           border border-red-200 text-red-600
                           rounded-xl px-3 py-2 mb-3 text-xs font-medium"
              >
                <AlertCircle size={14} className="shrink-0" />
                {erreurMessage}
                <button
                  onClick={() => setErreurMessage(null)}
                  className="ml-auto text-red-400 hover:text-red-600"
                  aria-label="Fermer"
                >
                  <X size={13} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Prévisualisation image à envoyer ── */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative inline-block mb-3"
              >
                <img
                  src={imagePreview}
                  alt="Prévisualisation"
                  className="h-20 w-auto rounded-xl object-cover
                             border border-slate-200"
                />
                {/* Bouton supprimer l'image */}
                <button
                  type="button"
                  onClick={handleSupprimerImage}
                  className="absolute -top-2 -right-2 w-6 h-6
                             bg-red-500 hover:bg-red-600 text-white
                             rounded-full flex items-center justify-center
                             transition-colors shadow-md"
                  aria-label="Supprimer l'image"
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Barre de saisie principale ── */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              flex items-end gap-2 bg-white border rounded-2xl
              px-3 py-2 transition-all duration-200
              ${
                isDragging
                  ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200"
                  : "border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100"
              }
            `}
          >
            {/* Input file caché */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Ajouter une image"
            />

            {/* Bouton image */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loadingEnvoi}
              className="flex items-center justify-center w-8 h-8
                         text-slate-400 hover:text-blue-500
                         transition-colors shrink-0 mb-0.5
                         disabled:opacity-50"
              aria-label="Ajouter une image"
            >
              <ImagePlus size={20} />
            </button>

            {/* Textarea auto-resize */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isDragging
                  ? "Déposez l'image ici..."
                  : "Écrire un message... (Entrée pour envoyer)"
              }
              rows={1}
              disabled={loadingEnvoi}
              className="flex-1 bg-transparent text-sm text-slate-700
                         placeholder-slate-400 resize-none focus:outline-none
                         py-1.5 max-h-[120px] disabled:opacity-50
                         leading-relaxed"
            />

            {/* Bouton envoyer */}
            <button
              type="button"
              onClick={handleEnvoyer}
              disabled={loadingEnvoi || (!message.trim() && !image)}
              className="flex items-center justify-center w-9 h-9
                         bg-blue-500 hover:bg-blue-600 active:scale-95
                         text-white rounded-xl transition-all shrink-0
                         disabled:opacity-40 disabled:cursor-not-allowed
                         disabled:active:scale-100 mb-0.5"
              aria-label="Envoyer le message"
            >
              {loadingEnvoi ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {/* Hint Shift+Entrée */}
          <p className="text-xs text-slate-400 mt-2 text-center">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]
                           font-mono border border-slate-200">
              Shift
            </kbd>
            {" + "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]
                           font-mono border border-slate-200">
              Entrée
            </kbd>
            {" pour aller à la ligne"}
          </p>
        </div>
      ) : (
        // ── Demande fermée : zone de saisie désactivée ──
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-center gap-2
                          bg-slate-50 border border-slate-200
                          rounded-2xl px-4 py-4">
            <span className="text-sm text-slate-400 font-medium">
              ⚫ Cette demande est fermée
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilDiscussion;