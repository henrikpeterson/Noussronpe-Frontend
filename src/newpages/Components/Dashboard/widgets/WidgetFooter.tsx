import { Link } from "react-router-dom";


/**
 * WIDGET FOOTER - Liens + Réseaux sociaux
 * Version NON sticky pour éviter chevauchement
 */

// Icône TikTok custom


const INSTITUTIONAL_LINKS = [
  { label: "À propos", href: "/a-propos" },
  { label: "Équipe", href: "/equipe" },
  { label: "Partenaires", href: "/partenaires" },
];

const LEGAL_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "Conditions", href: "/conditions" },
];



const WidgetFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-[#F9FAFB] pr-10 py-4">
      
      
      {/* Liens institutionnels */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-3">
        {INSTITUTIONAL_LINKS.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Liens légaux */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-4">
        {LEGAL_LINKS.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Réseaux sociaux */}
      
    </footer>
  );
};

export default WidgetFooter;