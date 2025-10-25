import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redeemTokenCode } from "@/data/tokens";
import { useToast } from "@/hooks/use-toast";
import { Coins, X } from "lucide-react";

interface TokenRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tokens: number) => void;
}

export default function TokenRechargeModal({ isOpen, onClose, onSuccess }: TokenRechargeModalProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setMessage("");
    
    // Simulation d'un délai de traitement
    setTimeout(() => {
      const result = redeemTokenCode(code.trim().toUpperCase());
      
      if (result.success) {
        setMessage(result.message);
        setMessageType("success");
        onSuccess(result.value!);
        toast({
          title: "Jetons rechargés !",
          description: `Vous avez gagné ${result.value} jetons de savoir.`,
        });
        
        // Fermer le modal après 2 secondes
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setCode("");
    setMessage("");
    setMessageType("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Coins className="h-5 w-5" />
            Recharger mes jetons
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token-code">Code du ticket</Label>
            <Input
              id="token-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Entrez votre code ici..."
              className="text-center font-mono text-lg tracking-widest"
              disabled={isLoading}
            />
          </div>
          
          {message && (
            <div
              className={`p-3 rounded-md text-sm font-medium text-center ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!code.trim() || isLoading}
            >
              {isLoading ? "Validation..." : "Valider"}
            </Button>
          </div>
        </form>
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          Codes d'exemple: EDU2024A1, BONUS123, SUPER500
        </div>
      </DialogContent>
    </Dialog>
  );
}