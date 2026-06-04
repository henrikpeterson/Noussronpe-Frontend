import { GAMES } from "@/newpages/data/Games";
import GamesCard from "./GamesCard";
import GamesHeader from "./GamesHeader";

/**
 * SUBJECT GRID - Grille verticale des matières
 * Cartes centrées empilées verticalement
 */

interface GamesGridProps {
  onSelectSubject : (gameId: string) => void;
}

const GamesGrid = ({ onSelectSubject }: GamesGridProps) => {
  return (
    <div className="pt-3 pb-8">
      
      {/* Header gradient */}
      <GamesHeader 
        title="Apprends en t'amusant"
        subtitle="Solidifie tes bases devellope ta concentration ainsi que ta culture generale avec nos jeux."
      />

      {/* Liste verticale des cartes */}
      <div className="space-y-8">
        {GAMES.map((game, index) => (
          <GamesCard
            key={game.id}
            game={game}
            index={index}
            onSelect={onSelectSubject}
          />
        ))}
      </div>

    </div>
  );
};

export default GamesGrid;