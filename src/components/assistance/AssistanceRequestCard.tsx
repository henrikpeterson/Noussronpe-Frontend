import { useState } from "react";
import { AssistanceRequest } from "@/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Lock, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AssistanceRequestCardProps {
  request: AssistanceRequest;
  onView: (request: AssistanceRequest) => void;
}

const AssistanceRequestCard = ({ request }: AssistanceRequestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    switch (request.statut) {
      case 'en_attente':
        return <Clock className="h-4 w-4" />;
      case 'repondue':
        return <CheckCircle className="h-4 w-4" />;
      case 'fermé':
        return <Lock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (request.statut) {
      case 'en_attente':
        return 'En attente';
      case 'repondue':
        return 'Répondu';
      case 'fermé':
        return 'Fermé';
      default:
        return 'En attente';
    }
  };

  const getStatusVariant = () => {
    switch (request.statut) {
      case 'en_attente':
        return 'secondary' as const;
      case 'repondue':
        return 'default' as const;
      case 'fermé':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={getStatusVariant()} className="flex items-center gap-1">
                {getStatusIcon()}
                {getStatusText()}
              </Badge>
              <Badge variant="outline">{request.matiere_nom}</Badge>
              <Badge variant="secondary">{request.type_question}</Badge>
            </div>
            <CardTitle className="text-lg mb-1">{request.titre}</CardTitle>
            <CardDescription>
              {format(new Date(request.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </CardDescription>
          </div>
          
          {/* Bouton expand/collapse */}
          
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description toujours visible */}
        <p className="text-sm text-muted-foreground mb-4">
          {request.description}
        </p>

        {/* Section réponses - visible seulement quand expandée */}
        {isExpanded && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              Réponses ({request.reponses.length})
            </div>

            {request.reponses.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune réponse pour le moment</p>
                <p>Un enseignant te répondra bientôt</p>
              </div>
            ) : (
              <div className="space-y-3">
                {request.reponses.map((reponse) => (
                  <div 
                    key={reponse.id} 
                    className={`p-3 rounded-lg border ${
                      reponse.is_from_teacher 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium ${
                        reponse.is_from_teacher ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {reponse.is_from_teacher ? '👨‍🏫 Enseignant' : '👤 Élève'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(reponse.created_at), "d MMM HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm">{reponse.message}</p>
                    
                    {reponse.image && (
                      <div className="mt-2">
                        <img 
                          src={reponse.image} 
                          alt="Illustration réponse" 
                          className="max-w-full h-auto rounded border max-h-32 object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bouton voir détails/détails réduits */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2"
        >
          {isExpanded ? (
            <>↑ Réduire les détails</>
          ) : (
            <>↓ Voir les détails ({request.reponses.length} réponse(s))</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssistanceRequestCard;