
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-afrique-orange/20 mb-6">
          <BookOpen className="h-10 w-10 text-afrique-orange" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page non trouvée</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Nous ne trouvons pas la page que vous recherchez. Peut-être qu'elle a été déplacée ou supprimée.
        </p>
        
        <Button asChild size="lg" className="bg-afrique-orange hover:bg-afrique-orange/90">
          <Link to="/">Retourner à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
