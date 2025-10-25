import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPendingChallengesCount } from "@/data/challenges";
import { Bell, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
export function ChallengeNotification() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const updateCount = () => {
      setCount(getPendingChallengesCount());
    };
    updateCount();

    // Mettre à jour toutes les 5 secondes (simulation temps réel)
    const interval = setInterval(updateCount, 5000);
    return () => clearInterval(interval);
  }, []);
  if (count === 0) return null;
  return <Button variant="outline" size="sm" asChild className="relative border-primary/20 bg-primary/5 hover:bg-primary/10">
      <Link to="/defi/recus" className="bg-white ">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <span className="text-blue-600 font-bold">Défis reçus</span>
          <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            {count}
          </Badge>
        </div>
      </Link>
    </Button>;
}