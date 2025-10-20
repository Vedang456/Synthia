import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, Home, LogOut, Sparkles, Users, Activity } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";

export const Navbar = () => {
  const { isConnected, disconnect } = useWeb3();
  const navigate = useNavigate();

  if (!isConnected) {
    return null;
  }

  return (
    <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors">
              <Home className="w-5 h-5" />
              Synthia
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Section Selectors */}
            <div className="hidden xl:flex items-center gap-1 mr-2 p-2 bg-muted/30 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/score')}
                className="text-sm px-3 py-2 h-auto hover:bg-primary/10 font-medium"
                title="Go to Reputation Score"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Score
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/nft')}
                className="text-sm px-3 py-2 h-auto hover:bg-primary/10 font-medium"
                title="Go to NFT Card"
              >
                <Users className="w-4 h-4 mr-2" />
                NFT
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/activity')}
                className="text-sm px-3 py-2 h-auto hover:bg-primary/10 font-medium"
                title="Go to Activity Timeline"
              >
                <Activity className="w-4 h-4 mr-2" />
                Activity
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/info')}
                className="text-sm px-3 py-2 h-auto hover:bg-primary/10 font-medium"
                title="Go to Technical Information"
              >
                <span className="text-lg mr-1">⚙</span>
                MeTTa
              </Button>
            </div>

            <Link to="/docs">
              <Button variant="outline" size="sm" className="gap-2">
                <Book className="w-4 h-4" />
                Docs
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={disconnect}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
