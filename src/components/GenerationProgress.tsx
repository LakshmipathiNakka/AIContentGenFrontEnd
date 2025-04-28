import { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';

interface GenerationProgressProps {
  totalSteps: number;
  onComplete: () => void;
}

const GenerationProgress = ({ totalSteps, onComplete }: GenerationProgressProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (currentStep <= totalSteps && !isComplete) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 800); // Simulate each step taking 0.8 seconds
      
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      setTimeout(onComplete, 1000); // Delay before marking as complete
    }
  }, [currentStep, totalSteps, isComplete, onComplete]);
  
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-slate-700 mb-2">Generation Progress</h3>
      <div className="flex items-center justify-between text-xs text-slate-500">
        {steps.map(step => (
          <div key={step} className="flex items-center">
            {step < currentStep ? (
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border border-slate-300 mr-1"></div>
            )}
            <span>Step {step}</span>
            {step < totalSteps && <ArrowRight className="h-4 w-4 mx-1 text-slate-400" />}
          </div>
        ))}
      </div>
      
      {isComplete && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-green-600">Generation Complete!</span>
          <button className="inline-flex items-center text-mcq-primary hover:text-mcq-secondary">
            <Download className="h-4 w-4 mr-1" />
            Download Questions
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerationProgress;
