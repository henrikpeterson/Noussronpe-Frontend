import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle2, Gift } from "lucide-react";
import { ChallengeReward } from "@/data/challenges-rewards";

interface ChallengeRewardCardProps {
  challenge: ChallengeReward;
  isSelected?: boolean;
  onSelect?: (challengeId: string) => void;
  onClaim?: (challengeId: string) => void;
  isClaimed?: boolean;
}

const ChallengeRewardCard = ({ 
  challenge, 
  isSelected = false, 
  onSelect, 
  onClaim,
  isClaimed = false 
}: ChallengeRewardCardProps) => {
  const progressPercentage = Math.min((challenge.current / challenge.target) * 100, 100);
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'quiz': return '📝 Quiz';
      case 'chapters': return '📚 Chapitres';
      case 'battles': return '⚔️ Défis';
      default: return category;
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-primary' : ''
    } ${challenge.completed ? 'bg-gradient-to-br from-yellow-50 to-amber-50' : ''}`}>
      <div className={`h-2 bg-gradient-to-r ${challenge.color}`} />
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {challenge.completed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              <Badge variant="outline">{getCategoryLabel(challenge.category)}</Badge>
            </div>
            <CardTitle className="text-xl">{challenge.title}</CardTitle>
            <CardDescription>{challenge.description}</CardDescription>
          </div>
          {isSelected && (
            <Badge className="bg-primary">Objectif actif</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-semibold">
              {challenge.current} / {challenge.target}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground text-right">
            {progressPercentage.toFixed(0)}% complété
          </p>
        </div>

        {/* Récompense */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <Gift className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">
                Récompense
              </p>
              <p className="text-xs text-amber-700">
                {challenge.reward.name}
              </p>
            </div>
            {challenge.completed && !isClaimed && (
              <Trophy className="h-6 w-6 text-amber-500 animate-pulse" />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2">
          {challenge.completed ? (
            isClaimed ? (
              <Button variant="outline" disabled className="w-full">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Récompense réclamée
              </Button>
            ) : (
              <Button 
                onClick={() => onClaim?.(challenge.id)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                <Trophy className="mr-2 h-4 w-4" />
                Réclamer ma récompense
              </Button>
            )
          ) : isSelected ? (
            <Button variant="outline" disabled className="w-full">
              Objectif en cours...
            </Button>
          ) : (
            <Button 
              onClick={() => onSelect?.(challenge.id)}
              className="w-full"
              variant="outline"
            >
              Choisir cet objectif
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeRewardCard;
