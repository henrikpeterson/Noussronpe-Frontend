import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Friend } from "@/data/friends";
import { useNavigate } from "react-router-dom";

interface FriendCardProps {
  friend: Friend;
}

export function FriendCard({ friend }: FriendCardProps) {
  const navigate = useNavigate();

  const handleChallenge = () => {
    navigate(`/defi/lancer/${friend.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {friend.avatar}
                </AvatarFallback>
              </Avatar>
              <div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{friend.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {friend.class}
                </Badge>
                {friend.status === 'offline' && friend.lastSeen && (
                  <span className="text-xs text-muted-foreground">
                    {friend.lastSeen}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            onClick={handleChallenge}
            size="sm"
            className="bg-gradient-to-r from-afrique-orange to-afrique-rouge hover:from-afrique-orange/90 hover:to-afrique-rouge/90"
          >
            Défier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}