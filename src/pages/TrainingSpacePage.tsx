import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { subjects } from "@/data/subjects";
import ExamCard from "@/components/cards/ExamCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, Calculator, FileText, Globe, FlaskConical, Leaf, TrendingUp, Target, Coins, Loader2, AlertCircle, Icon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useTrainingData } from '@/hooks/useTrainingData';
import { trainingService} from '../api';
import { Alert, AlertDescription } from "@/components/ui/alert";

const icons = {
  book: Book,
  calculator: Calculator,
  file: FileText,
  globe: Globe,
  flask: FlaskConical,
  leaf: Leaf,
  languages: Globe,
  brain: Book,
};

// Mapping des matières avec des icônes (à adapter selon tes matières en BDD)
const matiereIconMap: Record<string, keyof typeof icons> = {
  "Mathématiques": "calculator",
  "Physique": "flask",
  "Chimie": "flask",
  "Physique Chimie": "flask",
  "SVT": "leaf",
  "Français": "book",
  "Anglais": "globe",
  "Histoire": "book",
  "Géographie": "globe",
  "Philosophie": "brain",
};

const TrainingSpacePage = () => {
  // UTILISATION DU HOOK POUR LES DONNÉES DYNAMIQUES
  const { 
    classes, 
    matieres, 
    typesEpreuve, 
    resourceCountsByMatiere,
    loading: loadingdata, 
    error: errorData,
  } = useTrainingData();


  const [selectedMatiereId, setSelectedMatiereId] = useState<number | null>(null);
  const [selectedClasseId, setSelectedClasseId] = useState<number | null>(null);
  const [selectedTypeEpreuve, setSelectedTypeEpreuve] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9

  // États pour les épreuves filtrées
  const [epreuves, setEpreuves] = useState<any[]>([]);
  const [loadingEpreuves, setLoadingEpreuves] = useState(false);
  const [errorEpreuves, setErrorEpreuves] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpreuves = async () =>{
      //Si aucune matière n'est sélectionnée, on ne charge rien
      if (selectedMatiereId === null) {
        setEpreuves([]);
        return;
      }
      try { 
        setLoadingEpreuves(true);
        setErrorEpreuves(null);

        const filters: {
          classe?: number;
          matiere?: number;
          type_epreuve?: string;
        } = {
          matiere: selectedMatiereId,
        };

        if (selectedClasseId !== null) { filters.classe = selectedClasseId ;}
        if (selectedTypeEpreuve !== null) {filters.type_epreuve = selectedTypeEpreuve;}

        const response = await trainingService.getEpreuvesFiltreees(filters);
        setEpreuves(response.epreuves);
        
      } catch (error) {
        setErrorEpreuves("Impossible de charger les épreuves");
        setEpreuves([]);
      } finally {
        setLoadingEpreuves(false);
      }
    };
    
    fetchEpreuves();
  }, [selectedMatiereId, selectedClasseId, selectedTypeEpreuve]);
  
  // Pagination
  const totalPages = Math.ceil(epreuves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEpreuves = epreuves.slice(startIndex, startIndex + itemsPerPage);

  /// === HANDLERS ===
  const handleMatiereChange = (matiereId: number | "all") => {
    setSelectedMatiereId(matiereId === "all" ? null : matiereId);
    setCurrentPage(1);
  };

  const handleClasseChange = (classeId: number | "all") => {
    setSelectedClasseId(classeId === "all" ? null : classeId);
    setCurrentPage(1);
  };

  const handleTypeEpreuveChange = (typeCode: string | "all") => {
    setSelectedTypeEpreuve(typeCode === "all" ? null : typeCode);
    setCurrentPage(1);
  };

   const resetFilters = () => {
    setSelectedClasseId(null);
    setSelectedTypeEpreuve(null);
    setCurrentPage(1);
  };

  // === CHARGEMENT INITIAL ===
  if (loadingdata) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground text-lg">Chargement des données...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // === ERREUR DE CHARGEMENT ===
  if (errorData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Erreur de chargement</p>
              <p>{errorData}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title="Espace d'Entraînement"
          subtitle="Choisis ta matière et ton niveau pour t'exercer, réviser et t'auto-évaluer."
          backgroundPattern={true}
        />
        
        <div className="container mx-auto px-4 py-12">
          {/* Barre d'action secondaire */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-end">
            <Button variant="outline" asChild className="gap-2">
              <Link to="/progression">
                <TrendingUp className="h-4 w-4" />
                Mes progrès
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/defi/amis">
                <Target className="h-4 w-4" />
                Mes défis
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/">
                <Coins className="h-4 w-4" />
                Recharger mes jetons
              </Link>
            </Button>
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {/* Filtre Matière */}
              <Select value={selectedMatiereId?.toString() || "all"} 
              onValueChange={(value) => handleMatiereChange(value === "all" ? "all" : parseInt(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Matière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les matières</SelectItem>
                  {matieres.map(matiere => (
                    <SelectItem key={matiere.id} value={matiere.id.toString()}>
                      {matiere.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtre Classe */}
              <Select value={selectedClasseId?.toString() || "all"} 
              onValueChange={(value) => handleClasseChange(value === "all" ? "all" : parseInt(value))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  {classes.map(classe => (
                    <SelectItem key={classe.id} value={classe.id.toString()}>
                      {classe.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTypeEpreuve || "all"} 
              onValueChange={(value) => handleTypeEpreuveChange(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type de ressources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les activités</SelectItem>
                  {typesEpreuve.map(type => ( 
                    <SelectItem key={type.code} value={type.code}>
                      {type.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vue "Toutes les matières" - Affiche les cartes de matières */}
          {selectedMatiereId === null ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Choisis ta matière</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {matieres.map(matiere => {
                  const iconKey = matiereIconMap[matiere.nom] || "book";
                  const Icon = icons[iconKey];
                  // Récupère le nombre d'épreuves pour cette matière
                  const resourceCount = resourceCountsByMatiere[matiere.id] || 0;
                  
                  return (
                    <Card 
                      key={matiere.id}
                      className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer border-2 group"
                      onClick={() => setSelectedMatiereId(matiere.id)}
                    >
                      <div className="h-1 bg-primary" />
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="p-4 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-7 w-7 text-primary"/>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground">{matiere.nom}</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-3">
                          {resourceCount} ressource{resourceCount > 1 ? 's' : ''} disponible{resourceCount > 1 ? 's' : ''}
                        </p>
                        <Button 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Voir les ressources
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Vue par matière - Affiche les ressources de cette matière */
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {matieres.find(m => m.id === selectedMatiereId)?.nom}
                  </h2>
                  <p className="text-muted-foreground">
                    {epreuves.length} ressource{epreuves.length > 1 ? 's' : ''} disponible{epreuves.length > 1 ? 's' : ''}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleMatiereChange("all")}
                >
                  Voir toutes les matières
                </Button>
              </div>

              {/* Affichage du chargement */}
              {loadingEpreuves ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Chargement des épreuves...</p>
                </div>
              ) : errorEpreuves ? (
                /* Erreur de chargement des épreuves */
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorEpreuves}</AlertDescription>
                </Alert>
              ) : epreuves.length === 0 ? (
                /* Aucune épreuve trouvée */
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    Aucune ressource disponible avec ces filtres.
                  </p>
                  {(selectedClasseId !== null || selectedTypeEpreuve !== null) && (
                    <Button 
                      variant="outline" 
                      onClick={resetFilters}
                    >
                      Réinitialiser les filtres
                    </Button>
                  )}
                </div>
              ) : (
                /* Liste des épreuves */
              
                <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedEpreuves.map((epreuve) => (
                  <ExamCard key={epreuve.id} exam={epreuve} />
                ))}
              </div>
                  
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrainingSpacePage;
