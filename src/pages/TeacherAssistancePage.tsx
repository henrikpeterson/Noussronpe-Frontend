// TeacherAssistancePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ExpandableResponseForm } from "@/components/assistance/ExpandableResponseForm";
import { useTeacherAssistance } from "@/hooks/useTeacherAssistance";

const TeacherAssistancePage = () => {
  const navigate = useNavigate();
  const {
    demandesEnAttente,
    demandesRepondues,
    loading,
    error,
    chargerDemandes,
    repondreDemande,
    clearError
  } = useTeacherAssistance();

  // Vérifier l'authentification enseignant au chargement
  useEffect(() => {
    const teacherToken = localStorage.getItem('teacher_access_token');
    const teacherUser = localStorage.getItem('teacher_user');
    
    if (!teacherToken || !teacherUser) {
      toast.error("Accès refusé", {
        description: "Vous devez être connecté en tant qu'enseignant"
      });
      navigate("/");
      return;
    }

    // Vérifier si l'utilisateur est bien un enseignant
    try {
      const user = JSON.parse(teacherUser);
      if (!user.is_staff) {
        toast.error("Accès refusé", {
          description: "Cette fonctionnalité est réservée aux enseignants"
        });
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmitResponse = async (assistanceId: number, data: { message: string; image?: File }) => {
    try {
      await repondreDemande(assistanceId, data);
      toast.success("Réponse envoyée avec succès !", {
        description: "L'élève sera notifié de votre réponse"
      });
      return Promise.resolve();
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible d'envoyer la réponse"
      });
      return Promise.reject(err);
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case 'repondue':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Répondu
          </Badge>
        );
      case 'en_cours':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            En cours
          </Badge>
        );
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getTypeQuestionBadge = (type: string) => {
    const types: Record<string, string> = {
      'cours': 'bg-purple-100 text-purple-800',
      'exercice': 'bg-blue-100 text-blue-800',
      'comprehension': 'bg-green-100 text-green-800',
      'autres': 'bg-gray-100 text-gray-800'
    };
    
    const typeLabels: Record<string, string> = {
      'cours': 'Cours',
      'exercice': 'Exercice',
      'comprehension': 'Compréhension',
      'autres': 'Autres'
    };
    
    return (
      <Badge variant="outline" className={types[type] || ''}>
        {typeLabels[type] || type}
      </Badge>
    );
  };

  if (loading && demandesEnAttente.length === 0 && demandesRepondues.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-muted-foreground">Chargement des demandes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
           <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="h-10 w-10 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Espace Enseignant
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
               Gérez les demandes d'assistance des élèves et apportez-leur votre expertise
            </p>
            
            {/* Statistiques SEULEMENT - 3 cartes centrées */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total demandes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {demandesEnAttente.length + demandesRepondues.length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-amber-600">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      En attente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                      {demandesEnAttente.length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-600">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Répondues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {demandesRepondues.length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Onglets et liste des demandes */}
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <Tabs defaultValue="en-attente" className="w-full">
                  <TabsList className="grid w-full md:w-auto grid-cols-2">
                    <TabsTrigger value="en-attente" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      En attente ({demandesEnAttente.length})
                    </TabsTrigger>
                    <TabsTrigger value="repondues" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Répondues ({demandesRepondues.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Onglet "En attente" */}
                  <TabsContent value="en-attente" className="mt-6">
                    {demandesEnAttente.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-2">Aucune demande en attente</h3>
                        <p className="text-muted-foreground">
                          Les élèves n'ont pas encore soumis de demandes d'assistance
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {demandesEnAttente.map((demande) => (
                          <Card key={demande.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4 bg-gradient-to-r from-white to-slate-50/50">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {getStatusBadge(demande.statut)}
                                    {getTypeQuestionBadge(demande.type_question)}
                                    <Badge variant="outline" className="bg-blue-50">
                                      {demande.matiere_nom}
                                    </Badge>
                                  </div>
                                  <CardTitle className="text-xl mb-2 text-foreground">
                                    {demande.titre}
                                  </CardTitle>
                                  <CardDescription className="flex flex-wrap items-center gap-2">
                                    <span className="font-medium text-foreground">Élève :</span>
                                    <span className="text-foreground">{demande.utilisateur_nom}</span>
                                    <span className="text-sm opacity-75">
                                      • {format(new Date(demande.created_at), "d MMMM yyyy à HH:mm", { locale: fr })}
                                    </span>
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {/* Description de la demande */}
                              <div className="bg-slate-50/50 rounded-lg p-4 border">
                                <p className="text-sm font-medium mb-2 text-slate-700">Description :</p>
                                <p className="text-sm whitespace-pre-wrap text-slate-900">
                                  {demande.description}
                                </p>
                                {demande.image && (
                                  <div className="mt-3">
                                    <p className="text-sm font-medium mb-2 text-slate-700">Image jointe :</p>
                                    <div className="relative max-w-xs">
                                      <img 
                                        src={demande.image} 
                                        alt="Image de la demande"
                                        className="rounded-lg border shadow-sm"
                                      />
                                      <div className="absolute inset-0 bg-black/5 rounded-lg"></div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Formulaire de réponse déroulant */}
                              <ExpandableResponseForm
                                requestId={demande.id}
                                onSubmit={handleSubmitResponse}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Onglet "Répondues" */}
                  <TabsContent value="repondues" className="mt-6">
                    {demandesRepondues.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-2">Aucune demande répondue</h3>
                        <p className="text-muted-foreground">
                          Vous n'avez pas encore répondu à des demandes
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {demandesRepondues.map((demande) => (
                          <Card key={demande.id} className="overflow-hidden border border-green-100">
                            <CardHeader className="pb-4 bg-gradient-to-r from-green-50/50 to-white">
                              <div className="flex flex-col">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  {getStatusBadge(demande.statut)}
                                  {getTypeQuestionBadge(demande.type_question)}
                                  <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                    {demande.matiere_nom}
                                  </Badge>
                                </div>
                                <CardTitle className="text-xl mb-2 text-foreground">
                                  {demande.titre}
                                </CardTitle>
                                <CardDescription className="flex flex-wrap items-center gap-2">
                                  <span className="font-medium text-foreground">Élève :</span>
                                  <span className="text-foreground">{demande.utilisateur_nom}</span>
                                  <span className="text-sm opacity-75">
                                    • {format(new Date(demande.created_at), "d MMMM yyyy à HH:mm", { locale: fr })}
                                  </span>
                                </CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {/* Question de l'élève */}
                              <div className="bg-slate-50/50 rounded-lg p-4 border">
                                <p className="text-sm font-medium mb-2 text-slate-700">Question de l'élève :</p>
                                <p className="text-sm whitespace-pre-wrap text-slate-900">
                                  {demande.description}
                                </p>
                              </div>
                              
                              {/* Réponses de l'enseignant */}
                              {demande.reponses && demande.reponses.length > 0 && (
                                <div className="space-y-4">
                                  <h4 className="font-medium text-green-700 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Votre(s) réponse(s)
                                  </h4>
                                  {demande.reponses.map((reponse, idx) => (
                                    <div 
                                      key={reponse.id} 
                                      className="bg-green-50/80 rounded-lg p-4 border border-green-200"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                                            Réponse {idx + 1}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {format(new Date(reponse.created_at), "d MMM HH:mm", { locale: fr })}
                                          </span>
                                        </div>
                                        {reponse.is_from_teacher && (
                                          <Badge variant="outline" className="text-xs">
                                            👨‍🏫 Enseignant
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm whitespace-pre-wrap text-green-900">
                                        {reponse.message}
                                      </p>
                                      {reponse.image && (
                                        <div className="mt-3">
                                          <img 
                                            src={reponse.image} 
                                            alt="Image de la réponse"
                                            className="max-w-xs rounded-lg border border-green-200"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherAssistancePage;