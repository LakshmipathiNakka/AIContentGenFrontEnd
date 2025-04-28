
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
    <div className="generation-progress">
      <h3 className="progress-title">Generation Progress</h3>
      <div className="progress-steps">
        {steps.map(step => (
          <div key={step} className={`progress-step ${currentStep > step ? 'completed' : ''} ${currentStep === step ? 'current' : ''}`}>
            {step < currentStep ? (
              <CheckCircle className="step-icon completed" />
            ) : (
              <div className="step-circle"></div>
            )}
            <span className="step-label">Step {step}</span>
            {step < totalSteps && <ArrowRight className="step-arrow" />}
          </div>
        ))}
      </div>
      
      {isComplete && (
        <div className="progress-complete">
          <span className="complete-message">Generation Complete!</span>
          <button className="download-button">
            <Download className="button-icon" />
            Download Questions
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerationProgress;
