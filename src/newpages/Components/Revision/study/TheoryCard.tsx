/**
 * ════════════════════════════════════════════════════════════════════════
 * THEORYPANEL - Panel gauche (plus de card)
 * ════════════════════════════════════════════════════════════════════════
 * 
 * CHANGEMENTS MAJEURS :
 * - Plus de rounded/shadow/border-2
 * - Juste border-r pour séparation
 * - h-screen overflow-y-auto
 * - Padding interne uniquement
 * 
 * ════════════════════════════════════════════════════════════════════════
 */

import { BookOpen, Bookmark } from 'lucide-react';
import { useMediaQuery, BREAKPOINTS } from '@/newpages/hooks/useMediaQuery';
import type { TheoryData, TheorySection } from '@/newpages/Components/Revision/study/types';

interface TheoryPanelProps {
  data: TheoryData;
  chapterTitle: string;
  onGoToQuiz?: () => void; // Pour mobile uniquement
}

const TheoryPanel = ({ data, chapterTitle, onGoToQuiz }: TheoryPanelProps) => {
  
  const isMobile = useMediaQuery('(max-width: 1023px)');

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER SECTION
   * ═══════════════════════════════════════════════════════════
   */
  const renderSection = (section: TheorySection, index: number) => {
    
    // Paragraphe normal
    if (section.type === 'paragraph') {
      return (
        <p 
          key={index} 
          className="text-base leading-relaxed text-slate-700 mb-6"
        >
          {section.content}
        </p>
      );
    }

    // Encadré important
    if (section.type === 'important') {
      const variantStyles = {
        blue: 'bg-blue-50 border-blue-400 text-blue-900',
        green: 'bg-green-50 border-green-400 text-green-900',
        amber: 'bg-amber-50 border-amber-400 text-amber-900',
        purple: 'bg-purple-50 border-purple-400 text-purple-900',
      };

      const colorClass = variantStyles[section.variant || 'blue'];

      return (
        <div
          key={index}
          className={`border-l-4 rounded-r-lg p-4 mb-6 ${colorClass}`}
        >
          <p className="font-fredoka leading-relaxed">
            {section.content}
          </p>
        </div>
      );
    }

    // Citation
    if (section.type === 'quote') {
      return (
        <blockquote
          key={index}
          className="border-l-4 border-slate-300 pl-4 py-2 mb-6 
                     font-fredoka text-slate-700 text-base"
        >
          {section.content}
        </blockquote>
      );
    }

    // Formule
    if (section.type === 'formula') {
      return (
        <div
          key={index}
          className="bg-[#1E1E1E] text-white font-fredoka text-xl 
                     rounded-lg p-6 mb-6 text-center"
        >
          {section.content}
        </div>
      );
    }

    // Exemple
    if (section.type === 'example') {
      const variantStyles = {
        blue: 'bg-blue-50 border-blue-300',
        green: 'bg-green-50 border-green-300',
        amber: 'bg-amber-50 border-amber-300',
        purple: 'bg-purple-50 border-purple-300',
      };

      const colorClass = variantStyles[section.variant || 'green'];

      return (
        <div
          key={index}
          className={`border-2 rounded-lg p-4 mb-6 ${colorClass}`}
        >
          <p className="text-XL font-fredoka text-slate-800 whitespace-pre-line">
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
    <div className="h-screen bg-white overflow-y-auto border-r border-slate-200">
      
      {/* Container avec padding */}
      <div className="px-6 md:px-8 py-6 md:py-8">
        
        {/* ═══ HEADER ═══ */}
        <div className="mb-8">
          
          {/* Titre + badges */}
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl md:text-3xl font-fredoka text-slate-900 flex-1 leading-tight">
              {data.title}
            </h1>

            {/* Badges (desktop only) */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              <button className="px-3 py-1.5 bg-blue-50 border border-blue-200 
                                 rounded-lg text-xs font-bold text-blue-700
                                 hover:bg-blue-100 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>TLDR</span>
              </button>

              <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 
                                 rounded-lg text-xs font-bold text-slate-700
                                 hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Marquer</span>
              </button>
            </div>
          </div>

          {/* Sous-titre */}
          <p className="text-base md:text-lg text-slate-600 font-fredoka mb-4">
            {data.subtitle}
          </p>

          {/* Ligne décorative */}
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>

        {/* ═══ CONTENU ═══ */}
        <div className="space-y-0">
          {data.sections.map((section, index) => renderSection(section, index))}
        </div>

        {/* ═══ BOUTON MOBILE "ALLER AU QUIZ" ═══ */}
        {isMobile && onGoToQuiz && (
          <button
            onClick={onGoToQuiz}
            className="w-full mt-8 mb-24 px-6 py-4 bg-blue-50 border-2 border-blue-200
                       rounded-xl font-fredoka text-blue-700 text-base
                       hover:bg-blue-100 transition-all flex items-center 
                       justify-between group"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">📘</span>
              <span>Aller au quiz</span>
            </span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        )}

      </div>
    </div>
  );
};

export default TheoryPanel;