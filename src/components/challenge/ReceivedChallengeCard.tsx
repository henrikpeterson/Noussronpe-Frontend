import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Challenge, updateChallengeStatus } from "@/data/challenges";
import { Clock, User, BookOpen, Trophy, Check, X } from "lucide-react";
import { toast } from "sonner";

interface ReceivedChallengeCardProps {
  challenge: Challenge;
  onStatusUpdate: () => void;
}

export function ReceivedChallengeCard({ challenge, onStatusUpdate }: ReceivedChallengeCardProps) {
  const handleAccept = () => {
    updateChallengeStatus(challenge.id, 'accepted');
    toast.success(`Défi accepté ! Préparez-vous à affronter ${challenge.from}`);
    onStatusUpdate();
  };

  const handleDecline = () => {
    updateChallengeStatus(challenge.id, 'declined');
    toast.info(`Défi décliné`);
    onStatusUpdate();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'QCM': return 'bg-blue-100 text-blue-800';
      case 'Flashcard': return 'bg-green-100 text-green-800';
      case 'Temps limité': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="text-primary font-semibold">
                {challenge.from.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{challenge.from}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatDate(challenge.createdAt)}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/5">
            <Trophy className="h-3 w-3 mr-1" />
            Défi
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {challenge.message && (
          <p className="text-sm text-muted-foreground italic">
            "{challenge.message}"
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Matière</p>
              <p className="text-sm font-medium">{challenge.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Niveau</p>
              <p className="text-sm font-medium">{challenge.level}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getTypeColor(challenge.type)}>
            {challenge.type}
          </Badge>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleAccept}
            className="flex-1 bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Check className="h-4 w-4 mr-2" />
            Accepter
          </Button>
          <Button 
            onClick={handleDecline}
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Décliner
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}