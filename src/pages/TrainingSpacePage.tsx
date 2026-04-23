import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Book, 
  Calculator, 
  FileText, 
  Globe, 
  FlaskConical, 
  Leaf, 
  Loader2, 
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Filter,
  X,
  Check,
  TrendingUp,
  Target,
  Coins,
  ChevronDown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTrainingData } from '@/hooks/useTrainingData';
import { trainingService } from '../api';
import { Alert, AlertDescription } from "@/components/ui/alert";
import ExamCard from "@/components/cards/ExamCard";
import { cn } from "@/lib/utils";

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

const gradients = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600", 
  "from-green-500 to-green-600",
  "from-orange-500 to-orange-600",
  "from-pink-500 to-pink-600",
  "from-teal-500 to-teal-600",
  "from-red-500 to-red-600",
  "from-indigo-500 to-indigo-600",
];

const TrainingSpacePage = () => {
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
  const itemsPerPage = 9;
  
  //variables useState qui servent uniquement à ouvrir ou fermer des fenêtres surgissantes
  const [showMatiereDialog, setShowMatiereDialog] = useState(false);
  const [showClasseDialog, setShowClasseDialog] = useState(false);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  
  //variable ou sont stockés les résultats qui arrivent de l'API (les exercices/épreuves)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [epreuves, setEpreuves] = useState<any[]>([]);

  const [loadingEpreuves, setLoadingEpreuves] = useState(false);
  const [errorEpreuves, setErrorEpreuves] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpreuves = async () => {
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

        if (selectedClasseId !== null) { filters.classe = selectedClasseId; }
        if (selectedTypeEpreuve !== null) { filters.type_epreuve = selectedTypeEpreuve; }

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
  
  const totalPages = Math.ceil(epreuves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEpreuves = epreuves.slice(startIndex, startIndex + itemsPerPage);

  const handleMatiereSelect = (matiereId: number) => {
    setSelectedMatiereId(matiereId);
    setCurrentPage(1);
    setShowMatiereDialog(false);
  };

  const handleClasseSelect = (classeId: number | null) => {
    setSelectedClasseId(classeId);
    setCurrentPage(1);
    setShowClasseDialog(false);
  };

  const handleTypeSelect = (typeCode: string | null) => {
    setSelectedTypeEpreuve(typeCode);
    setCurrentPage(1);
    setShowTypeDialog(false);
  };

  const resetFilters = () => {
    setSelectedMatiereId(null);
    setSelectedClasseId(null);
    setSelectedTypeEpreuve(null);
    setCurrentPage(1);
  };

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

  if (errorData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
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

  const activeFiltersCount = [
    selectedMatiereId !== null,
    selectedClasseId !== null,
    selectedTypeEpreuve !== null
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* En-tête de page + Actions rapides */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  Espace d'Entraînement
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Choisis tes filtres et accède à tes ressources
                </p>
              </div>
              
              {/* Actions rapides - Desktop */}
              <div className="hidden md:flex gap-2">
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <Link to="/progression">
                    <TrendingUp className="h-4 w-4" />
                    Mes progrès
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <Link to="/defi/amis">
                    <Target className="h-4 w-4" />
                    Mes défis
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <Link to="/">
                    <Coins className="h-4 w-4" />
                    Jetons
                  </Link>
                </Button>
              </div>
            </div>

            {/* Section Filtres - Design amélioré */}
            <div className="bg-muted/30 rounded-xl p-4 md:p-6 border border-border">
              {/* Header de la section filtres */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Filter className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base md:text-lg">Filtrer les ressources</h2>
                    <p className="text-xs text-muted-foreground">
                      {activeFiltersCount === 0 
                        ? "Aucun filtre actif" 
                        : `${activeFiltersCount} filtre${activeFiltersCount > 1 ? 's' : ''} actif${activeFiltersCount > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={resetFilters}
                    className="gap-1 text-xs md:text-sm"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Réinitialiser</span>
                  </Button>
                )}
              </div>

              {/* Boutons de filtres */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Filtre Matière */}
                <button
                  onClick={() => setShowMatiereDialog(true)}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all text-left group hover:shadow-md",
                    selectedMatiereId !== null
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 bg-background"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Book className={cn(
                          "h-4 w-4 shrink-0",
                          selectedMatiereId !== null ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Matière
                        </span>
                      </div>
                      <p className={cn(
                        "font-semibold text-sm md:text-base truncate",
                        selectedMatiereId !== null ? "text-primary" : "text-foreground"
                      )}>
                        {selectedMatiereId !== null 
                          ? matieres.find(m => m.id === selectedMatiereId)?.nom 
                          : "Toutes les matières"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedMatiereId !== null 
                          ? `${resourceCountsByMatiere[selectedMatiereId] || 0} ressources`
                          : `${matieres.length} disponibles`}
                      </p>
                    </div>
                    <div className={cn(
                      "p-1.5 rounded-full transition-colors shrink-0",
                      selectedMatiereId !== null 
                        ? "bg-primary/20" 
                        : "bg-muted group-hover:bg-primary/10"
                    )}>
                      {selectedMatiereId !== null ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Filtre Niveau */}
                <button
                  onClick={() => selectedMatiereId !== null && setShowClasseDialog(true)}
                  disabled={selectedMatiereId === null}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all text-left group hover:shadow-md",
                    selectedMatiereId === null && "opacity-50 cursor-not-allowed",
                    selectedClasseId !== null && selectedMatiereId !== null
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-sm"
                      : "border-border hover:border-blue-500/50 bg-background"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className={cn(
                          "h-4 w-4 shrink-0",
                          selectedClasseId !== null ? "text-blue-600" : "text-muted-foreground"
                        )} />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Niveau
                        </span>
                      </div>
                      <p className={cn(
                        "font-semibold text-sm md:text-base truncate",
                        selectedClasseId !== null ? "text-blue-600 dark:text-blue-400" : "text-foreground"
                      )}>
                        {selectedClasseId !== null 
                          ? classes.find(c => c.id === selectedClasseId)?.nom 
                          : "Tous les niveaux"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedMatiereId === null ? "Sélectionne une matière" : "Optionnel"}
                      </p>
                    </div>
                    <div className={cn(
                      "p-1.5 rounded-full transition-colors shrink-0",
                      selectedClasseId !== null 
                        ? "bg-blue-500/20" 
                        : "bg-muted group-hover:bg-blue-500/10"
                    )}>
                      {selectedClasseId !== null ? (
                        <Check className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Filtre Type */}
                <button
                  onClick={() => selectedMatiereId !== null && setShowTypeDialog(true)}
                  disabled={selectedMatiereId === null}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all text-left group hover:shadow-md",
                    selectedMatiereId === null && "opacity-50 cursor-not-allowed",
                    selectedTypeEpreuve !== null && selectedMatiereId !== null
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 shadow-sm"
                      : "border-border hover:border-purple-500/50 bg-background"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className={cn(
                          "h-4 w-4 shrink-0",
                          selectedTypeEpreuve !== null ? "text-purple-600" : "text-muted-foreground"
                        )} />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Type
                        </span>
                      </div>
                      <p className={cn(
                        "font-semibold text-sm md:text-base truncate",
                        selectedTypeEpreuve !== null ? "text-purple-600 dark:text-purple-400" : "text-foreground"
                      )}>
                        {selectedTypeEpreuve !== null 
                          ? typesEpreuve.find(t => t.code === selectedTypeEpreuve)?.libelle 
                          : "Tous les types"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedMatiereId === null ? "Sélectionne une matière" : "Optionnel"}
                      </p>
                    </div>
                    <div className={cn(
                      "p-1.5 rounded-full transition-colors shrink-0",
                      selectedTypeEpreuve !== null 
                        ? "bg-purple-500/20" 
                        : "bg-muted group-hover:bg-purple-500/10"
                    )}>
                      {selectedTypeEpreuve !== null ? (
                        <Check className="h-4 w-4 text-purple-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Tags filtres actifs */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-muted-foreground font-medium">Filtres actifs :</span>
                    
                    {selectedMatiereId !== null && (
                      <div className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium">
                        <span>{matieres.find(m => m.id === selectedMatiereId)?.nom}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMatiereId(null);
                          }}
                          className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    {selectedClasseId !== null && (
                      <div className="inline-flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                        <span>{classes.find(c => c.id === selectedClasseId)?.nom}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClasseId(null);
                          }}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    {selectedTypeEpreuve !== null && (
                      <div className="inline-flex items-center gap-1.5 bg-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                        <span>{typesEpreuve.find(t => t.code === selectedTypeEpreuve)?.libelle}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTypeEpreuve(null);
                          }}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions rapides - Mobile */}
            <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button variant="outline" size="sm" asChild className="gap-2 shrink-0">
                <Link to="/progression">
                  <TrendingUp className="h-4 w-4" />
                  Progrès
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-2 shrink-0">
                <Link to="/defi/amis">
                  <Target className="h-4 w-4" />
                  Défis
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-2 shrink-0">
                <Link to="/">
                  <Coins className="h-4 w-4" />
                  Jetons
                </Link>
              </Button>
            </div>
          </div>

          {/* Contenu principal */}
          {selectedMatiereId === null ? (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground">
                Toutes les matières
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {matieres.map((matiere, index) => {
                  const iconKey = matiereIconMap[matiere.nom] || "book";
                  const Icon = icons[iconKey];
                  const resourceCount = resourceCountsByMatiere[matiere.id] || 0;
                  const gradient = gradients[index % gradients.length];
                  
                  return (
                    <Card 
                      key={matiere.id}
                      className="border-0 overflow-hidden cursor-pointer group hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-2xl"
                      onClick={() => handleMatiereSelect(matiere.id)}
                    >
                      <div className={`bg-gradient-to-br ${gradient} p-4 md:p-6 text-white relative`}>
                        <div className="absolute top-2 right-2">
                          {resourceCount > 0 && (
                            <span className="bg-white/30 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full">
                              {resourceCount} 📄
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="p-3 md:p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                            <Icon className="h-6 w-6 md:h-8 md:w-8" />
                          </div>
                          <h3 className="font-bold text-sm md:text-xl text-center leading-tight">
                            {matiere.nom}
                          </h3>
                        </div>
                      </div>
                      
                      <CardContent className="p-3 md:p-4 bg-white dark:bg-gray-900">
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="text-muted-foreground">
                            {resourceCount} ressource{resourceCount > 1 ? 's' : ''}
                          </span>
                          <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform">
                            Voir →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {loadingEpreuves ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Chargement des épreuves...</p>
                </div>
              ) : errorEpreuves ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorEpreuves}</AlertDescription>
                </Alert>
              ) : epreuves.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="mb-6">
                    <div className="inline-block p-6 bg-primary/10 rounded-full">
                      <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">Aucune ressource trouvée 📚</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm md:text-base">
                    Essaie de modifier tes filtres pour trouver d'autres ressources.
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    {(selectedClasseId !== null || selectedTypeEpreuve !== null) && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedClasseId(null);
                          setSelectedTypeEpreuve(null);
                        }}
                      >
                        Enlever les filtres
                      </Button>
                    )}
                    <Button onClick={resetFilters}>
                      Voir toutes les matières
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                          
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) {
                              page = i + 1;
                            } else if (currentPage <= 3) {
                              page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              page = totalPages - 4 + i;
                            } else {
                              page = currentPage - 2 + i;
                            }
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
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

      {/* Dialog Matières */}
      <Dialog open={showMatiereDialog} onOpenChange={setShowMatiereDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl flex items-center gap-2">
              <Book className="h-6 w-6 text-primary" />
              Choisis ta matière
            </DialogTitle>
            <DialogDescription>
              Sélectionne la matière que tu veux réviser
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {matieres.map((matiere, index) => {
              const iconKey = matiereIconMap[matiere.nom] || "book";
              const Icon = icons[iconKey];
              const resourceCount = resourceCountsByMatiere[matiere.id] || 0;
              const gradient = gradients[index % gradients.length];
              const isSelected = selectedMatiereId === matiere.id;
              
              return (
                <button
                  key={matiere.id}
                  onClick={() => handleMatiereSelect(matiere.id)}
                  className={cn(
                    "relative overflow-hidden rounded-xl transition-all duration-200 text-left",
                    isSelected 
                      ? "ring-4 ring-primary ring-offset-2 scale-[0.98]" 
                      : "hover:scale-[1.02] hover:shadow-lg"
                  )}
                >
                  <div className={`bg-gradient-to-br ${gradient} p-4 text-white`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm md:text-base truncate">
                          {matiere.nom}
                        </h3>
                        <p className="text-xs text-white/80">
                          {resourceCount} ressource{resourceCount > 1 ? 's' : ''}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="p-1.5 bg-white rounded-full shrink-0">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Niveaux */}
      <Dialog open={showClasseDialog} onOpenChange={setShowClasseDialog}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Choisis ton niveau
            </DialogTitle>
            <DialogDescription>
              Filtre les ressources par classe
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 mt-4">
            <button
              onClick={() => handleClasseSelect(null)}
              className={cn(
                "w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between",
                selectedClasseId === null
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 font-semibold"
                  : "border-border hover:border-blue-500/50 hover:bg-accent"
              )}
            >
              <span>Tous les niveaux</span>
              {selectedClasseId === null && (
                <Check className="h-5 w-5 text-blue-600" />
              )}
            </button>
            
            {classes.map((classe) => {
              const isSelected = selectedClasseId === classe.id;
              return (
                <button
                  key={classe.id}
                  onClick={() => handleClasseSelect(classe.id)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between",
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 font-semibold"
                      : "border-border hover:border-blue-500/50 hover:bg-accent"
                  )}
                >
                  <span>{classe.nom}</span>
                  {isSelected && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Types */}
      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-600" />
              Type d'activité
            </DialogTitle>
            <DialogDescription>
              Filtre par type de ressource
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 mt-4">
            <button
              onClick={() => handleTypeSelect(null)}
              className={cn(
                "w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between",
                selectedTypeEpreuve === null
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 font-semibold"
                  : "border-border hover:border-purple-500/50 hover:bg-accent"
              )}
            >
              <span>Tous les types</span>
              {selectedTypeEpreuve === null && (
                <Check className="h-5 w-5 text-purple-600" />
              )}
            </button>
            
            {typesEpreuve.map((type) => {
              const isSelected = selectedTypeEpreuve === type.code;
              return (
                <button
                  key={type.code}
                  onClick={() => handleTypeSelect(type.code)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between",
                    isSelected
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 font-semibold"
                      : "border-border hover:border-purple-500/50 hover:bg-accent"
                  )}
                >
                  <span>{type.libelle}</span>
                  {isSelected && (
                    <Check className="h-5 w-5 text-purple-600" />
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* CSS custom */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TrainingSpacePage;