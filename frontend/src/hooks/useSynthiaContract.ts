import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";

export const useSynthiaContract = () => {
  const { synthiaContract, nftContract, address } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);

  const requestScoreUpdate = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return false;
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

    if (!synthiaContract || !nftContract || !targetAddress) return [];

    try {
      // Fetch events from the blockchain
      const activities = [];

      // Get the latest block number to limit our search
      const provider = synthiaContract.runner?.provider;
      if (!provider) return [];
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 10000); // Search last ~10000 blocks

      // Fetch ScoreUpdated events for the user
      const scoreUpdatedFilter = synthiaContract.filters.ScoreUpdated(targetAddress);
      const scoreUpdatedEvents = await synthiaContract.queryFilter(scoreUpdatedFilter, fromBlock);

      // Fetch UserAnalysisCompleted events for the user
      const analysisFilter = synthiaContract.filters.UserAnalysisCompleted(targetAddress);
      const analysisEvents = await synthiaContract.queryFilter(analysisFilter, fromBlock);

      // Fetch AchievementUnlocked events for the user
      const achievementFilter = synthiaContract.filters.AchievementUnlocked(targetAddress);
      const achievementEvents = await synthiaContract.queryFilter(achievementFilter, fromBlock);

      // Fetch NFT events for the user
      const tokenId = await nftContract.getTokenId(targetAddress);
      if (tokenId) {
        const nftMintedFilter = nftContract.filters.ReputationTokenMinted(targetAddress);
        const nftMintedEvents = await nftContract.queryFilter(nftMintedFilter, fromBlock);

        const nftUpdatedFilter = nftContract.filters.ReputationTokenUpdated(targetAddress, tokenId);
        const nftUpdatedEvents = await nftContract.queryFilter(nftUpdatedFilter, fromBlock);

        // Add NFT events to activities
        nftMintedEvents.forEach((event, index) => {
          const args = event as any; // Type assertion for event args
          activities.push({
            id: `nft_mint_${index}`,
            type: "nft_mint" as const,
            title: "Reputation NFT Minted",
            description: "Your soulbound reputation NFT was created",
            timestamp: Number(args.args?.timestamp || args.timestamp),
          });
        });

        nftUpdatedEvents.forEach((event, index) => {
          const args = event as any; // Type assertion for event args
          activities.push({
            id: `nft_update_${index}`,
            type: "nft_update" as const,
            title: "NFT Updated",
            description: "Soulbound NFT metadata refreshed with latest score",
            timestamp: Number(args.args?.timestamp || args.timestamp),
          });
        });
      }

      // Add contract events to activities
      scoreUpdatedEvents.forEach((event, index) => {
        const args = event as any; // Type assertion for event args
        activities.push({
          id: `score_update_${index}`,
          type: "score_update" as const,
          title: "Score Updated",
          description: "ASI agent analyzed wallet and updated reputation score",
          timestamp: Number(args.args?.timestamp || args.timestamp),
          scoreChange: Number(args.args?.score || args.score),
        });
      });

      analysisEvents.forEach((event, index) => {
        const args = event as any; // Type assertion for event args
        activities.push({
          id: `analysis_${index}`,
          type: "analysis" as const,
          title: "Wallet Analysis",
          description: "ASI agent reviewed on-chain activity patterns",
          timestamp: Number(args.args?.timestamp || args.timestamp),
        });
      });

      achievementEvents.forEach((event, index) => {
        const args = event as any; // Type assertion for event args
        activities.push({
          id: `achievement_${index}`,
          type: "achievement" as const,
          title: "Achievement Unlocked",
          description: args.args?.achievement || "Achievement earned",
          timestamp: Number(args.args?.timestamp || args.timestamp),
        });
      });

      // Sort by timestamp (newest first) and limit to recent activities
      return activities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20); // Limit to 20 most recent activities

    } catch (error) {
      console.error("Error fetching activity history:", error);
      return [];
    }
  };

  const getReputationData = async (tokenId: number, currentScore?: number) => {
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

    if (!synthiaContract || !targetAddress) return false;

    try {
      return await synthiaContract.pendingUpdates(targetAddress);
    } catch (error) {
      console.error("Error checking pending update:", error);
      return false;
    }
  };

  const getASIAgent = async () => {
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
