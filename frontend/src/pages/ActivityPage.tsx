import { Navbar } from "@/components/Navbar";
import { ReputationInsights } from "@/components/ReputationInsights";
import { useDemoData } from "@/hooks/useDemoData";
import { useWeb3 } from "@/contexts/Web3Context";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ActivityPage = () => {
  const { address, isConnected } = useWeb3();
  const { currentDemoWallet } = useDemoData();

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
              Please connect your wallet to view your activity timeline and access all features.
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold glow-text mb-2">Activity Timeline</h1>
            <p className="text-muted-foreground">
              Detailed analysis of your on-chain activity and reputation evolution
            </p>
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
            <ReputationInsights
              score={currentDemoWallet.score}
              walletAddress={address || currentDemoWallet.address}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary">Activity Analysis</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Our ASI agents analyze multiple dimensions of your on-chain activity including transaction patterns,
                  smart contract interactions, DeFi participation, and governance activities.
                </p>
                <p>
                  This comprehensive analysis provides insights into your reputation evolution and helps identify
                  areas for improvement in your Web3 participation.
                </p>
              </div>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary">Scoring Dimensions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Transaction Activity</span>
                  <span className="text-primary font-medium">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Security Practices</span>
                  <span className="text-primary font-medium">Excellent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>DeFi Participation</span>
                  <span className="text-primary font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Social Proof</span>
                  <span className="text-primary font-medium">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
