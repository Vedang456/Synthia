import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, X, Trophy } from 'lucide-react';
import { DEMO_STEPS, DemoStep } from '@/lib/demoConstants';

export const useDemoTour = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
    setIsVisible(true);
  };

  const nextStep = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);

      // Execute step action if exists
      const step = DEMO_STEPS[nextStepIndex];
      if (step.action) {
        step.action();
      }
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setIsActive(false);
    setIsVisible(false);
    setCurrentStep(0);
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);

    const step = DEMO_STEPS[stepIndex];
    if (step.action) {
      step.action();
    }
  };

  return {
    isActive,
    currentStep,
    isVisible,
    currentStepData: DEMO_STEPS[currentStep],
    startTour,
    nextStep,
    prevStep,
    endTour,
    goToStep,
    totalSteps: DEMO_STEPS.length
  };
};
