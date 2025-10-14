import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { BrowserProvider, Contract, JsonRpcProvider, Eip1193Provider } from "ethers";
import { HEDERA_TESTNET, CONTRACTS, SYNTHIA_ABI, SYNTHIA_NFT_ABI } from "@/config/contracts";

interface Web3ContextType {
  address: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
  synthiaContract: Contract | null;
  nftContract: Contract | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  isConnected: false,
  provider: null,
  synthiaContract: null,
  nftContract: null,
  connect: async () => {},
  disconnect: async () => {},
});

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || "YOUR_PROJECT_ID";

const metadata = {
  name: "Synthia",
  description: "Decentralized Reputation System",
  url: window.location.origin,
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const ethersAdapter = new EthersAdapter();

const appKit = createAppKit({
  adapters: [ethersAdapter],
  networks: [
    {
      id: HEDERA_TESTNET.chainId,
      name: HEDERA_TESTNET.name,
      nativeCurrency: {
        name: HEDERA_TESTNET.currency,
        symbol: HEDERA_TESTNET.currency,
        decimals: 18,
      },
      rpcUrls: {
        default: { http: [HEDERA_TESTNET.rpcUrl] },
        public: { http: [HEDERA_TESTNET.rpcUrl] },
      },
      blockExplorers: {
        default: { name: "Hashscan", url: HEDERA_TESTNET.explorerUrl },
      },
    },
  ],
  metadata,
  projectId,
  features: {
    analytics: false,
  },
  // Add these configurations for better wallet modal experience
  allowUnsupportedChain: false,
  enableWalletConnect: true,
  walletFeaturesOrder: ['connect_wallet', 'switches_network'],
  // Enable coinbase wallet and other popular wallets
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet
  ],
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [synthiaContract, setSynthiaContract] = useState<Contract | null>(null);
  const [nftContract, setNftContract] = useState<Contract | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = appKit.subscribeState((state) => {
      if (state.selectedNetworkId) {
        const account = appKit.getAddress();
        if (account) {
          setAddress(account);
          initializeProvider();
        } else {
          setAddress(null);
          setProvider(null);
          setSynthiaContract(null);
          setNftContract(null);
        }
      }
    });

    // Initial check
    const initialAddress = appKit.getAddress();
    if (initialAddress) {
      setAddress(initialAddress);
      initializeProvider();
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const initializeProvider = async () => {
    try {
      const walletProvider = appKit.getWalletProvider() as Eip1193Provider;
      if (!walletProvider) {
        console.error("No wallet provider available");
        return;
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      setProvider(ethersProvider);

      const signer = await ethersProvider.getSigner();

      // Initialize contracts if addresses are available
      if (CONTRACTS.SYNTHIA) {
        const synthia = new Contract(CONTRACTS.SYNTHIA, SYNTHIA_ABI, signer);
        setSynthiaContract(synthia);
      }

      if (CONTRACTS.SYNTHIA_NFT) {
        const nft = new Contract(CONTRACTS.SYNTHIA_NFT, SYNTHIA_NFT_ABI, signer);
        setNftContract(nft);
      }
    } catch (error) {
      console.error("Error initializing provider:", error);
    }
  };

  const connect = async () => {
    try {
      // Check if already connected
      const currentAddress = appKit.getAddress();
      if (currentAddress) {
        console.log("Already connected to wallet");
        return;
      }

      await appKit.open();
      console.log("Wallet connection modal opened successfully");
    } catch (error) {
      console.error("Error opening wallet connection modal:", error);
      throw new Error("Failed to open wallet connection modal");
    }
  };

  const disconnect = async () => {
    try {
      await appKit.disconnect();
      // Explicitly reset all state
      setAddress(null);
      setProvider(null);
      setSynthiaContract(null);
      setNftContract(null);
      navigate("/");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      // Even if appKit.disconnect() fails, reset the local state
      setAddress(null);
      setProvider(null);
      setSynthiaContract(null);
      setNftContract(null);
      navigate("/");
    }
  };

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected: !!address,
        provider,
        synthiaContract,
        nftContract,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};
