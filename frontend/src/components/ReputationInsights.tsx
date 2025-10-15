import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Award, Users, MessageSquare, Activity, Sparkles, Target } from "lucide-react";
import { useDemoData } from "@/hooks/useDemoData";

interface ReputationInsightsProps {
  score: number;
  walletAddress?: string;
}

export const ReputationInsights = ({ score, walletAddress }: ReputationInsightsProps) => {
  const { currentDemoWallet } = useDemoData();

  // Use the current demo wallet data if no specific wallet address is provided
  const wallet = currentDemoWallet;

  // Calculate score breakdown based on current score
  // These are calculated as percentages of the total score
  const getScoreBreakdown = (totalScore: number) => {
    // Base the breakdown on realistic proportions for a well-rounded wallet
    // Higher scores get better distribution across all categories
    const scoreRatio = totalScore / 1000;

    return {
      transactionScore: Math.min(100, Math.round(totalScore * 0.25 * scoreRatio + 60)), // 25% weight
      defiScore: Math.min(100, Math.round(totalScore * 0.30 * scoreRatio + 50)), // 30% weight
      securityScore: Math.min(100, Math.round(totalScore * 0.25 * scoreRatio + 70)), // 25% weight
      socialScore: Math.min(100, Math.round(totalScore * 0.20 * scoreRatio + 40)) // 20% weight
    };
  };

  const breakdown = getScoreBreakdown(score);

  // Calculate tier and milestone information based on actual score
  const getTierInfo = (score: number) => {
    if (score >= 900) return { name: "Diamond", color: "text-cyan-400", bg: "bg-cyan-500/20", description: "Exceptional reputation across all dimensions" };
    if (score >= 800) return { name: "Platinum", color: "text-slate-300", bg: "bg-slate-500/20", description: "Excellent standing with strong fundamentals" };
    if (score >= 700) return { name: "Gold", color: "text-yellow-400", bg: "bg-yellow-500/20", description: "Very good reputation with room for growth" };
    if (score >= 600) return { name: "Silver", color: "text-gray-300", bg: "bg-gray-500/20", description: "Good standing with solid foundation" };
    if (score >= 400) return { name: "Bronze", color: "text-orange-400", bg: "bg-orange-500/20", description: "Moderate reputation, building steadily" };
    return { name: "Developing", color: "text-gray-500", bg: "bg-gray-500/10", description: "Developing reputation, great potential ahead" };
  };

  const getNextMilestone = (score: number) => {
    if (score >= 900) {
      return {
        points: 0,
        tier: "Diamond",
        message: "You've reached the highest tier! Maintain your excellent standing.",
        suggestions: ["Continue maintaining security standards", "Consider protocol governance participation"]
      };
    }

    const milestones = [
      { threshold: 900, name: "Diamond", points: 900 - score },
      { threshold: 800, name: "Platinum", points: 800 - score },
      { threshold: 700, name: "Gold", points: 700 - score },
      { threshold: 600, name: "Silver", points: 600 - score },
      { threshold: 400, name: "Bronze", points: 400 - score }
    ];

    const nextMilestone = milestones.find(m => score < m.threshold);

    if (nextMilestone) {
      return {
        points: nextMilestone.points,
        tier: nextMilestone.name,
        message: `${nextMilestone.points} points to ${nextMilestone.name} tier`,
        suggestions: getImprovementSuggestions(score, nextMilestone.name)
      };
    }

    return {
      points: 0,
      tier: "Maximum",
      message: "You've reached the highest possible tier!",
      suggestions: ["Maintain your excellent reputation", "Continue demonstrating consistent behavior"]
    };
  };

  const getImprovementSuggestions = (currentScore: number, targetTier: string) => {
    const suggestions: string[] = [];

    if (targetTier === "Diamond" && currentScore < 900) {
      suggestions.push("Focus on DeFi participation and social verification");
      suggestions.push("Maintain consistent high-value transactions");
      suggestions.push("Ensure impeccable security practices");
    } else if (targetTier === "Platinum" && currentScore < 800) {
      suggestions.push("Expand DeFi protocol participation");
      suggestions.push("Improve social proof and verification");
      suggestions.push("Maintain security best practices");
    } else if (targetTier === "Gold" && currentScore < 700) {
      suggestions.push("Increase transaction volume and consistency");
      suggestions.push("Explore more DeFi opportunities");
      suggestions.push("Build social presence and verification");
    }

    return suggestions.length > 0 ? suggestions : ["Continue your current positive behavior patterns"];
  };

  const insights = [
    {
      category: "Transaction Activity",
      score: breakdown.transactionScore,
      maxScore: 100,
      description: "Based on transaction volume, frequency, and patterns",
      trend: breakdown.transactionScore > 80 ? "up" : breakdown.transactionScore > 60 ? "stable" : "down",
      color: "bg-blue-500"
    },
    {
      category: "DeFi Engagement",
      score: breakdown.defiScore,
      maxScore: 100,
      description: "Participation in decentralized finance protocols",
      trend: breakdown.defiScore > 80 ? "up" : breakdown.defiScore > 60 ? "stable" : "down",
      color: "bg-purple-500"
    },
    {
      category: "Security Posture",
      score: breakdown.securityScore,
      maxScore: 100,
      description: "Security practices and risk assessment",
      trend: breakdown.securityScore > 90 ? "up" : "stable",
      color: "bg-green-500"
    },
    {
      category: "Social Proof",
      score: breakdown.socialScore,
      maxScore: 100,
      description: "Social verification and community presence",
      trend: breakdown.socialScore > 70 ? "up" : breakdown.socialScore > 50 ? "stable" : "down",
      color: "bg-orange-500"
    }
  ];

  const tierInfo = getTierInfo(score);
  const milestoneInfo = getNextMilestone(score);

  const quickActions = [
    {
      title: "Chat with ASI:One",
      description: "Get personalized insights and ask questions",
      icon: MessageSquare,
      action: () => {
        // Trigger chat interface
        const event = new CustomEvent('open-chat');
        window.dispatchEvent(event);
      }
    },
    {
      title: "View Agent Coordination",
      description: "See how ASI agents work together",
      icon: Users,
      action: () => {
        // Switch to agents tab
        const event = new CustomEvent('switch-to-agents');
        window.dispatchEvent(event);
      }
    },
    {
      title: "Compare with Others",
      description: "See how you rank against other users",
      icon: Target,
      action: () => {
        // Trigger comparison feature
        const event = new CustomEvent('trigger-comparison');
        window.dispatchEvent(event);
      }
    },
    {
      title: "View Analytics",
      description: "Detailed breakdown of your reputation",
      icon: Activity,
      action: () => {
        // Switch to analysis tab
        const event = new CustomEvent('switch-to-analysis');
        window.dispatchEvent(event);
      }
    }
  ];

  return (
    <Card className="p-6 bg-card/30 backdrop-blur-sm border-primary/30">
      <h3 className="text-xl font-bold mb-6 text-primary glow-text flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        Reputation Insights
      </h3>

      {/* Current Tier Display */}
      <div className="mb-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Current Tier</span>
          <Badge className={`${tierInfo.bg} ${tierInfo.color} border-current`}>
            {tierInfo.name}
          </Badge>
        </div>
        <div className="text-2xl font-bold text-primary mb-1">
          {score}/1000
        </div>
        <p className="text-sm text-muted-foreground">
          {tierInfo.description}
        </p>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-foreground">Score Breakdown</h4>
        {insights.map((insight, index) => (
          <div key={index} className="p-4 rounded-lg border border-border/50 bg-muted/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{insight.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{insight.score}/100</span>
                {insight.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                {insight.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                {insight.trend === "stable" && <div className="w-4 h-4 rounded-full bg-gray-400" />}
              </div>
            </div>
            <Progress value={insight.score} className="mb-2" />
            <p className="text-xs text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto p-3 flex flex-col items-center gap-2 text-center hover:bg-primary/10"
              onClick={action.action}
            >
              <action.icon className="w-5 h-5" />
              <div>
                <div className="font-medium text-xs">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Next Milestone */}
      <div className="mt-6 p-4 rounded-lg border border-secondary/20 bg-secondary/5">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-secondary" />
          <span className="font-medium text-sm">Next Milestone</span>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">
            {milestoneInfo.message}
          </div>
          {milestoneInfo.points > 0 && (
            <div className="text-xs text-secondary mb-2">
              {milestoneInfo.points} points to {milestoneInfo.tier} tier
            </div>
          )}
          <div className="text-xs text-secondary">
            <div className="font-medium mb-1">💡 Suggestions:</div>
            <ul className="space-y-1">
              {milestoneInfo.suggestions.slice(0, 2).map((suggestion, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-xs">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
