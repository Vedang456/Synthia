import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { showToast } from "@/lib/toast-utils";
import { ethers } from "ethers";

export const useSynthiaContract = () => {
  const { synthiaContract, nftContract, address } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);

  const requestScoreUpdate = async () => {
    if (!address) {
      showToast.error("Please connect your wallet");
      return false;
    }

    if (!synthiaContract) {
      showToast.error("Contract not available. Please check contract deployment.");
      return false;
    }

    setIsLoading(true);
    try {
      // Check if update is already pending
      const pendingRequest = await synthiaContract.pendingRequests(address);
      if (pendingRequest.isCompleted === false && pendingRequest.requestTimestamp > 0) {
        showToast.error("Score update already pending");
        return false;
      }

      const tx = await synthiaContract.requestScoreUpdate();
      showToast.info("Transaction submitted. Waiting for confirmation...");

      const receipt = await tx.wait();
      showToast.success("Score update requested! ASI agent will process your request.");
      return true;
    } catch (error: unknown) {
      console.error("Error requesting score update:", error);
      const message = error instanceof Error ? error.message : "Failed to request score update";
      showToast.error(message);
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
      // Return null for any contract-related errors in demo mode or when contracts fail
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
          const eventData = event as { args?: { timestamp?: bigint } }; // Type assertion for event args
          activities.push({
            id: `nft_mint_${index}`,
            type: "nft_mint" as const,
            title: "Reputation NFT Minted",
            description: "Your soulbound reputation NFT was created",
            timestamp: Number(eventData.args?.timestamp || Date.now() / 1000),
          });
        });

        nftUpdatedEvents.forEach((event, index) => {
          const eventData = event as { args?: { timestamp?: bigint } }; // Type assertion for event args
          activities.push({
            id: `nft_update_${index}`,
            type: "nft_update" as const,
            title: "NFT Updated",
            description: "Soulbound NFT metadata refreshed with latest score",
            timestamp: Number(eventData.args?.timestamp || Date.now() / 1000),
          });
        });
      }

      // Add contract events to activities
      scoreUpdatedEvents.forEach((event, index) => {
        const eventData = event as { args?: { timestamp?: bigint; score?: bigint } }; // Type assertion for event args
        activities.push({
          id: `score_update_${index}`,
          type: "score_update" as const,
          title: "Score Updated",
          description: "ASI agent analyzed wallet and updated reputation score",
          timestamp: Number(eventData.args?.timestamp || Date.now() / 1000),
          scoreChange: Number(eventData.args?.score || 0),
        });
      });

      analysisEvents.forEach((event, index) => {
        const eventData = event as { args?: { timestamp?: bigint } }; // Type assertion for event args
        activities.push({
          id: `analysis_${index}`,
          type: "analysis" as const,
          title: "Wallet Analysis",
          description: "ASI agent reviewed on-chain activity patterns",
          timestamp: Number(eventData.args?.timestamp || Date.now() / 1000),
        });
      });

      achievementEvents.forEach((event, index) => {
        const eventData = event as { args?: { timestamp?: bigint; achievement?: string } }; // Type assertion for event args
        activities.push({
          id: `achievement_${index}`,
          type: "achievement" as const,
          title: "Achievement Unlocked",
          description: eventData.args?.achievement || "Achievement earned",
          timestamp: Number(eventData.args?.timestamp || Date.now() / 1000),
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
      const pendingRequest = await synthiaContract.pendingRequests(targetAddress);
      return pendingRequest.isCompleted === false && pendingRequest.requestTimestamp > 0;
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
      showToast.error("Please connect your wallet");
      return false;
    }

    setIsLoading(true);
    try {
      const tx = await synthiaContract.updateASIAgent(newAgent);
      showToast.info("Transaction submitted. Waiting for confirmation...");
      
      await tx.wait();
      showToast.success("ASI agent updated successfully!");
      return true;
    } catch (error: unknown) {
      console.error("Error updating ASI agent:", error);
      const message = error instanceof Error ? error.message : "Failed to update ASI agent";
      showToast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateScore = async (userAddress: string, score: number) => {
    if (!synthiaContract || !address) {
      showToast.error("Please connect your wallet");
      return false;
    }

    if (score < 0 || score > 100) {
      showToast.error("Score must be between 0 and 100");
      return false;
    }

    setIsLoading(true);
    try {
      const tx = await synthiaContract.updateScore(userAddress, score, "0x0000000000000000000000000000000000000000000000000000000000000000", 0);
      showToast.info("Transaction submitted. Waiting for confirmation...");

      await tx.wait();
      showToast.success("Score updated successfully!");
      return true;
    } catch (error: unknown) {
      console.error("Error updating score:", error);
      const message = error instanceof Error ? error.message : "Failed to update score. Are you the ASI agent?";
      showToast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registerAgent = async (agent: string, role: string) => {
    if (!synthiaContract || !address) {
      showToast.error("Please connect your wallet");
      return false;
    }

    setIsLoading(true);
    try {
      // Convert role string to bytes32
      const roleBytes32 = ethers.keccak256(ethers.toUtf8Bytes(role));
      const tx = await synthiaContract.registerAgent(agent, roleBytes32);
      showToast.info("Transaction submitted. Waiting for confirmation...");

      await tx.wait();
      showToast.success(`Agent registered successfully with ${role} role!`);
      return true;
    } catch (error: unknown) {
      console.error("Error registering agent:", error);
      const message = error instanceof Error ? error.message : "Failed to register agent";
      showToast.error(message);
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
    registerAgent,
    getActivityHistory,
    isLoading,
  };
};
