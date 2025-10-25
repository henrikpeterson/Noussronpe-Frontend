import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { userProgress } from "@/data/user";
import { getUserTokens } from "@/data/tokens";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Trophy,
  BookOpen,
  Clock,
  Target,
  ArrowLeft,
  Coins
} from "lucide-react";

export default function ProfilePage() {
  // Mock user data - in a real app this would come from authentication/API
  const userInfo = {
    firstName: "Koffi",
    lastName: "Djamé",
    email: "koffi.djame@email.com",
    level: "3ème",
    joinDate: "2024-01-15",
    avatar: ""
  };

  const { statistics, badges, tokens } = userProgress;
  const currentTokens = getUserTokens();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tokens Card */}
          <Card className="lg:col-span-3 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-afrique-orange" />
                Mes jetons de savoir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-afrique-orange/10 to-afrique-orange/5 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Coins className="h-8 w-8 text-afrique-orange" />
                  </div>
                  <div className="text-3xl font-bold text-afrique-orange">{currentTokens.balance}</div>
                  <div className="text-sm text-muted-foreground">Jetons disponibles</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary">{currentTokens.totalEarned}</div>
                  <div className="text-sm text-muted-foreground">Total gagné</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={userInfo.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {userInfo.firstName[0]}{userInfo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{userInfo.firstName} {userInfo.lastName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Classe: {userInfo.level}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Membre depuis: {new Date(userInfo.joinDate).toLocaleDateString('fr-FR')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Statistiques générales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{statistics.totalExamsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Épreuves terminées</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-secondary">{Math.floor(statistics.totalTimeSpent / 60)}h {statistics.totalTimeSpent % 60}m</div>
                  <div className="text-sm text-muted-foreground">Temps d'étude</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-accent">{statistics.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Score moyen</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Mes badges ({badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {badges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{badge.name}</h4>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Obtenu le {new Date(badge.dateEarned).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucun badge obtenu pour le moment</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Continuez à étudier pour débloquer vos premiers badges !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}