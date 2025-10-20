import { useState } from "react";
import { ArrowLeft, Book, Code, Lightbulb, Rocket, Shield, Users, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const navigation = [
    { id: "overview", label: "Overview", icon: Book },
    { id: "features", label: "Features", icon: Shield },
    { id: "reputation-score", label: "Reputation Score", icon: Zap },
    { id: "how-it-works", label: "How It Works", icon: Lightbulb },
    { id: "getting-started", label: "Getting Started", icon: Rocket },
    { id: "api", label: "API Reference", icon: Code },
    { id: "faq", label: "FAQ", icon: Users },
  ];

  const sections = {
    overview: {
      title: "Synthia Documentation",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Synthia is a revolutionary decentralized reputation system that leverages blockchain technology and artificial intelligence to create tamper-proof, transparent reputation scores for Web3 participants.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">What is Synthia?</h2>
            <p className="text-muted-foreground">
              Synthia combines the power of Soulbound NFTs (SBTs) with advanced ASI (Artificial Super Intelligence) agents to analyze on-chain behavior and generate dynamic reputation scores. Unlike traditional reputation systems, Synthia creates permanent, non-transferable reputation tokens that stay with users across all Web3 applications.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Key Benefits</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Tamper-Proof:</strong> Reputation scores stored on blockchain cannot be manipulated</li>
              <li><strong>AI-Powered:</strong> Advanced algorithms analyze complex on-chain behavior patterns</li>
              <li><strong>Universal:</strong> Works across all Web3 applications and platforms</li>
              <li><strong>Transparent:</strong> All score calculations and updates are publicly verifiable</li>
              <li><strong>Dynamic:</strong> Reputation evolves based on ongoing activity and behavior</li>
            </ul>
          </div>
        </div>
      )
    },

    features: {
      title: "Features",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Soulbound NFTs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Non-transferable reputation tokens that permanently bind to your wallet address, ensuring authentic representation of your Web3 identity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced ASI agents analyze complex transaction patterns, smart contract interactions, and behavioral data to generate accurate reputation scores.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-primary" />
                  Tamper-Proof Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All reputation data is stored on-chain, making it immutable and resistant to manipulation or external interference.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Universal Trust
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Build reputation that transcends individual applications, creating a unified trust layer for the entire Web3 ecosystem.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },

    "how-it-works": {
      title: "How It Works",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">The Synthia Process</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">Link your Web3 wallet to begin the reputation building process. Synthia supports all major wallet providers.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Analysis Begins</h3>
                  <p className="text-muted-foreground">Our ASI agents analyze your on-chain activity, transaction history, smart contract interactions, and behavioral patterns.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">SBT Generation</h3>
                  <p className="text-muted-foreground">A unique Soulbound NFT is minted containing your reputation score and metadata, permanently bound to your wallet.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Continuous Evolution</h3>
                  <p className="text-muted-foreground">Your reputation score evolves over time as you continue to interact with Web3 applications and build your digital identity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    "getting-started": {
      title: "Getting Started",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>

            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>A Web3 wallet (MetaMask, WalletConnect, etc.)</li>
                <li>Some ETH for gas fees</li>
                <li>Basic understanding of blockchain concepts</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3">Step 1: Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-4">Click the "Connect Wallet" button on the homepage and select your preferred wallet provider.</p>

            <h3 className="text-xl font-semibold mb-3">Step 2: Grant Permissions</h3>
            <p className="text-muted-foreground mb-4">Approve the smart contract interactions required for reputation analysis.</p>

            <h3 className="text-xl font-semibold mb-3">Step 3: Wait for Analysis</h3>
            <p className="text-muted-foreground mb-4">Our ASI agents will analyze your on-chain activity. This process typically takes 2-5 minutes.</p>

            <h3 className="text-xl font-semibold mb-3">Step 4: Claim Your SBT</h3>
            <p className="text-muted-foreground mb-4">Once analysis is complete, claim your unique Soulbound NFT containing your reputation score.</p>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> The analysis process is one-time. Once you have your SBT, your reputation will continue to evolve automatically based on your ongoing Web3 activity.
              </p>
            </div>
          </div>
        </div>
      )
    },

    api: {
      title: "API Reference",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              Synthia provides a comprehensive API for developers to integrate reputation data into their applications.
            </p>

            <h2 className="text-2xl font-bold mb-4">Endpoints</h2>

            <div className="space-y-4">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">{`GET /api/reputation/{address}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">Retrieve reputation data for a specific wallet address.</CardDescription>
                  <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                    Response: {`{ score: number, level: string, badges: string[], lastUpdated: string }`}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">{`GET /api/verify/{tokenId}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">Verify the authenticity and validity of a reputation SBT.</CardDescription>
                  <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                    Response: {`{ valid: boolean, owner: string, metadata: object }`}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">Authentication</h3>
              <p className="text-sm text-muted-foreground">API access requires an API key. Contact our team for developer access.</p>
            </div>
          </div>
        </div>
      )
    },

    "reputation-score": {
      title: "Understanding Your Reputation Score",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">How Your Reputation Score is Calculated</h2>

            <p className="text-muted-foreground mb-6">
              Your reputation score is calculated by ASI agents based on comprehensive analysis of your on-chain activities across multiple dimensions.
            </p>

            <h3 className="text-xl font-semibold mb-3">Scoring Dimensions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Transaction Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Analysis of transaction volume, frequency, and patterns. Higher scores for consistent, legitimate activity across multiple protocols.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Security Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Evaluation of wallet security measures, smart contract interactions, and risk management behaviors.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    DeFi Participation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Assessment of DeFi protocol usage, liquidity provision, yield farming, and governance participation.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Social Proof
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Verification through social identity, community engagement, and cross-platform reputation signals.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-3">Score Ranges</h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">900+</div>
                <div>
                  <h4 className="font-semibold text-green-400">Diamond Tier</h4>
                  <p className="text-sm text-muted-foreground">Elite users with exceptional reputation across all dimensions</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">750+</div>
                <div>
                  <h4 className="font-semibold text-blue-400">Platinum Tier</h4>
                  <p className="text-sm text-muted-foreground">Highly trusted users with strong reputation scores</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">600+</div>
                <div>
                  <h4 className="font-semibold text-yellow-400">Gold Tier</h4>
                  <p className="text-sm text-muted-foreground">Good reputation with room for improvement</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">300+</div>
                <div>
                  <h4 className="font-semibold text-gray-400">Silver Tier</h4>
                  <p className="text-sm text-muted-foreground">Developing reputation, needs more activity</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">Soulbound NFTs</h3>

            <p className="text-muted-foreground mb-4">
              Your Soulbound NFT is a permanent, non-transferable representation of your reputation that can be verified across all Web3 applications. This SBT contains:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>Your current reputation score and tier</li>
              <li>Historical score evolution data</li>
              <li>Verification metadata for cross-platform use</li>
              <li>Immutable proof of your Web3 identity</li>
            </ul>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Important Note</h4>
              <p className="text-sm text-muted-foreground">
                Reputation scores evolve over time based on your ongoing Web3 activity. Positive behaviors increase your score, while periods of inactivity or risky behavior may decrease it. The system continuously monitors and updates your reputation to reflect your current standing in the Web3 ecosystem.
              </p>
            </div>
          </div>
        </div>
      )
    },

    faq: {
      title: "Frequently Asked Questions",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">What is a Soulbound NFT?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A Soulbound NFT (SBT) is a non-transferable token that is permanently bound to a specific wallet address. Unlike regular NFTs, SBTs cannot be sold, traded, or transferred, making them perfect for representing immutable aspects of identity like reputation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">How is my reputation score calculated?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our ASI agents analyze multiple factors including transaction volume, smart contract interactions, DeFi participation, NFT ownership patterns, governance participation, and community engagement across various protocols.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Can my reputation score change over time?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Yes! Your reputation is dynamic and evolves based on your ongoing Web3 activity. Positive behaviors increase your score, while negative or inactive periods may decrease it. The system continuously monitors and updates your reputation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Is my data private?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All analysis is performed on public blockchain data only. We never access private keys or sensitive personal information. The reputation system operates entirely on transparent, publicly available on-chain data.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-xl font-semibold">Synthia Documentation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-sm min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{sections[activeSection as keyof typeof sections].title}</h1>
              <p className="text-muted-foreground">Comprehensive guide to understanding and using Synthia</p>
            </div>

            {sections[activeSection as keyof typeof sections].content}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
