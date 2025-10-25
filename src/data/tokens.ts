export interface TokenCode {
  code: string;
  value: number;
  used: boolean;
}

export interface UserTokens {
  balance: number;
  totalEarned: number;
}

// Codes de tickets disponibles (simulation)
export const availableTokenCodes: TokenCode[] = [
  { code: "EDU2024A1", value: 50, used: false },
  { code: "EDU2024B2", value: 150, used: false },
  { code: "EDU2024C3", value: 250, used: false },
  { code: "EDU2024D4", value: 500, used: false },
  { code: "EDU2024E5", value: 100, used: false },
  { code: "EDU2024F6", value: 300, used: false },
  { code: "SCHOOL01", value: 200, used: false },
  { code: "BONUS123", value: 150, used: false },
  { code: "SUPER500", value: 500, used: false },
  { code: "MINI50", value: 50, used: false },
];

// Solde actuel de l'utilisateur
export let userTokens: UserTokens = {
  balance: 15,
  totalEarned: 15,
};

export const consumeTokens = (amount: number): boolean => {
  if (userTokens.balance >= amount) {
    userTokens.balance -= amount;
    return true;
  }
  return false;
};

export const redeemTokenCode = (code: string): { success: boolean; value?: number; message: string } => {
  const tokenCode = availableTokenCodes.find(tc => tc.code === code);
  
  if (!tokenCode) {
    return { success: false, message: "Code incorrect ou déjà utilisé" };
  }
  
  if (tokenCode.used) {
    return { success: false, message: "Code incorrect ou déjà utilisé" };
  }
  
  // Marquer le code comme utilisé
  tokenCode.used = true;
  
  // Mettre à jour le solde (addition au solde existant)
  userTokens.balance += tokenCode.value;
  userTokens.totalEarned += tokenCode.value;
  
  return { 
    success: true, 
    value: tokenCode.value,
    message: `Félicitations 🎉 vous avez gagné ${tokenCode.value} jetons de savoir !`
  };
};

export const getUserTokens = (): UserTokens => {
  return userTokens;
};