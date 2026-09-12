// src/api/revision.ts - FINAL CONSOLIDÉ - Phases 1+2+3
// Production-ready, commenté, avec tous les fixs (token students_access_token, classe auto, flashcards mapping)

const API_BASE_URL = 'http://192.168.1.69:8000/api';
const AUTH_BASE_URL = 'http://192.168.1.69:8000';

// ===================== TYPES =====================
export interface MatiereRevisionApi {
  id: number;
  slug: string;
  nom: string;
  description: string;
  icone: string;
  nb_themes: number;
  nb_lecons: number;
  nb_epreuves: number;
}

export interface CurrentUser {
  id: number;
  Nom: string;
  Prenom: string;
  NumeroTel: string;
  Class: string | null;
  is_staff: boolean;
}

export interface ThemeMinimalApi {
  id: number;
  titre: string;
  ordre: number;
}

export interface LeconRoadmapApi {
  id: number;
  titre: string;
  ordre: number;
  duree: number;
  image_url: string;
  theme: ThemeMinimalApi;
  nb_questions: number;
  nb_flashcards: number;
  progression: {
    statut: 'non_commence' | 'en_cours' | 'termine';
    meilleur_score: number | null;
    derniere_tentative: string | null;
  };
  is_locked: boolean;
}

export interface RoadmapResponse {
  is_authenticated: boolean;
  lecons: LeconRoadmapApi[];
}

export interface LeconDetailApi {
  id: number;
  titre: string;
  description: string;
  contenu_sections: Array<{
    type: 'paragraph' | 'important' | 'quote' | 'formula' | 'example';
    content: string;
    variant?: 'blue' | 'green' | 'amber' | 'purple';
  }>;
  duree: number;
  image_url: string;
  ordre: number;
  theme: ThemeMinimalApi;
  nb_questions: number;
  nb_flashcards: number;
  progression: any;
}

export interface QuestionApi {
  id: number;
  texte_question: string;
  code_example: string;
  ordre: number;
  options: Array<{ id: number; texte_option: string; ordre: number }>;
}

// Backend brut
interface FlashcardBackend {
  id: number;
  question: string;
  reponse: string;
  indice: string;
  ordre: number;
}
// Frontend attendu par FlashcardView.tsx
export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  ordre?: number;
}

export interface TentativeApi {
  id: number;
  lecon: number;
  mode: 'quiz' | 'flashcard';
  score: number | null;
  bonnes_reponses: number | null;
  total_questions: number;
  terminee: boolean;
}

export interface ReponseValidationApi {
  id: number;
  question_id: number;
  reponse_donnee: number;
  est_correcte: boolean;
  explication: string;
  bonne_option_ordre: number;
  bonne_option_texte: string;
}

export interface FinalisationApi {
  score: number | null;
  bonnes_reponses: number | null;
  total_questions: number;
  est_termine_lecon: boolean;
  progression: any;
  tentative: TentativeApi;
}

// ===================== HELPERS =====================
function getAuthToken(): string | null {
  return localStorage.getItem('students_access_token') || localStorage.getItem('access_token') || localStorage.getItem('token');
}

export function clearAuthData() {
  localStorage.removeItem('students_access_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('currentUser');
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}, useAuthBase = false): Promise<T> {
  const token = getAuthToken();
  const base = useAuthBase ? AUTH_BASE_URL : API_BASE_URL;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const url = endpoint.startsWith('http') ? endpoint : `${base}${endpoint}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `Erreur ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function getCurrentUserClasse(): Promise<string | null> {
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      const obj = u.user || u.data || u;
      return obj.Class || obj.classe || obj.Classe || null;
    }
  } catch {}
  const token = getAuthToken();
  if (!token) return null;
  try {
    const user = await apiFetch<CurrentUser>('/auth/users/me/', {}, true);
    localStorage.setItem('user', JSON.stringify(user));
    return user.Class;
  } catch { return null; }
}

export async function getCurrentUserWithClasse(): Promise<CurrentUser | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const user = await apiFetch<CurrentUser>('/auth/users/me/', {}, true);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        const obj = u.user || u;
        return { id: obj.id, Nom: obj.Nom, Prenom: obj.Prenom, NumeroTel: obj.NumeroTel, Class: obj.Class || obj.classe, is_staff: false };
      }
    } catch {}
    return null;
  }
}

export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/_/g, '-').trim();
}

// ===================== PHASE 1 - MATIERES =====================
export async function getMatieresByClasse(classe?: string | null): Promise<MatiereRevisionApi[]> {
  const query = classe ? `?classe=${encodeURIComponent(classe)}` : '';
  return apiFetch<MatiereRevisionApi[]>(`/revision/matieres/${query}`);
}

// ===================== PHASE 2 - ROADMAP =====================
export async function getLeconsRoadmap(matiereSlug: string, classeParam?: string | null): Promise<RoadmapResponse> {
  let classe = classeParam;
  if (!classe) {
    const fromUser = await getCurrentUserClasse();
    classe = fromUser || '6eme';
  }
  const params = new URLSearchParams();
  if (matiereSlug) params.set('matiere', matiereSlug);
  if (classe) params.set('classe', classe);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<RoadmapResponse>(`/revision/lecons/roadmap/${query}`);
}

// ===================== PHASE 3 - STUDYVIEW =====================
export async function getLeconDetail(leconId: number): Promise<LeconDetailApi> {
  return apiFetch<LeconDetailApi>(`/revision/lecons/${leconId}/`);
}

export async function getQuestions(leconId: number): Promise<QuestionApi[]> {
  return apiFetch<QuestionApi[]>(`/revision/lecons/${leconId}/questions/`);
}

export async function getFlashcards(leconId: number): Promise<FlashCard[]> {
  const data = await apiFetch<FlashcardBackend[]>(`/revision/lecons/${leconId}/flashcards/`);
  // Mapping backend reponse/indice -> frontend answer/hint
  return data.map(f => ({
    id: String(f.id),
    question: f.question,
    answer: f.reponse,
    hint: f.indice || undefined,
    ordre: f.ordre,
  }));
}

export async function createTentative(leconId: number, mode: 'quiz' | 'flashcard'): Promise<TentativeApi> {
  return apiFetch<TentativeApi>(`/revision/tentatives/`, {
    method: 'POST',
    body: JSON.stringify({ lecon_id: leconId, mode })
  });
}

export async function submitReponse(tentativeId: number, questionId: number, reponseDonnee: number): Promise<ReponseValidationApi> {
  return apiFetch<ReponseValidationApi>(`/revision/tentatives/${tentativeId}/reponses/`, {
    method: 'POST',
    body: JSON.stringify({ question_id: questionId, reponse_donnee: reponseDonnee })
  });
}

export async function finaliserTentative(tentativeId: number, totalCartes?: number): Promise<FinalisationApi> {
  return apiFetch<FinalisationApi>(`/revision/tentatives/${tentativeId}/finaliser/`, {
    method: 'POST',
    body: JSON.stringify(totalCartes ? { total_cartes: totalCartes } : {})
  });
}
