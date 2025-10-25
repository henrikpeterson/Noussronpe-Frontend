
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-xl mb-4">EduAfrique</h3>
            <p className="text-primary-foreground/80">
              Plateforme éducative numérique dédiée aux élèves et écoles en Afrique francophone.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Liens utiles</h4>
            <ul className="space-y-2">
              <li><Link to="/a-propos" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact</Link></li>
              <li><Link to="/ecoles" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Espace écoles</Link></li>
              <li><Link to="/faq" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Nous suivre</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Facebook</a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Twitter</a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/30 pt-6 mt-6 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} EduAfrique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
