import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReputationGaugeProps {
  score: number;
  maxScore?: number;
}

const getRankAndGrade = (score: number, maxScore: number = 1000) => {
  const percentage = (score / maxScore) * 100;

  // Grade calculation based on percentage
  let grade: string;
  let gradeColor: string;

  if (percentage >= 95) {
    grade = "A+";
    gradeColor = "text-emerald-400";
  } else if (percentage >= 90) {
    grade = "A";
    gradeColor = "text-green-400";
  } else if (percentage >= 85) {
    grade = "A-";
    gradeColor = "text-green-300";
  } else if (percentage >= 80) {
    grade = "B+";
    gradeColor = "text-blue-400";
  } else if (percentage >= 75) {
    grade = "B";
    gradeColor = "text-blue-300";
  } else if (percentage >= 70) {
    grade = "B-";
    gradeColor = "text-cyan-400";
  } else if (percentage >= 65) {
    grade = "C+";
    gradeColor = "text-yellow-400";
  } else if (percentage >= 60) {
    grade = "C";
    gradeColor = "text-orange-400";
  } else if (percentage >= 55) {
    grade = "C-";
    gradeColor = "text-orange-300";
  } else if (percentage >= 50) {
    grade = "D+";
    gradeColor = "text-red-400";
  } else if (percentage >= 45) {
    grade = "D";
    gradeColor = "text-red-300";
  } else {
    grade = "F";
    gradeColor = "text-gray-400";
  }

  // Rank calculation (1-1000 based on score)
  const rank = Math.max(1, Math.min(1000, Math.floor((score / maxScore) * 1000)));

  // Percentile calculation (how many users you'd be ahead of)
  const percentile = Math.floor((score / maxScore) * 100);

  return { grade, gradeColor, rank, percentile };
};

export const ReputationGauge = ({ score, maxScore = 1000 }: ReputationGaugeProps) => {
  const percentage = (score / maxScore) * 100;
  const { grade, gradeColor, rank, percentile } = getRankAndGrade(score, maxScore);

  const getScoreColor = () => {
    if (percentage >= 80) return "text-secondary";
    if (percentage >= 60) return "text-accent";
    if (percentage >= 40) return "text-primary";
    return "text-muted-foreground";
  };

  const getScoreLabel = () => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    return "Building";
  };

  return (
    <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/30 glow-border">
      <div className="text-center space-y-6">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Reputation Score</div>
          <div className={`text-6xl font-bold glow-text ${getScoreColor()}`}>
            {score}
          </div>
          <div className="text-xl text-muted-foreground mt-2">/ {maxScore}</div>
        </div>

        <div className="space-y-2">
          <Progress value={percentage} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Score Level</span>
            <span className={getScoreColor()}>{getScoreLabel()}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div>
            <div className="text-2xl font-bold text-primary">{percentile}%</div>
            <div className="text-xs text-muted-foreground">Percentile</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${gradeColor}`}>{grade}</div>
            <div className="text-xs text-muted-foreground">Grade</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">#{rank}</div>
            <div className="text-xs text-muted-foreground">Rank</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
