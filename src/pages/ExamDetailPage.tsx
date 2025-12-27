import { useParams } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { exams } from "@/data/exams";
import { subjects } from "@/data/subjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Clock, Download, FileText, Play, School, Eye, Loader2 } from "lucide-react";
import ExamTraining from "@/components/training/ExamTraining";
import { useTokenConsumption } from "@/hooks/useTokenConsumption";
import TokenConsumptionModal from "@/components/tokens/TokenConsumptionModal";
import TokenPacksModal from "@/components/tokens/TokenPacksModal";
import { useEpreuveDetails } from "@/hooks/useTrainingData";

const ExamDetailPage = () => {
  const {id} = useParams<{id: string}>(); 
  const { epreuve, loading, error } = useEpreuveDetails(Number(id));

  //const exam = exams.find(e => e.id === id);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const totalPages = 4;
  const {
    tokens,
    showConsumptionModal,
    showPacksModal,
    pendingConsumption,
    requestTokenConsumption,
    confirmConsumption,
    cancelConsumption,
    closePacksModal,
  } = useTokenConsumption();

  // ✅ GESTION DU CHARGEMENT ET DES ERREURS EN PREMIER
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg">Chargement de l'épreuve...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Erreur</h1>
            <p className="mb-6">{error}</p>
            <Button asChild>
              <a href="/training">Retour à l'espace d'entraînement</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  
  if (!epreuve || !epreuve.id) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Épreuve non trouvée</h1>
            <p className="mb-6">L'épreuve que vous recherchez n'existe pas.</p>
            <Button asChild>
              <a href="/epreuves">Retour aux épreuves</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>;
  }
  if (isTrainingMode) {
    return <ExamTraining epreuveId={epreuve.id} onExit={() => setIsTrainingMode(false)} />;
  }

  // URL du PDF pour l'aperçu (URL d'exemple)
  const pdfUrl = `http://192.168.1.76:8000/api/TrainingAndEvaluation/epreuve/${epreuve.id}/pdf/`;
  
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="h-64 bg-cover bg-center relative" style={{
        backgroundImage: "url(https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)"
      }}>
          <div className="absolute inset-0 bg-black/50 flex items-end">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-afrique-jaune hover:bg-afrique-jaune/80">{epreuve.classe.nom}</Badge>
                <Badge variant="outline" className="text-white border-white">{epreuve.type_epreuve}</Badge>
                <Badge variant="outline" className="text-white border-white">{epreuve.annee}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-white">{epreuve.titre}</h1>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">À propos de cette épreuve</h2>
                  <p className="text-gray-700 mb-6">{epreuve.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-afrique-orange" />
                      <div>
                        <p className="text-sm text-gray-500">Durée</p>
                        <p className="font-medium">{epreuve.duree} minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <School className="h-5 w-5 text-afrique-orange" />
                      <div>
                        <p className="text-sm text-gray-500">École</p>
                        <p className="font-medium">{epreuve.ecole}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-afrique-orange" />
                      <div>
                        <p className="text-sm text-gray-500">Matière</p>
                        <p className="font-medium">{epreuve.matiere.nom}</p>
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => requestTokenConsumption(2, "Cette épreuve complète", () => setShowPreview(!showPreview))} 
                      variant="outline" 
                      className="flex-1 gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {showPreview ? "Masquer l'aperçu" : "Aperçu de l'épreuve (2 jetons)"}
                    </Button>
                    <Button 
                      onClick={() => requestTokenConsumption(1, "Ce mode entraînement", () => setIsTrainingMode(true))} 
                      className="bg-afrique-orange hover:bg-afrique-orange/90 flex-1 gap-2 bg-blue-500 hover:bg-blue-400 font-bold text-zinc-950"
                    >
                      <Play className="h-4 w-4" />
                      S'exercer en mode entraînement (1 jeton)
                    </Button>
                    <Button 
                      onClick={() => requestTokenConsumption(2, "Ce téléchargement", () => {
                        // Handle download logic here
                        console.log("Downloading PDF...");
                      })} 
                      variant="outline" 
                      className="flex-1 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger l'épreuve (2 jetons)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Section d'aperçu PDF */}
              {showPreview && <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">Aperçu de l'épreuve</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          Page {currentPage} sur {totalPages}
                        </span>
                      </div>
                    </div>
                    
                    {/* Iframe pour le PDF */}
                    <div className="border rounded-lg overflow-hidden mb-4">
                      <iframe src={pdfUrl} 
                      width="100%" height="600" className="border-0" title="Aperçu de l'épreuve" />
                    </div>
                    
                    {/* Pagination */}
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                        </PaginationItem>
                        
                        {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return <PaginationItem key={page}>
                              <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer">
                                {page}
                              </PaginationLink>
                            </PaginationItem>;
                    })}
                        
                        <PaginationItem>
                          <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </CardContent>
                </Card>}
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Chapitres liés</h3>
                  <div className="space-y-4">
                    <a href="/revision/math/math-3eme-pythagore" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium">Le théorème de Pythagore</h4>
                      <p className="text-sm text-gray-500 mt-1">Réviser ce chapitre</p>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          {/* Barre de navigation */}
          <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowPreview(false)}
                className="text-white"
              >
                ✕ Fermer
              </Button>
              <span className="text-sm">
                Page {currentPage} / {totalPages}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="text-white"
              >
                ◀
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="text-white"
              >
                ▶
              </Button>
              <Button variant="ghost" className="text-white">
                <Download className="h-4 w-4 mr-1" /> Télécharger
              </Button>
            </div>
          </div>

          {/* Zone PDF */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="Aperçu de l'épreuve"
            />
          </div>
        </div>
      )}


      {/* Token Modals */}
      <TokenConsumptionModal
        isOpen={showConsumptionModal}
        onClose={cancelConsumption}
        onConfirm={confirmConsumption}
        cost={pendingConsumption?.cost || 0}
        description={pendingConsumption?.description || ""}
        currentBalance={tokens.balance}
      />
      
      <TokenPacksModal
        isOpen={showPacksModal}
        onClose={closePacksModal}
      />
    </div>;
};
export default ExamDetailPage;