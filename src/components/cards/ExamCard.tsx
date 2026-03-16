import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, School, Eye, Play, Loader2, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useTokenConsumption } from "@/hooks/useTokenConsumption";
import TokenConsumptionModal from "@/components/tokens/TokenConsumptionModal";
import TokenPacksModal from "@/components/tokens/TokenPacksModal";
import ExamTraining from "@/components/training/ExamTraining";

interface ExamCardProps {
  exam: {
    id: number;
    titre: string;
    description?: string;
    type_epreuve: string;
    annee: number;
    classe: { id: number; nom: string };
    matiere: { id: number; nom: string };
    pdf: string;
    image_url?: string;
    duree: number;
    ecole: string;
  }
}

export default function ExamCard({ exam }: ExamCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(true);

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

  const pdfUrl = `http://192.168.1.69:8000/api/TrainingAndEvaluation/epreuve/${exam.id}/pdf/`;

  // ✅ SI LE MODE ENTRAÎNEMENT EST ACTIVÉ : 
  // On affiche le composant en "Overlay" (plein écran par-dessus tout)
  if (isTrainingMode) {
  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto overflow-x-hidden">
      
      <ExamTraining epreuveId={exam.id} onExit={() => setIsTrainingMode(false)} />
    </div>
  );
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col rounded-[1.5rem] border-slate-200 bg-white">
        <div 
          className="h-32 bg-cover bg-center relative" 
          style={{ backgroundImage: exam.image_url ? `url(${exam.image_url})` : "url(https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&w=400&q=80)" }}
        >
          <div className="absolute top-2 left-2 flex gap-1 font-bold">
            <Badge className="bg-sky-500 text-[12px] h-9">{exam.classe.nom}</Badge>
            <Badge variant="outline" className="bg-white/90 text-[15px] h-9 font-bold text-slate-700">{exam.annee}</Badge>
          </div>
        </div>

        <CardContent className="p-5 flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">{exam.titre}</h3>
          <div className="space-y-1.5 mb-3 text-sm text-gray-500">
            <div className="flex items-center"><Clock className="h-4 w-4 mr-1 text-sky-500" />{exam.duree} min</div>
            <div className="flex items-center"><School className="h-4 w-4 mr-1 text-sky-500" /><span className="truncate">{exam.ecole}</span></div>
          </div>
        </CardContent>

        <div className="p-4 pt-0 grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => requestTokenConsumption(2, "consulter l'aperçu", () => setShowPreview(true))}
            className="rounded-xl font-bold text-sm h-12"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" /> LIRE LE SUJET 
          </Button>

          <Button 
            size="sm"
            onClick={() => requestTokenConsumption(1, "accéder au mode entraînement", () => setIsTrainingMode(true))}
            className="rounded-xl font-bold text-sm h-12 bg-primary text-white"
          >
            <Play className="h-3.5 w-3.5 mr-1.5 fill-current" /> TRAITER LE SUJET 
          </Button>
        </div>
      </Card>

      {/* MODALE APERÇU PDF */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 flex flex-col rounded-2xl overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <DialogTitle className="text-sm font-bold truncate">{exam.titre}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="flex-grow bg-slate-50 relative">
            {isPdfLoading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            <iframe src={pdfUrl} className="w-full h-full border-none" onLoad={() => setIsPdfLoading(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <TokenConsumptionModal
        isOpen={showConsumptionModal}
        onClose={cancelConsumption}
        onConfirm={confirmConsumption}
        cost={pendingConsumption?.cost || 0}
        description={pendingConsumption?.description || ""}
        currentBalance={tokens.balance}
      />
      
      <TokenPacksModal isOpen={showPacksModal} onClose={closePacksModal} />
    </>
  );
}