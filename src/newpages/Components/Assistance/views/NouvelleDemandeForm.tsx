import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assistanceService } from "@/api";
import { Matiere } from "@/api";
import {
  ArrowLeft,
  BookOpen,
  PenLine,
  Brain,
  MessageCircle,
  ImagePlus,
  X,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface NouvelleDemandeFormProps {
  loading: boolean;
  error: string | null;
  onSoumettre: (data: {
    titre: string;
    type_question: string;
    description: string;
    matiere: number;
    image?: File;
  }) => Promise<void>;
  onRetour: () => void;
  onClearError: () => void;
}

// ─── Structure d'un type de question ───
interface TypeQuestion {
  code: string;
  libelle: string;
}

// ─── Erreurs de validation du formulaire ───
interface FormErrors {
  titre?: string;
  matiere?: string;
  type_question?: string;
  description?: string;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURATION DES TYPES DE QUESTIONS
// Icônes, labels et couleurs pour chaque type
// ═══════════════════════════════════════════════════════════

const TYPE_QUESTION_CONFIG: Record<
  string,
  {
    icon: React.ReactNode;
    label: string;
    couleurActif: string;
    couleurInactif: string;
  }
> = {
  cours: {
    icon: <BookOpen size={18} />,
    label: "Cours",
    couleurActif: "bg-blue-500 text-white border-blue-500",
    couleurInactif:
      "bg-white text-slate-600 border-slate-200 hover:border-blue-300",
  },
  exercice: {
    icon: <PenLine size={18} />,
    label: "Exercice",
    couleurActif: "bg-orange-500 text-white border-orange-500",
    couleurInactif:
      "bg-white text-slate-600 border-slate-200 hover:border-orange-300",
  },
  comprehension: {
    icon: <Brain size={18} />,
    label: "Compréhension",
    couleurActif: "bg-purple-500 text-white border-purple-500",
    couleurInactif:
      "bg-white text-slate-600 border-slate-200 hover:border-purple-300",
  },
  autres: {
    icon: <MessageCircle size={18} />,
    label: "Autres",
    couleurActif: "bg-slate-600 text-white border-slate-600",
    couleurInactif:
      "bg-white text-slate-600 border-slate-200 hover:border-slate-400",
  },
};

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════

const NouvelleDemandeForm = ({
  loading,
  error,
  onSoumettre,
  onRetour,
  onClearError,
}: NouvelleDemandeFormProps) => {
  // ═══════════════════════════════════════
  // ÉTATS DU FORMULAIRE
  // ═══════════════════════════════════════
  const [titre, setTitre] = useState("");
  const [matiere, setMatiere] = useState<number | "">("");
  const [typeQuestion, setTypeQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ─── États locaux (indépendants du hook parent) ───
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [typesQuestions, setTypesQuestions] = useState<TypeQuestion[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isDragging, setIsDragging] = useState(false);

  // ─── Référence pour l'input file caché ───
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ═══════════════════════════════════════
  // CHARGEMENT DES DONNÉES INITIALES
  // Matières et types de questions depuis l'API
  // ═══════════════════════════════════════
  useEffect(() => {
    const chargerDonnees = async () => {
      setLoadingData(true);
      try {
        // Chargement en parallèle pour optimiser les performances
        const [responseMatieres, responseTypes] = await Promise.all([
          assistanceService.getMatieres(),
          assistanceService.getTypesQuestions(),
        ]);

        // getMatieres() retourne response (objet Axios complet)
        setMatieres(responseMatieres.data ?? []);

        // getTypesQuestions() retourne response (objet Axios complet)
        setTypesQuestions(responseTypes.data ?? []);
      } catch (err) {
        console.error("Erreur chargement données formulaire:", err);
      } finally {
        setLoadingData(false);
      }
    };

    chargerDonnees();
  }, []);

  // ═══════════════════════════════════════
  // GESTION DE L'IMAGE
  // ═══════════════════════════════════════

  /**
   * Traite un fichier image sélectionné ou déposé
   * Vérifie le type et la taille avant de l'accepter
   */
  const traiterImage = (file: File) => {
    // Vérification du type MIME
    if (!file.type.startsWith("image/")) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Le fichier doit être une image",
      }));
      return;
    }

    // Vérification de la taille (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        image: "L'image ne doit pas dépasser 5 Mo",
      }));
      return;
    }

    // Génération de la prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setImage(file);
  };

  // Sélection via l'input file
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) traiterImage(file);
  };

  // Suppression de l'image sélectionnée
  const handleSupprimerImage = () => {
    setImage(null);
    setImagePreview(null);
    // Reset de l'input pour permettre de resélectionner le même fichier
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Gestion du Drag & Drop ──
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) traiterImage(file);
  };

  // ═══════════════════════════════════════
  // VALIDATION DU FORMULAIRE
  // ═══════════════════════════════════════

  /**
   * Valide tous les champs obligatoires
   * Retourne true si le formulaire est valide
   */
  const validerFormulaire = (): boolean => {
    const erreurs: FormErrors = {};

    if (!titre.trim()) {
      erreurs.titre = "Le titre est obligatoire";
    } else if (titre.trim().length < 5) {
      erreurs.titre = "Le titre doit contenir au moins 5 caractères";
    }

    if (!matiere) {
      erreurs.matiere = "Veuillez sélectionner une matière";
    }

    if (!typeQuestion) {
      erreurs.type_question = "Veuillez choisir un type de question";
    }

    if (!description.trim()) {
      erreurs.description = "La description est obligatoire";
    } else if (description.trim().length < 20) {
      erreurs.description =
        "La description doit contenir au moins 20 caractères";
    }

    setFormErrors(erreurs);

    // Retourne true uniquement si aucune erreur
    return Object.keys(erreurs).length === 0;
  };

  // ═══════════════════════════════════════
  // SOUMISSION DU FORMULAIRE
  // ═══════════════════════════════════════

  const handleSoumettre = async (e: React.FormEvent) => {
    e.preventDefault();

    // Réinitialisation des erreurs API précédentes
    onClearError();

    // Arrêt si validation échoue
    if (!validerFormulaire()) return;

    await onSoumettre({
      titre: titre.trim(),
      type_question: typeQuestion,
      description: description.trim(),
      matiere: matiere as number,
      ...(image && { image }),
    });
  };

  // ═══════════════════════════════════════
  // RENDER - CHARGEMENT DES DONNÉES
  // ═══════════════════════════════════════
  if (loadingData) {
    return (
      <div className="w-full py-8">
        {/* En-tête squelette */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-slate-100 rounded-full animate-pulse" />
          <div className="w-48 h-7 bg-slate-100 rounded-lg animate-pulse" />
        </div>

        {/* Champs squelettes */}
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="w-24 h-4 bg-slate-100 rounded animate-pulse" />
              <div className="w-full h-11 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════
  return (
    <div className="w-full py-8">

      {/* ── BANNIÈRE D'ERREUR API ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 bg-red-50 border
                       border-red-200 text-red-700 rounded-xl
                       px-4 py-3 mb-6"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="text-sm font-medium flex-1">{error}</span>
            <button
              onClick={onClearError}
              className="text-red-400 hover:text-red-600
                         transition-colors shrink-0"
              aria-label="Fermer l'erreur"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          EN-TÊTE : Retour + Titre
      ══════════════════════════════════════ */}
      <div className="flex items-center gap-3 mb-8">
        {/* Bouton retour */}
        <button
          onClick={onRetour}
          disabled={loading}
          className="flex items-center justify-center w-9 h-9
                     rounded-full bg-slate-100 hover:bg-slate-200
                     text-slate-600 transition-colors
                     disabled:opacity-50 shrink-0"
          aria-label="Retour à la liste"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-black
                         font-fredoka text-slate-800">
            Nouvelle demande
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Posez votre question à un enseignant
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FORMULAIRE PRINCIPAL
      ══════════════════════════════════════ */}
      <form onSubmit={handleSoumettre} noValidate className="space-y-6">

        {/* ── CHAMP TITRE ── */}
        <div className="space-y-1.5">
          <label
            htmlFor="titre"
            className="block text-sm font-semibold text-slate-700"
          >
            Titre <span className="text-red-400">*</span>
          </label>
          <input
            id="titre"
            type="text"
            value={titre}
            onChange={(e) => {
              setTitre(e.target.value);
              // Efface l'erreur dès que l'utilisateur tape
              if (formErrors.titre) {
                setFormErrors((prev) => ({ ...prev, titre: undefined }));
              }
            }}
            placeholder="Ex : Je ne comprends pas les intégrales..."
            maxLength={150}
            className={`
              w-full px-4 py-3 rounded-xl border text-sm
              text-slate-700 placeholder-slate-400
              focus:outline-none focus:ring-2 transition-all
              ${
                formErrors.titre
                  ? "border-red-300 focus:ring-red-200 bg-red-50"
                  : "border-slate-200 focus:ring-blue-200 focus:border-blue-300 bg-white"
              }
            `}
          />
          {/* Ligne basse : erreur + compteur de caractères */}
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {formErrors.titre && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 font-medium"
                >
                  {formErrors.titre}
                </motion.p>
              )}
            </AnimatePresence>
            <span className="text-xs text-slate-400 ml-auto">
              {titre.length}/150
            </span>
          </div>
        </div>

        {/* ── CHAMP MATIÈRE ── */}
        <div className="space-y-1.5">
          <label
            htmlFor="matiere"
            className="block text-sm font-semibold text-slate-700"
          >
            Matière <span className="text-red-400">*</span>
          </label>
          <select
            id="matiere"
            value={matiere}
            onChange={(e) => {
              setMatiere(Number(e.target.value));
              if (formErrors.matiere) {
                setFormErrors((prev) => ({ ...prev, matiere: undefined }));
              }
            }}
            className={`
              w-full px-4 py-3 rounded-xl border text-sm
              text-slate-700 focus:outline-none focus:ring-2
              transition-all appearance-none cursor-pointer
              ${
                formErrors.matiere
                  ? "border-red-300 focus:ring-red-200 bg-red-50"
                  : "border-slate-200 focus:ring-blue-200 focus:border-blue-300 bg-white"
              }
            `}
          >
            <option value="">Sélectionner une matière</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nom}
              </option>
            ))}
          </select>
          <AnimatePresence>
            {formErrors.matiere && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-500 font-medium"
              >
                {formErrors.matiere}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ── TYPE DE QUESTION ── */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Type de question <span className="text-red-400">*</span>
          </label>

          {/* Grille responsive : 2 colonnes mobile, 4 colonnes desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(typesQuestions.length > 0
              ? typesQuestions
              : // Fallback si l'API ne retourne rien
                Object.entries(TYPE_QUESTION_CONFIG).map(([code, config]) => ({
                  code,
                  libelle: config.label,
                }))
            ).map((type) => {
              const config = TYPE_QUESTION_CONFIG[type.code];
              const estSelectionne = typeQuestion === type.code;

              return (
                <button
                  key={type.code}
                  type="button"
                  onClick={() => {
                    setTypeQuestion(type.code);
                    if (formErrors.type_question) {
                      setFormErrors((prev) => ({
                        ...prev,
                        type_question: undefined,
                      }));
                    }
                  }}
                  className={`
                    flex items-center justify-center gap-2
                    px-3 py-3 rounded-xl border font-semibold
                    text-sm transition-all duration-200
                    active:scale-95
                    ${
                      estSelectionne
                        ? config?.couleurActif ??
                          "bg-blue-500 text-white border-blue-500"
                        : config?.couleurInactif ??
                          "bg-white text-slate-600 border-slate-200"
                    }
                  `}
                >
                  {config?.icon}
                  <span className="text-xs sm:text-sm">
                    {config?.label ?? type.libelle}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {formErrors.type_question && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-500 font-medium"
              >
                {formErrors.type_question}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ── CHAMP DESCRIPTION ── */}
        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-700"
          >
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (formErrors.description) {
                setFormErrors((prev) => ({ ...prev, description: undefined }));
              }
            }}
            placeholder="Décrivez votre problème en détail. Plus vous êtes précis, plus l'enseignant pourra vous aider efficacement..."
            rows={5}
            maxLength={1000}
            className={`
              w-full px-4 py-3 rounded-xl border text-sm
              text-slate-700 placeholder-slate-400
              focus:outline-none focus:ring-2 transition-all
              resize-none
              ${
                formErrors.description
                  ? "border-red-300 focus:ring-red-200 bg-red-50"
                  : "border-slate-200 focus:ring-blue-200 focus:border-blue-300 bg-white"
              }
            `}
          />
          {/* Ligne basse : erreur + compteur */}
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {formErrors.description && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 font-medium"
                >
                  {formErrors.description}
                </motion.p>
              )}
            </AnimatePresence>
            <span className="text-xs text-slate-400 ml-auto">
              {description.length}/1000
            </span>
          </div>
        </div>

        {/* ── UPLOAD IMAGE (OPTIONNEL) ── */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Image{" "}
            <span className="text-slate-400 font-normal">(optionnelle)</span>
          </label>

          {/* Input file caché */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            aria-label="Sélectionner une image"
          />

          {imagePreview ? (
            // ── Prévisualisation de l'image sélectionnée ──
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-xl overflow-hidden
                         border border-slate-200 bg-slate-50"
            >
              <img
                src={imagePreview}
                alt="Prévisualisation"
                className="w-full max-h-48 object-contain p-2"
              />
              {/* Bouton supprimer l'image */}
              <button
                type="button"
                onClick={handleSupprimerImage}
                className="absolute top-2 right-2 w-7 h-7
                           bg-red-500 hover:bg-red-600
                           text-white rounded-full flex items-center
                           justify-center transition-colors shadow-md"
                aria-label="Supprimer l'image"
              >
                <X size={14} />
              </button>
              <p className="text-xs text-slate-400 text-center pb-2">
                {image?.name}
              </p>
            </motion.div>
          ) : (
            // ── Zone de dépôt drag & drop ──
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                flex flex-col items-center justify-center
                gap-2 px-4 py-8 rounded-xl border-2 border-dashed
                cursor-pointer transition-all duration-200
                ${
                  isDragging
                    ? "border-blue-400 bg-blue-50 scale-[1.01]"
                    : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
                }
              `}
            >
              <ImagePlus
                size={28}
                className={isDragging ? "text-blue-500" : "text-slate-400"}
              />
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600">
                  {isDragging
                    ? "Déposez l'image ici"
                    : "Glisser ou cliquer pour ajouter"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  PNG, JPG, JPEG • Max 5 Mo
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            BOUTONS D'ACTION
            Responsive : colonne sur mobile, ligne sur desktop
        ══════════════════════════════════════ */}
        <div className="flex flex-col-reverse sm:flex-row
                        items-stretch sm:items-center
                        gap-3 pt-2">
          {/* Bouton Annuler */}
          <button
            type="button"
            onClick={onRetour}
            disabled={loading}
            className="flex-1 sm:flex-none px-6 py-3
                       bg-slate-100 hover:bg-slate-200
                       text-slate-700 font-semibold text-sm
                       rounded-xl transition-colors
                       disabled:opacity-50"
          >
            Annuler
          </button>

          {/* Bouton Envoyer */}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none flex items-center
                       justify-center gap-2 px-6 py-3
                       bg-blue-500 hover:bg-blue-600
                       active:scale-95 text-white font-bold
                       text-sm rounded-xl transition-all
                       shadow-md hover:shadow-lg
                       disabled:opacity-60 disabled:cursor-not-allowed
                       disabled:active:scale-100"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send size={16} />
                Envoyer la demande
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NouvelleDemandeForm;