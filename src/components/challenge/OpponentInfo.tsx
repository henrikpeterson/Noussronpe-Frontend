import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Friend } from "@/data/friends";

interface OpponentInfoProps {
  opponent: Friend;
  status: "thinking" | "completed" | "waiting";
}

const OpponentInfo = ({ opponent, status }: OpponentInfoProps) => {
  const getStatusText = () => {
    switch (status) {
      case "thinking":
        return "Répond en cours...";
      case "completed":
        return "A terminé";
      case "waiting":
        return "En attente";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "thinking":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "waiting":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {opponent.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{opponent.name}</h3>
            <p className="text-sm text-gray-500">{opponent.class}</p>
          </div>
        </div>
        
        <Badge className={`${getStatusColor()} border-0`}>
          {getStatusText()}
        </Badge>
      </div>
    </div>
  );
};

export default OpponentInfo;