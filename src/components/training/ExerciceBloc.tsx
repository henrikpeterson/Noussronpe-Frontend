import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Send, 
  ClipboardList, 
  ChevronDown, 
  Lightbulb 
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react"; // Pour le bouton fermer


import QuestionCard from "./QuestionCard";
import { Exercice } from 'src/api.tsx'; 

interface ExerciceBlocProps {
  exercice: Exercice;
  exerciceNumber: number;
  totalExercices: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: Record<number, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnswerChange: (questionId: number, answer: any) => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  colorScheme: string;
  showExplanations?: boolean;
}

const questionStyles = [
  { 
    card: "bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300/70", 
    border: "border-l-[8px] border-l-blue-600", 
    icon: "bg-blue-600 text-white shadow-lg shadow-blue-500/40", 
    bg: "bg-blue-50",
    shadow: "shadow-blue-200/50 hover:shadow-blue-300/60" 
  },
  { 
    card: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-4 border-emerald-300/70", 
    border: "border-l-[8px] border-l-emerald-600", 
    icon: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/40", 
    bg: "bg-emerald-50",
    shadow: "shadow-emerald-200/50 hover:shadow-emerald-300/60"
  },
  { 
    card: "bg-gradient-to-br from-orange-50 to-orange-100 border-4 border-orange-300/70", 
    border: "border-l-[8px] border-l-orange-500", 
    icon: "bg-orange-500 text-white shadow-lg shadow-orange-500/40", 
    bg: "bg-orange-50",
    shadow: "shadow-orange-200/50 hover:shadow-orange-300/60"
  },
  { 
    card: "bg-gradient-to-br from-cyan-50 to-cyan-100 border-4 border-cyan-300/70", 
    border: "border-l-[8px] border-l-cyan-500", 
    icon: "bg-cyan-500 text-white shadow-lg shadow-cyan-400/40", 
    bg: "bg-cyan-50",
    shadow: "shadow-cyan-200/50 hover:shadow-cyan-300/60"
  },
  { 
    card: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-4 border-indigo-300/70", 
    border: "border-l-[8px] border-l-indigo-600", 
    icon: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40", 
    bg: "bg-indigo-50",
    shadow: "shadow-indigo-200/50 hover:shadow-indigo-300/60"
  }
];

