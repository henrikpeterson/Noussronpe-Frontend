import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Coins, Star, Zap, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TokenPack {
  id: string;
  name: string;
  tokens: number;
  price: number;
  icon: any;
  color: string;
  popular?: boolean;
}

interface TokenPacksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tokenPacks: TokenPack[] = [
  {
    id: "mini",
    name: "Mini Pack",
    tokens: 40,
    price: 500,
    icon: GraduationCap,
    color: "text-blue-500",
  },
  {
    id: "classique", 
    name: "Classique Pack",
    tokens: 75,
    price: 1000,
    icon: Coins,
    color: "text-green-500",
    popular: true,
  },
  {
    id: "genie",
    name: "Génie Pack", 
    tokens: 150,
    price: 1500,
    icon: Zap,
    color: "text-purple-500",
  },
];

export default function TokenPacksModal({ isOpen, onClose }: TokenPacksModalProps) {
  const { toast } = useToast();

  const handlePurchase = (pack: TokenPack) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `L'achat du ${pack.name} sera bientôt disponible !`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Coins className="h-5 w-5" />
            Acheter des jetons de savoir
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              Vos jetons sont épuisés. Rechargez pour continuer à réviser 🚀
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tokenPacks.map((pack) => {
              const IconComponent = pack.icon;
              return (
                <Card 
                  key={pack.id} 
                  className={`relative hover:shadow-lg transition-shadow ${
                    pack.popular ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {pack.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                      <Star className="h-3 w-3 mr-1" />
                      Populaire
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-2">
                      <IconComponent className={`h-8 w-8 ${pack.color}`} />
                    </div>
                    <CardTitle className="text-lg">{pack.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-primary">{pack.tokens}</div>
                      <div className="text-sm text-muted-foreground">jetons</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold">{pack.price} F</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(pack.price / pack.tokens)} F par jeton
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handlePurchase(pack)}
                      className="w-full"
                      variant={pack.popular ? "default" : "outline"}
                    >
                      Acheter
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Vous pouvez également utiliser des codes de tickets physiques
            </p>
            <Button 
              variant="link" 
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('openTokenRecharge'));
              }}
              className="text-primary"
            >
              J'ai un code de ticket
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}