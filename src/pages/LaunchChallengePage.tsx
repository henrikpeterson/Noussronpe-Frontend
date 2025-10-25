import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { friends, challengeTypes } from "@/data/friends";
import { subjects } from "@/data/subjects";
import { addChallenge } from "@/data/challenges";
import { chapters } from "@/data/chapters";
import { exams } from "@/data/exams";
import { Swords, ArrowLeft } from "lucide-react";
import challengeImage from "@/assets/challenge-competition.jpg";
import { useToast } from "@/hooks/use-toast";
import { useTokenConsumption } from "@/hooks/useTokenConsumption";
import TokenConsumptionModal from "@/components/tokens/TokenConsumptionModal";
import TokenPacksModal from "@/components/tokens/TokenPacksModal";

const levels = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"];

export default function LaunchChallengePage() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
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
  
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedChallengeType, setSelectedChallengeType] = useState("");
  const [challengeMode, setChallengeMode] = useState(""); // "chapter" ou "exam"
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  const friend = friends.find(f => f.id === friendId);

  if (!friend) {
    return <div>Ami non trouvé</div>;
  }

  const handleLaunchChallenge = () => {
    if (!selectedSubject || !selectedLevel || !selectedChallengeType || !challengeMode || 
        (challengeMode === "chapter" && !selectedChapter) || 
        (challengeMode === "exam" && !selectedExam)) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Demander la consommation de 4 jetons
    requestTokenConsumption(4, "Lancer un défi", () => {
      // Ajouter le défi à la file d'attente
      const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
      const selectedChallengeTypeData = challengeTypes.find(ct => ct.id === selectedChallengeType);
      
      const newChallenge = addChallenge({
        from: "Vous", // Dans une vraie app, ce serait l'utilisateur connecté
        to: friend.name,
        subject: selectedSubjectData?.name || selectedSubject,
        level: selectedLevel,
        type: selectedChallengeTypeData?.name || selectedChallengeType,
        message: `Prêt(e) pour un défi en ${selectedSubjectData?.name} ?`
      });

      toast({
        title: "Défi lancé !",
        description: `Le défi commence maintenant !`,
      });

      // Rediriger vers la page du défi actif
      navigate(`/defi/actif/${newChallenge.id}`);
    });
  };

  const selectedChallengeTypeData = challengeTypes.find(ct => ct.id === selectedChallengeType);
  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  
  // Filtrer les chapitres et examens selon la matière et le niveau sélectionnés
  const availableChapters = chapters.filter(chapter => 
    chapter.subject === selectedSubject && chapter.level === selectedLevel
  );
  const availableExams = exams.filter(exam => 
    exam.subject === selectedSubject && exam.level === selectedLevel
  );
  
  const selectedChapterData = chapters.find(c => c.id === selectedChapter);
  const selectedExamData = exams.find(e => e.id === selectedExam);

  return (
    <div className="min-h-screen bg-gradient-to-br from-afrique-vert/5 via-white to-afrique-orange/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/defi/amis")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        {/* Hero Section */}
        <div className="relative mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-afrique-rouge to-afrique-orange p-8 text-white">
          <div className="absolute inset-0 opacity-20">
            <img 
              src={challengeImage} 
              alt="Lancer un défi" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Swords className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Lancer un défi</h1>
            </div>
            <p className="text-xl opacity-90">
              Configurez votre défi et défiez votre ami !
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de défi */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="h-5 w-5" />
                  Configuration du défi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Matière */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Matière *
                  </label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez une matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          <div className="flex items-center gap-2">
                            <span>{subject.icon}</span>
                            {subject.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Niveau scolaire */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Niveau scolaire *
                  </label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mode de défi */}
                {selectedSubject && selectedLevel && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Mode de défi *
                    </label>
                    <Select value={challengeMode} onValueChange={setChallengeMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez le mode de défi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chapter">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Défi sur un chapitre</span>
                            <span className="text-xs text-muted-foreground">
                              Quiz basé sur un chapitre spécifique
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="exam">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Défi sur une épreuve</span>
                            <span className="text-xs text-muted-foreground">
                              Défi basé sur une épreuve complète
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Sélection du chapitre */}
                {challengeMode === "chapter" && availableChapters.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Chapitre *
                    </label>
                    <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez un chapitre" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableChapters.map(chapter => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{chapter.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {chapter.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Sélection de l'épreuve */}
                {challengeMode === "exam" && availableExams.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Épreuve *
                    </label>
                    <Select value={selectedExam} onValueChange={setSelectedExam}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez une épreuve" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableExams.map(exam => (
                          <SelectItem key={exam.id} value={exam.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{exam.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {exam.school} - {exam.year} ({exam.type})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Message si aucun contenu disponible */}
                {challengeMode === "chapter" && availableChapters.length === 0 && (
                  <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-md">
                    Aucun chapitre disponible pour cette matière et ce niveau.
                  </div>
                )}

                {challengeMode === "exam" && availableExams.length === 0 && (
                  <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-md">
                    Aucune épreuve disponible pour cette matière et ce niveau.
                  </div>
                )}

                {/* Type de défi */}
                {challengeMode && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Type de défi *
                    </label>
                    <Select value={selectedChallengeType} onValueChange={setSelectedChallengeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez un type de défi" />
                      </SelectTrigger>
                      <SelectContent>
                        {challengeTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{type.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {type.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button 
                  onClick={handleLaunchChallenge}
                  className="w-full bg-gradient-to-r from-afrique-rouge to-afrique-orange hover:from-afrique-rouge/90 hover:to-afrique-orange/90"
                  size="lg"
                >
                  <Swords className="h-5 w-5 mr-2" />
                  Lancer le défi !
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Carte de l'ami */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Votre adversaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                        {friend.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                        friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {friend.name}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      {friend.class}
                    </Badge>
                  </div>

                  {friend.status === 'offline' && friend.lastSeen && (
                    <p className="text-sm text-muted-foreground">
                      {friend.lastSeen}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Résumé du défi */}
            {(selectedSubject || selectedLevel || selectedChallengeType || challengeMode) && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Résumé du défi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedSubjectData && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Matière:</span>
                      <Badge variant="outline">
                        {selectedSubjectData.icon} {selectedSubjectData.name}
                      </Badge>
                    </div>
                  )}
                  
                  {selectedLevel && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Niveau:</span>
                      <Badge variant="outline">{selectedLevel}</Badge>
                    </div>
                  )}

                  {challengeMode && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Mode:</span>
                      <Badge variant="outline">
                        {challengeMode === "chapter" ? "Chapitre" : "Épreuve"}
                      </Badge>
                    </div>
                  )}

                  {selectedChapterData && (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Chapitre:</span>
                      <Badge variant="outline" className="self-start">
                        {selectedChapterData.title}
                      </Badge>
                    </div>
                  )}

                  {selectedExamData && (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Épreuve:</span>
                      <Badge variant="outline" className="self-start">
                        {selectedExamData.title}
                      </Badge>
                    </div>
                  )}
                  
                  {selectedChallengeTypeData && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Type:</span>
                      <Badge variant="outline">{selectedChallengeTypeData.name}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Modales de jetons */}
      <TokenConsumptionModal
        isOpen={showConsumptionModal}
        onClose={cancelConsumption}
        onConfirm={confirmConsumption}
        cost={pendingConsumption?.cost || 0}
        description={pendingConsumption?.description || ''}
        currentBalance={tokens.balance}
      />
      
      <TokenPacksModal
        isOpen={showPacksModal}
        onClose={closePacksModal}
      />
    </div>
  );
}