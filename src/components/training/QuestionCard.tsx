import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle} from "lucide-react";
import { useState } from "react";
import { Exercice, Question, Option } from 'src/api.tsx'; 

interface QuestionCardProps {
  question: Question;
  answer: any;
  onAnswerChange: (answer: any) => void;
  isFirstQuestion?: boolean;
  showExplanations?: boolean;
  questionNumber?: number;
}

const QuestionCard = ({ question, answer, onAnswerChange, isFirstQuestion = false, showExplanations = false, questionNumber }: QuestionCardProps) => {

  console.log('🔍 QuestionCard données:', {
    questionId: question.id,
    questionText: question.texte_question,
    options: question.options,  // ← Vérifie le format
    answerFromParent: answer,    // ← Vérifie la réponse
    optionsCount: question.options?.length
  });
  const [reponseSelectionnee, setReponseSelectionnee] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(isFirstQuestion);
  
  // Trouver quelle option est sélectionnée
  const optionSelectionneeIndex = question.options.findIndex(opt => opt.texte_option === answer);
  const optionSelectionnee = optionSelectionneeIndex !== -1 ? question.options[optionSelectionneeIndex] : null;

  // Trouver l'option correcte
  const optionCorrecte = question.options.find(opt => opt.correcte); 


  const handleReponseChange = (optionIndex: number, optionTexte: string) => {
     // Si déjà une réponse sélectionnée, on ne fait rien
    if (reponseSelectionnee !== null) return;
    
    setReponseSelectionnee(optionIndex);
    onAnswerChange(optionTexte);
  };

  return (
    <Card className="shadow-md border-border/40 transition-shadow duration-200">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/40 p-3 cursor-pointer hover:from-primary/10 hover:to-primary/15 transition-colors">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm md:text-base font-bold text-foreground">
                  Question {questionNumber}
                </CardTitle>
                <div className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  ⭐ {question.points} pts
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-3 p-3">
            {/* Texte de la question */}
            <div className="text-sm md:text-base leading-relaxed text-foreground font-medium">
              {question.texte_question}
            </div>

            {/* Options QCM */}
            <RadioGroup
              value={reponseSelectionnee?.toString() || optionSelectionneeIndex?.toString() || ""}
              className="space-y-2"
            >
              {question.options.map((option, index) => {
                const estSelectionnee = reponseSelectionnee === index || optionSelectionneeIndex === index;
                const estCorrecte = option.correcte;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-start space-x-2 p-3 rounded-lg border transition-all ${
                      estSelectionnee 
                        ? estCorrecte
                          ? 'border-green-500 bg-green-50' 
                          : 'border-red-500 bg-red-50'
                        : reponseSelectionnee !== null
                          ? 'opacity-50 cursor-not-allowed' // ← Désactivé après sélection
                          : 'border-border hover:bg-accent/50 cursor-pointer'
                    }`}
                    onClick={() => reponseSelectionnee === null && handleReponseChange(index, option.texte_option)}
                  >
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${question.id}-${index}`}
                      className="mt-0.5"
                      disabled={reponseSelectionnee !== null} // ← Désactivé après sélection
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`option-${question.id}-${index}`} 
                        className={`font-normal text-sm leading-relaxed ${
                          reponseSelectionnee !== null ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        {option.texte_option}
                      </Label>
                      {/* Afficher les explications SEULEMENT si showExplanations = true */}
                      {showExplanations && estCorrecte && option.explication && (
                        <div className="mt-2 text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-200">
                          <div className="flex items-center gap-1 text-blue-600 font-semibold mb-1">
                            💡 Explication :
                          </div>
                          {option.explication}
                        </div>
                      )}
                    </div>
                    
                    {/* Indicateur visuel de bonne/mauvaise réponse APRÈS sélection */}
                    {estSelectionnee && (
                      <div className={`flex items-center text-xs ${
                        estCorrecte ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {estCorrecte ? (
                          <CheckCircle2 className="h-4 w-4" aria-label="Bonne réponse" />
                        ) : (
                          <XCircle className="h-4 w-4" aria-label="Mauvaise réponse" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default QuestionCard;
