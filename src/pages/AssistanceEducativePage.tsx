import { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AssistanceRequestForm from "@/components/assistance/AssistanceRequestForm";
import AssistanceRequestCard from "@/components/assistance/AssistanceRequestCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Loader2, PlusCircle, History, Sparkles, MessageCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAssistance } from "@/hooks/useAssitance";
import { AssistanceRequest } from "@/api";
import { toast } from "@/components/ui/use-toast";

const AssistanceEducativePage = () => {
  const {
    demandes,
    loading,
    error,
    creeDemande,
    chargerMesDemandes,
    clearError,
  } = useAssistance();

  const [activeTab, setActiveTab] = useState("formulaire");

  useEffect(() => {
    chargerMesDemandes();
  }, []);

  const handleFormSubmit = async (formData: {
    description: string;
    matiere: number;
    image?: File;
  }) => {
    try {
      const cleanDescription = formData.description.replace(/\n/g, " ");
      const autoTitre =
        cleanDescription.length > 20
          ? cleanDescription.substring(0, 20) + "..."
          : cleanDescription;

      const dataForBackend = {
        titre: autoTitre || "Nouvelle question",
        type_question: "exercice",
        description: formData.description,
        matiere: formData.matiere,
        image: formData.image,
      };

      await creeDemande(dataForBackend);
      await chargerMesDemandes();
      setActiveTab("demandes");

      toast({
        title: "Question envoyée ! ✨",
        description: "Ta question a bien été envoyée ! Un prof va te répondre bientôt.",
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      toast({
        title: "Erreur d'envoi",
        description: "Zut ! Ça n'a pas marché. Vérifie ta connexion.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .aep-root { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .aep-tab-active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 4px 14px rgba(99,102,241,0.38);
        }
        .aep-tab-inactive { color: #94a3b8; background: transparent; }
        .aep-tab-inactive:hover { color: #6366f1; }
      `}</style>

      <div className="aep-root min-h-screen flex flex-col">
        <Header />

        <main
          className="flex-grow relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #eef2ff 0%, #faf5ff 45%, #fff1f5 100%)",
          }}
        >
          {/* Blobs décoratifs */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              top: -100, left: -100, width: 400, height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
              filter: "blur(70px)", opacity: 0.25,
            }}
          />
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              bottom: -80, right: -80, width: 360, height: 360,
              borderRadius: "50%",
              background: "radial-gradient(circle, #f472b6 0%, transparent 70%)",
              filter: "blur(60px)", opacity: 0.18,
            }}
          />
          <div
            aria-hidden
            className="absolute pointer-events-none hidden md:block"
            style={{
              top: "30%", right: "5%", width: 200, height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
              filter: "blur(50px)", opacity: 0.15,
            }}
          />

          <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
            {/* Hero Header */}
            <div className="text-center mb-10">
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  color: "#6366f1",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.1)",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Aide personnalisée d'un enseignant qualifié
              </span>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-3"
                style={{ letterSpacing: "-0.03em" }}
              >
                Assistance{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Éducative
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
                Pose tes questions sur tes cours ou exercices et reçois une réponse détaillée.
              </p>
            </div>

            {/* Erreur */}
            {error && (
              <div className="max-w-2xl mx-auto mb-4">
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertDescription>
                    {error}
                    <Button variant="ghost" size="sm" onClick={clearError} className="ml-2">×</Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Main Card */}
            <div
              className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 8px 48px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Custom Tab switcher */}
                <div className="p-3 pb-0">
                  <div
                    className="grid grid-cols-2 rounded-2xl p-1 gap-1"
                    style={{ background: "rgba(241,245,249,0.85)" }}
                  >
                    {[
                      { value: "formulaire", icon: <PlusCircle className="h-4 w-4" />, labelLg: "Nouvelle demande", labelSm: "Nouvelle" },
                      { value: "demandes", icon: <History className="h-4 w-4" />, labelLg: `Mes demandes (${demandes.length})`, labelSm: `Demandes (${demandes.length})` },
                    ].map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                          activeTab === tab.value ? "aep-tab-active" : "aep-tab-inactive"
                        }`}
                      >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.labelLg}</span>
                        <span className="sm:hidden">{tab.labelSm}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formulaire */}
                <TabsContent value="formulaire" className="p-4 sm:p-6 mt-0 focus-visible:ring-0 focus-visible:outline-none">
                  <AssistanceRequestForm onSubmit={handleFormSubmit} />
                </TabsContent>

                {/* Mes demandes */}
                <TabsContent value="demandes" className="p-4 sm:p-6 mt-0 focus-visible:ring-0 focus-visible:outline-none">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16">
                      <div className="relative w-14 h-14">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", opacity: 0.12 }}
                        />
                        <Loader2 className="h-7 w-7 animate-spin text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-slate-400 font-medium text-sm">Chargement de tes demandes…</p>
                    </div>
                  ) : demandes.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-16 text-center">
                      <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
                        style={{ background: "linear-gradient(135deg,#ede9fe,#fce7f3)" }}
                      >
                        💬
                      </div>
                      <div>
                        <p className="font-black text-slate-700 text-lg">Aucune demande pour l'instant</p>
                        <p className="text-slate-400 text-sm mt-1">Pose ta première question, un prof t'attend !</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("formulaire")}
                        className="mt-1 px-6 py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
                        style={{
                          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                        }}
                      >
                        Poser ma première question ✨
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {demandes.map((request) => (
                        <AssistanceRequestCard
                          key={request.id}
                          request={request}
                          onView={() => {}}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AssistanceEducativePage;