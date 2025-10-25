import { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ChallengeRewardCard from "@/components/challenges/ChallengeRewardCard";
import RewardClaimModal from "@/components/challenges/RewardClaimModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getChallengesRewards, 
  getSelectedChallenge,
  selectChallenge,
  claimReward,
  getUserChallengeData 
} from "@/data/challenges-rewards";
import { useToast } from "@/hooks/use-toast";
import { Trophy } from "lucide-react";

const ChallengesRewardsPage = () => {
  const challenges = getChallengesRewards();
  const userChallengeData = getUserChallengeData();
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    userChallengeData.selectedChallengeId
  );
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [claimedChallenge, setClaimedChallenge] = useState<any>(null);
  const { toast } = useToast();

  const handleSelectChallenge = (challengeId: string) => {
    selectChallenge(challengeId);
    setSelectedChallengeId(challengeId);
    
    toast({
      title: "Objectif sélectionné !",
      description: "Ton défi est maintenant actif. Bonne chance ! 🎯",
    });
  };

  const handleClaimReward = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      claimReward(challengeId);
      setClaimedChallenge(challenge);
      setRewardModalOpen(true);
    }
  };

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection 
          title="Challenges & Récompenses"
          subtitle="Fixe-toi des objectifs, relève des défis et gagne des récompenses motivantes ! 🏆"
          backgroundPattern={true}
        />
        
        <div className="container mx-auto px-4 py-12">
          {/* Challenge sélectionné */}
          {selectedChallengeId && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-6 w-6 text-amber-500" />
                <h2 className="text-2xl font-bold">Mon objectif actuel</h2>
              </div>
              <div className="max-w-2xl">
                <ChallengeRewardCard
                  challenge={challenges.find(c => c.id === selectedChallengeId)!}
                  isSelected={true}
                  onClaim={handleClaimReward}
                  isClaimed={userChallengeData.claimedRewards.includes(selectedChallengeId)}
                />
              </div>
            </div>
          )}

          {/* Liste des challenges */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full max-w-md mb-8">
              <TabsTrigger value="active" className="flex-1">
                Défis disponibles ({activeChallenges.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                Complétés ({completedChallenges.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeChallenges.map(challenge => (
                  <ChallengeRewardCard
                    key={challenge.id}
                    challenge={challenge}
                    isSelected={challenge.id === selectedChallengeId}
                    onSelect={handleSelectChallenge}
                  />
                ))}
              </div>
              {activeChallenges.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Tous les défis ont été complétés ! 🎉
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedChallenges.map(challenge => (
                  <ChallengeRewardCard
                    key={challenge.id}
                    challenge={challenge}
                    onClaim={handleClaimReward}
                    isClaimed={userChallengeData.claimedRewards.includes(challenge.id)}
                  />
                ))}
              </div>
              {completedChallenges.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Aucun défi complété pour le moment. Continue tes efforts ! 💪
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />

      {/* Modal de récompense */}
      {claimedChallenge && (
        <RewardClaimModal
          isOpen={rewardModalOpen}
          onClose={() => {
            setRewardModalOpen(false);
            setClaimedChallenge(null);
          }}
          rewardName={claimedChallenge.reward.name}
          challengeTitle={claimedChallenge.title}
        />
      )}
    </div>
  );
};

export default ChallengesRewardsPage;
