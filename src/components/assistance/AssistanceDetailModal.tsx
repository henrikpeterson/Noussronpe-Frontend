import { AssistanceRequest } from "@/data/assistance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AssistanceDetailModalProps {
  request: AssistanceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssistanceDetailModal = ({ request, open, onOpenChange }: AssistanceDetailModalProps) => {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{request.subject}</Badge>
            <Badge>{request.questionType}</Badge>
          </div>
          <DialogTitle>Détails de la demande</DialogTitle>
          <DialogDescription>
            Posée le {format(request.createdAt, "d MMMM yyyy à HH:mm", { locale: fr })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Question de l'élève */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Ta question
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {request.description}
            </p>
            {request.imageUrl && (
              <img 
                src={request.imageUrl} 
                alt="Question" 
                className="mt-3 rounded-lg max-w-full"
              />
            )}
          </div>

          {/* Réponse de l'enseignant */}
          {request.response ? (
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  Réponse de {request.response.teacherName}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  {format(request.response.answeredAt, "d MMM à HH:mm", { locale: fr })}
                </p>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                {request.response.text}
              </p>
              {request.response.imageUrl && (
                <img 
                  src={request.response.imageUrl} 
                  alt="Réponse" 
                  className="mt-3 rounded-lg max-w-full"
                />
              )}
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                ⏳ En attente de la réponse d'un enseignant...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssistanceDetailModal;
