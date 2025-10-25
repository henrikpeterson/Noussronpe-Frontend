import { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { ReceivedChallengeCard } from "@/components/challenge/ReceivedChallengeCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPendingChallenges } from "@/data/challenges";
import { Inbox, Trophy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReceivedChallengesPage() {
  const [challenges, setChallenges] = useState(getPendingChallenges());

  const refreshChallenges = () => {
    setChallenges(getPendingChallenges());
  };

  useEffect(() => {
    refreshChallenges();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Inbox className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Défis reçus</h1>
              <p className="text-muted-foreground">
                {challenges.length} défi{challenges.length > 1 ? 's' : ''} en attente
              </p>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {challenges.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucun défi en attente
                    </h3>
                    <p className="text-muted-foreground">
                      Vous n'avez pas de défis en attente pour le moment. 
                      Encouragez vos amis à vous défier !
                    </p>
                  </div>
                  <Button asChild>
                    <Link to="/defi/amis">
                      Défier un ami
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {challenges.map(challenge => (
                <ReceivedChallengeCard 
                  key={challenge.id} 
                  challenge={challenge}
                  onStatusUpdate={refreshChallenges}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}