
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface GenerationProgressProps {
  totalSteps: number;
  initialStep?: number;
  onComplete?: () => void;
}

const GenerationProgress = ({ 
  totalSteps, 
  initialStep = 0,
  onComplete
}: GenerationProgressProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (currentStep >= totalSteps) {
      setIsComplete(true);
      onComplete?.();
      return;
    }
    
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 1500); // Advance every 1.5 seconds for demo purposes
    
    return () => clearTimeout(timer);
  }, [currentStep, totalSteps, onComplete]);
  
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep && !isComplete) return 'current';
    return 'upcoming';
  };
  
  const steps = [
    { id: 'read-data', name: 'Reading Input Data' },
    { id: 'generate-prompts', name: 'Generating Prompts' },
    { id: 'api-call', name: 'Calling Azure OpenAI API' },
    { id: 'process-responses', name: 'Processing Responses' },
    { id: 'create-mcqs', name: 'Creating MCQs' },
    { id: 'format-output', name: 'Formatting Output' }
  ].slice(0, totalSteps);
  
  return (
    <div className="pb-6">
      <div className="flex items-center mb-6">
        {isComplete ? (
          <>
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="ml-2 text-lg font-medium text-green-600">Generation Complete</h3>
          </>
        ) : (
          <>
            <RefreshCw className="h-6 w-6 text-mcq-primary animate-spin" />
            <h3 className="ml-2 text-lg font-medium text-slate-800">Generating MCQs...</h3>
          </>
        )}
      </div>
      
      <div className="space-y-6">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full ${
                status === 'completed' ? 'bg-green-100' : 
                status === 'current' ? 'bg-mcq-light' : 
                'bg-slate-100'
              }`}>
                {status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : status === 'current' ? (
                  <RefreshCw className="h-5 w-5 text-mcq-primary animate-spin" />
                ) : (
                  <Clock className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div className="ml-4 w-full">
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-medium ${
                    status === 'completed' ? 'text-green-600' : 
                    status === 'current' ? 'text-mcq-primary' : 
                    'text-slate-500'
                  }`}>
                    {step.name}
                  </p>
                  {status === 'completed' && (
                    <p className="text-xs text-green-600">Completed</p>
                  )}
                  {status === 'current' && (
                    <p className="text-xs text-mcq-primary">In progress</p>
                  )}
                </div>
                <div className="mt-1 w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      status === 'completed' ? 'bg-green-500 w-full' : 
                      status === 'current' ? 'bg-mcq-primary w-1/2 animate-pulse' : 
                      'w-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {isComplete && (
        <div className="mt-6 text-center">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mcq-primary hover:bg-mcq-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Results
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerationProgress;
