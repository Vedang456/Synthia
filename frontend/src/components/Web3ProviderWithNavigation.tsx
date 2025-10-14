import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/contexts/Web3Context';

export const Web3ProviderWithNavigation = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  return <>{children}</>;
};
