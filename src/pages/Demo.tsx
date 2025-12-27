import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getAllRequests, AssistanceRequest } from "@/data/assistance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const TeacherAssistancePage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responseModalOpen, setResponseModalOpen] = useState(false);

  useEffect(() => {
  // NOUVELLE VÉRIFICATION (au lieu de isTeacher)
  const teacherToken = localStorage.getItem("teacher_access_token");
  const teacherUser = localStorage.getItem("teacher_user");
  
  if (!teacherToken || !teacherUser) {
    toast.error("Accès refusé", {
      description: "Vous devez être connecté en tant qu'enseignant"
    });
    navigate("/");
    return;
  }
  
  // Vérification supplémentaire : s'assurer que c'est bien un enseignant
  try {
    const user = JSON.parse(teacherUser);
    if (!user.is_staff) {
      toast.error("Accès refusé", {
        description: "Cette fonctionnalité est réservée aux enseignants"
      });
      navigate("/");
      return;
    }
  } catch (error) {
    toast.error("Erreur d'authentification");
    navigate("/");
    return;
  }

  // Charger les demandes
  setRequests(getAllRequests());
}, [navigate]);

  const handleRespond = (request: AssistanceRequest) => {
    setSelectedRequest(request);
    setResponseModalOpen(true);
    setResponseText("");
  };

  const handleSubmitResponse = () => {
    if (!responseText.trim()) {
      toast.error("Veuillez écrire une réponse");
      return;
    }

    toast.success("Réponse envoyée !", {
      description: "L'élève sera notifié de votre réponse"
    });

    setResponseModalOpen(false);
    setResponseText("");
    setSelectedRequest(null);
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const answeredRequests = requests.filter(r => r.status === 'answered');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Espace Enseignant</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gérez les demandes d'assistance des élèves et apportez-leur votre expertise
            </p>
          </div>

          {/* Statistiques */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requests.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">En attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingRequests.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Répondues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{answeredRequests.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des demandes */}
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Demandes d'assistance des élèves</CardTitle>
                <CardDescription>
                  Répondez aux questions des élèves pour les aider dans leurs révisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune demande pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <Card key={request.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                                  {request.status === 'pending' ? 'En attente' : 'Répondu'}
                                </Badge>
                                <Badge variant="outline">{request.subject}</Badge>
                                <Badge variant="outline">{request.questionType}</Badge>
                              </div>
                              <CardTitle className="text-lg">
                                {request.studentName}
                              </CardTitle>
                              <CardDescription>
                                {format(request.createdAt, "d MMMM yyyy à HH:mm", { locale: fr })}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4">{request.description}</p>
                          {request.status === 'pending' ? (
                            <Button 
                              onClick={() => handleRespond(request)}
                              className="w-full"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Répondre
                            </Button>
                          ) : (
                            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                                Votre réponse :
                              </p>
                              <p className="text-sm text-green-800 dark:text-green-200">
                                {request.response?.text}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal de réponse */}
      <Dialog open={responseModalOpen} onOpenChange={setResponseModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Répondre à {selectedRequest?.studentName}</DialogTitle>
            <DialogDescription>
              Question sur {selectedRequest?.subject} - {selectedRequest?.questionType}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 mt-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Question de l'élève :</p>
                <p className="text-sm">{selectedRequest.description}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Votre réponse</Label>
                <Textarea
                  id="response"
                  placeholder="Écrivez votre réponse détaillée ici..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={8}
                />
              </div>

              <Button onClick={handleSubmitResponse} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Envoyer la réponse
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default TeacherAssistancePage;
