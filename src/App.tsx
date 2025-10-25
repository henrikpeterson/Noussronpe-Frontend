
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TrainingSpacePage from "./pages/TrainingSpacePage";
import AssistanceEducativePage from "./pages/AssistanceEducativePage";
import TeacherAssistancePage from "./pages/TeacherAssistancePage";
import ExamDetailPage from "./pages/ExamDetailPage";
import RevisionPage from "./pages/RevisionPage";
import ChapterDetailPage from "./pages/ChapterDetailPage";
import ProgressPage from "./pages/ProgressPage";
import ClassChaptersPage from "./pages/ClassChaptersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CourseAnalysisPage from "./pages/CourseAnalysisPage";
import ChooseFriendPage from "./pages/ChooseFriendPage";
import LaunchChallengePage from "./pages/LaunchChallengePage";
import ActiveChallengePage from "./pages/ActiveChallengePage";
import ChallengeResultPage from "./pages/ChallengeResultPage";
import ReceivedChallengesPage from "./pages/ReceivedChallengesPage";
import ProfilePage from "./pages/ProfilePage";
import ChallengesRewardsPage from "./pages/ChallengesRewardsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/course-analysis" element={<CourseAnalysisPage />} />
          <Route path="/espace-entrainement" element={<TrainingSpacePage />} />
          <Route path="/epreuves/:id" element={<ExamDetailPage />} />
          <Route path="/revision" element={<RevisionPage />} />
          <Route path="/revision/classe/:level" element={<ClassChaptersPage />} />
          <Route path="/revision/:subject/:id" element={<ChapterDetailPage />} />
          <Route path="/progression" element={<ProgressPage />} />
          <Route path="/defi/amis" element={<ChooseFriendPage />} />
          <Route path="/defi/lancer/:friendId" element={<LaunchChallengePage />} />
          <Route path="/defi/actif/:challengeId" element={<ActiveChallengePage />} />
          <Route path="/defi/resultat/:challengeId" element={<ChallengeResultPage />} />
          <Route path="/defi/recus" element={<ReceivedChallengesPage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/challenges-recompenses" element={<ChallengesRewardsPage />} />
          <Route path="/assistance-educative" element={<AssistanceEducativePage />} />
          <Route path="/espace-enseignant" element={<TeacherAssistancePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
