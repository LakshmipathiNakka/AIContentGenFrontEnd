import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Check, X, Copy, Download, Edit } from 'lucide-react';

interface QuestionCardProps {
  questionId: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
  difficulty: string;
  language: string;
}

const QuestionCard = ({ 
  questionId, 
  questionText, 
  options, 
  explanation, 
  difficulty,
  language
}: QuestionCardProps) => {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    if (options[index].isCorrect) {
      toast({
        title: "Correct!",
        description: "You selected the right answer.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try again or view the explanation.",
        variant: "destructive",
      });
    }
  };
  
  const handleCopy = () => {
    const questionContent = `
Question: ${questionText}

Options:
${options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option.text}`).join('\n')}

Correct Answer: ${String.fromCharCode(65 + options.findIndex(opt => opt.isCorrect))}

Explanation: ${explanation}
    `;
    
    navigator.clipboard.writeText(questionContent);
    toast({
      title: "Copied to clipboard",
      description: "Question details copied successfully",
    });
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 neon-card transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 
            difficulty === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' : 
            'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
            {language}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-mcq-primary dark:hover:text-primary transition-colors"
            title="Copy question"
          >
            <Copy size={18} />
          </button>
          <button 
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-mcq-primary dark:hover:text-primary transition-colors"
            title="Download question"
          >
            <Download size={18} />
          </button>
          <button 
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-mcq-primary dark:hover:text-primary transition-colors"
            title="Edit question"
          >
            <Edit size={18} />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-base font-medium text-slate-800 dark:text-white">{questionText}</h3>
      </div>
      
      <div className="space-y-2 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={`w-full text-left p-3 rounded-md border transition-all duration-200 ${
              selectedOption === index 
                ? (option.isCorrect 
                  ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                  : 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400')
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center">
              <div className={`h-6 w-6 flex items-center justify-center rounded-full border mr-3 transition-all duration-200 ${
                selectedOption === index 
                  ? (option.isCorrect 
                    ? 'border-green-500 dark:border-green-400 bg-green-500 dark:bg-green-400 text-white' 
                    : 'border-red-500 dark:border-red-400 bg-red-500 dark:bg-red-400 text-white')
                  : 'border-slate-300 dark:border-slate-600'
              }`}>
                {selectedOption === index && (option.isCorrect ? <Check size={14} /> : <X size={14} />)}
                {selectedOption !== index && <span className="text-slate-600 dark:text-slate-400">{String.fromCharCode(65 + index)}</span>}
              </div>
              <span className="text-slate-700 dark:text-slate-300">{option.text}</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-sm text-mcq-primary dark:text-primary hover:text-mcq-secondary dark:hover:text-primary-light transition-colors"
        >
          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
        </button>
        
        {showExplanation && (
          <div className="mt-2 p-3 rounded-md bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-300">
            {explanation}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Question ID: {questionId}
      </div>
    </div>
  );
};

export default QuestionCard;
