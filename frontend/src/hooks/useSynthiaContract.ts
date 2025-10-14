import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";

// Demo mode for when contracts aren't deployed
const DEMO_MODE = process.env.NODE_ENV === 'development' || !process.env.VITE_SYNTHIA_CONTRACT_ADDRESS;

export const useSynthiaContract = () => {
  const { synthiaContract, nftContract, address } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);

  const requestScoreUpdate = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return false;
    }

    if (DEMO_MODE) {
      // Demo mode - simulate contract interaction (faster for better UX)
      setIsLoading(true);
      try {
        // Simulate network delay - much faster for demo
        await new Promise(resolve => setTimeout(resolve, 300));
        toast.success("Score update requested! ASI agent will process your request.");
        return true;
      } catch (error) {
        toast.error("Failed to request score update");
        return false;
      } finally {
        setIsLoading(false);
      }
    }

    if (!synthiaContract) {
      toast.error("Contract not available. Please check contract deployment.");
      return false;
    }

    setIsLoading(true);
    try {
      // Check if update is already pending
      const isPending = await synthiaContract.pendingUpdates(address);
      if (isPending) {
        toast.error("Score update already pending");
        return false;
      }

      const tx = await synthiaContract.requestScoreUpdate();
      toast.info("Transaction submitted. Waiting for confirmation...");

      const receipt = await tx.wait();
      toast.success("Score update requested! ASI agent will process your request.");
      return true;
    } catch (error: unknown) {
      console.error("Error requesting score update:", error);
      const message = error instanceof Error ? error.message : "Failed to request score update";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserScore = async (userAddress?: string, currentScore?: number) => {
    const targetAddress = userAddress || address;

    if (DEMO_MODE) {
      // Demo mode - use provided current score or generate realistic score
      let finalScore: number;

      if (currentScore !== undefined) {
        // Use the provided current score with some realistic variation
        const variation = Math.floor(Math.random() * 40) - 20; // +/- 20 variation
        finalScore = Math.max(100, Math.min(900, currentScore + variation));
      } else {
        // Generate realistic score distribution when no current score provided
        const baseScore = 400 + Math.floor(Math.random() * 400); // Scores between 400-800
        const variance = Math.floor(Math.random() * 100) - 50; // +/- 50 variation
        finalScore = Math.max(100, Math.min(900, baseScore + variance));
      }

      return {
        score: finalScore,
        lastUpdated: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 7 * 24 * 3600), // Random time within last week
      };
    }

    if (!synthiaContract || !targetAddress) return null;

    try {
      const [score, lastUpdated] = await synthiaContract.getUserScore(targetAddress);
      return {
        score: Number(score),
        lastUpdated: Number(lastUpdated),
      };
    } catch (error) {
      console.error("Error getting user score:", error);
      return null;
    }
  };

  const getTokenId = async (userAddress?: string) => {
    const targetAddress = userAddress || address;

    if (DEMO_MODE) {
      // Demo mode - generate deterministic token ID based on wallet address
      if (targetAddress) {
        // Create a deterministic token ID based on wallet address hash
        // Use a simple hash function to ensure consistency
        let hash = 0;
        for (let i = 0; i < targetAddress.length; i++) {
          const char = targetAddress.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        const tokenId = Math.abs(hash) % 50000 + 1000; // Token IDs from 1000-51000
        return tokenId;
      }
      return Math.floor(Math.random() * 50000) + 1000; // Fallback random token ID
    }

    if (!nftContract || !targetAddress) return null;

    try {
      const tokenId = await nftContract.getTokenId(targetAddress);
      return Number(tokenId);
    } catch (error) {
      console.error("Error getting token ID:", error);
      return null;
    }
  };

  const getActivityHistory = async (userAddress?: string) => {
    const targetAddress = userAddress || address;

    if (DEMO_MODE) {
      // Demo mode - generate realistic activity data based on current state
      const activities = [];
      const now = Math.floor(Date.now() / 1000);

      // Current score activity - use the current score from state if available
      if (targetAddress) {
        activities.push({
          id: 1,
          type: "score_update",
          title: "Score Updated",
          description: "ASI agent analyzed wallet and updated reputation score",
          timestamp: now - (Math.floor(Math.random() * 24 * 3600)), // Random time within last 24 hours
          scoreChange: Math.floor(Math.random() * 100) + 20, // Random score change
        });
      }

      // NFT update activity
      if (targetAddress) {
        activities.push({
          id: 2,
          type: "nft_update",
          title: "NFT Updated",
          description: "Soulbound NFT metadata refreshed with latest score",
          timestamp: now - (Math.floor(Math.random() * 48 * 3600)), // Random time within last 48 hours
        });
      }

      // Achievement activity for high scores
      activities.push({
        id: 3,
        type: "achievement",
        title: "Achievement Unlocked",
        description: "Reached 800+ reputation score milestone",
        timestamp: now - (Math.floor(Math.random() * 7 * 24 * 3600)), // Random time within last week
      });

      // Analysis activity
      activities.push({
        id: 4,
        type: "analysis",
        title: "Wallet Analysis",
        description: "ASI agent reviewed on-chain activity patterns",
        timestamp: now - (Math.floor(Math.random() * 14 * 24 * 3600)), // Random time within last 2 weeks
      });

      // Sort by timestamp (newest first)
      return activities.sort((a, b) => b.timestamp - a.timestamp);
    }

    if (!synthiaContract || !targetAddress) return [];

    try {
      // This would be replaced with actual contract calls to fetch events
      // For now, return empty array as we're focusing on demo mode
      return [];
    } catch (error) {
      console.error("Error fetching activity history:", error);
      return [];
    }
  };

  const getReputationData = async (tokenId: number, currentScore?: number) => {
    if (DEMO_MODE) {
      // Demo mode - use provided current score or return mock reputation data
      let finalScore: number;

      if (currentScore !== undefined) {
        // Use the provided current score with some realistic variation
        const variation = Math.floor(Math.random() * 40) - 20; // +/- 20 variation
        finalScore = Math.max(100, Math.min(900, currentScore + variation));
      } else {
        // Generate mock reputation data when no current score provided
        const baseScore = 400 + Math.floor(Math.random() * 400);
        const variance = Math.floor(Math.random() * 100) - 50;
        finalScore = Math.max(100, Math.min(900, baseScore + variance));
      }

      return {
        score: finalScore,
        lastUpdated: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 7 * 24 * 3600),
      };
    }

    if (!nftContract) return null;

    try {
      const [score, lastUpdated] = await nftContract.getReputationData(tokenId);
      return {
        score: Number(score),
        lastUpdated: Number(lastUpdated),
      };
    } catch (error) {
      console.error("Error getting reputation data:", error);
      return null;
    }
  };

  const getTokenURI = async (tokenId: number) => {
    if (DEMO_MODE) {
      // Demo mode - return mock URI
      return `https://api.synthia.io/metadata/${tokenId}`;
    }

    if (!nftContract) return null;

    try {
      const uri = await nftContract.tokenURI(tokenId);
      return uri;
    } catch (error) {
      console.error("Error getting token URI:", error);
      return null;
    }
  };

  const checkPendingUpdate = async (userAddress?: string) => {
    const targetAddress = userAddress || address;

    if (DEMO_MODE) {
      // Demo mode - randomly return pending status (20% chance for demo)
      return Math.random() < 0.2;
    }

    if (!synthiaContract || !targetAddress) return false;

    try {
      return await synthiaContract.pendingUpdates(targetAddress);
    } catch (error) {
      console.error("Error checking pending update:", error);
      return false;
    }
  };

  const getASIAgent = async () => {
    if (DEMO_MODE) {
      // Demo mode - return mock ASI agent address
      return "0x742d35Cc6635C0532d3C7E4E3c4B8C5B1a5c4e4c";
    }

    if (!synthiaContract) return null;

    try {
      return await synthiaContract.asiAgent();
    } catch (error) {
      console.error("Error getting ASI agent:", error);
      return null;
    }
  };

  const updateASIAgent = async (newAgent: string) => {
    if (!synthiaContract || !address) {
      toast.error("Please connect your wallet");
      return false;
    }

    setIsLoading(true);
    try {
      const tx = await synthiaContract.updateASIAgent(newAgent);
      toast.info("Transaction submitted. Waiting for confirmation...");
      
      await tx.wait();
      toast.success("ASI agent updated successfully!");
      return true;
    } catch (error: unknown) {
      console.error("Error updating ASI agent:", error);
      const message = error instanceof Error ? error.message : "Failed to update ASI agent";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateScore = async (userAddress: string, score: number) => {
    if (!synthiaContract || !address) {
      toast.error("Please connect your wallet");
      return false;
    }

    if (score < 0 || score > 1000) {
      toast.error("Score must be between 0 and 1000");
      return false;
    }

    setIsLoading(true);
    try {
      const tx = await synthiaContract.updateScore(userAddress, score);
      toast.info("Transaction submitted. Waiting for confirmation...");
      
      await tx.wait();
      toast.success("Score updated successfully!");
      return true;
    } catch (error: unknown) {
      console.error("Error updating score:", error);
      const message = error instanceof Error ? error.message : "Failed to update score. Are you the ASI agent?";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestScoreUpdate,
    getUserScore,
    getTokenId,
    getReputationData,
    getTokenURI,
    checkPendingUpdate,
    getASIAgent,
    updateASIAgent,
    updateScore,
    isLoading,
  };
};
