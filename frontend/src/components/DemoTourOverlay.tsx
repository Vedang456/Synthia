import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, X, Trophy, ChevronDown } from 'lucide-react';
import { DemoStep } from '@/lib/demoConstants';
import { useEffect, useState } from 'react';

interface DemoTourOverlayProps {
  isVisible: boolean;
  currentStep: number;
  currentStepData: DemoStep;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onGoToStep: (step: number) => void;
  totalSteps: number;
  currentTab?: string;
  onTabChange?: (tab: 'overview' | 'chat' | 'agents' | 'analysis') => void;
}

export const DemoTourOverlay = ({
  isVisible,
  currentStep,
  currentStepData,
  onNext,
  onPrev,
  onClose,
  onGoToStep,
  totalSteps,
  currentTab,
  onTabChange
}: DemoTourOverlayProps) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, arrow: 'top' as 'top' | 'bottom' | 'left' | 'right' });

  useEffect(() => {
    if (isVisible && currentStepData.target) {
      // Switch to required tab if needed
      if (currentStepData.requiredTab && currentStepData.requiredTab !== currentTab && onTabChange) {
        onTabChange(currentStepData.requiredTab);
      }

      const targetElement = document.querySelector(currentStepData.target) as HTMLElement;
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const tooltipWidth = 320;
        const tooltipHeight = 200;

        // Calculate position based on target element location
        let top = 0;
        let left = 0;
        let arrow: 'top' | 'bottom' | 'left' | 'right' = 'top';

        // Position tooltip above target if possible
        if (rect.top - tooltipHeight - 20 > 0) {
          top = rect.top - tooltipHeight - 20;
          left = Math.max(20, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, viewportWidth - tooltipWidth - 20));
          arrow = 'bottom';
        }
        // Position tooltip below target if above isn't possible
        else if (rect.bottom + tooltipHeight + 20 < viewportHeight) {
          top = rect.bottom + 20;
          left = Math.max(20, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, viewportWidth - tooltipWidth - 20));
          arrow = 'top';
        }
        // Position tooltip to the right of target
        else if (rect.right + tooltipWidth + 20 < viewportWidth) {
          top = Math.max(20, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, viewportHeight - tooltipHeight - 20));
          left = rect.right + 20;
          arrow = 'left';
        }
        // Position tooltip to the left of target (fallback)
        else {
          top = Math.max(20, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, viewportHeight - tooltipHeight - 20));
          left = Math.max(20, rect.left - tooltipWidth - 20);
          arrow = 'right';
        }

        setTooltipPosition({ top, left, arrow });

        // Auto-scroll to make the target element visible
        const scrollMargin = 100; // Extra space around the element
        const targetTop = rect.top + window.scrollY - scrollMargin;
        const targetLeft = rect.left + window.scrollX - scrollMargin;

        // Calculate if we need to scroll
        const needsVerticalScroll = targetTop < window.scrollY ||
          (targetTop + rect.height + scrollMargin) > (window.scrollY + viewportHeight);

        const needsHorizontalScroll = targetLeft < window.scrollX ||
          (targetLeft + rect.width + scrollMargin) > (window.scrollX + viewportWidth);

        if (needsVerticalScroll || needsHorizontalScroll) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }
    }
  }, [isVisible, currentStep, currentStepData, currentTab, onTabChange]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop with hole for highlighted element */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0 bg-black/30" />
        {currentStepData.target && (
          <style>{`
            .tour-backdrop-hole {
              position: absolute;
              border-radius: 8px;
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3);
              z-index: 41;
            }
          `}</style>
        )}
      </div>

      {/* Interactive Tour Card */}
      <div
        className="fixed z-50 transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <Card className="w-80 p-4 bg-card/95 backdrop-blur-sm border-primary/50 shadow-2xl relative">
          {/* Arrow pointer */}
          <div
            className={`absolute w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent ${
              tooltipPosition.arrow === 'top' ? 'border-t-primary/50 top-[-10px] left-1/2 transform -translate-x-1/2' :
              tooltipPosition.arrow === 'bottom' ? 'border-b-primary/50 bottom-[-10px] left-1/2 transform -translate-x-1/2 border-t-transparent border-b-[10px]' :
              tooltipPosition.arrow === 'left' ? 'border-l-primary/50 left-[-10px] top-1/2 transform -translate-y-1/2 border-r-transparent border-l-[10px]' :
              'border-r-primary/50 right-[-10px] top-1/2 transform -translate-y-1/2 border-l-transparent border-r-[10px]'
            }`}
          />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                {currentStep + 1}
              </div>
              <div>
                <h3 className="font-bold text-base">{currentStepData.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="w-3 h-3" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Progress indicators */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onGoToStep(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i === currentStep ? 'bg-primary w-6' : i < currentStep ? 'bg-primary/50' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1}/{totalSteps}
            </Badge>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={onPrev} className="flex-1">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Back
              </Button>
            )}
            <Button onClick={onNext} size="sm" className="flex-1">
              {currentStep === totalSteps - 1 ? (
                <>
                  <Trophy className="w-3 h-3 mr-1" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-3 h-3 ml-1" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Highlight animation for target element */}
      {currentStepData.target && (
        <style>{`
          [data-tour="${currentStepData.target}"] {
            position: relative;
            z-index: 42;
          }
          [data-tour="${currentStepData.target}"]::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            background: rgba(59, 130, 246, 0.2);
            border-radius: 8px;
            z-index: -1;
            animation: tourPulse 2s ease-in-out infinite;
            pointer-events: none;
          }
          @keyframes tourPulse {
            0%, 100% {
              opacity: 0.2;
              transform: scale(1);
            }
            50% {
              opacity: 0.4;
              transform: scale(1.02);
            }
          }
        `}</style>
      )}
    </>
  );
};
