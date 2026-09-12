/**
 * ════════════════════════════════════════════════════════════════════════
 * THEORYPANEL - Panel gauche (Espacements réduits & Paragraphes renforcés)
 * ════════════════════════════════════════════════════════════════════════
 */

import { BookOpen, Bookmark, Info, Quote, Lightbulb, Calculator } from 'lucide-react';
import { useMediaQuery } from '@/newpages/hooks/useMediaQuery';
import type { TheoryData, TheorySection } from '@/newpages/Components/Revision/study/types';

interface TheoryPanelProps {
  data: TheoryData;
  chapterTitle: string;
  onGoToQuiz?: () => void;
}

const TheoryPanel = ({ data, chapterTitle, onGoToQuiz }: TheoryPanelProps) => {
  const isMobile = useMediaQuery('(max-width: 1023px)');

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER SECTION
   * ═══════════════════════════════════════════════════════════
   */
  const renderSection = (section: TheorySection, index: number) => {
    // 1. Paragraphe normal - Plus gras (font-bold), texte plus sombre (text-slate-900) et marge réduite (mb-5)
    if (section.type === 'paragraph') {
      return (
        <p 
          key={index} 
          className="text-lg leading-relaxed text-slate-900 mb-5 font-bold bg-white/80 backdrop-blur-[2px] p-3.5 rounded-xl border border-slate-200/60 shadow-sm"
        >
          {section.content}
        </p>
      );
    }

    // 2. Encadré important - Marge réduite à mb-5
    if (section.type === 'important') {
      const variantStyles = {
        blue: 'bg-blue-50/95 border-blue-500 text-blue-950 shadow-blue-100',
        green: 'bg-green-50/95 border-green-500 text-green-950 shadow-green-100',
        amber: 'bg-amber-50/95 border-amber-500 text-amber-950 shadow-amber-100',
        purple: 'bg-purple-50/95 border-purple-500 text-purple-950 shadow-purple-100',
      };

      const colorClass = variantStyles[section.variant || 'blue'];

      return (
        <div
          key={index}
          className={`flex gap-3.5 border-l-4 rounded-r-2xl p-4 mb-5 shadow-sm ${colorClass}`}
        >
          <Info className="w-6 h-6 shrink-0 mt-0.5 opacity-90" />
          <p className="font-fredoka text-[1.05rem] font-bold leading-relaxed">
            {section.content}
          </p>
        </div>
      );
    }

    // 3. Citation - Marge réduite à mb-5
    if (section.type === 'quote') {
      return (
        <div key={index} className="flex gap-3 mb-5 px-1 md:px-4">
          <Quote className="w-8 h-8 text-slate-400 shrink-0 rotate-180" />
          <blockquote className="border-l-4 border-slate-400 pl-4 py-1.5 font-fredoka text-slate-800 text-lg md:text-xl italic font-bold leading-relaxed bg-white/70 backdrop-blur-[1px] rounded-r-xl">
            {section.content}
          </blockquote>
        </div>
      );
    }

    // 4. Formule - Marges réduites (mt-2, mb-5)
    if (section.type === 'formula') {
      return (
        <div key={index} className="mb-5 mt-2">
          <div className="flex items-center gap-2 mb-2 px-1 text-xs font-black text-slate-600 uppercase tracking-widest">
            <Calculator className="w-4 h-4" />
            <span>Formule à retenir</span>
          </div>
          <div className="bg-slate-900 text-white font-fredoka text-xl md:text-2xl font-bold tracking-wider rounded-2xl p-6 text-center shadow-md">
            {section.content}
          </div>
        </div>
      );
    }

    // 5. Exemple - Marges réduites (mt-4, mb-5)
    if (section.type === 'example') {
      const wrapperStyles = {
        blue: 'bg-blue-50/95 border-blue-300',
        green: 'bg-green-50/95 border-green-300',
        amber: 'bg-amber-50/95 border-amber-300',
        purple: 'bg-purple-50/95 border-purple-300',
      };
      
      const badgeStyles = {
        blue: 'bg-blue-100 text-blue-800 border-blue-300',
        green: 'bg-green-100 text-green-800 border-green-300',
        amber: 'bg-amber-100 text-amber-800 border-amber-300',
        purple: 'bg-purple-100 text-purple-800 border-purple-300',
      };

      const variant = section.variant || 'green';
      const wrapperClass = wrapperStyles[variant];
      const badgeClass = badgeStyles[variant];

      return (
        <div
          key={index}
          className={`relative border-2 rounded-2xl p-5 mb-5 mt-4 shadow-sm ${wrapperClass}`}
        >
          <div className={`absolute -top-3.5 left-5 px-3 py-1 rounded-full border text-xs font-black flex items-center gap-1.5 shadow-sm ${badgeClass}`}>
            <Lightbulb className="w-3.5 h-3.5" />
            Exemple
          </div>
          <p className="text-base md:text-lg font-fredoka font-bold text-slate-900 whitespace-pre-line mt-2 leading-relaxed">
            {section.content}
          </p>
        </div>
      );
    }

    return null;
  };

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER PRINCIPAL
   * ═══════════════════════════════════════════════════════════
   */
  return (
    <div 
      className="h-screen overflow-y-auto border-r border-slate-300 relative bg-amber-50/20"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(239, 68, 68, 0.25) 2px, transparent 2px),
          linear-gradient(to right, rgba(203, 213, 225, 0.5) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(203, 213, 225, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 24px 24px, 24px 24px',
        backgroundPosition: '32px 0, 0 0, 0 0',
      }}
    >
      <div className="max-w-4xl mx-auto pl-12 pr-6 md:pl-16 md:pr-12 py-6 md:py-8">
        
        {/* ═══ HEADER (Espace sous le header réduit à mb-6) ═══ */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-slate-900 flex-1 leading-tight">
              {data.title}
            </h1>

            {/* Badges */}
            <div className="hidden md:flex items-center gap-2.5 ml-4 shrink-0">
              <button className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 
                                 rounded-xl text-xs font-bold text-blue-700
                                 hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
                <span>TLDR</span>
              </button>

              <button className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 
                                 rounded-xl text-xs font-bold text-slate-700
                                 hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-sm">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Marquer</span>
              </button>
            </div>
          </div>

          <p className="text-base md:text-lg text-slate-700 font-fredoka font-semibold mb-3 leading-relaxed">
            {data.subtitle}
          </p>

          <div className="w-14 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>

        {/* ═══ CONTENU ═══ */}
        <div className="mt-4">
          {data.sections.map((section, index) => renderSection(section, index))}
        </div>

        {/* ═══ BOUTON MOBILE ═══ */}
        {isMobile && onGoToQuiz && (
          <button
            onClick={onGoToQuiz}
            className="w-full mt-8 mb-20 px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                       text-white rounded-2xl font-fredoka font-bold text-base
                       hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center 
                       justify-between group shadow-md"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-xl">📘</span>
              <span>Passer au quiz</span>
            </span>
            <span className="text-xl group-hover:translate-x-2 transition-transform">
              →
            </span>
          </button>
        )}

      </div>
    </div>
  );
};

export default TheoryPanel;