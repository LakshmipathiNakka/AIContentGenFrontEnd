
import { useState, useEffect } from 'react';
import QuestionForm from '@/components/QuestionForm';
import GenerationProgress from '@/components/GenerationProgress';
import QuestionCard from '@/components/QuestionCard';
import { FileText, Download, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Define question types
const QUESTION_TYPES = {
  GENERAL_MCQ: 'General MCQs',
  CODING_ANALYSIS: 'Coding Analysis MCQs',
  CODING_QUESTIONS: 'Coding Questions'
};

const GenerateQuestions = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionType, setQuestionType] = useState(QUESTION_TYPES.GENERAL_MCQ);
  
  const handleStartGeneration = async (inputs: any[]) => {
    setIsGenerating(true);
    setQuestions([]);
    
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate a network request
      setTimeout(async () => {
        try {
          // Format the inputs based on your backend requirements
          const formattedInputs = inputs.map(input => ({
            subject: input.subject,
            no_of_questions: input.no_of_questions,
            topic: input.topic,
            difficulty_level_tag: input.difficulty_level_tag,
            topic_tag: input.topic_tag,
            sub_topic_tag: input.sub_topic_tag
          }));
          
          // Simulate API call to generate questions
          // This would be replaced with a real API call
          const response = await simulateApiCall(formattedInputs, questionType);
          
          setGenerationComplete(true);
          setQuestions(response);
          
          toast({
            title: "Questions Generated Successfully",
            description: `${response.length} questions have been created.`,
          });
        } catch (error) {
          toast({
            title: "Error Generating Questions",
            description: "Failed to generate questions. Please try again.",
          });
        } finally {
          setIsGenerating(false);
        }
      }, 5000); // 5 seconds to simulate processing
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
      });
    }
  };

  const handleEditQuestion = (id: string) => {
    toast({
      title: "Edit Question",
      description: `Editing question ${id}`,
    });
    // In a real app, you would open a modal or navigate to an edit page
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.questionId !== id));
    toast({
      title: "Question Deleted",
      description: `Question ${id} has been removed`,
    });
  };

  const handleDownloadSheet = async () => {
    toast({
      title: "Downloading Google Sheet",
      description: "Your questions are being exported to Google Sheet format",
    });
    
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate a network request
      
      // Simulate download - in a real app, this would trigger an actual download
      setTimeout(() => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(questions, null, 2)], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = "generated_questions.json";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        toast({
          title: "Download Complete",
          description: "Questions have been downloaded as JSON",
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download questions. Please try again.",
      });
    }
  };

  // Simulate API call (in real app, this would be replaced with a fetch call)
  const simulateApiCall = async (inputs: any[], type: string) => {
    // This function would be replaced with a real API call to your backend
    // For demonstration, we'll return mock data based on the question type
    return [
      {
        questionId: "q123456",
        questionText: "What will be the output of the following Python code?\n\n```python\nprint(abs(-5))\n```",
        options: [
          { text: "-5", isCorrect: false },
          { text: "5", isCorrect: true },
          { text: "Error", isCorrect: false },
          { text: "None", isCorrect: false }
        ],
        explanation: "The abs() function in Python returns the absolute value of a number. The absolute value of -5 is 5.",
        difficulty: "easy",
        language: "Python",
        code_data: "print(abs(-5))"
      },
      {
        questionId: "q123457",
        questionText: "What is the result of the following Python expression?\n\n```python\nabs(-3.14)\n```",
        options: [
          { text: "-3.14", isCorrect: false },
          { text: "3", isCorrect: false },
          { text: "3.14", isCorrect: true },
          { text: "3.0", isCorrect: false }
        ],
        explanation: "The abs() function works with both integers and floating-point numbers. When given -3.14, it returns the absolute value 3.14.",
        difficulty: "easy",
        language: "Python",
        code_data: "abs(-3.14)"
      },
      {
        questionId: "q123458",
        questionText: "Consider this Python code. What will it display?\n\n```python\ncomplex_num = 3 + 4j\nprint(abs(complex_num))\n```",
        options: [
          { text: "3 + 4j", isCorrect: false },
          { text: "7", isCorrect: false },
          { text: "5", isCorrect: true },
          { text: "Error", isCorrect: false }
        ],
        explanation: "For a complex number, the abs() function returns the magnitude (or modulus) which is calculated as sqrt(real² + imag²). For 3+4j, it's sqrt(3² + 4²) = sqrt(9 + 16) = sqrt(25) = 5.",
        difficulty: "medium",
        language: "Python",
        code_data: "complex_num = 3 + 4j\nprint(abs(complex_num))"
      }
    ];
  };
  
  return (
    <div className="generate-questions-page">
      <div className="page-header">
        <h1 className="page-title">Generate Questions</h1>
        <p className="page-subtitle">Create custom questions for assessments</p>
      </div>
      
      <div className="page-content">
        <div className="sidebar">
          <QuestionForm 
            onGenerateStart={handleStartGeneration} 
            questionType={questionType}
            setQuestionType={setQuestionType}
          />
          
          <div className="quick-actions-card">
            <h2 className="card-title">Quick Actions</h2>
            
            <div className="action-buttons">
              <button 
                onClick={() => handleStartGeneration([{
                  subject: "Python",
                  no_of_questions: 5,
                  topic: "abs in Built-in Functions",
                  difficulty_level_tag: "Easy",
                  topic_tag: "PYTHON_CODING_ANALYSIS",
                  sub_topic_tag: "ABS_IN_BUILT_IN_FUNCTIONS"
                }])}
                disabled={isGenerating}
                className="primary-button full-width"
              >
                Generate Sample Questions
              </button>
              
              {generationComplete && (
                <button 
                  className="outline-button full-width" 
                  onClick={handleDownloadSheet}
                >
                  <Download className="button-icon" />
                  Download as Google Sheet
                </button>
              )}
            </div>
            
            <div className="progress-section">
              {isGenerating && (
                <GenerationProgress 
                  totalSteps={6} 
                  onComplete={() => setGenerationComplete(true)}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="main-content">
          {generationComplete ? (
            <div className="questions-section">
              <div className="questions-header">
                <h2 className="section-title">Generated Questions</h2>
                <div className="header-actions">
                  <button className="outline-button" onClick={handleDownloadSheet}>
                    <Download className="button-icon" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="questions-list">
                {questions.map((question) => (
                  <div key={question.questionId} className="question-container">
                    <QuestionCard
                      questionId={question.questionId}
                      questionText={question.questionText}
                      options={question.options}
                      explanation={question.explanation}
                      difficulty={question.difficulty}
                      language={question.language}
                    />
                    <div className="question-actions">
                      <button 
                        className="icon-button"
                        onClick={() => handleEditQuestion(question.questionId)}
                      >
                        <Edit className="icon-small" />
                      </button>
                      <button 
                        className="icon-button"
                        onClick={() => handleDeleteQuestion(question.questionId)}
                      >
                        <Trash2 className="icon-small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText className="icon-large" />
              </div>
              <h2 className="empty-state-title">No Questions Generated Yet</h2>
              <p className="empty-state-description">
                Fill out the form and click "Generate Questions" to create your questions. They will appear here once generated.
              </p>
              
              <div className="sample-preview">
                <h3 className="preview-title">Sample Question Preview</h3>
                <div className="question-preview">
                  <p className="preview-text">What is the output of the following Python code?</p>
                  <div className="code-block">
                    print(abs(-42))
                  </div>
                  <div className="options-preview">
                    <div className="option">
                      <div className="option-marker"></div>
                      <span className="option-text">A) -42</span>
                    </div>
                    <div className="option selected">
                      <div className="option-marker selected"></div>
                      <span className="option-text selected">B) 42</span>
                    </div>
                    <div className="option">
                      <div className="option-marker"></div>
                      <span className="option-text">C) Error</span>
                    </div>
                    <div className="option">
                      <div className="option-marker"></div>
                      <span className="option-text">D) None</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateQuestions;
