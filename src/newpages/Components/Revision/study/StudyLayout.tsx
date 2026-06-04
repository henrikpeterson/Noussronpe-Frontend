/**
 * ════════════════════════════════════════════════════════════════════════
 * STUDYLAYOUT - Layout minimaliste style Coddy
 * ════════════════════════════════════════════════════════════════════════
 * 
 * CHANGEMENTS MAJEURS :
 * - Plus de header global (déplacé dans PracticePanel)
 * - Container simple sans padding/gaps
 * - Juste le wrapper pour resizable panels
 * 
 * ════════════════════════════════════════════════════════════════════════
 */

import type { StudyLayoutProps } from './types';

const StudyLayout = ({ children }: Omit<StudyLayoutProps, 'subject' | 'chapter' | 'onBack' | 'progress'>) => {
  
  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      {/* Container plein écran sans padding */}
      {children}
    </div>
  );
};

export default StudyLayout;