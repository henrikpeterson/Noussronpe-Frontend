// components/ExpandableResponseForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, X, ChevronDown, ChevronUp, FileImage, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableResponseFormProps {
  requestId: number;
  onSubmit: (requestId: number, data: { message: string; image?: File }) => Promise<void>;
  className?: string;
  defaultExpanded?: boolean;
}

export const ExpandableResponseForm = ({
  requestId,
  onSubmit,
  className,
  defaultExpanded = false
}: ExpandableResponseFormProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [responseText, setResponseText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!responseText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(requestId, {
        message: responseText,
        image: selectedImage || undefined
      });
      
      // Réinitialiser après succès
      setResponseText("");
      setSelectedImage(null);
      setIsExpanded(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      throw error; // Propager l'erreur pour la gestion dans le parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image doit faire moins de 5MB");
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setResponseText("");
    setSelectedImage(null);
  };

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden transition-all", className)}>
      {/* Bouton d'ouverture/fermeture */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="ghost"
        className="w-full justify-between h-auto py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-b-none border-b"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">Répondre à cette demande</span>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <>
              <span className="text-sm text-muted-foreground">Fermer</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">Ouvrir</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </div>
      </Button>

      {/* Formulaire déroulant avec animation */}
      {isExpanded && (
        <div className="animate-in fade-in duration-200">
          <div className="p-4 space-y-4 bg-card">
            {/* Champ de texte */}
            <div className="space-y-2">
              <Label htmlFor={`response-${requestId}`} className="text-sm font-medium">
                Votre réponse détaillée *
              </Label>
              <Textarea
                id={`response-${requestId}`}
                placeholder="Expliquez clairement votre réponse. Soyez pédagogique et précis..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={5}
                className="resize-y min-h-[120px]"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                * Ce champ est obligatoire
              </p>
            </div>

            {/* Champ fichier image */}
            <div className="space-y-2">
              <Label htmlFor={`image-${requestId}`} className="flex items-center gap-2 text-sm font-medium">
                <FileImage className="h-4 w-4" />
                Ajouter une image explicative (optionnel)
              </Label>
              <Input
                id={`image-${requestId}`}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
                disabled={isSubmitting}
              />
              {selectedImage && (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">{selectedImage.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Formats acceptés: JPG, PNG, GIF • Max 5MB
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={!responseText.trim() || isSubmitting}
                className="flex-1 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer la réponse
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};