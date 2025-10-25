import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AssistanceRequestForm from "@/components/assistance/AssistanceRequestForm";
import AssistanceRequestCard from "@/components/assistance/AssistanceRequestCard";
import AssistanceDetailModal from "@/components/assistance/AssistanceDetailModal";
import { getStudentRequests, currentStudentStats, AssistanceRequest } from "@/data/assistance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AssistanceEducativePage = () => {
  const [requests, setRequests] = useState<AssistanceRequest[]>(getStudentRequests('student1'));
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleViewRequest = (request: AssistanceRequest) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleFormSubmit = () => {
    // Recharger les demandes après soumission
    setRequests(getStudentRequests('student1'));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Assistance Éducative</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Obtiens de l'aide personnalisée d'un enseignant qualifié. Pose tes questions sur tes cours ou exercices et reçois une réponse détaillée.
            </p>
          </div>

          {/* Statistiques */}
          <div className="max-w-4xl mx-auto mb-8">
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertDescription>
                {currentStudentStats.hasSubscription ? (
                  <span>
                    ✨ Tu as un abonnement actif ! Tu peux poser des questions illimitées.
                  </span>
                ) : (
                  <span>
                    Il te reste <strong>{currentStudentStats.freeQuestionsRemaining}</strong> question(s) gratuite(s). 
                    <Button variant="link" className="px-1 h-auto">
                      Souscrire à l'abonnement
                    </Button>
                    pour des questions illimitées (2000 F/trimestre).
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </div>

          {/* Formulaire et demandes */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Formulaire */}
            <div>
              <AssistanceRequestForm onSubmit={handleFormSubmit} />
            </div>

            {/* Mes demandes */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Mes demandes</CardTitle>
                  <CardDescription>
                    Consulte l'historique de tes questions et leurs réponses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {requests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune demande pour le moment</p>
                      <p className="text-sm">Pose ta première question !</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <AssistanceRequestCard
                          key={request.id}
                          request={request}
                          onView={handleViewRequest}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <AssistanceDetailModal
        request={selectedRequest}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      <Footer />
    </div>
  );
};

export default AssistanceEducativePage;
