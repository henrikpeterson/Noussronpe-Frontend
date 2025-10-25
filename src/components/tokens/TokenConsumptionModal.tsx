import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Coins } from "lucide-react";

interface TokenConsumptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cost: number;
  description: string;
  currentBalance: number;
}

export default function TokenConsumptionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  cost, 
  description, 
  currentBalance 
}: TokenConsumptionModalProps) {
  const canAfford = currentBalance >= cost;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Coins className="h-5 w-5" />
            Consommation de jetons
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              {canAfford ? (
                <Coins className="h-12 w-12 text-afrique-orange" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-red-500" />
              )}
            </div>
            
            {canAfford ? (
              <>
                <p className="text-lg font-medium mb-2">
                  {description} coûte <span className="text-afrique-orange font-bold">{cost} jeton{cost > 1 ? 's' : ''}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Solde actuel: {currentBalance} jetons
                </p>
                <p className="text-sm text-muted-foreground">
                  Après: {currentBalance - cost} jetons
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-2 text-red-600">
                  Jetons insuffisants
                </p>
                <p className="text-sm text-muted-foreground">
                  {description} coûte {cost} jeton{cost > 1 ? 's' : ''} mais vous n'avez que {currentBalance} jeton{currentBalance > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-red-500 mt-2">
                  Rechargez vos jetons pour continuer 🚀
                </p>
              </>
            )}
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            {canAfford ? (
              <Button
                onClick={onConfirm}
                className="flex-1"
              >
                Continuer
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onClose();
                  // Trigger token recharge modal
                  window.dispatchEvent(new CustomEvent('openTokenRecharge'));
                }}
                className="flex-1"
              >
                Recharger
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}