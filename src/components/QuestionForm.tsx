
import { useState, useEffect } from 'react';
import { FileCode, Code2, GraduationCap } from 'lucide-react';
import DynamicInputs from './DynamicInputs';
import AnimatedTextarea from './AnimatedTextarea';

// Define question types
const QUESTION_TYPES = {
  GENERAL_MCQ: 'General MCQs',
  CODING_ANALYSIS: 'Coding Analysis MCQs',
  CODING_QUESTIONS: 'Coding Questions'
};

interface InputData {
  subject: string;
  no_of_questions: number;
  topic: string;
  difficulty_level_tag: string;
  topic_tag: string;
  sub_topic_tag: string;
}

interface QuestionFormProps {
  onGenerateStart?: (inputs: InputData[]) => void;
  questionType: string;
  setQuestionType: (type: string) => void;
}

const QuestionForm = ({ 
  onGenerateStart, 
  questionType, 
  setQuestionType 
}: QuestionFormProps) => {
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
  
  // Generate a prompt based on the inputs and selected question type
  const generatePrompt = () => {
    let typeSuffix = "";
    
    switch(questionType) {
      case QUESTION_TYPES.CODING_ANALYSIS:
        typeSuffix = "and code analysis questions";
        break;
      case QUESTION_TYPES.CODING_QUESTIONS:
        typeSuffix = "coding questions";
        break;
      default:
        typeSuffix = "multiple choice questions";
    }
    
    const prompt = inputs.map(input => 
      `You are a developer specializing in ${input.subject} with 20 years of experience. You need to prepare ${input.no_of_questions} ${input.difficulty_level_tag} ${typeSuffix} for the recruitment of freshers on the topic of ${input.topic} in the ${input.subject} language.`
    ).join('\n\n');
    
    setPromptText(prompt);
    return prompt;
  };
  
  useEffect(() => {
    // Update prompt when question type changes
    if (promptText) {
      generatePrompt();
    }
  }, [questionType]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Generate final prompt if not already done
    if (!promptText) {
      generatePrompt();
    }
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (onGenerateStart) {
        onGenerateStart(inputs);
      }
    }, 1000);
  };
  
  return (
    <div className="question-form-card">
      <div className="form-header">
        <div className="form-icon">
          <FileCode className="icon-medium" />
        </div>
        <h2 className="form-title">Generate New Questions</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">
            Question Type
          </h3>
          
          <div className="question-type-selector">
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="question-type-dropdown"
            >
              {Object.values(QUESTION_TYPES).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h3 className="section-title">
            Question Parameters
          </h3>
          
          <DynamicInputs 
            inputs={inputs}
            setInputs={setInputs}
          />
        </div>
        
        <div className="form-section">
          <div className="prompt-header">
            <h3 className="section-title">Complete Prompt</h3>
            <button
              type="button" 
              className="outline-button small" 
              onClick={generatePrompt}
            >
              Generate Prompt
            </button>
          </div>
          
          <AnimatedTextarea 
            text={promptText}
            onChange={setPromptText}
            className="prompt-textarea"
          />
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading}
            className="primary-button full-width"
          >
            {isLoading ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
