import { useParams } from "react-router-dom";
import { getTextBuilderLevel } from "@/games/Link-Learn/data/textBuilderLevels";
import TextBuilderPage from "./TextBuilderPage";
import FillGapsPage from "./FillGapsPage";

export default function TextBuilderGameWrapper() {
  const { levelId } = useParams();
  const id = parseInt(levelId || "1");
  const level = getTextBuilderLevel(id);

  // Si le niveau n'existe pas
  if (!level) {
    return (
      <div className="h-[100dvh] bg-background flex items-center justify-center">
        <p className="font-display text-xl text-foreground">Niveau introuvable</p>
      </div>
    );
  }

  // Charger le bon composant selon le mode
  if (level.mode === "fill-gaps") {
    return <FillGapsPage />;
  }

  // Par défaut : text-builder
  return <TextBuilderPage />;
}