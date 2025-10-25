import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, Gift } from "lucide-react";
import confetti from 'canvas-confetti';
import { useEffect } from "react";

interface RewardClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardName: string;
  challengeTitle: string;
}

const RewardClaimModal = ({ 
  isOpen, 
  onClose, 
  rewardName,
  challengeTitle 
}: RewardClaimModalProps) => {
  
  useEffect(() => {
    if (isOpen) {
      // Lancer les confettis
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FF6347']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500', '#FF6347']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative p-6 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full">
                <Trophy className="h-16 w-16 text-amber-600" />
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-center text-2xl">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              Félicitations ! 🎉
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
          </DialogTitle>
          
          <DialogDescription className="text-center space-y-4 pt-4">
            <p className="text-lg font-semibold text-foreground">
              Tu as atteint ton objectif !
            </p>
            
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border-2 border-amber-200">
              <p className="text-sm text-muted-foreground mb-2">
                Challenge complété
              </p>
              <p className="font-bold text-foreground mb-3">
                {challengeTitle}
              </p>
              
              <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg">
                <Gift className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-amber-900">
                  {rewardName}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic">
              Continue sur cette lancée et relève de nouveaux défis ! 💪
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-4">
          <Button 
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          >
            Super ! 🎊
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardClaimModal;
