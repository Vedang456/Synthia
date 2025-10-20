import DotGrid from "@/components/DotGrid";
import { useWeb3 } from "@/contexts/Web3Context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnect } from "@/components/WalletConnect";
import { Dashboard } from "@/components/Dashboard";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import logoImage from "@/assets/Synthia.png";
import { Link } from "react-router-dom";

const Index = () => {
  const { isConnected } = useWeb3();

  if (isConnected) {
    return <Dashboard />;
  }

  return <div className="min-h-screen">
      {/* Header with WalletConnect */}
      <div className="absolute top-4 right-4 z-20">
        <WalletConnect />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with DotGrid */}
        <div className="absolute inset-0 z-0">
          <DotGrid
            dotSize={8}
            gap={20}
            baseColor="#5227FF"
            activeColor="#7C3AED"
            proximity={100}
            shockRadius={200}
            shockStrength={3}
            resistance={800}
            returnDuration={2}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-left">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary/20 border border-primary/50 mb-8 shadow-neon backdrop-blur-sm">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary tracking-wide">Powered by ASI Agents</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 glow-text text-amber-50 leading-tight tracking-tight">
            <div className="flex items-center justify-start gap-4 mb-3">
              <img
                src={logoImage}
                alt="Synthia Logo"
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full shadow-neon"
              />
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Synthia</span>
            </div>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-amber-50/90 mb-10 max-w-4xl leading-relaxed tracking-wide font-light">
            Decentralized Reputation System powered by Blockchain & AI
          </p>

          <p className="text-lg md:text-xl text-amber-50/80 mb-16 max-w-3xl leading-relaxed tracking-wide font-light">
            Build transparent, tamper-proof reputation using Soulbound NFTs.
            Let ASI agents analyze your on-chain activity and unlock your true Web3 identity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-start items-center mb-16">
            <Link to="/docs">
              <Button variant="outline" size="lg">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Features */}
      <Features />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cyber opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Sparkles className="w-20 h-20 text-primary mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 glow-text leading-tight tracking-tight">
            Ready to Build Your Reputation?
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed tracking-wide font-light">
            Join the future of decentralized trust. Connect your wallet and let ASI agents
            analyze your on-chain activity to create your unique reputation score.
          </p>
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-border/50 overflow-hidden">
        {/* DotGrid Background */}
        <div className="absolute inset-0 z-0">
          <DotGrid
            dotSize={6}
            gap={25}
            baseColor="#5227FF"
            activeColor="#7C3AED"
            proximity={80}
            shockRadius={150}
            shockStrength={2}
            resistance={900}
            returnDuration={2.5}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img
                src="/Synthia.png"
                alt="Synthia Logo"
                className="w-10 h-10 rounded-full shadow-neon"
              />
              <div className="text-sm text-foreground/90 leading-relaxed">
                <p className="font-semibold text-base mb-1">© 2025 Synthia</p>
                <p className="opacity-90 mb-0.5">Decentralized Reputation System</p>
                <p className="opacity-70 text-xs">Built with blockchain technology and AI agents</p>
              </div>
            </div>
            <div className="text-sm text-foreground/90 text-center md:text-right">
              <p className="font-semibold">Powered by ASI Agents</p>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
