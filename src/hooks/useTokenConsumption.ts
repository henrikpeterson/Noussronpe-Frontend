import { useState, useEffect } from 'react';
import { getUserTokens, consumeTokens } from '@/data/tokens';

export const useTokenConsumption = () => {
  const [tokens, setTokens] = useState(getUserTokens());
  const [showConsumptionModal, setShowConsumptionModal] = useState(false);
  const [showPacksModal, setShowPacksModal] = useState(false);
  const [pendingConsumption, setPendingConsumption] = useState<{
    cost: number;
    description: string;
    onSuccess: () => void;
  } | null>(null);

  // Listen for token updates
  useEffect(() => {
    const updateTokens = () => {
      setTokens(getUserTokens());
    };

    window.addEventListener('tokensUpdated', updateTokens);
    return () => window.removeEventListener('tokensUpdated', updateTokens);
  }, []);

  // Listen for token recharge modal trigger
  useEffect(() => {
    const handleOpenTokenRecharge = () => {
      setShowPacksModal(false);
      setShowConsumptionModal(false);
      window.dispatchEvent(new CustomEvent('openTokenRecharge'));
    };

    window.addEventListener('openTokenRecharge', handleOpenTokenRecharge);
    return () => window.removeEventListener('openTokenRecharge', handleOpenTokenRecharge);
  }, []);

  const requestTokenConsumption = (cost: number, description: string, onSuccess: () => void) => {
    const currentTokens = getUserTokens();
    
    if (currentTokens.balance >= cost) {
      setPendingConsumption({ cost, description, onSuccess });
      setShowConsumptionModal(true);
    } else {
      setShowPacksModal(true);
    }
  };

  const confirmConsumption = () => {
    if (pendingConsumption) {
      const success = consumeTokens(pendingConsumption.cost);
      if (success) {
        setTokens(getUserTokens());
        pendingConsumption.onSuccess();
        window.dispatchEvent(new CustomEvent('tokensUpdated'));
      }
    }
    setShowConsumptionModal(false);
    setPendingConsumption(null);
  };

  const cancelConsumption = () => {
    setShowConsumptionModal(false);
    setPendingConsumption(null);
  };

  const closePacksModal = () => {
    setShowPacksModal(false);
  };

  return {
    tokens,
    showConsumptionModal,
    showPacksModal,
    pendingConsumption,
    requestTokenConsumption,
    confirmConsumption,
    cancelConsumption,
    closePacksModal,
  };
};