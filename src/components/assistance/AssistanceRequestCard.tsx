import { AssistanceRequest } from "@/data/assistance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Lock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AssistanceRequestCardProps {
  request: AssistanceRequest;
  onView: (request: AssistanceRequest) => void;
}

const AssistanceRequestCard = ({ request, onView }: AssistanceRequestCardProps) => {
  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'answered':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <Lock className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (request.status) {
      case 'pending':
        return 'En attente';
      case 'answered':
        return 'Répondu';
      case 'closed':
        return 'Fermé';
    }
  };

  const getStatusVariant = () => {
    switch (request.status) {
      case 'pending':
        return 'secondary' as const;
      case 'answered':
        return 'default' as const;
      case 'closed':
        return 'outline' as const;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getStatusVariant()} className="flex items-center gap-1">
                {getStatusIcon()}
                {getStatusText()}
              </Badge>
              <Badge variant="outline">{request.subject}</Badge>
            </div>
            <CardTitle className="text-lg">{request.questionType.charAt(0).toUpperCase() + request.questionType.slice(1)}</CardTitle>
            <CardDescription>
              {format(request.createdAt, "d MMMM yyyy", { locale: fr })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {request.description}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onView(request)}
          className="w-full"
        >
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssistanceRequestCard;
