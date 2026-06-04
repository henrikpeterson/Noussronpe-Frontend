/**
 * ════════════════════════════════════════════════════════════════════════
 * SIDEBARMINI - Sidebar gauche avec icône info uniquement
 * ════════════════════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarMini = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    type: 'bug',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Envoyer le feedback au backend
    console.log('Feedback envoyé:', feedback);
    
    // Reset et fermer
    setFeedback({ type: 'bug', message: '' });
    setIsOpen(false);
    
    // Confirmation visuelle
    alert('Merci pour ton retour ! 👍');
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* SIDEBAR (fixed left) */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="fixed left-0 top-0 bottom-0 w-14 bg-white border-r 
                      border-slate-200 flex flex-col items-center justify-center z-30">
        
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-lg
                     text-slate-400 hover:text-slate-700 hover:bg-slate-100
                     transition-all"
          title="Signaler un problème"
        >
          <Info className="w-5 h-5" />
        </button>

      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PANEL FEEDBACK (slide from left) */}
      {/* ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50
                         flex flex-col"
            >
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Signaler un problème
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                             hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 overflow-y-auto">
                
                {/* Type de problème */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Type de problème
                  </label>
                  <select
                    value={feedback.type}
                    onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl
                               focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="bug">Bug technique</option>
                    <option value="theory">Erreur dans la théorie</option>
                    <option value="question">Question incorrecte</option>
                    <option value="suggestion">Suggestion</option>
                  </select>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    placeholder="Décris le problème en détail..."
                    rows={6}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl
                               focus:border-blue-500 focus:outline-none transition-colors
                               resize-none"
                  />
                </div>

                {/* Bouton submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white
                             font-bold rounded-xl transition-colors shadow-lg
                             hover:shadow-xl"
                >
                  Envoyer
                </button>

              </form>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarMini;