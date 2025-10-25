import { Card } from "@/components/ui/card";
import { Wallet, Brain, Award, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your Web3 wallet to get started with Synthia",
    color: "text-primary",
  },
  {
    icon: Brain,
    title: "ASI Analysis",
    description: "Our ASI agent analyzes your on-chain activity and behavior",
    color: "text-secondary",
  },
  {
    icon: Award,
    title: "Score Calculation",
    description: "Receive a reputation score (0-100) based on comprehensive analysis",
    color: "text-accent",
  },
  {
    icon: Sparkles,
    title: "NFT Minting",
    description: "Get your Soulbound NFT representing your reputation",
    color: "text-primary",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 glow-text">How Synthia Works</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            A transparent, AI-powered reputation system built on blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="p-6 bg-card/30 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-neon"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-cyber flex items-center justify-center mb-4 shadow-neon`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              <div className="text-sm text-secondary font-semibold mb-2">
                Step {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
