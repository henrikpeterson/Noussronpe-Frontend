import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, Sparkles, HelpCircle, BookOpen, Image as ImageIcon, Send } from "lucide-react";
import { toast } from "sonner";
import { useReferenceData } from "@/hooks/useReferenceData";


import bookIcon from "@/assets/icons/books.png";
import pencilIcon from '/icons/edit.png';
import questionIcon from '/icons/conversation.png';
import lightbulbIcon from '/icons/lightbulb.png';
import subjectIcon from '/icons/target.png';
import sendIcon from '/icons/send.png';


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
  const [titre, setTitre] = useState("");
  const [type_question, setTypeQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [matiere, setMatiere] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Récupère les données de référence
  const { matieres, typesQuestions, loading: loadingReferences } = useReferenceData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titre || !type_question || !description || !matiere) {
      toast.error("Oups ! Il manque des informations", {
        description: "Remplis tous les champs pour qu'on puisse t'aider ! ✨"
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        titre,
        type_question,
        description,
        matiere: parseInt(matiere),
        image
      });
      
      toast.success("Super ! Ta question est envoyée 🚀", {
        description: "Un enseignant va te répondre très bientôt !"
      });
      
      // Reset form
      setTitre("");
      setTypeQuestion("");
      setDescription("");
      setMatiere("");
      setImage(null);
      
    } catch (err) {
      console.error("Erreur dans le formulaire:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image trop lourde", {
          description: "Choisis une image de moins de 5MB s'il te plaît !"
        });
        return;
      }
      setImage(file);
      toast.success("Image ajoutée ! 🎨", {
        description: "Ça va aider l'enseignant à mieux comprendre !"
      });
    }
  };
  
  const testBookIcon = "/icons/book.png"
 

  const getTypeQuestionIcon = (type: string) => {
    const icons: Record<string, string> = {
      'cours': bookIcon,
      'exercice': pencilIcon,
      'comprehension': questionIcon,
      'autres': lightbulbIcon
    };
    return icons[type] || '/icons/conversation.png';
  };

  if (loadingReferences) {
    return (
      <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
              <Sparkles className="h-10 w-10 text-blue-500 animate-pulse" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">Préparation du formulaire...</p>
            <p className="text-gray-500">On charge tout pour toi !</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    
    <div className="relative">
      {/* Décoration */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>
      
      <Card className="border-2 border-blue-200 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-blue-50/50 relative z-10">
        {/* Header coloré */}
        <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
        
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Pose ta question ! 
                <span className="text-2xl">✨</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Nos super enseignants sont là pour t'aider !
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre avec emoji */}
            <div className="space-y-3">
              <Label htmlFor="titre" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-xl">💭</span>
                Dis-nous ce qui te pose problème 🧠
              </Label>
              <div className="relative">
                <Input
                  id="titre"
                  placeholder="Ex: Je bloque sur l'exercice 3 de maths..."
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  className="h-12 pl-10 text-base border-2 border-blue-200 focus:border-blue-400 rounded-xl bg-white/80"
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  📝
                </div>
              </div>
            </div>

            {/* Matière avec emoji */}
            <div className="space-y-3">
              <Label htmlFor="matiere" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-xl">📚</span>
                C'est pour quelle matière ?
              </Label>
              <div className="relative">
                <Select value={matiere} onValueChange={setMatiere}>
                  <SelectTrigger 
                    id="matiere" 
                    className="h-12 pl-10 text-base border-2 border-green-200 focus:border-green-400 rounded-xl bg-white/80"
                  >
                    <div className="absolute left-3 top-3">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <SelectValue placeholder="Choisis une matière" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    {matieres.map((matiereItem) => (
                      <SelectItem 
                        key={matiereItem.id} 
                        value={matiereItem.id.toString()}
                        className="text-base py-3 hover:bg-blue-50"
                      >
                        <span className="text-lg mr-2">📖</span>
                        {matiereItem.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Type de question avec emoji */}
           <div className="space-y-3">
              <Label htmlFor="type_question" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                C'est quel type de question ?
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {typesQuestions.map((type) => (
                  <Button
                    key={type.code}
                    type="button"
                    variant={type_question === type.code ? "default" : "outline"}
                    onClick={() => setTypeQuestion(type.code)}
                    className={`h-14 text-base rounded-xl border-2 ${
                      type_question === type.code 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent' 
                        : 'border-blue-200 hover:border-blue-300 bg-white/80'
                    }`}
                  >
                    <img 
                      src={getTypeQuestionIcon(type.code)} 
                      alt={type.libelle} 
                      className="w-6 h-6 mr-2" 
                    />
                    {type.libelle}
                  </Button>
                ))}
              </div>
            </div>

            {/* Description avec emoji */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-xl">✍️</span>
                Explique ton problème en détails
              </Label>
              <Textarea
                id="description"
                placeholder="Décris ce que tu ne comprends pas... Sois précis pour qu'on puisse mieux t'aider !"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="text-base border-2 border-purple-200 focus:border-purple-400 rounded-xl bg-white/80 resize-none"
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-yellow-500">💡</span>
                <span>Plus tu es précis, mieux on pourra t'aider !</span>
              </div>
            </div>

            {/* Image avec emoji */}
            <div className="space-y-3">
              <Label htmlFor="image" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-xl">🖼️</span>
                Veux-tu ajouter une image ? (facultatif)
              </Label>
              <div className="relative">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <div className={`p-4 border-2 border-dashed rounded-xl transition-all ${
                    image 
                      ? 'border-green-300 bg-green-50/50' 
                      : 'border-blue-200 hover:border-blue-300 bg-white/50'
                  }`}>
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className={`p-3 rounded-full ${
                        image 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {image ? <ImageIcon className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-700">
                          {image ? "Image sélectionnée ! 🎉" : "Clique pour ajouter une image"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {image ? image.name : "JPG, PNG (max 5MB)"}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Bouton d'envoi avec animation */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={submitting || !titre || !type_question || !description || !matiere}
                className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Envoyer ma question à l'enseignant !
                  </>
                )}
              </Button>
              
              {/* Message d'encouragement */}
             
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistanceRequestForm;