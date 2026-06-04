import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TokenRechargeModal from "@/components/tokens/TokenRechargeModal";
import { getUserTokens } from "@/data/tokens";
import {
  BookOpen, Menu, X, LogIn, UserPlus, Coins, LogOut,
  Dumbbell, TrendingUp, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { to: "/espace-entrainement", label: "ENTRAINEMENT", icon: Dumbbell },
  { to: "/revision",            label: "REVISION",      icon: BookOpen },
  { to: "/progression",         label: "PROGRESSION",   icon: TrendingUp },
];

export default function Header() {
   // ==================== ÉTATS ====================
   const [isMenuOpen,      setIsMenuOpen]      = useState(false);
   const [isLoggedIn,      setIsLoggedIn]      = useState(false);
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const [userData,        setUserData]        = useState<any>(null);
   const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
   const [tokenBalance,    setTokenBalance]    = useState(getUserTokens().balance);
   const [scrolled,        setScrolled]        = useState(false);
   const navigate  = useNavigate();
   const location  = useLocation();
 
   // ==================== EFFETS ====================
   useEffect(() => {
     checkAuthStatus();
 
     const handleTokenUpdate = () => setTokenBalance(getUserTokens().balance);
     const handleOpenTokenRecharge = () => setIsTokenModalOpen(true);
 
     window.addEventListener("tokensUpdated",      handleTokenUpdate);
     window.addEventListener("openTokenRecharge",  handleOpenTokenRecharge);
     return () => {
       window.removeEventListener("tokensUpdated",     handleTokenUpdate);
       window.removeEventListener("openTokenRecharge", handleOpenTokenRecharge);
     };
   }, []);
 
   /* Scroll effect */
   useEffect(() => {
     const onScroll = () => setScrolled(window.scrollY > 10);
     window.addEventListener("scroll", onScroll, { passive: true });
     return () => window.removeEventListener("scroll", onScroll);
   }, []);
 
   // ==================== FONCTIONS ====================
   const checkAuthStatus = () => {
     const token = localStorage.getItem("students_access_token") || sessionStorage.getItem("students_access_token");
     const user  = localStorage.getItem("students_user")         || sessionStorage.getItem("students_user");
     if (token && user) {
       setIsLoggedIn(true);
       try { setUserData(JSON.parse(user)); } catch { /* noop */ }
     } else {
       setIsLoggedIn(false);
       setUserData(null);
     }
   };
 
   const handleLogout = () => {
     ["students_access_token","students_refresh_token","students_user"].forEach(k => {
       localStorage.removeItem(k);
       sessionStorage.removeItem(k);
     });
     setIsLoggedIn(false);
     setUserData(null);
     setIsMenuOpen(false);
     navigate("/");
     window.location.reload();
   };
 
   const getUserInitials = () => {
     if (!userData) return "US";
     const { Prenom, Nom } = userData;
     return (Prenom && Nom) ? `${Prenom[0]}${Nom[0]}`.toUpperCase() : "US";
   };
 
   const getFullName = () => {
     if (!userData) return "Utilisateur";
     const { Prenom, Nom } = userData;
     return (Prenom && Nom) ? `${Prenom} ${Nom}` : "Utilisateur";
   };
 
   const handleTokenSuccess = () => {
     setTokenBalance(getUserTokens().balance);
     window.dispatchEvent(new CustomEvent("tokensUpdated"));
   };
 
   const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Container avec Glassmorphism */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between bg-white/80 backdrop-blur-lg border-2 border-slate-100 border-b-[4px] border-b-slate-200/50 rounded-2xl px-4 py-2 shadow-xl shadow-blue-900/5">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <motion.div
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ y: 2 }}
                className="relative p-1 bg-white rounded-xl border-2 border-slate-100 border-b-[4px] border-b-blue-600/20 shadow-sm transition-all"
            >
                {/* L'image avec un léger drop-shadow pour la profondeur interne */}
                <img
                src="/Logo-Reviz+.svg"
                alt="Logo Reviz+"
                className="h-10 w-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"
                />
                
                {/* Petit éclat de lumière optionnel en haut à gauche pour le côté brillant */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black font-fredoka transition-all ${
                    isActive 
                      ? "text-blue-600 bg-blue-50/50" 
                      : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  <link.icon className={`w-4 h-4 ${isActive ? "animate-bounce" : ""}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* AUTH / USER SECTION */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* TOKEN BADGE 3D */}
                <button
                  onClick={() => setIsTokenModalOpen(true)}
                  className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 border-b-[4px] border-b-amber-300/50 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-all active:border-b-0 active:translate-y-[2px]"
                >
                  <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black text-amber-700">{tokenBalance}</span>
                </button>

                {/* USER PROFILE */}
                <div className="flex items-center gap-2 pl-2 border-l-2 border-slate-100">
                  <Avatar className="h-10 w-10 border-2 border-blue-100 shadow-sm">
                    <AvatarFallback className="bg-blue-600 text-white font-black text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Déconnexion"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="font-black font-fredoka text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black font-fredoka rounded-xl border-b-[4px] border-blue-800 transition-all active:border-b-0 active:translate-y-[2px] px-6">
                    S'INSCRIRE
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mx-4 mt-2 lg:hidden bg-white rounded-3xl shadow-2xl border-2 border-slate-100 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl font-black font-fredoka text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <link.icon className="w-6 h-6" />
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-slate-100 my-2" />
              
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3 p-2">
                  <Link to="/connexion" onClick={() => setIsMenuOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full font-black rounded-xl border-b-4">Connexion</Button>
                  </Link>
                  <Link to="/inscription" onClick={() => setIsMenuOpen(false)} className="w-full">
                    <Button className="w-full bg-blue-600 text-white font-black rounded-xl border-b-4 border-blue-800">S'inscrire</Button>
                  </Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="flex items-center gap-4 p-4 rounded-2xl font-black text-red-500 hover:bg-red-50">
                  <LogOut className="w-6 h-6" />
                  Déconnexion
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <TokenRechargeModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSuccess={handleTokenSuccess}
      />
    </header>
  );
}