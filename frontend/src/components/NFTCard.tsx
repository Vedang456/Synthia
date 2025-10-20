import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, TrendingUp, Wallet, Lock, Sparkles, Zap } from "lucide-react";
import nftCardImage from "@/assets/nft-card.png";
import { useSynthiaContract } from "@/hooks/useSynthiaContract";

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
  const { getTokenId } = useSynthiaContract();
  const [actualTokenId, setActualTokenId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchTokenId = async () => {
      if (walletAddress) {
        const tokenIdFromContract = await getTokenId(walletAddress);
        if (tokenIdFromContract && tokenIdFromContract !== 0) {
          setActualTokenId(`#${tokenIdFromContract.toString()}`);
        }
      }
    };

    fetchTokenId();
  }, [walletAddress, getTokenId]);

  // Use contract token ID if available, otherwise fallback to generated or provided token ID
  const displayTokenId = actualTokenId || tokenId || (walletAddress ? generateTokenId(walletAddress) : "#0001");

  const getNFTStyle = (walletAddress: string) => {
    if (!walletAddress) return 0;
    // Simple hash function to get a number between 0-3 from wallet address
    const hash = walletAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 4; // Returns 0, 1, 2, or 3
  };

  const nftStyle = walletAddress ? getNFTStyle(walletAddress) : 0;

  // Different background gradients for each style
  const nftBackgrounds = [
    'from-slate-900 via-purple-900 to-slate-900', // Original
    'from-gray-900 via-blue-900 to-gray-900',     // Blue theme
    'from-gray-900 via-emerald-900 to-gray-900',  // Green theme
    'from-gray-900 via-rose-900 to-gray-900'      // Red theme
  ];

  // Different badge styles for each theme
  const badgeStyles = [
    'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/50',
    'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-400/50',
    'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-400/50',
    'from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-400/50'
  ];

  const getTierGlow = (score: number) => {
    if (score >= 900) return "shadow-cyan-500/50 border-cyan-400/50";
    if (score >= 800) return "shadow-slate-400/50 border-slate-300/50";
    if (score >= 700) return "shadow-yellow-400/50 border-yellow-300/50";
    if (score >= 600) return "shadow-gray-300/50 border-gray-200/50";
    if (score >= 400) return "shadow-orange-400/50 border-orange-300/50";
    return "shadow-gray-500/30 border-gray-400/30";
  };

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${nftBackgrounds[nftStyle]} ${getTierGlow(score)} shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform ${isHovered ? 'animate-pulse' : ''}`} style={{ animationDuration: '3s' }}></div>
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-radial from-white/10 via-transparent to-transparent opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-500`}></div>
      </div>

      {/* Glowing border animation */}
      <div className={`absolute inset-0 rounded-lg ${isHovered ? 'animate-pulse' : ''}`}>
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${
          score >= 900 ? 'from-cyan-400 to-blue-400' : 
          score >= 800 ? 'from-slate-300 to-gray-300' : 
          nftStyle === 0 ? 'from-primary to-secondary' :
          nftStyle === 1 ? 'from-blue-400 to-indigo-400' :
          nftStyle === 2 ? 'from-emerald-400 to-teal-400' :
          'from-rose-400 to-pink-400'
        } opacity-20 ${isHovered ? 'opacity-40' : ''} transition-opacity duration-300`}></div>
      </div>

      {/* Sparkle effects */}
      {isHovered && (
        <>
          <div className="absolute top-4 right-4 animate-ping">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="absolute bottom-4 left-4 animate-pulse">
            <Zap className="w-3 h-3 text-yellow-400" />
          </div>
          <div className="absolute top-1/2 right-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Sparkles className="w-3 h-3 text-purple-400" />
          </div>
        </>
      )}

      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`text-2xl font-bold glow-text ${score >= 900 ? 'text-cyan-400' : score >= 800 ? 'text-slate-300' : score >= 700 ? 'text-yellow-400' : 'text-primary'}`}>
              Synthia SBT
            </h3>
            <p className="text-sm text-muted-foreground font-mono">{displayTokenId}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={`bg-gradient-to-r ${score >= 900 ? badgeStyles[0] : score >= 800 ? 'from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-400/50' : badgeStyles[nftStyle]}`}>
              <Shield className="w-3 h-3 mr-1" />
              Soulbound
            </Badge>
            <Badge className={`bg-gradient-to-r ${score >= 900 ? 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/50' : badgeStyles[nftStyle]}`}>
              <Lock className="w-3 h-3 mr-1" />
              Eternal
            </Badge>
          </div>
        </div>

        <div className="flex justify-center my-6 relative">
          <div className={`relative w-48 h-48 transition-all duration-500 ${isHovered ? 'scale-110 rotate-2' : 'scale-100'}`}>
            {/* NFT Image with enhanced effects */}
            <div className={`absolute inset-0 rounded-lg ${
              score >= 900 ? 'from-cyan-400/20 to-purple-400/20' : 
              score >= 800 ? 'from-slate-300/20 to-gray-300/20' : 
              nftStyle === 0 ? 'from-primary/20 to-secondary/20' :
              nftStyle === 1 ? 'from-blue-400/20 to-indigo-400/20' :
              nftStyle === 2 ? 'from-emerald-400/20 to-teal-400/20' :
              'from-rose-400/20 to-pink-400/20'
            } blur-xl ${isHovered ? 'animate-pulse' : ''}`}></div>
            <img
              src={nftCardImage}
              alt="Synthia NFT"
              className={`relative w-full h-full object-contain rounded-lg glow-border transition-all duration-300 ${isHovered ? 'brightness-110 contrast-110' : ''}`}
            />

            {/* Overlay effects */}
            <div className={`absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 via-transparent to-transparent ${isHovered ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>

            {/* Tier-specific overlay */}
            <div className={`absolute inset-0 rounded-lg ${
              score >= 900 ? 'bg-gradient-to-br from-cyan-500/10 to-transparent' : 
              score >= 800 ? 'bg-gradient-to-br from-slate-400/10 to-transparent' : 
              nftStyle === 0 ? 'bg-gradient-to-br from-primary/10 to-transparent' :
              nftStyle === 1 ? 'bg-gradient-to-br from-blue-500/10 to-transparent' :
              nftStyle === 2 ? 'bg-gradient-to-br from-emerald-500/10 to-transparent' :
              'bg-gradient-to-br from-rose-500/10 to-transparent'
            } ${isHovered ? 'opacity-100' : 'opacity-50'} transition-opacity duration-300`}></div>
          </div>

          {/* Floating particles effect */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${
                    score >= 900 ? 'bg-cyan-400' : 
                    score >= 800 ? 'bg-slate-300' : 
                    nftStyle === 0 ? 'bg-primary' :
                    nftStyle === 1 ? 'bg-blue-400' :
                    nftStyle === 2 ? 'bg-emerald-400' :
                    'bg-rose-400'
                  } opacity-60`}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    animation: `float 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 mt-6 pt-6 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Reputation Score</span>
            <span className={`text-lg font-bold flex items-center ${score >= 900 ? 'text-cyan-400' : score >= 800 ? 'text-slate-300' : score >= 700 ? 'text-yellow-400' : 'text-primary'}`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${score >= 900 ? 'text-cyan-400' : score >= 800 ? 'text-slate-300' : 'text-secondary'}`} />
              {score}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm text-foreground">{lastUpdated}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Soulbound To</span>
            <span className={`text-sm flex items-center ${score >= 900 ? 'text-cyan-300' : 'text-accent'}`}>
              <Wallet className="w-3 h-3 mr-1" />
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Your Account"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="outline" className={`border-secondary text-secondary ${score >= 900 ? 'border-cyan-400 text-cyan-300' : ''}`}>
              <Award className="w-3 h-3 mr-1" />
              {score >= 900 ? "Diamond Elite" : score >= 800 ? "Platinum" : score >= 700 ? "Gold" : score >= 600 ? "Silver" : score >= 400 ? "Bronze" : "Developing"}
            </Badge>
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-lg border ${score >= 900 ? 'bg-cyan-500/10 border-cyan-400/20' : 'bg-secondary/10 border-secondary/20'}`}>
          <p className={`text-xs text-center ${score >= 900 ? 'text-cyan-300/80' : 'text-secondary/80'}`}>
            {score >= 900
              ? "✨ This legendary Soulbound Token represents unparalleled excellence in the Web3 ecosystem."
              : "🔐 This Soulbound Token represents your unique reputation and cannot be transferred to another account."
            }
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .glow-border {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .shadow-cyan-500/50 {
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.2);
        }

        .shadow-slate-400/50 {
          box-shadow: 0 0 25px rgba(148, 163, 184, 0.4), 0 0 50px rgba(148, 163, 184, 0.15);
        }

        .shadow-yellow-400/50 {
          box-shadow: 0 0 25px rgba(250, 204, 21, 0.4), 0 0 50px rgba(250, 204, 21, 0.15);
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </Card>
  );
};
