// src/hooks/useLeconStudy.ts - V3 - FIX reprise quiz "Déjà répondu"
import { useState, useEffect, useCallback } from 'react';
import {
  getLeconDetail, getQuestions, getFlashcards,
  createTentative, submitReponse, finaliserTentative,
  type LeconDetailApi, type TentativeApi, type ReponseValidationApi, type FinalisationApi
} from '@/newpages/data/revision';
import type { FlashCard } from '@/newpages/Components/Revision/study/types';

export type StudyMode = 'quiz' | 'flashcard' | null;

export interface StudyAnswer {
  questionId: number;
  userAnswer: number;
  isCorrect: boolean;
  explication: string;
  bonneOptionOrdre: number;
}

export function useLeconStudy(leconId: number) {
  const [lecon, setLecon] = useState<LeconDetailApi | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [tentative, setTentative] = useState<TentativeApi | null>(null);

  const [selectedMode, setSelectedMode] = useState<StudyMode>(null);
  const [isModeLocked, setIsModeLocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<StudyAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<FinalisationApi | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLecon = async () => {
      setIsLoading(true);
      try {
        const detail = await getLeconDetail(leconId);
        setLecon(detail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur leçon');
      } finally {
        setIsLoading(false);
      }
    };
    if (leconId) loadLecon();
  }, [leconId]);

  const selectMode = useCallback(async (mode: 'quiz' | 'flashcard') => {
    if (isModeLocked && selectedMode === mode) return; // déjà dans ce mode
    setError(null);
    try {
      const newTentative = await createTentative(leconId, mode) as any;
      setTentative(newTentative);
      setSelectedMode(mode);
      setIsModeLocked(true);

      // Charge contenu selon mode
      let qs: any[] = [];
      let cards: FlashCard[] = [];
      if (mode === 'quiz') {
        const { getQuestions } = await import('@/newpages/data/revision');
        qs = await getQuestions(leconId);
        setQuestions(qs);
      } else {
        const { getFlashcards } = await import('@/newpages/data/revision');
        cards = await getFlashcards(leconId) as any;
        setFlashcards(cards);
      }

      // FIX REPRISE : si tentative existante avec déjà des réponses, on reprend où on s'est arrêté
      const existingReponses = newTentative.reponses || [];
      if (existingReponses.length > 0) {
        console.log(`[useLeconStudy] Reprise détectée : ${existingReponses.length} réponses déjà en base`);
        const mappedAnswers: StudyAnswer[] = existingReponses.map((r: any) => ({
          questionId: r.question,
          userAnswer: r.reponse_donnee,
          isCorrect: r.est_correcte,
          explication: '', // sera rechargée à la validation si besoin
          bonneOptionOrdre: 0,
        }));
        setAnswers(mappedAnswers);
        // On se place à la prochaine question non répondue
        setCurrentIndex(existingReponses.length);
      } else {
        setCurrentIndex(0);
        setAnswers([]);
      }

      setIsCompleted(false);
      setFinalResult(null);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      setError(msg === 'AUTH_REQUIRED' ? 'Connecte-toi pour t\'entraîner' : msg);
    }
  }, [leconId, isModeLocked, selectedMode]);

  const validateQuizAnswer = useCallback(async (optionIndex: number) => {
    if (!tentative) throw new Error('Pas de tentative');
    const currentQ = questions[currentIndex];
    const validation = await submitReponse(tentative.id, currentQ.id, optionIndex);
    
    // Si déjà répondu (deja_repondu true), on ne duplique pas dans answers
    setAnswers(prev => {
      const already = prev.find(a => a.questionId === currentQ.id);
      if (already) return prev;
      return [...prev, {
        questionId: currentQ.id,
        userAnswer: optionIndex,
        isCorrect: validation.est_correcte,
        explication: validation.explication,
        bonneOptionOrdre: validation.bonne_option_ordre,
      }];
    });
    
    return validation;
  }, [tentative, questions, currentIndex]);

  const nextQuestion = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const nextCard = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const finaliser = useCallback(async () => {
    if (!tentative) return;
    const result = await finaliserTentative(tentative.id, selectedMode === 'flashcard' ? flashcards.length : undefined);
    setFinalResult(result);
    setIsCompleted(true);
    setTentative(result.tentative);
  }, [tentative, selectedMode, flashcards.length]);

  const restart = useCallback(() => {
    setSelectedMode(null);
    setIsModeLocked(false);
    setCurrentIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setFinalResult(null);
    setTentative(null);
  }, []);

  const totalQuestions = selectedMode === 'quiz' ? questions.length : flashcards.length;
  const progress = totalQuestions > 0 ? Math.round((currentIndex / totalQuestions) * 100) : 0;

  return {
    lecon, questions, flashcards, tentative,
    selectedMode, isModeLocked, currentIndex, totalQuestions, answers, isCompleted, finalResult,
    isLoading, error, progress,
    selectMode, validateQuizAnswer, nextQuestion, nextCard, finaliser, restart
  };
}
