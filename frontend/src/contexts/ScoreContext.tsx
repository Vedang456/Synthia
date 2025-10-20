import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useSynthiaContract } from '@/hooks/useSynthiaContract';
import { useDemoData } from '@/hooks/useDemoData';

interface ScoreContextType {
  score: number;
  isPending: boolean;
  lastUpdated: Date | null;
  isLoading: boolean;
  refreshScore: () => Promise<void>;
  requestScoreUpdate: () => Promise<boolean>;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

interface ScoreProviderProps {
  children: ReactNode;
}

export const ScoreProvider = ({ children }: ScoreProviderProps) => {
  const { address, isConnected } = useWeb3();
  const { getUserScore, requestScoreUpdate: contractRequestScoreUpdate, isLoading, checkPendingUpdate } = useSynthiaContract();
  const { currentDemoWallet } = useDemoData();

  const [score, setScore] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const DEMO_MODE = process.env.NODE_ENV === 'development' || !process.env.VITE_SYNTHIA_CONTRACT_ADDRESS;

  const refreshScore = useCallback(async () => {
    try {
      if (isConnected && address) {
        const scoreData = await getUserScore(address, score);
        if (scoreData) {
          setScore(scoreData.score);
          setLastUpdated(new Date(scoreData.lastUpdated * 1000));
        }

        const pending = await checkPendingUpdate();
        setIsPending(pending);
      } else {
        // Demo mode
        setScore(currentDemoWallet.score);
        setLastUpdated(currentDemoWallet.lastUpdated);
        setIsPending(false);
      }
    } catch (error) {
      console.error('Error refreshing score:', error);
      // Fallback to demo data on error
      setScore(currentDemoWallet.score);
      setLastUpdated(currentDemoWallet.lastUpdated);
      setIsPending(false);
    }
  }, [address, currentDemoWallet, getUserScore, checkPendingUpdate, score, isConnected]);

  const requestScoreUpdate = useCallback(async (): Promise<boolean> => {
    if (DEMO_MODE || !isConnected) {
      // Demo mode - just refresh the demo data
      setScore(currentDemoWallet.score);
      setLastUpdated(currentDemoWallet.lastUpdated);
      return true;
    }

    try {
      const success = await contractRequestScoreUpdate();
      if (success) {
        setIsPending(true);
        await refreshScore(); // Refresh to get updated state
      }
      return success;
    } catch (error) {
      console.error('Error requesting score update:', error);
      return false;
    }
  }, [DEMO_MODE, isConnected, currentDemoWallet, contractRequestScoreUpdate, refreshScore]);

  useEffect(() => {
    refreshScore();
  }, [refreshScore]);

  const value: ScoreContextType = {
    score,
    isPending,
    lastUpdated,
    isLoading,
    refreshScore,
    requestScoreUpdate,
  };

  return (
    <ScoreContext.Provider value={value}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = (): ScoreContextType => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
};
