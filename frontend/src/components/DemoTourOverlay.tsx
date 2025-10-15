import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, X, Trophy } from 'lucide-react';
import { DemoStep } from '@/lib/demoConstants';

interface DemoTourOverlayProps {
  isVisible: boolean;
  currentStep: number;
  currentStepData: DemoStep;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onGoToStep: (step: number) => void;
  totalSteps: number;
}

export const DemoTourOverlay = ({
  isVisible,
  currentStep,
  currentStepData,
  onNext,
  onPrev,
  onClose,
  onGoToStep,
  totalSteps
}: DemoTourOverlayProps) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none" />

      {/* Tour Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <Card className="w-96 p-6 bg-card/95 backdrop-blur-sm border-primary/50 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {currentStep + 1}
              </div>
              <div>
                <h3 className="font-bold text-lg">{currentStepData.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Step Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onGoToStep(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={onPrev}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              <Button onClick={onNext} size="sm">
                {currentStep === totalSteps - 1 ? (
                  <>
                    <Trophy className="w-4 h-4 mr-1" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Highlight Target Element - using CSS-in-JS approach */}
      <style>{`
        .tour-target {
          position: relative;
        }
        .tour-target::after {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          z-index: 49;
          pointer-events: none;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </>
  );
};
