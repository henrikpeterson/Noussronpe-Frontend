// --- Imports Animaux ---
import inseparable from "@/games/PuzzleGame/assets/Animaux/L'Inseparable_à _face_rouge.webp";
import orycterope from "@/games/PuzzleGame/assets/Animaux/L'Oryctérope_du Cap.webp";
import grueRoyale from "@/games/PuzzleGame/assets/Animaux/La_Grue _Royale.webp";
import caracal from "@/games/PuzzleGame/assets/Animaux/Le_Caracal.webp";
import lycaon from "@/games/PuzzleGame/assets/Animaux/Le_Lycaon.webp";
import ratel from "@/games/PuzzleGame/assets/Animaux/Le_Ratel.webp";
import serval from "@/games/PuzzleGame/assets/Animaux/Le_Serval.webp";
import okapi from "@/games/PuzzleGame/assets/Animaux/Okapi.webp";
import pangolin from "@/games/PuzzleGame/assets/Animaux/Pangolin.webp";
import shoebill from "@/games/PuzzleGame/assets/Animaux/Shoebill Stork.webp";

// --- Imports Sites touristiques ---
import cascadeKpime from "@/games/PuzzleGame/assets/Site_touristique/Cascade_de_Kpimé.webp";
import desertSahara from "@/games/PuzzleGame/assets/Site_touristique/Desert_du_sahara.webp";
import koutammakou from "@/games/PuzzleGame/assets/Site_touristique/Koutammakou.webp";
import avenueBaobabs from "@/games/PuzzleGame/assets/Site_touristique/L'Avenue_des_Baobabs.webp";
import kilimandjaro from "@/games/PuzzleGame/assets/Site_touristique/Le_Mont_Kilimandjaro.webp";
import tiebele from "@/games/PuzzleGame/assets/Site_touristique/Le_Village_de_Tiébél.webp";
import chutesVictoria from "@/games/PuzzleGame/assets/Site_touristique/Les_Chutes_Victoria_.webp";
import dunesSossus from "@/games/PuzzleGame/assets/Site_touristique/Les_Dunes_de_Sossusv.webp";
import okavango from "@/games/PuzzleGame/assets/Site_touristique/Okanvango.webp";
import tableMountain from "@/games/PuzzleGame/assets/Site_touristique/Table_Mountain.webp";

export interface PuzzleImage {
  id: string;
  name: string;
  nameEn: string;
  url: string;
  category: string;
}

