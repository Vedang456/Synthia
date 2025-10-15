import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSynthiaContract } from "@/hooks/useSynthiaContract";
import { useWeb3 } from "@/contexts/Web3Context";
import { Shield, RefreshCw, Settings, Sparkles } from "lucide-react";
import { showToast } from "@/lib/toast-utils";

export const ContractInteraction = () => {
  const { address } = useWeb3();
  const {
    requestScoreUpdate,
    getUserScore,
    getTokenId,
    getASIAgent,
    updateASIAgent,
    updateScore,
    checkPendingUpdate,
    isLoading,
  } = useSynthiaContract();

  const [userAddress, setUserAddress] = useState("");
  const [newAgent, setNewAgent] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [scoreValue, setScoreValue] = useState("");
  const [asiAgent, setAsiAgent] = useState<string>("");
  const [isPending, setIsPending] = useState(false);

  const loadASIAgent = useCallback(async () => {
    const agent = await getASIAgent();
    if (agent) setAsiAgent(agent);
  }, [getASIAgent]);

  const checkPending = useCallback(async () => {
    const pending = await checkPendingUpdate();
    setIsPending(pending);
  }, [checkPendingUpdate]);

  const handleRequestUpdate = async () => {
    const success = await requestScoreUpdate();
    if (success) {
      await checkPending();
    }
  };

  const handleQueryScore = async () => {
    const queryAddress = userAddress || address;
    if (!queryAddress) {
      showToast.error("Please enter an address");
      return;
    }

    const scoreData = await getUserScore(queryAddress);
    if (scoreData) {
      const date = new Date(scoreData.lastUpdated * 1000).toLocaleString();
      showToast.success(`Score: ${scoreData.score}\nLast Updated: ${date}`, { duration: 5000 });
    } else {
      showToast.error("No score found for this address");
    }
  };

  const handleUpdateAgent = async () => {
    if (!newAgent) {
      showToast.error("Please enter a new agent address");
      return;
    }

    const success = await updateASIAgent(newAgent);
    if (success) {
      setNewAgent("");
      await loadASIAgent();
    }
  };

  const handleUpdateScore = async () => {
    if (!targetUser || !scoreValue) {
      showToast.error("Please enter both address and score");
      return;
    }

    const score = parseInt(scoreValue);
    const success = await updateScore(targetUser, score);
    if (success) {
      setTargetUser("");
      setScoreValue("");
    }
  };

  useEffect(() => {
    if (address) {
      loadASIAgent();
      checkPending();
    }
  }, [address, loadASIAgent, checkPending]);

  return (
    <Card className="p-6 bg-card/30 backdrop-blur-sm border-primary/30">
      <h3 className="text-2xl font-bold mb-6 text-primary glow-text flex items-center gap-2">
        <Shield className="w-6 h-6" />
        Contract Functions
      </h3>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user">User Functions</TabsTrigger>
          <TabsTrigger value="query">Query</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-lg space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Request Score Update</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Request ASI agent to analyze your wallet and update your reputation score
              </p>
              {isPending && (
                <div className="mb-3 p-2 bg-secondary/20 border border-secondary/50 rounded text-sm text-secondary">
                  ⏳ Score update pending...
                </div>
              )}
              <Button
                variant="hero"
                onClick={handleRequestUpdate}
                disabled={isLoading || isPending}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Request Score Update
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="query" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Query Address (leave empty for your address)</Label>
              <Input
                placeholder="0x..."
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" onClick={handleQueryScore} className="w-full">
                Get Score
              </Button>
            </div>

            <div className="p-3 bg-muted/20 rounded text-sm">
              <div className="font-semibold mb-1">Current ASI Agent</div>
              <div className="text-muted-foreground font-mono text-xs break-all">
                {asiAgent || "Not loaded"}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg mb-4">
            <p className="text-sm text-destructive">
              ⚠️ Admin functions can only be called by the ASI agent
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Update ASI Agent Address</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="New agent address"
                  value={newAgent}
                  onChange={(e) => setNewAgent(e.target.value)}
                />
                <Button
                  variant="cyber"
                  onClick={handleUpdateAgent}
                  disabled={isLoading}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Update User Score (ASI Agent Only)</Label>
              <div className="space-y-2 mt-2">
                <Input
                  placeholder="User address"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Score (0-1000)"
                  value={scoreValue}
                  onChange={(e) => setScoreValue(e.target.value)}
                  min="0"
                  max="1000"
                />
                <Button
                  variant="secondary"
                  onClick={handleUpdateScore}
                  disabled={isLoading}
                  className="w-full"
                >
                  Update Score
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
