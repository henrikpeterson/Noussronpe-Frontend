import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { FriendCard } from "@/components/challenge/FriendCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { friends } from "@/data/friends";
import { Search, Users } from "lucide-react";
import challengeImage from "@/assets/challenge-competition.jpg";
export default function ChooseFriendPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "all" || friend.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });
  const uniqueLevels = Array.from(new Set(friends.map(f => f.level)));
  return <div className="min-h-screen bg-gradient-to-br from-afrique-orange/5 via-white to-afrique-bleu/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-afrique-bleu to-afrique-vert p-8 text-white">
          <div className="absolute inset-0 opacity-20">
            <img src={challengeImage} alt="Défi entre amis" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 bg-transparent">
              <Users className="h-8 w-8 bg-transparent" />
              <h1 className="text-3xl text-gray-950 font-semibold">Défier un ami</h1>
            </div>
            <p className="opacity-90 text-xl font-bold text-gray-950">
              Choisissez un ami et lancez-lui un défi pour apprendre ensemble !
            </p>
          </div>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Rechercher et filtrer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Rechercher un ami..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  {uniqueLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des amis */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Vos amis ({filteredFriends.length})
          </h2>
          
          {filteredFriends.length === 0 ? <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucun ami trouvé avec ces critères de recherche.
                </p>
              </CardContent>
            </Card> : <div className="grid gap-4">
              {filteredFriends.map(friend => <FriendCard key={friend.id} friend={friend} />)}
            </div>}
        </div>
      </main>

      <Footer />
    </div>;
}