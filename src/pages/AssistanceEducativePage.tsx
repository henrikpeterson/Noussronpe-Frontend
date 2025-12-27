import { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AssistanceRequestForm from "@/components/assistance/AssistanceRequestForm";
import AssistanceRequestCard from "@/components/assistance/AssistanceRequestCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, HelpCircle, Loader2, PlusCircle, History } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAssistance } from "@/hooks/useAssitance";
import { AssistanceRequest } from "@/api";

const AssistanceEducativePage = () => {
  const { 
    demandes, 
    loading, 
    error, 
    creeDemande, 
    chargerMesDemandes,
    clearError 
  } = useAssistance();
  
  const [activeTab, setActiveTab] = useState("formulaire");

  // Charger les demandes au montage
  useEffect(() => {
    chargerMesDemandes();
  }, []);

  const handleFormSubmit = async (formData: {
    titre: string;
    type_question: string;
    description: string;
    matiere: number;
    image?: File;
  }) => {
    try {
      await creeDemande(formData);
      await chargerMesDemandes();
      setActiveTab("demandes"); // Basculer sur l'onglet des demandes après soumission
    } catch (err) {
      console.error("Erreur création demande:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête (inchangé) */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Assistance Éducative</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Obtiens de l'aide personnalisée d'un enseignant qualifié. Pose tes questions sur tes cours ou exercices et reçois une réponse détaillée.
            </p>
          </div>

          {/* Gestion des erreurs (inchangé) */}
          {error && (
            <div className="max-w-4xl mx-auto mb-4">
              <Alert variant="destructive">
                <AlertDescription>
                  {error}
                  <Button variant="ghost" size="sm" onClick={clearError} className="ml-2">
                    ×
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Contenu principal avec onglets */}
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="pb-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="formulaire" className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Nouvelle demande
                    </TabsTrigger>
                    <TabsTrigger value="demandes" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Mes demandes ({demandes.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Onglet 1 : Formulaire */}
                  <TabsContent value="formulaire" className="mt-6">
                    <AssistanceRequestForm onSubmit={handleFormSubmit} />
                  </TabsContent>

                  {/* Onglet 2 : Mes demandes */}
                  <TabsContent value="demandes" className="mt-6">
                    {loading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p className="text-muted-foreground">Chargement...</p>
                      </div>
                    ) : demandes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Aucune demande pour le moment</p>
                        <p className="text-sm">Pose ta première question !</p>
                        <Button 
                          onClick={() => setActiveTab("formulaire")}
                          className="mt-4"
                        >
                          Créer une demande
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {demandes.map((request) => (
                          <AssistanceRequestCard
                            key={request.id}
                            request={request}
                            onView={() => {/* Laissé vide comme avant */}}
                          />
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

export default AssistanceEducativePage;