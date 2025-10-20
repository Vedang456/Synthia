import { WalletConnect } from "@/components/WalletConnect";
import { Dashboard } from "@/components/Dashboard";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import heroImage from "@/assets/hero-bg.jpeg";

const Index = () => {
  const { isConnected } = useWeb3();

  if (isConnected) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="absolute inset-0 cyber-grid opacity-30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/50 mb-6 shadow-neon">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Powered by ASI Agents</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 glow-text">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img 
                src="src/assets/Synthia.png" 
                alt="Synthia Logo" 
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full shadow-neon"
              />
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Synthia</span>
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Decentralized Reputation System powered by Blockchain & AI
          </p>

          <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
            Build transparent, tamper-proof reputation using Soulbound NFTs. 
            Let ASI agents analyze your on-chain activity and unlock your true Web3 identity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <WalletConnect />
            <Button variant="outline" size="lg">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/30">
              <div className="text-4xl font-bold text-primary glow-text mb-2">1000</div>
              <div className="text-sm text-muted-foreground">Max Reputation Score</div>
            </div>
            <div className="p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-secondary/30">
              <div className="text-4xl font-bold text-secondary glow-text mb-2">SBT</div>
              <div className="text-sm text-muted-foreground">Soulbound NFTs</div>
            </div>
            <div className="p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-accent/30">
              <div className="text-4xl font-bold text-accent glow-text mb-2">ASI</div>
              <div className="text-sm text-muted-foreground">AI-Powered Analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Features */}
      <Features />

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cyber opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4 glow-text">Ready to Build Your Reputation?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the future of decentralized trust. Connect your wallet and let ASI agents 
            analyze your on-chain activity to create your unique reputation score.
          </p>
          <WalletConnect />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img 
                src="/Synthia.png" 
                alt="Synthia Logo" 
                className="w-6 h-6 rounded-full"
              />
              <div className="text-sm text-muted-foreground">
                <p>© 2025 Synthia. Decentralized Reputation System.</p>
                <p className="mt-1">Built with blockchain technology and AI agents.</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Powered by ASI Agents</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
