import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, TrendingUp, Wallet, Lock } from "lucide-react";
import nftCardImage from "@/assets/nft-card.png";

interface NFTCardProps {
  score: number;
  tokenId?: string;
  lastUpdated?: string;
  walletAddress?: string;
}

const generateTokenId = (walletAddress: string): string => {
  // Create a deterministic token ID based on wallet address
  // Use first 8 characters of address hash as token ID
  const hash = walletAddress.slice(2, 10).toUpperCase();
  return `#${hash}`;
};

export const NFTCard = ({ score, tokenId, lastUpdated = "2025-10-14", walletAddress }: NFTCardProps) => {
  // Generate token ID if not provided and wallet address is available
  const displayTokenId = tokenId || (walletAddress ? generateTokenId(walletAddress) : "#0001");

  return (
    <Card className="overflow-hidden bg-card/30 backdrop-blur-md border-primary/40 shadow-neon hover:shadow-cyan transition-all duration-300 hover:scale-105">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-cyber opacity-30"></div>
        <div className="p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-primary glow-text">Synthia SBT</h3>
              <p className="text-sm text-muted-foreground">Token {displayTokenId}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className="bg-secondary/20 text-secondary border-secondary/50">
                <Shield className="w-3 h-3 mr-1" />
                Soulbound
              </Badge>
              <Badge className="bg-accent/20 text-accent border-accent/50">
                <Lock className="w-3 h-3 mr-1" />
                Non-Transferable
              </Badge>
            </div>
          </div>

          <div className="flex justify-center my-6">
            <div className="relative w-48 h-48">
              <img
                src={nftCardImage}
                alt="Synthia NFT"
                className="w-full h-full object-contain rounded-lg glow-border"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg"></div>
            </div>
          </div>

          <div className="space-y-3 mt-6 pt-6 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reputation Score</span>
              <span className="text-lg font-bold text-primary flex items-center">
                <TrendingUp className="w-4 h-4 mr-1 text-secondary" />
                {score}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm text-foreground">{lastUpdated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Soulbound To</span>
              <span className="text-sm text-accent flex items-center">
                <Wallet className="w-3 h-3 mr-1" />
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Your Account"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline" className="border-secondary text-secondary">
                <Award className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>

          <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-xs text-secondary/80 text-center">
              This Soulbound Token represents your unique reputation and cannot be transferred to another account.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
