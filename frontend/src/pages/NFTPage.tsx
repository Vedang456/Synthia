import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { NFTCard } from "@/components/NFTCard";
import { useWeb3 } from "@/contexts/Web3Context";
import { useDemoData } from "@/hooks/useDemoData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NFTPage = () => {
  const { address, isConnected } = useWeb3();
  const { currentDemoWallet } = useDemoData();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      setLastUpdated(new Date());
    } else {
      setLastUpdated(currentDemoWallet.lastUpdated);
    }
  }, [address, currentDemoWallet, isConnected]);

  // If not connected, show a connection prompt
  if (!isConnected) {
    return (
      <div className="min-h-screen cyber-grid relative overflow-hidden">
        <Navbar />

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold glow-text mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground mb-8">
              Please connect your wallet to view your Soulbound NFT and access all features.
            </p>
            <Link to="/">
              <Button variant="hero" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold glow-text mb-2">Soulbound NFT</h1>
            <p className="text-muted-foreground">
              Your permanent, non-transferable reputation token
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <NFTCard
              score={currentDemoWallet.score}
              walletAddress={address || currentDemoWallet.address}
              lastUpdated={lastUpdated?.toLocaleDateString()}
            />
          </div>

          <div className="mt-8 bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-primary">About Soulbound NFTs</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                A Soulbound NFT (SBT) is a non-transferable token that is permanently bound to your wallet address.
                Unlike regular NFTs, SBTs cannot be sold, traded, or transferred, making them perfect for representing
                immutable aspects of identity like reputation.
              </p>
              <p>
                Your reputation SBT contains your current score, historical data, and verification metadata that can be
                used across all Web3 applications to establish trust and credibility.
              </p>
              <p>
                This SBT serves as immutable proof of your Web3 identity and reputation, providing a unified trust layer
                for the entire ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTPage;
