import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Shield, Lock, Zap, Globe, BarChart3, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Soulbound NFTs",
    description: "Non-transferable reputation tokens that stay with your wallet forever",
  },
  {
    icon: Lock,
    title: "Tamper-Proof",
    description: "Blockchain-based scores that cannot be manipulated or altered",
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Advanced ASI agents analyze behavior for accurate scoring",
  },
  {
    icon: Globe,
    title: "Transparent",
    description: "All score updates and changes are publicly verifiable",
  },
  {
    icon: BarChart3,
    title: "Dynamic Scoring",
    description: "Reputation evolves based on your ongoing on-chain activities",
  },
  {
    icon: Users,
    title: "Universal Trust",
    description: "Build reputation that works across all Web3 applications",
  },
];

export const Features = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-glow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 glow-text">Why Synthia?</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Revolutionary reputation infrastructure for the decentralized web
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full">
            <Card className="bg-card/30 backdrop-blur-sm border-primary/30 hover:bg-card/40 transition-colors">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary glow-text mb-1 sm:mb-2">100</div>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">Max Reputation Score</CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-card/30 backdrop-blur-sm border-secondary/30 hover:bg-card/40 transition-colors">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-secondary glow-text mb-1 sm:mb-2">SBT</div>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">Soulbound NFTs</CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-card/30 backdrop-blur-sm border-accent/30 hover:bg-card/40 transition-colors">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent glow-text mb-1 sm:mb-2">ASI</div>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">AI-Powered Analysis</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-cyan group"
            >
              <feature.icon className="w-12 h-12 text-primary group-hover:text-secondary transition-colors mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
