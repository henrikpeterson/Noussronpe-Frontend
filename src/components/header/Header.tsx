import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChallengeNotification } from "@/components/challenge/ChallengeNotification";
import TokenRechargeModal from "@/components/tokens/TokenRechargeModal";
import { getUserTokens } from "@/data/tokens";
import { BookOpen, Menu, X, LogIn, UserPlus, Coins, LogOut, User } from "lucide-react";

export default function Header() {
  // ==================== ÉTATS ====================
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(getUserTokens().balance);
  const navigate = useNavigate();

  // ==================== EFFETS ====================
  useEffect(() => {
    checkAuthStatus();
    
    const handleTokenUpdate = () => {
      setTokenBalance(getUserTokens().balance);
    };
    
    const handleOpenTokenRecharge = () => {
      setIsTokenModalOpen(true);
    };

    window.addEventListener('tokensUpdated', handleTokenUpdate);
    window.addEventListener('openTokenRecharge', handleOpenTokenRecharge);
    
    return () => {
      window.removeEventListener('tokensUpdated', handleTokenUpdate);
      window.removeEventListener('openTokenRecharge', handleOpenTokenRecharge);
    };
  }, []);

  // ==================== FONCTIONS ====================
  const checkAuthStatus = () => {
    const token = localStorage.getItem('students_access_token') || sessionStorage.getItem('students_access_token');
    const user = localStorage.getItem('students_user') || sessionStorage.getItem('students_user');
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        setUserData(JSON.parse(user));
      } catch (error) {
        console.error("Erreur lecture données utilisateur:", error);
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('students_access_token');
    localStorage.removeItem('students_refresh_token');
    localStorage.removeItem('students_user');
    sessionStorage.removeItem('students_access_token');
    sessionStorage.removeItem('students_refresh_token');
    sessionStorage.removeItem('students_user');
    
    setIsLoggedIn(false);
    setUserData(null);
    setIsMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const getUserInitials = () => {
    if (!userData) return "US";
    const { Prenom, Nom } = userData;
    if (Prenom && Nom) {
      return `${Prenom.charAt(0)}${Nom.charAt(0)}`.toUpperCase();
    }
    return "US";
  };

  const getFullName = () => {
    if (!userData) return "Utilisateur";
    const { Prenom, Nom } = userData;
    if (Prenom && Nom) {
      return `${Prenom} ${Nom}`;
    }
    return "Utilisateur";
  };

  const handleTokenSuccess = (tokensAdded: number) => {
    setTokenBalance(getUserTokens().balance);
    window.dispatchEvent(new CustomEvent('tokensUpdated'));
  };

  // ==================== RENDU VISUEL ====================
  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground border-b shadow-sm">
      
      {/* BARRE PRINCIPALE */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/Logo_Noussronpe-cropped.svg" alt="Noussronpe" className="h-12 w-100 text-white"/>
        </Link>

        {/* Menu hamburger mobile */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/espace-entrainement" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            Espace d'Entraînement
          </Link>
          <Link to="/revision" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            Révision
          </Link>
          <Link to="/progression" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            Ma progression
          </Link>
          
          {/* SUPPRIMÉ: Le bouton recharge a été retiré d'ici pour éviter le doublon */}
          <ChallengeNotification />
        </nav>

        {/* PARTIE DROITE DU HEADER (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4">
          
          {!isLoggedIn ? (
            // UTILISATEUR DÉCONNECTÉ
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="text-primary-foreground/80 hover:text-primary-foreground">
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Link>
              </Button>
              
              <Button asChild className="bg-afrique-orange hover:bg-afrique-orange/90">
                <Link to="/register" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Inscription
                </Link>
              </Button>
            </div>
          ) : (
            // UTILISATEUR CONNECTÉ
            <div className="flex items-center gap-4">
              
              {/* BOUTON RECHARGE JETONS (UNIQUEMENT ICI POUR ÉVITER LE DOUBLON) */}
              <Button 
                variant="ghost" 
                onClick={() => setIsTokenModalOpen(true)}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors flex items-center gap-2"
              >
                <Coins className="h-4 w-4" />
                <span className="hidden lg:inline">Recharger</span>
                <span className="bg-afrique-orange text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {tokenBalance}
                </span>
              </Button>
              
              {/* PROFIL UTILISATEUR */}
              <div className="flex items-center gap-3">
                <Link to="/profil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-afrique-bleu text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {getFullName()}
                  </span>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MENU MOBILE */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary py-4 px-6 shadow-md animate-fade-in">
          <nav className="flex flex-col space-y-4">
            
            <Link 
              to="/espace-entrainement" 
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors py-2" 
              onClick={() => setIsMenuOpen(false)}
            >
              Espace d'Entraînement
            </Link>
            <Link 
              to="/revision" 
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors py-2" 
              onClick={() => setIsMenuOpen(false)}
            >
              Révision
            </Link>
            <Link 
              to="/progression" 
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors py-2" 
              onClick={() => setIsMenuOpen(false)}
            >
              Ma progression
            </Link>
            
            {!isLoggedIn ? (
              // MOBILE - DÉCONNECTÉ
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="ghost" asChild className="justify-start">
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    Connexion
                  </Link>
                </Button>
                
                <Button asChild className="bg-afrique-orange hover:bg-afrique-orange/90 justify-start">
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Inscription
                  </Link>
                </Button>
              </div>
            ) : (
              // MOBILE - CONNECTÉ
              <div className="flex flex-col space-y-3 pt-4 border-t">
                
                {/* BOUTON RECHARGE MOBILE (UNIQUEMENT ICI) */}
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsTokenModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="justify-start flex items-center gap-2"
                >
                  <Coins className="h-4 w-4" />
                  Recharger mes jetons
                  <span className="bg-afrique-orange text-white px-2 py-1 rounded-full text-xs font-semibold ml-auto">
                    {tokenBalance}
                  </span>
                </Button>
                
                {/* PROFIL MOBILE */}
                <Link 
                  to="/profil" 
                  className="flex items-center gap-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-afrique-bleu text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary-foreground">
                      {getFullName()}
                    </span>
                    <span className="text-xs text-primary-foreground/70">
                      Voir mon dashboard
                    </span>
                  </div>
                </Link>
                
                {/* DÉCONNEXION MOBILE */}
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="justify-start flex items-center gap-2 text-red-400 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* MODALE RECHARGE */}
      <TokenRechargeModal 
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSuccess={handleTokenSuccess}
      />
    </header>
  );
}