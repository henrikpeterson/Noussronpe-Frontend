import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, XCircle, HelpCircle, Info, AlertCircle } from "lucide-react";
import { Question } from 'src/api.tsx'; 

interface QuestionCardProps {
  question: Question;
  answer: any; // La réponse stockée dans le parent
  onAnswerChange: (answer: any) => void;
  showExplanations?: boolean;
  isFirstQuestion?: boolean;
  questionNumber?: number;
  customStyle?: {shadow: any; border: string; icon: string; bg: string; card: string};
}

const QuestionCard = ({ 
  question, 
  answer, 
  onAnswerChange, 
  showExplanations = true, // On l'active par défaut pour le feedback immédiat
  questionNumber,
  customStyle
}: QuestionCardProps) => {

  // Une question est considérée comme "répondue" si answer n'est pas undefined
  const dejaRepondu = answer !== undefined && answer !== null;

  return (
   <Card className={`
      border-none shadow-lg transition-all duration-300 
      ${customStyle.card}
      ${customStyle.border} 
      ${customStyle.bg} 
      ${customStyle.shadow}
      hover:-translate-y-1 // Petit mouvement vers le haut au survol
    `}>
      <CardHeader className="p-5">
        <div className="flex items-center gap-5">
          {/* Le numéro devient un badge flottant */}
          <div className={`
            h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center 
            text-xl font-black rotate-[-5deg] // Un peu d'angle pour le fun
            ${customStyle.icon}
          `}>
            {questionNumber}
          </div>
          
          <div className="space-y-1">
             <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Question {questionNumber}</span>
             <h3 className="font-extrabold text-slate-800 text-base md:text-lg leading-snug">
               {question.texte_question}
             </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <div className="grid gap-3">
          {question.options.map((option, index) => {
              // On harmonise tout sur le texte puisque c'est ce que onAnswerChange envoie
              const isSelected = answer === option.texte_option; 
              const isCorrect = option.correcte;
              
              // Logique de style du bouton (inchangée mais on utilise isSelected partout)
              let statusClasses = "border-slate-100 text-slate-600 italic";
              if (dejaRepondu) {
                if (isCorrect) {
                  statusClasses = "border-green-500 bg-green-50 text-green-700 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                } else if (isSelected && !isCorrect) {
                  statusClasses = "border-red-500 bg-red-50 text-red-700 animate-shake";
                } else {
                  statusClasses = "border-slate-100 opacity-50 grayscale-[0.5]";
                }
              } else {
                statusClasses = "border-slate-100 hover:border-primary/50 hover:bg-slate-50 active:scale-[0.98]";
              }

              return (
                <div key={index} className="flex flex-col gap-2"> {/* Wrapper pour empiler bouton et feedback */}
                  <button
                      disabled={dejaRepondu}
                      onClick={() => onAnswerChange(option.texte_option)}
                      className={`relative w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group ${statusClasses}`}
                    >
                      {/* Badge Lettre A, B, C... */}
                      <div className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl font-black text-sm border-2 transition-all
                        ${dejaRepondu 
                          ? isCorrect ? 'bg-green-500 border-green-500 text-white' : (isSelected ? 'bg-red-500 border-red-500 text-white' : 'bg-slate-100 border-slate-200 text-slate-400')
                          : 'bg-white border-slate-200 text-slate-400 group-hover:border-primary group-hover:text-primary'
                        }`}>
                        {String.fromCharCode(65 + index)}
                      </div>

                      <div className="flex-1 flex items-center justify-between gap-8">
                        {/* Conteneur Texte + Badge Mauvaise Réponse */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-bold">{option.texte_option}</p>
                    
                          {/* Badge Mauvaise Réponse : Aligné sur la même ligne que le texte */}
                          {dejaRepondu && isSelected && !isCorrect && (
                            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider animate-in fade-in zoom-in-95">
                              Mauvaise réponse
                            </span>
                          )}
                        </div>
                        {/* Icône de validation à droite */}
                        <div className="shrink-0">
                          {dejaRepondu && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                          {dejaRepondu && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                        </div>
                      </div>
                    </button>

                    {/* On ne garde le bloc "en dessous" QUE pour l'explication de la bonne réponse */}
                    {dejaRepondu && isCorrect && option.explication && (
                      <div className="mt-2 p-4 rounded-2xl border-2 border-green-500 bg-green-50 text-green-800 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-green-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider">
                            Bonne réponse
                          </span>
                          <div className="h-[1px] flex-1 bg-green-200"></div>
                        </div>
                        <div className="flex items-center gap-2 font-bold text-sm mb-1 text-green-700">
                          <Info className="h-4 w-4" /> Pourquoi c'est juste ?
                        </div>
                        <p className="text-sm opacity-90">{option.explication}</p>
                      </div>
                    )}
                </div>
              );
            })}
        </div>

        {dejaRepondu && (
          <div className="mt-4 p-3 rounded-lg bg-slate-50 text-[11px] font-medium text-slate-500 flex items-center gap-2 border border-slate-100">
            <Info className="h-4 w-4 text-primary" />
            Réponse enregistrée. Tu pourras passer à la suite une fois toutes les questions complétées.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;