export interface Level {
  id: number;
  name: string;
  grid: number;
  requiredPoints: number;
  category: string;
  images: PuzzleImage[];
  timeLimit: number; // seconds
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Animaux Africains",
    grid: 3,
    requiredPoints: 0,
    category: "animals",
    timeLimit: 180,
    images: [
      { id: "a1", name: "L'Inseparable à face rouge", nameEn: "L'Inseparable à face rouge", url: inseparable, category: "animals" },
      { id: "a2", name: "L'Oryctérope du Cap", nameEn: "L'Oryctérope du Cap", url: orycterope, category: "animals" },
      { id: "a3", name: "La Grue Royale", nameEn: "La Grue Royale", url: grueRoyale, category: "animals" },
      { id: "a4", name: "Le Caracal", nameEn: "Le Caracal", url: caracal, category: "animals" },
      { id: "a5", name: "Le Lycaon", nameEn: "Le Lycaon", url: lycaon, category: "animals" },
      { id: "a6", name: "Le Ratel", nameEn: "Le Ratel", url: ratel, category: "animals" },
      { id: "a7", name: "Le Serval", nameEn: "Le Serval", url: serval, category: "animals" },
      { id: "a8", name: "L'Okapi", nameEn: "L'Okapi", url: okapi, category: "animals" },
      { id: "a9", name: "Le Pangolin", nameEn: "Le Pangolin", url: pangolin, category: "animals" },
      { id: "a10", name: "Le Shoebill Stork", nameEn: "Le Shoebill Stork", url: shoebill, category: "animals" },
    ],
  },
  {
    id: 2,
    name: "Paysages du Togo/Afrique",
    grid: 4,
    requiredPoints: 2500,
    category: "landscapes",
    timeLimit: 240,
    images: [
      { id: "l1", name: "La Cascade de Kpimé", nameEn: "Cascade de Kpimé", url: cascadeKpime, category: "landscapes" },
      { id: "l2", name: "Le Désert du Sahara", nameEn: "Désert du Sahara", url: desertSahara, category: "landscapes" },
      { id: "l3", name: "Koutammakou", nameEn: "Koutammakou", url: koutammakou, category: "landscapes" },
      { id: "l4", name: "L'Avenue des Baobabs", nameEn: "L'Avenue des Baobabs", url: avenueBaobabs, category: "landscapes" },
      { id: "l5", name: "Le Mont Kilimandjaro", nameEn: "Le Mont Kilimandjaro", url: kilimandjaro, category: "landscapes" },
      { id: "l6", name: "Le Village de Tiébélé", nameEn: "Le Village de Tiébélé", url: tiebele, category: "landscapes" },
      { id: "l7", name: "Les Chutes Victoria", nameEn: "Les Chutes Victoria", url: chutesVictoria, category: "landscapes" },
      { id: "l8", name: "Les Dunes de Sossusvlei", nameEn: "Les Dunes de Sossusvlei", url: dunesSossus, category: "landscapes" },
      { id: "l9", name: "Delta de l'Okavango", nameEn: "Delta de l'Okavango", url: okavango, category: "landscapes" },
      { id: "l10", name: "Table Mountain", nameEn: "Table Mountain", url: tableMountain, category: "landscapes" },
    ],
  },
  {
    id: 3,
    name: "Monuments et Cultures",
    grid: 5,
    requiredPoints: 3500,
    category: "monuments",
    timeLimit: 480,
    images: [
      { id: "m1", name: "Angkor_wat", nameEn: "Angkor wat au cambodge", url: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m2", name: "basilique_notre_dame_de_la_paix", nameEn: "basilique notre de la paix en cote d'ivoire", url: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m3", name: "Danseur_masque", nameEn: "Danseur de masque mali", url: "https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m4", name: "Eglise_saint_georges", nameEn: "Eglise saint georges en ethiopie", url: "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m5", name: "La_Tour_Eiffel", nameEn: "La tour eiffel en France", url: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m6", name: "Le_Collisee", nameEn: "Le collisee en Italie", url: "https://images.unsplash.com/photo-1534854638093-bada1813ca19?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m7", name: "Le_Taj_mahal", nameEn: "Le Taj mahal en Inde", url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m8", name: "Maison_des_esclaves", nameEn: "Maison des esclaves au senegal", url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m9", name: "Muraille_de_de_chine", nameEn: "La muraille de chine", url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m10", name: "Pachou_Pichou", nameEn: "Le Pachou Pichou au Perou", url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m11", name: "Renaissance", nameEn: "Monument de la renaissance au senegal", url: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=600&h=600&fit=crop", category: "monuments" },
      { id: "m12", name: "Village_Traditionnel", nameEn: "Village Massai au kenya", url: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=600&h=600&fit=crop", category: "monuments" },
    ],
  },
];

export const POINT_THRESHOLDS = {
  1: 0,
  2: 500,
  3: 1200,
};

export function calculateStars(completed: boolean, underTime: boolean, noErrors: boolean): number {
  if (!completed) return 0;
  let stars = 1;
  if (underTime) stars++;
  if (noErrors) stars++;
  return stars;
}

export function calculatePoints(grid: number, timeLeft: number, stars: number, combo: number): number {
  const basePoints = grid * grid * 10;
  const timeBonus = Math.floor(timeLeft * 2);
  const starBonus = stars * 50;
  const multiplier = combo >= 3 ? 2 : 1;
  return (basePoints + timeBonus + starBonus) * multiplier;
}
