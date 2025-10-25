
import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import PDFUploader from "@/components/upload/PDFUploader";
import AnalysisActions from "@/components/analysis/AnalysisActions";
import SummaryDisplay from "@/components/results/SummaryDisplay";
import QuizDisplay from "@/components/results/QuizDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CourseAnalysisPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileAnalysis, setFileAnalysis] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'upload' | 'actions' | 'summary' | 'quiz'>('upload');
  const [generatedSummary, setGeneratedSummary] = useState<any>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);

  const handleFileUploaded = (file: File, analysis: any) => {
    setUploadedFile(file);
    setFileAnalysis(analysis);
    setCurrentView('actions');
  };

  const handleGenerateSummary = () => {
    // Simulation de génération de résumé
    const mockSummary = {
      title: fileAnalysis.title,
      mainPoints: [
        "Introduction aux concepts fondamentaux du sujet étudié",
        "Développement des théories principales et de leurs applications",
        "Analyse des cas pratiques et exemples concrets",
        "Mise en perspective avec les enjeux contemporains",
        "Synthèse des apprentissages clés et recommandations"
      ],
      keyTerms: [
        { term: "Concept clé 1", definition: "Définition détaillée du premier concept important" },
        { term: "Théorie principale", definition: "Explication de la théorie centrale du cours" },
        { term: "Méthodologie", definition: "Approche méthodologique utilisée dans le domaine" }
      ],
      conclusion: "Ce cours propose une approche complète et structurée du sujet, permettant une compréhension approfondie des enjeux et des applications pratiques."
    };
    
    setGeneratedSummary(mockSummary);
    setCurrentView('summary');
  };

  const handleGenerateQuiz = () => {
    // Simulation de génération de quiz
    const mockQuiz = [
      {
        id: 1,
        type: 'mcq' as const,
        question: "Quel est le concept principal abordé dans ce cours ?",
        options: ["Concept A", "Concept B", "Concept C", "Concept D"],
        correctAnswer: "Concept B",
        explanation: "Le concept B est effectivement le thème central développé tout au long du cours."
      },
      {
        id: 2,
        type: 'boolean' as const,
        question: "La théorie principale présentée est-elle applicable dans tous les contextes ?",
        correctAnswer: "Faux",
        explanation: "Cette théorie a des limites et ne s'applique que dans certains contextes spécifiques."
      },
      {
        id: 3,
        type: 'mcq' as const,
        question: "Quelle méthodologie est recommandée pour l'application pratique ?",
        options: ["Méthode quantitative", "Méthode qualitative", "Approche mixte", "Aucune méthode spécifique"],
        correctAnswer: "Approche mixte",
        explanation: "L'approche mixte combine les avantages des méthodes quantitatives et qualitatives."
      }
    ];
    
    setGeneratedQuiz(mockQuiz);
    setCurrentView('quiz');
  };

  const resetToActions = () => {
    setCurrentView('actions');
    setGeneratedSummary(null);
    setGeneratedQuiz(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Analyse de cours PDF</h1>
            <p className="text-gray-600">Transformez vos documents en outils d'apprentissage interactifs</p>
          </div>

          {currentView === 'upload' && (
            <PDFUploader onFileUploaded={handleFileUploaded} />
          )}

          {currentView === 'actions' && fileAnalysis && (
            <>
              <div className="mb-6 text-center">
                <Button variant="outline" onClick={() => setCurrentView('upload')}>
                  Changer de fichier
                </Button>
              </div>
              <AnalysisActions
                fileAnalysis={fileAnalysis}
                onGenerateSummary={handleGenerateSummary}
                onGenerateQuiz={handleGenerateQuiz}
              />
            </>
          )}

          {currentView === 'summary' && generatedSummary && (
            <>
              <div className="mb-6 text-center">
                <Button variant="outline" onClick={resetToActions}>
                  Retour aux options
                </Button>
              </div>
              <SummaryDisplay summary={generatedSummary} />
            </>
          )}

          {currentView === 'quiz' && generatedQuiz && (
            <>
              <div className="mb-6 text-center">
                <Button variant="outline" onClick={resetToActions}>
                  Retour aux options
                </Button>
              </div>
              <QuizDisplay questions={generatedQuiz} />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
