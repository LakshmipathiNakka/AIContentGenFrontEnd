
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { FileCode, Code2, GraduationCap } from 'lucide-react';
import DynamicInputs from './DynamicInputs';
import AnimatedTextarea from './AnimatedTextarea';
import { Button } from "@/components/ui/button";

interface InputData {
  subject: string;
  no_of_questions: number;
  topic: string;
  difficulty_level_tag: string;
  topic_tag: string;
  sub_topic_tag: string;
}

const QuestionForm = ({ onGenerateStart }: { onGenerateStart?: () => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState<InputData[]>([
    {
      subject: "Python",
      no_of_questions: 6,
      topic: "abs in Built-in Functions",
      difficulty_level_tag: "Easy",
      topic_tag: "PYTHON_CODING_ANALYSIS",
      sub_topic_tag: "ABS_IN_BUILT_IN_FUNCTIONS"
    }
  ]);
  
  const [promptText, setPromptText] = useState('');
  
  // Generate a prompt based on the inputs
  const generatePrompt = () => {
    const prompt = `Create ${inputs.reduce((sum, input) => sum + input.no_of_questions, 0)} multiple choice questions about ${inputs.map(input => 
      `${input.topic} in ${input.subject} (Difficulty: ${input.difficulty_level_tag}, ${input.no_of_questions} questions)`
    ).join(', ')}. Include code examples where appropriate.`;
    
    setPromptText(prompt);
    return prompt;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Generate final prompt if not already done
    if (!promptText) {
      generatePrompt();
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Questions Generation Started",
        description: `Generating questions based on your criteria. Please wait.`,
      });
      
      if (onGenerateStart) {
        onGenerateStart();
      }
    }, 1000);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <div className="mb-6 flex items-center">
        <div className="p-3 rounded-lg bg-mcq-light">
          <FileCode className="h-8 w-8 text-mcq-primary" />
        </div>
        <h2 className="ml-4 text-xl font-semibold text-slate-800">Generate New MCQs</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-md font-medium text-slate-700 mb-4">
            Question Parameters
          </h3>
          
          <DynamicInputs 
            inputs={inputs}
            setInputs={setInputs}
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-slate-700">Complete Prompt</h3>
            <Button
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={generatePrompt}
            >
              Generate Prompt
            </Button>
          </div>
          
          <AnimatedTextarea 
            text={promptText}
            onChange={setPromptText}
            className="font-mono text-sm"
          />
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mcq-primary hover:bg-mcq-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary disabled:opacity-70"
          >
            {isLoading ? 'Generating...' : 'Generate MCQs'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
