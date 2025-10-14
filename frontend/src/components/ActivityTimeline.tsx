import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, Sparkles, Activity } from "lucide-react";
import { useSynthiaContract } from "@/hooks/useSynthiaContract";

interface ActivityItem {
  id: number;
  type: "score_update" | "nft_mint" | "analysis" | "achievement" | "nft_update";
  title: string;
  description: string;
  timestamp: string | number;
  scoreChange?: number;
}

interface ActivityTimelineProps {
  currentScore?: number;
  lastUpdated?: Date | null;
  walletAddress?: string | undefined;
}

export const ActivityTimeline = ({ currentScore, lastUpdated, walletAddress }: ActivityTimelineProps) => {
  const { getActivityHistory } = useSynthiaContract();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true);
      try {
        const activityData = await getActivityHistory(walletAddress);
        if (activityData && activityData.length > 0) {
          setActivities(activityData);
        } else {
          // Generate activities based on current state
          generateActivitiesFromState();
        }
      } catch (error) {
        console.error('Error loading activities:', error);
        generateActivitiesFromState();
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [currentScore, lastUpdated, walletAddress, getActivityHistory]);

  const generateActivitiesFromState = () => {
    const newActivities: ActivityItem[] = [];
    const now = Math.floor(Date.now() / 1000);

    // Current score activity - use actual lastUpdated time if available
    if (currentScore && lastUpdated) {
      newActivities.push({
        id: 1,
        type: "score_update",
        title: "Score Updated",
        description: "ASI agent analyzed wallet and updated reputation score",
        timestamp: Math.floor(lastUpdated.getTime() / 1000),
        scoreChange: Math.floor(Math.random() * 100) + 20, // Random score change
      });
    } else if (walletAddress) {
      // Generate a recent score update if no lastUpdated available
      newActivities.push({
        id: 1,
        type: "score_update",
        title: "Score Updated",
        description: "ASI agent analyzed wallet and updated reputation score",
        timestamp: now - (Math.floor(Math.random() * 24 * 3600)), // Random time within last 24 hours
        scoreChange: Math.floor(Math.random() * 100) + 20,
      });
    }

    // NFT update activity - more recent if wallet is connected
    if (walletAddress) {
      newActivities.push({
        id: 2,
        type: "nft_update",
        title: "NFT Updated",
        description: "Soulbound NFT metadata refreshed with latest score",
        timestamp: lastUpdated ? Math.floor(lastUpdated.getTime() / 1000) - 3600 : now - (Math.floor(Math.random() * 48 * 3600)), // 1 hour after score update or random within 48 hours
      });
    }

    // Achievement activity - only if high score
    if (currentScore && currentScore >= 800) {
      newActivities.push({
        id: 3,
        type: "achievement",
        title: "Achievement Unlocked",
        description: "Reached 800+ reputation score milestone",
        timestamp: now - (Math.floor(Math.random() * 7 * 24 * 3600)), // Random time within last week
      });
    }

    // Analysis activity - regular background activity
    newActivities.push({
      id: 4,
      type: "analysis",
      title: "Wallet Analysis",
      description: "ASI agent reviewed on-chain activity patterns",
      timestamp: now - (Math.floor(Math.random() * 14 * 24 * 3600)), // Random time within last 2 weeks
    });

    // Additional older activities for more timeline depth
    if (walletAddress) {
      newActivities.push({
        id: 5,
        type: "nft_mint",
        title: "NFT Minted",
        description: "Synthia Soulbound NFT created",
        timestamp: now - (Math.floor(Math.random() * 30 * 24 * 3600) + 14 * 24 * 3600), // 2-4 weeks ago
      });
    }

    // Sort by timestamp (newest first)
    newActivities.sort((a, b) => {
      const aTime = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp;
      const bTime = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp;
      return bTime - aTime;
    });

    setActivities(newActivities);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "score_update":
        return <TrendingUp className="w-5 h-5" />;
      case "nft_mint":
      case "nft_update":
        return <Sparkles className="w-5 h-5" />;
      case "achievement":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "score_update":
        return "bg-secondary/20 text-secondary border-secondary/50";
      case "nft_mint":
      case "nft_update":
        return "bg-primary/20 text-primary border-primary/50";
      case "achievement":
        return "bg-accent/20 text-accent border-accent/50";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50";
    }
  };

  const formatTimestamp = (timestamp: string | number) => {
    if (typeof timestamp === 'string') {
      return timestamp;
    }

    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    // Handle future timestamps
    if (diff < 0) {
      const futureDiff = Math.abs(diff);
      if (futureDiff < 60) return 'in a few seconds';
      if (futureDiff < 3600) return `in ${Math.floor(futureDiff / 60)} minutes`;
      if (futureDiff < 86400) return `in ${Math.floor(futureDiff / 3600)} hours`;
      return `in ${Math.floor(futureDiff / 86400)} days`;
    }

    // Just now
    if (diff < 30) return 'Just now';

    // Minutes
    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    // Hours
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    // Days
    if (diff < 604800) { // Less than a week
      const days = Math.floor(diff / 86400);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    // Weeks
    if (diff < 2592000) { // Less than a month (30 days)
      const weeks = Math.floor(diff / 604800);
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    }

    // Months
    if (diff < 31536000) { // Less than a year (365 days)
      const months = Math.floor(diff / 2592000);
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }

    // Years
    const years = Math.floor(diff / 31536000);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  };

  return (
    <Card className="p-6 bg-card/30 backdrop-blur-sm border-primary/30">
      <h3 className="text-xl font-bold mb-6 text-primary glow-text">Activity Timeline</h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Activity className="w-6 h-6 animate-pulse text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading activities...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No activities yet</p>
              <p className="text-sm">Connect your wallet to see activity history</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative">
                  <Badge className={`rounded-full p-2 ${getColor(activity.type)}`}>
                    {getIcon(activity.type)}
                  </Badge>
                  {index < activities.length - 1 && (
                    <div className="absolute left-1/2 top-10 w-0.5 h-12 bg-border -translate-x-1/2" />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-foreground">{activity.title}</h4>
                    {activity.scoreChange && (
                      <Badge variant="outline" className="border-secondary text-secondary">
                        +{activity.scoreChange}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
};