const ExerciceBloc = ({
  exercice,
  exerciceNumber,
  totalExercices,
  answers,
  onAnswerChange,
  onNext,
  onSubmit,
  isSubmitting = false,
  colorScheme,
  showExplanations = false
}: ExerciceBlocProps) => {
  const [isEnonceOpen, setIsEnonceOpen] = useState(false);
  const isLastExercice = exerciceNumber === totalExercices;
  
  // 1. État pour stocker l'URL de l'image cliquée (null si aucune)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // 2. Référence vers le conteneur du texte HTML
  const contentRef = useRef<HTMLDivElement>(null);

  const allQuestionsAnswered = exercice.questions.every(q => answers[q.id] !== undefined);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const htmlWithAbsoluteMedia = exercice.enonce.replace(
    /(<img[^>]+src="|<video[^>]+src=")\/media\//g,
    `$1${apiBaseUrl}/media/`
  );

  useEffect(() => {
    // Si le conteneur n'existe pas ou si l'énoncé est fermé, on ne fait rien
    if (!contentRef.current || !isEnonceOpen) return;

    // On trouve toutes les balises <img> dans le contenu injecté
    const images = contentRef.current.getElementsByTagName('img');

    // La fonction qui se lancera au clic
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (target.src) {
        setSelectedImage(target.src); // On ouvre la modale avec cette image
      }
    };

    // On ajoute l'écouteur sur chaque image et on change le curseur
    Array.from(images).forEach((img) => {
      img.style.cursor = 'zoom-in'; // Change le curseur pour indiquer que c'est cliquable
      img.addEventListener('click', handleImageClick);
    });

    // Fonction de nettoyage : important pour éviter les fuites de mémoire !
    // Elle retire les écouteurs quand le composant change ou se démonte.
    return () => {
      Array.from(images).forEach((img) => {
        img.removeEventListener('click', handleImageClick);
      });
    };
  }, [htmlWithAbsoluteMedia, isEnonceOpen]); // On relance si le HTML change ou si on ouvre l'énoncé

  return (
    // On utilise max-w-7xl pour permettre à l'interface de s'élargir sur les grands écrans
    <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-10 items-start max-w-7xl mx-auto">
      
      {/* --- SECTION ÉNONCÉ (Ajustée à 50% sur PC) --- */}
      {/* --- SECTION ÉNONCÉ --- */}
      <div className="w-full h-full lg:w-1/2 sticky top-[68px] lg:top-24 z-30 lg:z-10 flex justify-center">
        <Card className="
            w-full 
            /* INDISPENSABLE : Supprime arrondis et bordures sur mobile pour fusionner avec le header */
            rounded-none md:rounded-3xl 
            border-x-0 md:border-x 
            border-t-0 md:border-t 
            
            /* On garde l'ombre uniquement sur PC pour l'effet flottant */
            shadow-none md:shadow-xl 
            bg-white/95 backdrop-blur-md 
            border-b-4 border-primary/10
          ">
          <Collapsible open={isEnonceOpen} onOpenChange={setIsEnonceOpen}>
            
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-5 cursor-pointer lg:cursor-default bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl text-white shadow-md ${colorScheme === 'bg-green-100' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 leading-none mb-1.5">Mission {exerciceNumber}</p>
                    <h2 className="font-extrabold text-slate-800 text-base md:text-lg">Énoncé du problème</h2>
                  </div>
                </div>
                <div className={`lg:hidden transition-transform duration-300 ${isEnonceOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-6 w-6 text-slate-400" />
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent 
              forceMount 
              className={`lg:block ${isEnonceOpen ? 'block' : 'hidden'} px-6 pb-8 border-t border-slate-100 lg:border-none`}
            >
              {/* On garde tes 25% de hauteur pour ne pas boucher l'écran */}
              <div className="py-6 overflow-y-auto max-h-[25vh] lg:max-h-[calc(100vh-280px)] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                <div 
                ref={contentRef}
                  className="prose prose-slate max-w-none 
                    text-slate-700 leading-relaxed
                    prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-8 prose-img:transition-transform hover:prose-img:scale-[1.02]
                    prose-p:text-[1.05rem] prose-p:font-medium"
                  dangerouslySetInnerHTML={{ __html: htmlWithAbsoluteMedia }} 
                />
              </div>
              
              {/* ... Pied de l'énoncé ... */}
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
      
      {/* --- SECTION QUESTIONS (Ajustée à 50% sur PC) --- */}
      <div className="w-full lg:w-1/2 space-y-8 pb-24">
        <div className="flex items-center justify-between px-2 mt-4 lg:mt-2">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Lightbulb className="h-5 w-5 text-yellow-600 animate-pulse" />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm md:text-base">
              Questions d'analyse :
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {exercice.questions.length} Questions
          </span>
        </div>

        <div className="grid gap-6">
          {exercice.questions.map((question, index) => {
            // Sélection de la couleur basée sur l'index
            const style = questionStyles[index % questionStyles.length];
            
            return (
              <QuestionCard
                key={question.id}
                question={question}
                answer={answers[question.id]}
                onAnswerChange={(answer) => onAnswerChange(question.id, answer)}
                questionNumber={index + 1}
                // On passe ces nouvelles props à QuestionCard
                customStyle={style} 
              />
            );
          })}
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex flex-col items-center pt-8 gap-4 px-2">
          {!isLastExercice ? (
            <Button
              onClick={onNext}
              disabled={!allQuestionsAnswered}
              className={`
                w-full h-16 text-lg font-black rounded-2xl transition-all duration-300
                ${allQuestionsAnswered 
                  ? 'bg-primary hover:bg-primary/90 shadow-[0_6px_0_rgb(15,23,42)] active:translate-y-1 active:shadow-none' 
                  : 'bg-slate-200 text-slate-400 shadow-none'}
              `}
            >
              CONTINUER LA MISSION
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={!allQuestionsAnswered || isSubmitting}
              className={`
                w-full h-16 text-lg font-black rounded-2xl transition-all duration-300
                ${allQuestionsAnswered 
                  ? 'bg-green-600 hover:bg-green-500 shadow-[0_6px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none' 
                  : 'bg-slate-200 text-slate-400 shadow-none'}
              `}
            >
              {isSubmitting ? "ANALYSE EN COURS..." : "SOUMETTRE L'ÉPREUVE"}
              {!isSubmitting && <Send className="ml-2 h-5 w-15" />}
            </Button>
          )}
        </div>
      </div>   
      {/* Dans ExerciceBloc.tsx */}
     
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent 
            /* On utilise ! pour forcer l'annulation des styles par défaut qui causent le bug sur ta capture */
            className="!fixed !inset-0 !translate-x-0 !translate-y-0 !top-0 !left-0 !max-w-none w-full h-full p-0 bg-transparent border-none shadow-none z-[10000] flex items-center justify-center"
          >
            {/* ✅ LE FOND NOIR TOTAL : Il prend 100% de la fenêtre du navigateur */}
            <div 
              className="absolute inset-0 bg-black/95 backdrop-blur-md" 
              onClick={() => setSelectedImage(null)} 
            />

            <div className="relative z-[10001] w-full h-full flex items-center justify-center p-4">
              {/* Bouton fermer bien visible sur le noir */}
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[10002]"
              >
                <X className="h-8 w-8" />
              </button>
              
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt="Zoom" 
                  /* On s'assure que l'image reste dans les limites de l'écran sans le déformer */
                  className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
            
    </div>
  );
};

export default ExerciceBloc;