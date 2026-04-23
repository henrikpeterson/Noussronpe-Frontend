// src/games/math-Puzzle/lib/mathOperations.ts
//
// Générateur d'exercices mathématiques progressifs
// 
// AMÉLIORATIONS :
// ✅ Évite les doublons d'opérations ET de résultats
// ✅ Équilibre les types d'exercices (33% addition, 33% multiplication, etc.)
// ✅ Difficulté progressive dans chaque niveau
// ✅ Meilleure lisibilité (fonctions helper)
// ✅ Gestion des cas limites (division par zéro, racines négatives)

export type GradeLevel = '6eme' | '5eme' | '4eme' | '3eme' | '2nde' | '1ere' | 'terminale';

export interface MathPiece {
  id: number;
  operation: string;
  result: number;
  resultDisplay?: string;   // 🆕 Affichage du résultat (ex: "5/7")
  difficulty?: 'easy' | 'medium' | 'hard'; // 🆕 Pour adapter le puzzle
}

// ════════════════════════════════════════════════════════════════
// 🛠️ UTILITAIRES
// ════════════════════════════════════════════════════════════════

/** Génère un entier aléatoire entre min et max (inclus) */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Choisit un élément aléatoire dans un tableau */
function randomChoice<T>(arr:readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

/** Calcule le PGCD (pour simplifier les fractions) */
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** Simplifie une fraction */
function simplifyFraction(num: number, denom: number): { num: number; denom: number } {
  const divisor = gcd(num, denom);
  return { num: num / divisor, denom: denom / divisor };
}

/** Factorielle (pour combinaisons) */
function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/** Génère un hash unique pour détecter les opérations identiques */
function operationHash(op: string): string {
  // Normalise "3 × 5" et "5 × 3" → même hash pour multiplication/addition
  const normalized = op
    .replace(/\s+/g, '')
    .split(/([+×])/g)
    .filter(Boolean)
    .sort()
    .join('');
  return normalized;
}

// ════════════════════════════════════════════════════════════════
// 🎯 GÉNÉRATEURS PAR NIVEAU
// ════════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────
// 6ÈME : Opérations de base
// ──────────────────────────────────────────────────────────────
function generate6eme(): MathPiece {
  
  const categories = ['entiers', 'decimaux'];
  const category = randomChoice(categories);
  
  let operation: string, result: number, difficulty: 'easy' | 'medium' | 'hard';

  if (category === 'entiers') { 
    const types = ['addition', 'subtraction', 'multiplication', 'addition_3', 'multiplication_3', 'soustraction', 'division_euclidienne'];
    const type = randomChoice(types);
  
    switch (type) {
      case 'addition': {
        const a = randInt(10, 500);
        const b = randInt(10, 500);
        result = a + b;
        operation = `${a} + ${b}`;
        difficulty = result > 150 ? 'hard' : result > 100 ? 'medium' : 'easy';
        break;
      }
      
      case 'addition_3': {
          // Addition de 3 nombres : 46+37+54
          const a = randInt(10, 99);
          const b = randInt(10, 99);
          const c = randInt(10, 99);
          result = a + b + c;
          operation = `${a} + ${b} + ${c}`;
          difficulty = result > 200 ? 'hard' : result > 150 ? 'medium' : 'easy';
          break;
      }
      
      case 'multiplication': {
          // Multiplication : 117 × 83
          const a = randInt(50, 200);
          const b = randInt(50, 99);
          result = a * b;
          operation = `${a} × ${b}`;
          difficulty = result > 10000 ? 'hard' : 'medium';
          break;
      }
        
      case 'multiplication_3': {
          // Multiplication de 3 nombres : 4 × 56 × 25
          const a = randInt(2, 9);
          const b = randInt(10, 99);
          const c = randInt(10, 50);
          result = a * b * c;
          operation = `${a} × ${b} × ${c}`;
          difficulty = result > 15000 ? 'hard' : result > 5000 ? 'medium' : 'easy';
          break;
        }
      
      case 'soustraction': {
          // Soustraction : 1856 - 525
          const a = randInt(500, 2000);
          const b = randInt(100, a - 50);
          result = a - b;
          operation = `${a} - ${b}`;
          difficulty = a > 1500 ? 'hard' : 'medium';
          break;
        }

      case 'subtraction': {
        const a = randInt(30, 500);
        const b = randInt(10, a - 5); // Assure un résultat positif
        result = a - b;
        operation = `${a} - ${b}`;
        difficulty = a > 70 ? 'medium' : 'easy';
        break;
      }
      
      default: { //'division_euclidienne'
          const diviseur = randInt(5, 25);
          const quotient = randInt(10, 100);
          const reste = randInt(0, diviseur - 1);
          const dividende = diviseur * quotient + reste;
          
          result = quotient; // Le résultat est le quotient
          operation = `${dividende} ÷ ${diviseur}`;
          difficulty = dividende > 500 ? 'hard' : 'medium';
      }
    }

} else {
  // ─── NOMBRES DÉCIMAUX ───
  const types = ['addition_dec', 'soustraction_dec', 'mult_decimaux'];
  const type = randomChoice(types);
  
  switch (type) {
    case 'addition_dec': {
      // Addition : 15,2 + 0,57
      const a = randInt(10, 99) + randInt(1, 9) / 10;
      const b = randInt(1, 99) / 100;
      result = Math.round((a + b) * 100) / 100;
      operation = `${a.toFixed(1).replace('.', ',')} + ${b.toFixed(2).replace('.', ',')}`;
      difficulty = 'easy';
      break;
    }
    
    case 'soustraction_dec': {
      // Soustraction : 16,5 - 0,25
      const a = randInt(10, 99) + randInt(1, 9) / 10;
      const b = randInt(1, 99) / 100;
      result = Math.round((a - b) * 100) / 100;
      operation = `${a.toFixed(1).replace('.', ',')} - ${b.toFixed(2).replace('.', ',')}`;
      difficulty = 'easy';
      break;
    }
    
    default: { // mult_decimaux
      const multTypes = ['simple', 'double', 'avance'];
      const multType = randomChoice(multTypes);
      
      let a: number, b: number;
      
      switch (multType) {
        case 'simple': {
          // Décimal × Entier : 3,5 × 4
          a = randInt(10, 99) / 10;
          b = randInt(2, 9);
          result = Math.round(a * b * 100) / 100;
          operation = `${a.toFixed(1).replace('.', ',')} × ${b}`;
          difficulty = 'easy';
          break;
        }
        
        case 'double': {
          // Deux décimaux : 5,35 × 2,5
          a = randInt(100, 999) / 100;
          b = randInt(10, 99) / 10;
          result = Math.round(a * b * 100) / 100;
          operation = `${a.toFixed(2).replace('.', ',')} × ${b.toFixed(1).replace('.', ',')}`;
          difficulty = 'medium';
          break;
        }
        
        default: { // avance
          // Multiplication avancée : 12,5 × 10,8
          a = randInt(100, 200) / 10;
          b = randInt(80, 150) / 10;
          result = Math.round(a * b * 100) / 100;
          operation = `${a.toFixed(1).replace('.', ',')} × ${b.toFixed(1).replace('.', ',')}`;
          difficulty = 'hard';
        }
      }
    }
  }
}
  return { id: 0, operation, result, difficulty };
}

// ══════════════════════════════════════════════════════════════
// 🔧 UTILITAIRE POUR FRACTIONS
// ══════════════════════════════════════════════════════════════

/** Calcule le PPCM (pour additions de fractions) */
function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Formate une fraction simplifiée en string */
function formatFraction(num: number, denom: number): string {
  const simplified = simplifyFraction(num, denom);
  if (simplified.denom === 1) {
    return `${simplified.num}`;
  }
  return `${simplified.num}/${simplified.denom}`;
}

/** Génère un identifiant unique pour une fraction (pour éviter les doublons) */
function fractionToDecimal(num: number, denom: number): number {
  return num / denom;
}

// ══════════════════════════════════════════════════════════════
// 🎯 5ÈME : Relatifs, somme algébrique, fractions, calcul littéral
// ══════════════════════════════════════════════════════════════

function generate5eme(): MathPiece {
  const types = ['relatifs_addition', 'relatifs_soustraction', 'somme_algebrique','fractions'];
  const type = randomChoice(types);
  
  let operation: string;
  let result: number;
  let resultDisplay: string | undefined; // 🆕 Pour afficher le résultat en fraction
  let difficulty: 'easy' | 'medium' | 'hard';
  
  switch (type) {
    case 'relatifs_addition': {
      // Addition de relatifs : (-5) + (+8)
      const a = randInt(-20, 20);
      const b = randInt(-20, 20);
      result = a + b;
      
      const signA = a >= 0 ? '+' : '';
      const signB = b >= 0 ? '+' : '';
      operation = `(${signA}${a}) + (${signB}${b})`;
      difficulty = Math.abs(result) > 25 ? 'hard' : 'medium';
      break;
    }
    
    case 'relatifs_soustraction': {
      // Soustraction de relatifs : (+7) - (-3)
      const a = randInt(-20, 20);
      const b = randInt(-20, 20);
      result = a - b;
      
      const signA = a >= 0 ? '+' : '';
      const signB = b >= 0 ? '+' : '';
      operation = `(${signA}${a}) - (${signB}${b})`;
      difficulty = Math.abs(result) > 30 ? 'hard' : 'medium';
      break;
    }
    
    case 'somme_algebrique': {
    // Somme algébrique : (-5) + (+8) + (-3) + (+2)
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    const c = randInt(-10, 10);
    result = a + b + c;
    
    // Formate avec parenthèses et signe explicite
    const formatNum = (n: number) => {
      const sign = n >= 0 ? '+' : '';
      return `(${sign}${n})`;
    };
    
    // Format de l'opération avec opérateurs entre les parenthèses
    operation = `${formatNum(a)} + ${formatNum(b)} + ${formatNum(c)}`;
    
    difficulty = 'medium';
    break;
  }
    
    default: { // fractions
      const fractionTypes = [
        'addition_meme_denom', 
        'soustraction_meme_denom', 
        'addition_diff_denom',
        'multiplication_frac',
        'division_frac'
      ];
      const fracType = randomChoice(fractionTypes);
      
      switch (fracType) {
        case 'addition_meme_denom': {
          // Addition même dénominateur : 3/7 + 2/7 = 5/7
          const denom = randomChoice([5, 6, 7, 8, 9, 10, 12]);
          const num1 = randInt(1, denom - 2);
          const num2 = randInt(1, denom - num1 - 1);
          const numResult = num1 + num2;
          
          const simplified = simplifyFraction(numResult, denom);
          result = fractionToDecimal(simplified.num, simplified.denom);
          resultDisplay = formatFraction(numResult, denom);
          
          operation = `${num1}/${denom} + ${num2}/${denom}`;
          difficulty = 'easy';
          break;
        }
        
        case 'soustraction_meme_denom': {
          // Soustraction même dénominateur : 5/8 - 2/8 = 3/8
          const denom = randomChoice([5, 6, 7, 8, 9, 10, 12]);
          const num1 = randInt(3, denom - 1);
          const num2 = randInt(1, num1 - 1);
          const numResult = num1 - num2;
          
          const simplified = simplifyFraction(numResult, denom);
          result = fractionToDecimal(simplified.num, simplified.denom);
          resultDisplay = formatFraction(numResult, denom);
          
          operation = `${num1}/${denom} - ${num2}/${denom}`;
          difficulty = 'easy';
          break;
        }
        
        case 'addition_diff_denom': {
          // Addition dénominateurs différents : 1/3 + 1/4 = 7/12
          const denom1 = randomChoice([2, 3, 4, 5, 6]);
          const denom2 = randomChoice([2, 3, 4, 5, 6].filter(d => d !== denom1));
          const num1 = randInt(1, denom1 - 1);
          const num2 = randInt(1, denom2 - 1);
          
          const denomCommun = lcm(denom1, denom2);
          const numResult = num1 * (denomCommun / denom1) + num2 * (denomCommun / denom2);
          
          const simplified = simplifyFraction(numResult, denomCommun);
          result = fractionToDecimal(simplified.num, simplified.denom);
          resultDisplay = formatFraction(numResult, denomCommun);
          
          operation = `${num1}/${denom1} + ${num2}/${denom2}`;
          difficulty = 'medium';
          break;
        }
        
        case 'multiplication_frac': {
          // Multiplication : 2/3 × 4/5 = 8/15
          const num1 = randInt(2, 7);
          const denom1 = randInt(num1 + 1, 10);
          const num2 = randInt(2, 7);
          const denom2 = randInt(num2 + 1, 10);
          
          const numResult = num1 * num2;
          const denomResult = denom1 * denom2;
          
          const simplified = simplifyFraction(numResult, denomResult);
          result = fractionToDecimal(simplified.num, simplified.denom);
          resultDisplay = formatFraction(numResult, denomResult);
          
          operation = `${num1}/${denom1} × ${num2}/${denom2}`;
          difficulty = 'medium';
          break;
        }
        
        default: { // division_frac
          // Division : 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6
          const num1 = randInt(2, 6);
          const denom1 = randInt(num1 + 1, 9);
          const num2 = randInt(2, 6);
          const denom2 = randInt(num2 + 1, 9);
          
          // Division = multiplication par l'inverse
          const numResult = num1 * denom2;
          const denomResult = denom1 * num2;
          
          const simplified = simplifyFraction(numResult, denomResult);
          result = fractionToDecimal(simplified.num, simplified.denom);
          resultDisplay = formatFraction(numResult, denomResult);
          
          operation = `${num1}/${denom1} ÷ ${num2}/${denom2}`;
          difficulty = 'hard';
        }
      }
    }
  }
  
  return { id: 0, operation, result, resultDisplay, difficulty };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 4ÈME : Développement, Factorisation, Calcul littéral, Équations, Puissances
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Formate une expression algébrique proprement
 * Gère tous les cas particuliers :
 * - 1x → x
 * - -1x → -x
 * - 0x + 5 → 5
 * - 3x + -5 → 3x - 5
 * - 0 → "0"
 */
function formatAlgebraic(coefficient: number, variable: string = 'x', constant: number = 0): string {
  const parts: string[] = [];
  
  // Gérer le terme avec variable
  if (coefficient !== 0) {
    if (coefficient === 1) {
      parts.push(variable);
    } else if (coefficient === -1) {
      parts.push(`-${variable}`);
    } else {
      parts.push(`${coefficient}${variable}`);
    }
  }
  
  // Gérer la constante
  if (constant !== 0) {
    if (parts.length === 0) {
      // Premier terme, pas de signe
      parts.push(`${constant}`);
    } else {
      // Ajouter avec le bon signe
      const sign = constant > 0 ? '+' : '';
      parts.push(`${sign}${constant}`);
    }
  }
  
  // Cas spécial : tout est nul
  if (parts.length === 0) return '0';
  
  return parts.join('');
}

/**
 * Formate une expression polynomiale du second degré
 * Exemple : 1x² + 3x + 2 → "x²+3x+2"
 */
function formatQuadratic(a: number, b: number, c: number, variable: string = 'x'): string {
  const parts: string[] = [];
  
  // Terme en x²
  if (a !== 0) {
    if (a === 1) {
      parts.push(`${variable}²`);
    } else if (a === -1) {
      parts.push(`-${variable}²`);
    } else {
      parts.push(`${a}${variable}²`);
    }
  }
  
  // Terme en x
  if (b !== 0) {
    const sign = b > 0 && parts.length > 0 ? '+' : '';
    if (b === 1) {
      parts.push(`${sign}${variable}`);
    } else if (b === -1) {
      parts.push(`-${variable}`);
    } else {
      parts.push(`${sign}${b}${variable}`);
    }
  }
  
  // Constante
  if (c !== 0) {
    const sign = c > 0 && parts.length > 0 ? '+' : '';
    parts.push(`${sign}${c}`);
  }
  
  return parts.length > 0 ? parts.join('') : '0';
}

/**
 * Formate une expression avec parenthèses
 * Exemple : k(ax+b) avec gestion intelligente des signes
 */
function formatParentheses(factor: number, a: number, b: number, variable: string = 'x'): string {
  // Construire l'intérieur de la parenthèse
  let inner = '';
  
  if (a !== 0) {
    if (a === 1) {
      inner = variable;
    } else if (a === -1) {
      inner = `-${variable}`;
    } else {
      inner = `${a}${variable}`;
    }
  }
  
  if (b !== 0) {
    const sign = b > 0 ? '+' : '';
    inner += `${sign}${b}`;
  }
  
  // Ajouter le facteur
  if (factor === 1) {
    return `(${inner})`;
  } else if (factor === -1) {
    return `-(${inner})`;
  } else {
    return `${factor}(${inner})`;
  }
}

function generate4eme(): MathPiece {
  // Distribution équilibrée des types d'exercices
  const types = [
    'developpement',
    'developpement',
    'developpement',
    'factorisation',
    'factorisation',
    'factorisation',
    'reduction_sommes',      // NOUVEAU : remplace calcul_litteral
    'reduction_sommes',      // NOUVEAU
    'developpement_reduire', // NOUVEAU : développement avec réduction
    'developpement_reduire', // NOUVEAU
    'developpement_facteur', // NOUVEAU : développement avec facteur
    'developpement_facteur', // NOUVEAU
    'equations',
    'equations',
    'puissances'
  ] as const;
  
  const type = randomChoice(types);
  
  let operation: string;
  let result: number;
  let resultDisplay: string | undefined;
  let difficulty: 'easy' | 'medium' | 'hard';
  
  switch (type) {
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │                    DÉVELOPPEMENT (inchangé)                          │
    // └─────────────────────────────────────────────────────────────────────┘
    case 'developpement': {
      const devTypes = ['simple', 'avec_soustraction', 'double', 'identite'] as const;
      const devType = randomChoice(devTypes);
      
      switch (devType) {
        case 'simple': {
          const k = randInt(2, 6);
          const a = randInt(1, 4);
          const b = randInt(-8, 8);
          
          operation = formatParentheses(k, a, b);
          
          const coeffX = k * a;
          const constante = k * b;
          resultDisplay = formatAlgebraic(coeffX, 'x', constante);
          
          result = 0;
          difficulty = Math.abs(constante) > 20 ? 'medium' : 'easy';
          break;
        }
        
        case 'avec_soustraction': {
          const subType = randomChoice(['simple', 'avec_x']);
          
          if (subType === 'simple') {
            const a = randInt(3, 8);
            const b = randInt(1, a - 1);
            const c = randInt(1, 9);
            
            operation = `${a}x - (${b}x - ${c})`;
            
            const coeffX = a - b;
            resultDisplay = formatAlgebraic(coeffX, 'x', c);
            
            result = 0;
            difficulty = 'medium';
          } else {
            const a = randInt(2, 7);
            const b = randInt(1, 9);
            const c = randInt(1, a - 1);
            const d = randInt(1, 9);
            
            operation = `(${a}x + ${b}) - (${c}x + ${d})`;
            
            const coeffX = a - c;
            const constante = b - d;
            resultDisplay = formatAlgebraic(coeffX, 'x', constante);
            
            result = 0;
            difficulty = Math.abs(constante) > 15 ? 'hard' : 'medium';
          }
          break;
        }
        
        case 'double': {
          const a = randInt(1, 5);
          const b = randInt(1, 5);
          
          operation = `(x + ${a})(x + ${b})`;
          
          const coeffX = a + b;
          const constante = a * b;
          resultDisplay = formatQuadratic(1, coeffX, constante);
          
          result = 0;
          difficulty = 'hard';
          break;
        }
        
        case 'identite': {
          const idType = randomChoice(['carre_somme', 'carre_difference']);
          
          if (idType === 'carre_somme') {
            const a = randInt(2, 6);
            operation = `(x + ${a})²`;
            resultDisplay = formatQuadratic(1, 2 * a, a * a);
            difficulty = 'hard';
          } else {
            const a = randInt(2, 6);
            operation = `(x - ${a})²`;
            resultDisplay = formatQuadratic(1, -2 * a, a * a);
            difficulty = 'hard';
          }
          
          result = 0;
          break;
        }
      }
      break;
    }
    
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │                    FACTORISATION (inchangé)                          │
    // └─────────────────────────────────────────────────────────────────────┘
    case 'factorisation': {
      const factoTypes = ['facteur_commun', 'facteur_x', 'identite'] as const;
      const factoType = randomChoice(factoTypes);
      
      switch (factoType) {
        case 'facteur_commun': {
          const k = randomChoice([2, 3, 4, 5, 6]);
          const b = randInt(2, 9);
          
          operation = formatAlgebraic(k, 'x', k * b);
          resultDisplay = formatParentheses(k, 1, b);
          
          result = 0;
          difficulty = 'easy';
          break;
        }
        
        case 'facteur_x': {
          const a = randInt(2, 7);
          const b = randInt(2, 9);
          
          operation = formatQuadratic(a, b, 0);
          
          if (a === 1) {
            resultDisplay = `x(x + ${b})`;
          } else {
            resultDisplay = `x(${a}x + ${b})`;
          }
          
          result = 0;
          difficulty = 'medium';
          break;
        }
        
        case 'identite': {
          const a = randInt(3, 8);
          
          operation = `x² - ${a * a}`;
          resultDisplay = `(x - ${a})(x + ${a})`;
          
          result = 0;
          difficulty = 'hard';
          break;
        }
      }
      break;
    }
    
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │              NOUVEAU : RÉDUCTION DE SOMMES ALGÉBRIQUES               │
    // │              Ex: 1,5b - 3,7b + 2,5b = 0,3b                           │
    // └─────────────────────────────────────────────────────────────────────┘
    case 'reduction_sommes': {
      const variable = randomChoice(['x', 'y', 'b', 'm', 't', 'a']);
      
      // Générer entre 3 et 5 termes
      const nbTermes = randInt(3, 5);
      const termes: number[] = [];
      let somme = 0;
      
      for (let i = 0; i < nbTermes; i++) {
        // Générer des coefficients avec une décimale (ex: 1,5 ou -3,7)
        const signe = randomChoice([1, -1]);
        const partieEntiere = randInt(1, 9);
        const partieDecimale = randInt(0, 9);
        const coef = signe * (partieEntiere + partieDecimale / 10);
        termes.push(coef);
        somme += coef;
      }
      
      // Arrondir à 1 décimale pour éviter les erreurs de virgule flottante
      somme = Math.round(somme * 10) / 10;
      
      // Construire l'opération
      let operationStr = '';
      for (let i = 0; i < termes.length; i++) {
        const coef = termes[i];
        if (i === 0) {
          operationStr = `${coef.toFixed(1).replace('.', ',')}${variable}`;
        } else {
          const signe = coef > 0 ? '+' : '';
          operationStr += ` ${signe} ${coef.toFixed(1).replace('.', ',')}${variable}`;
        }
      }
      operation = operationStr.replace(/\s+/g, ' ');
      
      // Résultat
      if (somme === 0) {
        resultDisplay = '0';
      } else if (somme === 1) {
        resultDisplay = variable;
      } else if (somme === -1) {
        resultDisplay = `-${variable}`;
      } else {
        const sommeStr = somme.toFixed(1).replace('.', ',');
        // Enlever le ",0" si c'est un entier
        if (sommeStr.endsWith(',0')) {
          resultDisplay = `${sommeStr.slice(0, -2)}${variable}`;
        } else {
          resultDisplay = `${sommeStr}${variable}`;
        }
      }
      
      result = 0;
      difficulty = somme === 0 ? 'easy' : 'medium';
      break;
    }
    
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │           NOUVEAU : DÉVELOPPER ET RÉDUIRE                            │
    // │           Ex: 2(3x - 4) - 2x = 4x - 8                                │
    // └─────────────────────────────────────────────────────────────────────┘
    case 'developpement_reduire': {
      const reduireTypes = ['simple', 'avec_parentheses', 'double_parentheses'] as const;
      const reduireType = randomChoice(reduireTypes);
      
      switch (reduireType) {
        case 'simple': {
          // Type: 2(3x - 4) - 2x
          const k = randInt(2, 4);
          const a = randInt(2, 5);
          const b = randInt(-9, 9);
          const c = randInt(1, 5); // coefficient du terme hors parenthèses
          
          // Opération
          const signB = b >= 0 ? '+' : '';
          const innerExpr = `${a}x${signB}${b}`;
          operation = `${k}(${innerExpr}) - ${c}x`;
          
          // Calcul
          const coeffX = k * a - c;
          const constante = k * b;
          resultDisplay = formatAlgebraic(coeffX, 'x', constante);
          
          result = 0;
          difficulty = 'medium';
          break;
        }
        
        case 'avec_parentheses': {
          // Type: 3(-2y - 3) + 2(y - 7)
          const k1 = randInt(2, 4);
          const a1 = randInt(-5, 5);
          const b1 = randInt(-9, 9);
          const k2 = randInt(1, 3);
          const a2 = randInt(1, 4);
          const b2 = randInt(-9, 9);
          
          // Éviter que a1 = 0
          const a1Safe = a1 === 0 ? 1 : a1;
          
          // Construction
          const signA1 = a1Safe >= 0 ? '' : '-';
          const signB1 = b1 >= 0 ? '+' : '';
          const inner1 = `${signA1}${Math.abs(a1Safe)}y${signB1}${b1}`;
          
          const signA2 = a2 >= 0 ? '' : '-';
          const signB2 = b2 >= 0 ? '+' : '';
          const inner2 = `${signA2}${Math.abs(a2)}y${signB2}${b2}`;
          
          operation = `${k1}(${inner1}) + ${k2}(${inner2})`;
          
          // Calcul
          const coeffX = k1 * a1Safe + k2 * a2;
          const constante = k1 * b1 + k2 * b2;
          resultDisplay = formatAlgebraic(coeffX, 'y', constante);
          
          result = 0;
          difficulty = 'hard';
          break;
        }
        
        default: {
          // Type: U = (2x - 1)(3x + 2)
          const a = randInt(2, 4);
          const b = randInt(-3, 3);
          const c = randInt(2, 5);
          const d = randInt(1, 5);
          
          // Éviter b = 0
          const bSafe = b === 0 ? 1 : b;
          
          const signB = bSafe >= 0 ? '+' : '';
          const signD = d >= 0 ? '+' : '';
          
          operation = `(${a}x ${signB} ${Math.abs(bSafe)})(${c}x ${signD} ${d})`;
          
          // Calcul : (ax + b)(cx + d) = ac·x² + (ad + bc)x + bd
          const coeffX2 = a * c;
          const coeffX = a * d + bSafe * c;
          const constante = bSafe * d;
          
          if (coeffX2 === 1) {
            resultDisplay = formatQuadratic(1, coeffX, constante);
          } else {
            resultDisplay = `${coeffX2}x²` + 
              (coeffX !== 0 ? (coeffX > 0 ? '+' : '') + coeffX + 'x' : '') +
              (constante !== 0 ? (constante > 0 ? '+' : '') + constante : '');
          }
          
          result = 0;
          difficulty = 'hard';
        }
      }
      break;
    }
    
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │           NOUVEAU : DÉVELOPPER DES EXPRESSIONS À FACTEUR             │
    // │           Ex: 6a(7a² - 6a + 2) = 42a³ - 36a² + 12a                   │
    // └─────────────────────────────────────────────────────────────────────┘
    case 'developpement_facteur': {
      const facteurTypes = ['quadratique', 'cubique'] as const;
      const facteurType = randomChoice(facteurTypes);
      
      if (facteurType === 'quadratique') {
        // Type: 6a(7a² - 6a + 2)
        const k = randInt(3, 8);
        const a = randInt(2, 7);
        const b = randInt(-6, -1); // Souvent négatif pour varier
        const c = randInt(1, 5);
        
        const signB = b >= 0 ? '+' : '';
        const inner = `${a}a² ${signB} ${Math.abs(b)}a + ${c}`;
        operation = `${k}a(${inner})`;
        
        // Résultat
        const coeff3 = k * a;
        const coeff2 = k * b;
        const coeff1 = k * c;
        
        let resultat = '';
        if (coeff3 !== 0) {
          resultat += coeff3 === 1 ? 'a³' : coeff3 === -1 ? '-a³' : `${coeff3}a³`;
        }
        if (coeff2 !== 0) {
          const signe = coeff2 > 0 && resultat.length > 0 ? '+' : '';
          if (coeff2 === 1) {
            resultat += `${signe}a²`;
          } else if (coeff2 === -1) {
            resultat += `-a²`;
          } else {
            resultat += `${signe}${coeff2}a²`;
          }
        }
        if (coeff1 !== 0) {
          const signe = coeff1 > 0 && resultat.length > 0 ? '+' : '';
          if (coeff1 === 1) {
            resultat += `${signe}a`;
          } else if (coeff1 === -1) {
            resultat += `-a`;
          } else {
            resultat += `${signe}${coeff1}a`;
          }
        }
        
        resultDisplay = resultat || '0';
        result = 0;
        difficulty = 'medium';
      } else {
        // Type: -3c³(-c⁴ + 2c² + 1)
        const k = randInt(-5, -2); // Coefficient négatif
        const puissance = randInt(2, 3);
        const a = randInt(-3, -1);
        const b = randInt(1, 3);
        const c = randInt(1, 2);
        
        const variable = randomChoice(['c', 'x', 'y', 'a']);
        
        const signA = a >= 0 ? '+' : '';
        const signB = b >= 0 ? '+' : '';
        
        const expVar = puissance === 2 ? '²' : '³';
        const expA = '⁴';
        const expB = '²';
        
        operation = `${k}${variable}${expVar}(${a}${variable}${expA} ${signB} ${b}${variable}${expB} + ${c})`;
        
        // Calcul
        const degre1 = puissance + 4;
        const degre2 = puissance + 2;
        const degre3 = puissance;
        
        const coeff1 = k * a;
        const coeff2 = k * b;
        const coeff3 = k * c;
        
        let resultat = '';
        
        // Terme de plus haut degré
        if (coeff1 !== 0) {
          if (coeff1 === 1) {
            resultat += `${variable}${degre1 === 2 ? '²' : degre1 === 3 ? '³' : degre1 === 4 ? '⁴' : degre1 === 5 ? '⁵' : degre1 === 6 ? '⁶' : '⁷'}`;
          } else if (coeff1 === -1) {
            resultat += `-${variable}${degre1 === 2 ? '²' : degre1 === 3 ? '³' : degre1 === 4 ? '⁴' : degre1 === 5 ? '⁵' : degre1 === 6 ? '⁶' : '⁷'}`;
          } else {
            resultat += `${coeff1}${variable}${degre1 === 2 ? '²' : degre1 === 3 ? '³' : degre1 === 4 ? '⁴' : degre1 === 5 ? '⁵' : degre1 === 6 ? '⁶' : '⁷'}`;
          }
        }
        
        // Deuxième terme
        if (coeff2 !== 0) {
          const signe = coeff2 > 0 && resultat.length > 0 ? '+' : '';
          if (coeff2 === 1) {
            resultat += `${signe}${variable}${degre2 === 2 ? '²' : degre2 === 3 ? '³' : degre2 === 4 ? '⁴' : degre2 === 5 ? '⁵' : '⁶'}`;
          } else if (coeff2 === -1) {
            resultat += `-${variable}${degre2 === 2 ? '²' : degre2 === 3 ? '³' : degre2 === 4 ? '⁴' : degre2 === 5 ? '⁵' : '⁶'}`;
          } else {
            resultat += `${signe}${coeff2}${variable}${degre2 === 2 ? '²' : degre2 === 3 ? '³' : degre2 === 4 ? '⁴' : degre2 === 5 ? '⁵' : '⁶'}`;
          }
        }
        
        // Troisième terme
        if (coeff3 !== 0) {
          const signe = coeff3 > 0 && resultat.length > 0 ? '+' : '';
          if (coeff3 === 1) {
            resultat += `${signe}${variable}${degre3 === 2 ? '²' : degre3 === 3 ? '³' : '⁴'}`;
          } else if (coeff3 === -1) {
            resultat += `-${variable}${degre3 === 2 ? '²' : degre3 === 3 ? '³' : '⁴'}`;
          } else {
            resultat += `${signe}${coeff3}${variable}${degre3 === 2 ? '²' : degre3 === 3 ? '³' : '⁴'}`;
          }
        }
        
        resultDisplay = resultat || '0';
        result = 0;
        difficulty = 'hard';
      }
      break;
    }
    
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │                    ÉQUATIONS & INÉQUATIONS                           │
    // └─────────────────────────────────────────────────────────────────────┘
    case 'equations': {
      const eqTypes = ['simple_addition', 'simple_multiplication', 'deux_etapes', 'inequation'] as const;
      const eqType = randomChoice(eqTypes);
      
      switch (eqType) {
        case 'simple_addition': {
          const a = randInt(1, 20);
          const b = randInt(a + 1, 35);
          result = b - a;
          
          operation = `Résoudre : x + ${a} = ${b}`;
          resultDisplay = `x = ${result}`;
          
          difficulty = 'easy';
          break;
        }
        
        case 'simple_multiplication': {
          const a = randomChoice([2, 3, 4, 5, 6, 7]);
          const x = randInt(2, 12);
          const b = a * x;
          result = x;
          
          operation = `Résoudre : ${a}x = ${b}`;
          resultDisplay = `x = ${result}`;
          
          difficulty = 'easy';
          break;
        }
        
        case 'deux_etapes': {
          const a = randInt(2, 5);
          const x = randInt(2, 8);
          const b = randInt(1, 10);
          const c = a * x + b;
          result = x;
          
          operation = `Résoudre : ${a}x + ${b} = ${c}`;
          resultDisplay = `x = ${result}`;
          
          difficulty = 'medium';
          break;
        }
        
        case 'inequation': {
          const ineqSymbols = ['>', '<', '≥', '≤'] as const;
          const symbol = randomChoice(ineqSymbols);
          
          const a = randInt(1, 15);
          const b = randInt(a + 2, 25);
          
          result = b - a;
          
          operation = `Résoudre : x + ${a} ${symbol} ${b}`;
          resultDisplay = `x ${symbol} ${result}`;
          
          difficulty = 'medium';
          break;
        }
      }
      break;
    }
    
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │                          PUISSANCES                                  │
    // └─────────────────────────────────────────────────────────────────────┘
    default: { // puissances
      const powTypes = ['simple', 'produit', 'quotient', 'puissance_puissance'] as const;
      const powType = randomChoice(powTypes);
      
      switch (powType) {
        case 'simple': {
          const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10];
          const base = randomChoice(bases);
          
          const maxExp = base === 2 ? 8 :
                         base === 3 ? 5 :
                         base <= 5 ? 4 : 3;
          
          const exp = randInt(2, maxExp);
          result = Math.pow(base, exp);
          
          const expSymbol = exp === 2 ? '²' : 
                           exp === 3 ? '³' : 
                           exp === 4 ? '⁴' : 
                           exp === 5 ? '⁵' : `^${exp}`;
          
          operation = `${base}${expSymbol}`;
          resultDisplay = `${result}`;
          
          difficulty = result > 200 ? 'hard' : 
                      result > 50 ? 'medium' : 'easy';
          break;
        }
        
        case 'produit': {
          const base = randomChoice([2, 3, 4, 5]);
          const n = randomChoice([2, 3]);
          const m = randomChoice([2, 3]);
          
          result = Math.pow(base, n + m);
          
          const nSymbol = n === 2 ? '²' : '³';
          const mSymbol = m === 2 ? '²' : '³';
          
          operation = `${base}${nSymbol} × ${base}${mSymbol}`;
          resultDisplay = `${base}^${n + m} = ${result}`;
          
          difficulty = 'medium';
          break;
        }
        
        case 'quotient': {
          const base = randomChoice([2, 3, 5, 10]);
          const n = randInt(4, 6);
          const m = randInt(2, n - 2);
          
          result = Math.pow(base, n - m);
          
          const nSymbol = n === 4 ? '⁴' : 
                         n === 5 ? '⁵' : '⁶';
          const mSymbol = m === 2 ? '²' : '³';
          
          operation = `${base}${nSymbol} ÷ ${base}${mSymbol}`;
          resultDisplay = `${base}^${n - m} = ${result}`;
          
          difficulty = 'medium';
          break;
        }
        
        case 'puissance_puissance': {
          const base = randomChoice([2, 3, 4]);
          const n = randomChoice([2, 3]);
          const m = randomChoice([2, 3]);
          
          result = Math.pow(base, n * m);
          
          const nSymbol = n === 2 ? '²' : '³';
          const mSymbol = m === 2 ? '²' : '³';
          
          operation = `(${base}${nSymbol})${mSymbol}`;
          resultDisplay = `${base}^${n * m} = ${result}`;
          
          difficulty = 'hard';
          break;
        }
      }
    }
  }
  
  return { 
    id: 0, 
    operation, 
    result, 
    resultDisplay, 
    difficulty 
  };
}

// ──────────────────────────────────────────────────────────────
// 3ÈME : Racines, identités remarquables, puissances
// ──────────────────────────────────────────────────────────────
function generate3eme(): MathPiece {
  const types = ['sqrt', 'identite', 'power'];
  const type = randomChoice(types);
  
  let operation: string, result: number, difficulty: 'easy' | 'medium' | 'hard';
  
  switch (type) {
    case 'sqrt': {
      const root = randInt(2, 20);
      result = root;
      operation = `√${root * root}`;
      difficulty = root > 12 ? 'hard' : root > 7 ? 'medium' : 'easy';
      break;
    }
    
    case 'identite': {
      const a = randInt(3, 15);
      const b = randInt(2, a - 1);
      result = a * a - b * b;
      operation = `${a}² - ${b}²`;
      difficulty = 'hard';
      break;
    }
    
    default: { // power
      const a = randInt(2, 12);
      result = a * a;
      operation = `${a}²`;
      difficulty = a > 9 ? 'medium' : 'easy';
    }
  }
  
  return { id: 0, operation, result, difficulty };
}

// ──────────────────────────────────────────────────────────────
// 2NDE : Valeur absolue, puissances, intervalles
// ──────────────────────────────────────────────────────────────
function generate2nde(): MathPiece {
  const types = ['absolute', 'power', 'expression'];
  const type = randomChoice(types);
  
  let operation: string, result: number, difficulty: 'easy' | 'medium' | 'hard';
  
  switch (type) {
    case 'absolute': {
      const a = randInt(-50, 50);
      result = Math.abs(a);
      operation = `|${a}|`;
      difficulty = Math.abs(a) > 30 ? 'medium' : 'easy';
      break;
    }
    
    case 'power': {
      const base = randInt(2, 7);
      const exp = randInt(2, 5);
      result = Math.pow(base, exp);
      operation = `${base}^${exp}`;
      difficulty = result > 500 ? 'hard' : result > 100 ? 'medium' : 'easy';
      break;
    }
    
    default: { // expression combinée
      const a = randInt(2, 10);
      const b = randInt(2, 10);
      result = a * a + b;
      operation = `${a}² + ${b}`;
      difficulty = 'medium';
    }
  }
  
  return { id: 0, operation, result, difficulty };
}

// ──────────────────────────────────────────────────────────────
// 1ÈRE : Dérivées, suites, combinatoire
// ──────────────────────────────────────────────────────────────
function generate1ere(): MathPiece {
  const types = ['derivative', 'sequence', 'combination'];
  const type = randomChoice(types);
  
  let operation: string, result: number, difficulty: 'easy' | 'medium' | 'hard';
  
  switch (type) {
    case 'derivative': {
      const coef = randInt(1, 8);
      const exp = randInt(2, 4);
      const x = 1; // Toujours évaluer en x=1 pour simplicité
      result = coef * exp * Math.pow(x, exp - 1);
      const expSymbol = exp === 2 ? '²' : exp === 3 ? '³' : '⁴';
      operation = `f'(1) si f(x)=${coef}x${expSymbol}`;
      difficulty = 'medium';
      break;
    }
    
    case 'sequence': {
      const u0 = randInt(1, 10);
      const r = randInt(2, 5);
      const n = randInt(2, 4);
      result = u0 + n * r; // Suite arithmétique
      operation = `u${n} si u₀=${u0}, r=${r}`;
      difficulty = 'medium';
      break;
    }
    
    default: { // combination C(n,k)
      const n = randInt(4, 8);
      const k = randInt(2, Math.min(n - 2, 4));
      result = factorial(n) / (factorial(k) * factorial(n - k));
      
      if (result > 500 || !Number.isInteger(result)) {
        // Fallback sur un carré
        const a = randInt(3, 9);
        result = a * a;
        operation = `${a}²`;
        difficulty = 'easy';
      } else {
        operation = `C(${n},${k})`;
        difficulty = 'hard';
      }
    }
  }
  
  return { id: 0, operation, result, difficulty };
}

// ──────────────────────────────────────────────────────────────
// TERMINALE : Logarithmes, limites, exponentielles
// ──────────────────────────────────────────────────────────────
function generateTerminale(): MathPiece {
  const types = ['ln', 'exp', 'limit'];
  const type = randomChoice(types);
  
  let operation: string, result: number, difficulty: 'easy' | 'medium' | 'hard';
  
  switch (type) {
    case 'ln': {
      const n = randInt(1, 12);
      result = n;
      operation = `ln(e^${n})`;
      difficulty = 'easy';
      break;
    }
    
    case 'exp': {
      const a = randInt(0, 5);
      result = Math.round(Math.exp(a));
      operation = `⌊e^${a}⌋`; // Partie entière
      difficulty = 'medium';
      break;
    }
    
    default: { // limit
      const a = randInt(2, 10);
      const x0 = randInt(1, 8);
      result = a * x0;
      operation = `lim ${a}x (x→${x0})`;
      difficulty = 'easy';
    }
  }
  
  return { id: 0, operation, result, difficulty };
}

// ════════════════════════════════════════════════════════════════
// 🎲 GÉNÉRATION DU PUZZLE
// ════════════════════════════════════════════════════════════════

const generators: Record<GradeLevel, () => MathPiece> = {
  '6eme': generate6eme,
  '5eme': generate5eme,
  '4eme': generate4eme,
  '3eme': generate3eme,
  '2nde': generate2nde,
  '1ere': generate1ere,
  'terminale': generateTerminale,
};

/**
 * Génère un puzzle de `count` exercices uniques
 * 
 * AMÉLIORATIONS :
 * - Évite les doublons de résultats ET d'opérations
 * - Garantit une distribution équilibrée des difficultés
 * - Limite les tentatives pour éviter les boucles infinies
 */
export function generatePuzzle(grade: GradeLevel, count: number): MathPiece[] {
  const pieces: MathPiece[] = [];
  const usedResults = new Set<number>();
  const usedOperations = new Set<string>();
  const usedDisplays = new Set<string>(); // 🆕 CRUCIAL pour dev/facto
  
  const maxAttempts = count * 30;
  let totalAttempts = 0;
  
  while (pieces.length < count && totalAttempts < maxAttempts) {
    const piece = generators[grade]();
    
    // ─── CAS 1 : Développement/Factorisation (resultDisplay existe, result = 0) ───
    if (piece.resultDisplay && piece.result === 0) {
      const displayKey = piece.resultDisplay;
      const opKey = piece.operation;
      
      if (!usedDisplays.has(displayKey) && !usedOperations.has(opKey)) {
        piece.id = pieces.length;
        pieces.push(piece);
        usedDisplays.add(displayKey);
        usedOperations.add(opKey);
      }
    } 
    // ─── CAS 2 : Équations avec resultDisplay mais result numérique ───
    else if (piece.resultDisplay && piece.result !== 0) {
      const opKey = piece.operation;
      
      if (!usedResults.has(piece.result) && !usedOperations.has(opKey)) {
        piece.id = pieces.length;
        pieces.push(piece);
        usedResults.add(piece.result);
        usedOperations.add(opKey);
      }
    }
    // ─── CAS 3 : Calculs numériques purs (calcul littéral, puissances) ───
    else {
      const opHash = operationHash(piece.operation);
      
      if (!usedResults.has(piece.result) && !usedOperations.has(opHash)) {
        piece.id = pieces.length;
        pieces.push(piece);
        usedResults.add(piece.result);
        usedOperations.add(opHash);
      }
    }
    
    totalAttempts++;
  }
  
  // Compléter si pas assez
  while (pieces.length < count) {
    const piece = generators[grade]();
    
    if (piece.resultDisplay && piece.result === 0) {
      if (!usedDisplays.has(piece.resultDisplay)) {
        piece.id = pieces.length;
        pieces.push(piece);
        usedDisplays.add(piece.resultDisplay);
      }
    } else {
      if (!usedResults.has(piece.result)) {
        piece.id = pieces.length;
        pieces.push(piece);
        usedResults.add(piece.result);
      }
    }
  }
  
  return pieces;
}

// ════════════════════════════════════════════════════════════════
// 📋 CONFIGURATION DES NIVEAUX
// ════════════════════════════════════════════════════════════════

export const gradeLevels: { value: GradeLevel; label: string; description: string }[] = [
  { value: '6eme',     label: '6ème',      description: 'Opérations de base' },
  { value: '5eme',     label: '5ème',      description: 'Nombres relatifs & fractions' },
  { value: '4eme',     label: '4ème',      description: 'Puissances & calculs avancés' },
  { value: '3eme',     label: '3ème',      description: 'Racines & identités' },
  { value: '2nde',     label: '2nde',      description: 'Fonctions & ensembles' },
  { value: '1ere',     label: '1ère',      description: 'Dérivées & suites' },
  { value: 'terminale', label: 'Terminale', description: 'Analyse & logarithmes' },
];