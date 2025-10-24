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

  const displayTokenId = actualTokenId || tokenId || (walletAddress ? `#${walletAddress.slice(2, 10).toUpperCase()}` : "#0001");

  // Tier-based badge styles
  const badgeStyles = [
    'from-cyan-400/20 to-teal-400/20 text-cyan-300 border-cyan-400/50',
    'from-teal-300/20 to-cyan-300/20 text-teal-300 border-teal-400/50',
    'from-pink-300/20 to-rose-300/20 text-pink-300 border-pink-400/50',
    'from-rose-400/20 to-pink-300/20 text-rose-400 border-rose-400/50',
    'from-gray-400/20 to-slate-400/20 text-gray-300 border-gray-400/50',
    'from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/50'
  ];

  const getTierGlow = (score: number) => {
    if (score >= 90) return "shadow-cyan-500/50 border-cyan-400/50";
    if (score >= 80) return "shadow-teal-400/50 border-teal-300/50";
    if (score >= 70) return "shadow-pink-400/50 border-pink-300/50";
    if (score >= 60) return "shadow-rose-400/50 border-rose-400/50";
    if (score >= 40) return "shadow-gray-400/50 border-gray-300/50";
    return "shadow-gray-500/30 border-gray-400/30";
  };

  // Tier-based background gradients instead of wallet-based themes
  const getTierBackground = (score: number) => {
    if (score >= 90) return 'from-slate-900 via-cyan-900 to-slate-900';
    if (score >= 80) return 'from-gray-900 via-teal-900 to-gray-900';
    if (score >= 70) return 'from-gray-900 via-pink-900/50 to-gray-900';
    if (score >= 60) return 'from-gray-900 via-rose-900/50 to-gray-900';
    if (score >= 40) return 'from-gray-900 via-slate-800 to-gray-900';
    return 'from-gray-900 via-slate-900 to-gray-900';
  };

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${getTierBackground(score)} ${getTierGlow(score)} shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer`}
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
          score >= 90 ? 'from-cyan-400 to-teal-400' :
          score >= 80 ? 'from-teal-300 to-cyan-300' :
          score >= 70 ? 'from-pink-300 to-rose-300' :
          score >= 60 ? 'from-rose-400 to-pink-300' :
          score >= 40 ? 'from-slate-300 to-gray-300' :
          'from-slate-400 to-gray-400'
        } opacity-20 ${isHovered ? 'opacity-40' : ''} transition-opacity duration-300`}></div>
      </div>

      {/* Sparkle effects */}
      {isHovered && (
        <>
          <div className="absolute top-4 right-4 animate-ping">
            <Sparkles className={`w-4 h-4 ${score >= 90 ? 'text-cyan-400' : score >= 80 ? 'text-teal-300' : score >= 70 ? 'text-pink-300' : score >= 60 ? 'text-rose-400' : score >= 40 ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <div className="absolute bottom-4 left-4 animate-pulse">
            <Zap className={`w-3 h-3 ${score >= 90 ? 'text-cyan-300' : score >= 80 ? 'text-teal-400' : score >= 70 ? 'text-pink-400' : score >= 60 ? 'text-rose-300' : score >= 40 ? 'text-gray-300' : 'text-gray-400'}`} />
          </div>
          <div className="absolute top-1/2 right-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Sparkles className={`w-3 h-3 ${score >= 90 ? 'text-cyan-500' : score >= 80 ? 'text-teal-500' : score >= 70 ? 'text-pink-500' : score >= 60 ? 'text-rose-500' : score >= 40 ? 'text-gray-500' : 'text-gray-600'}`} />
          </div>
        </>
      )}

      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`text-2xl font-bold glow-text ${score >= 90 ? 'text-cyan-400' : score >= 80 ? 'text-teal-300' : score >= 70 ? 'text-pink-400' : score >= 60 ? 'text-rose-400' : score >= 40 ? 'text-gray-300' : 'text-gray-400'}`}>
              Synthia SBT
            </h3>
            <p className="text-sm text-muted-foreground font-mono">{displayTokenId}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={`bg-gradient-to-r ${score >= 90 ? badgeStyles[0] : score >= 80 ? badgeStyles[1] : score >= 70 ? badgeStyles[2] : score >= 60 ? badgeStyles[3] : score >= 40 ? badgeStyles[4] : badgeStyles[5]}`}>
              <Shield className="w-3 h-3 mr-1" />
              Soulbound
            </Badge>
            <Badge className={`bg-gradient-to-r ${score >= 90 ? 'from-purple-400/20 to-cyan-400/20 text-purple-300 border-purple-400/50' : score >= 80 ? badgeStyles[1] : score >= 70 ? badgeStyles[2] : score >= 60 ? badgeStyles[3] : score >= 40 ? badgeStyles[4] : badgeStyles[5]}`}>
              <Lock className="w-3 h-3 mr-1" />
              Eternal
            </Badge>
          </div>
        </div>

        <div className="flex justify-center my-6 relative">
          <div className={`relative w-48 h-48 transition-all duration-500 ${isHovered ? 'scale-110 rotate-2' : 'scale-100'}`}>
            {/* NFT Image with enhanced effects */}
            <div className={`absolute inset-0 rounded-lg ${
              score >= 90 ? 'from-cyan-400/20 to-teal-400/20' :
              score >= 80 ? 'from-teal-300/20 to-cyan-300/20' :
              score >= 70 ? 'from-pink-300/20 to-rose-300/20' :
              score >= 60 ? 'from-rose-400/20 to-pink-300/20' :
              score >= 40 ? 'from-gray-400/20 to-slate-400/20' :
              'from-gray-500/20 to-slate-500/20'
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
              score >= 90 ? 'bg-gradient-to-br from-cyan-500/10 to-transparent' :
              score >= 80 ? 'bg-gradient-to-br from-teal-400/10 to-transparent' :
              score >= 70 ? 'bg-gradient-to-br from-pink-400/10 to-transparent' :
              score >= 60 ? 'bg-gradient-to-br from-rose-400/10 to-transparent' :
              score >= 40 ? 'bg-gradient-to-br from-gray-400/10 to-transparent' :
              'bg-gradient-to-br from-gray-500/10 to-transparent'
            } ${isHovered ? 'opacity-100' : 'opacity-50'} transition-opacity duration-300`}></div>
          </div>

          {/* Floating particles effect */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${
                    score >= 90 ? 'bg-cyan-400' :
                    score >= 80 ? 'bg-teal-300' :
                    score >= 70 ? 'bg-pink-300' :
                    score >= 60 ? 'bg-rose-400' :
                    score >= 40 ? 'bg-gray-400' :
                    'bg-gray-500'
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
            <span className={`text-lg font-bold flex items-center ${score >= 90 ? 'text-cyan-400' : score >= 80 ? 'text-teal-300' : score >= 70 ? 'text-pink-400' : score >= 60 ? 'text-rose-400' : score >= 40 ? 'text-gray-300' : 'text-gray-400'}`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${score >= 90 ? 'text-cyan-400' : score >= 80 ? 'text-teal-300' : score >= 70 ? 'text-pink-400' : score >= 60 ? 'text-rose-400' : score >= 40 ? 'text-gray-300' : 'text-gray-400'}`} />
              {score}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm text-foreground">{lastUpdated}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Soulbound To</span>
            <span className={`text-sm flex items-center ${score >= 90 ? 'text-cyan-300' : score >= 80 ? 'text-teal-300' : score >= 70 ? 'text-pink-300' : score >= 60 ? 'text-rose-400' : score >= 40 ? 'text-gray-300' : 'text-gray-400'}`}>
              <Wallet className="w-3 h-3 mr-1" />
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Your Account"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="outline" className={`border-secondary text-secondary ${score >= 90 ? 'border-cyan-400 text-cyan-300' : score >= 80 ? 'border-teal-400 text-teal-300' : score >= 70 ? 'border-pink-400 text-pink-300' : score >= 60 ? 'border-rose-400 text-rose-300' : score >= 40 ? 'border-gray-400 text-gray-300' : 'border-gray-500 text-gray-400'}`}>
              <Award className="w-3 h-3 mr-1" />
              {score >= 90 ? "Diamond Elite" : score >= 80 ? "Platinum" : score >= 70 ? "Gold" : score >= 60 ? "Silver" : score >= 40 ? "Bronze" : "Developing"}
            </Badge>
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-lg border ${score >= 90 ? 'bg-cyan-500/10 border-cyan-400/20' : score >= 80 ? 'bg-teal-400/10 border-teal-400/20' : score >= 70 ? 'bg-pink-400/10 border-pink-400/20' : score >= 60 ? 'bg-rose-400/10 border-rose-400/20' : score >= 40 ? 'bg-gray-400/10 border-gray-400/20' : 'bg-gray-500/10 border-gray-500/20'}`}>
          <p className={`text-xs text-center ${score >= 90 ? 'text-cyan-300/80' : score >= 80 ? 'text-teal-300/80' : score >= 70 ? 'text-pink-300/80' : score >= 60 ? 'text-rose-400/80' : score >= 40 ? 'text-gray-300/80' : 'text-gray-400/80'}`}>
            {score >= 90
              ? "✨ This legendary Soulbound Token represents unparalleled excellence in the Web3 ecosystem."
              : score >= 80
              ? "🌟 This premium Soulbound Token showcases exceptional reputation and trustworthiness."
              : score >= 70
              ? "⭐ This valuable Soulbound Token demonstrates solid standing in the Web3 community."
              : score >= 60
              ? "🌸 This Soulbound Token indicates developing reputation with room for growth."
              : score >= 40
              ? "⚫ This Soulbound Token represents emerging presence in the Web3 ecosystem."
              : "⚪ This Soulbound Token marks your entry into the Web3 reputation system."
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

        .shadow-teal-400/50 {
          box-shadow: 0 0 25px rgba(20, 184, 166, 0.4), 0 0 50px rgba(20, 184, 166, 0.15);
        }

        .shadow-pink-400/50 {
          box-shadow: 0 0 25px rgba(244, 114, 182, 0.4), 0 0 50px rgba(244, 114, 182, 0.15);
        }

        .shadow-rose-400/50 {
          box-shadow: 0 0 25px rgba(251, 146, 60, 0.4), 0 0 50px rgba(251, 146, 60, 0.15);
        }

        .shadow-gray-400/50 {
          box-shadow: 0 0 25px rgba(156, 163, 175, 0.4), 0 0 50px rgba(156, 163, 175, 0.15);
        }

        .shadow-gray-500/30 {
          box-shadow: 0 0 20px rgba(107, 114, 128, 0.3), 0 0 40px rgba(107, 114, 128, 0.1);
        }
      `}</style>
    </Card>
  );
};
