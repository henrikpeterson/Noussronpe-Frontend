import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { canAskQuestion, currentStudentStats } from "@/data/assistance";

interface AssistanceRequestFormProps {
  onSubmit: () => void;
}

const AssistanceRequestForm = ({ onSubmit }: AssistanceRequestFormProps) => {
  const [subject, setSubject] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canAskQuestion(currentStudentStats)) {
      toast.error("Limite atteinte", {
        description: "Tu as atteint la limite de questions gratuites. Souscris à l'abonnement pour continuer !"
      });
      return;
    }

    if (!subject || !questionType || !description) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    toast.success("Demande envoyée !", {
      description: "Un enseignant te répondra bientôt."
    });
    
    // Reset form
    setSubject("");
    setQuestionType("");
    setDescription("");
    setImage(null);
    
    onSubmit();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      toast.success("Image ajoutée");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Poser une question</CardTitle>
        <CardDescription>
          Un enseignant te répondra dans les plus brefs délais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Matière concernée</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Sélectionne une matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                <SelectItem value="Physique-Chimie">Physique-Chimie</SelectItem>
                <SelectItem value="SVT">SVT</SelectItem>
                <SelectItem value="Français">Français</SelectItem>
                <SelectItem value="Histoire-Géographie">Histoire-Géographie</SelectItem>
                <SelectItem value="Anglais">Anglais</SelectItem>
                <SelectItem value="Philosophie">Philosophie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionType">Type de question</Label>
            <Select value={questionType} onValueChange={setQuestionType}>
              <SelectTrigger id="questionType">
                <SelectValue placeholder="Sélectionne le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cours">Cours</SelectItem>
                <SelectItem value="exercice">Exercice</SelectItem>
                <SelectItem value="comprehension">Compréhension</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Décris ton problème</Label>
            <Textarea
              id="description"
              placeholder="Explique en détail ce que tu ne comprends pas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Ajouter une image (optionnel)</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" asChild>
                <label htmlFor="image" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {image ? image.name : "Choisir une image"}
                </label>
              </Button>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Envoyer ma demande
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssistanceRequestForm;
