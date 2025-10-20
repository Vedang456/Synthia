import { Navbar } from "@/components/Navbar";
import { useWeb3 } from "@/contexts/Web3Context";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const InfoPage = () => {
  const { isConnected } = useWeb3();

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
              Please connect your wallet to view technical information and access all features.
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
            <h1 className="text-4xl font-bold glow-text mb-2">Technical Information</h1>
            <p className="text-muted-foreground">
              Advanced AI reasoning and blockchain integration details
            </p>
          </div>

          <div className="space-y-8">
            {/* MeTTa Reasoning Section */}
            <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">🤖 MeTTa Symbolic Reasoning</h2>
              <p className="text-muted-foreground mb-4">
                Our advanced AI reasoning engine applies sophisticated logical rules to determine reputation levels and provide transparent explanations for score calculations.
              </p>

              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Sample Reasoning Rule:</h4>
                <p className="text-sm font-mono text-muted-foreground">
                  elite_defi_user ∧ excellent_reputation ∧ social_proof_verified → diamond_tier
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Reasoning Process:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Pattern Recognition</li>
                    <li>• Behavioral Analysis</li>
                    <li>• Risk Assessment</li>
                    <li>• Trust Scoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Transparent Logic</li>
                    <li>• Explainable AI</li>
                    <li>• Rule-based Decisions</li>
                    <li>• Continuous Learning</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Blockchain Integration Section */}
            <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">⛓️ Hedera Blockchain Integration</h2>
              <p className="text-muted-foreground mb-4">
                All reputation data is immutably stored on Hedera with 3-second finality, HCS audit trails, and HTS token support for maximum transparency and security.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">3s</div>
                  <div className="text-sm font-medium">Finality</div>
                  <div className="text-xs text-muted-foreground">Ultra-fast confirmation</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">HCS</div>
                  <div className="text-sm font-medium">Audit Trail</div>
                  <div className="text-xs text-muted-foreground">Complete transparency</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">HTS</div>
                  <div className="text-sm font-medium">Token Standard</div>
                  <div className="text-xs text-muted-foreground">Native token support</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Technical Benefits:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Immutable Storage</li>
                    <li>• Cryptographic Security</li>
                    <li>• Decentralized Consensus</li>
                    <li>• Tamper-proof Records</li>
                    <li>• Public Verifiability</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Integration Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Smart Contract Integration</li>
                    <li>• Event Streaming (HCS)</li>
                    <li>• Token Management (HTS)</li>
                    <li>• Cross-platform Compatibility</li>
                    <li>• Developer-friendly APIs</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Technical Details */}
            <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">System Architecture</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">AI Components:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Natural Language Processing</li>
                    <li>• Pattern Recognition Engines</li>
                    <li>• Behavioral Analysis Models</li>
                    <li>• Risk Assessment Algorithms</li>
                    <li>• Symbolic Reasoning Systems</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Blockchain Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Distributed Ledger Technology</li>
                    <li>• Consensus Mechanisms</li>
                    <li>• Cryptographic Security</li>
                    <li>• Smart Contract Platform</li>
                    <li>• Interoperability Protocols</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
