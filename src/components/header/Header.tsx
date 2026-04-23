import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChallengeNotification } from "@/components/challenge/ChallengeNotification";
import TokenRechargeModal from "@/components/tokens/TokenRechargeModal";
import { getUserTokens } from "@/data/tokens";
import {
  BookOpen, Menu, X, LogIn, UserPlus, Coins, LogOut,
  Dumbbell, RotateCcw, TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Liens de navigation avec icônes ─── */
const NAV_LINKS = [
  { to: "/espace-entrainement", label: "Espace d'Entraînement", icon: Dumbbell },
  { to: "/revision",            label: "Révision",              icon: BookOpen },
  { to: "/progression",         label: "Ma progression",        icon: TrendingUp },
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

  // ==================== RENDU ====================
  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(37, 99, 235, 0.97)"
          : "#2563eb",
        boxShadow: scrolled
          ? "0 4px 24px rgba(37,99,235,0.25), 0 1px 4px rgba(0,0,0,0.1)"
          : "0 1px 3px rgba(0,0,0,0.1)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      {/* ── BARRE PRINCIPALE ── */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/Logo_Noussronpe-cropped.svg"
            alt="Noussronpe"
            className="h-10 w-auto"
          />
        </Link>

        {/* Hamburger mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/15"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isMenuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{   rotate:  90,  opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </Button>

        {/* ── NAVIGATION DESKTOP ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
                style={{ color: active ? "white" : "rgba(255,255,255,0.75)" }}
              >
                {/* Fond hover */}
                <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/12 transition-all duration-200" />
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{label}</span>
                {/* Underline animé */}
                <span
                  className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-white transition-all duration-200 origin-left"
                  style={{ transform: active ? "scaleX(1)" : "scaleX(0)", opacity: active ? 0.9 : 0 }}
                />
              </Link>
            );
          })}

          {/* Badge défis avec pulse */}
          <div className="relative ml-1">
            <ChallengeNotification />
          </div>
        </nav>

        {/* ── PARTIE DROITE DESKTOP ── */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              {/* Connexion — discret */}
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/12 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </Link>

              {/* Inscription — bien visible */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Inscription
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Jetons */}
              <button
                onClick={() => setIsTokenModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/12 transition-all duration-200 text-sm"
              >
                <Coins className="w-4 h-4" />
                <span className="hidden lg:inline">Jetons</span>
                <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  {tokenBalance}
                </span>
              </button>

              {/* Profil */}
              <Link
                to="/profil"
                className="flex items-center gap-2 hover:opacity-85 transition-opacity"
              >
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-white/30 hover:ring-white/60 transition-all">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-800 text-white text-xs font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white hidden lg:inline">
                  {getFullName()}
                </span>
              </Link>

              {/* Déconnexion */}
              <button
                onClick={handleLogout}
                title="Déconnexion"
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/12 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MENU MOBILE ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden overflow-hidden"
            style={{ background: "rgba(29, 78, 216, 0.98)", backdropFilter: "blur(12px)" }}
          >
            <nav className="flex flex-col px-4 pt-2 pb-5 gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: active ? "rgba(255,255,255,0.15)" : "transparent",
                      color: active ? "white" : "rgba(255,255,255,0.75)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}

              {/* Séparateur */}
              <div className="h-px bg-white/15 my-2" />

              {!isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-bold bg-white text-blue-600 justify-center transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Inscription
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => { setIsTokenModalOpen(true); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Coins className="w-4 h-4" />
                    Recharger mes jetons
                    <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold ml-auto">
                      {tokenBalance}
                    </span>
                  </button>

                  <Link
                    to="/profil"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:bg-white/10"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-blue-800 text-white text-xs font-bold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{getFullName()}</span>
                      <span className="text-xs text-white/50">Voir mon profil</span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 hover:bg-white/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modale recharge */}
      <TokenRechargeModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSuccess={handleTokenSuccess}
      />
    </header>
  );
}