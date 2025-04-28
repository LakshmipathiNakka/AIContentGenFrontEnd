
import { useState } from 'react';
import QuestionForm from '@/components/QuestionForm';
import GenerationProgress from '@/components/GenerationProgress';
import QuestionCard from '@/components/QuestionCard';
import { FileText, Download, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

// Mock AI-generated questions (in real app would come from API)
const mockGeneratedQuestions = [
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

const GenerateMCQs = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionType, setQuestionType] = useState('General MCQs');
  
  const handleStartGeneration = () => {
    setIsGenerating(true);
    setQuestions([]);
    
    // Simulate generation process
    setTimeout(() => {
      setGenerationComplete(true);
      setQuestions(mockGeneratedQuestions);
      
      toast({
        title: "Questions Generated Successfully",
        description: `${mockGeneratedQuestions.length} questions have been created.`,
      });
    }, 5000); // 5 seconds to complete all steps
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

  const handleDownloadSheet = () => {
    // Create Google Sheet structure with required headers
    const headers = [
      "question_id", "question_type", "short_text", "question_text", 
      "question_key", "content_type", "multimedia_count", "multimedia_format", 
      "multimedia_url", "thumbnail_url", "tag_names", "c_options", 
      "w_options", "options_content_type", "code_data", "code_language", 
      "explanation", "explanation_content_type", "toughness"
    ];
    
    // Transform questions data
    const rows = questions.map((q, index) => {
      const correctOption = q.options.find(opt => opt.isCorrect);
      const wrongOptions = q.options.filter(opt => !opt.isCorrect).map(opt => `OPTION : ${opt.text}`).join('\n');
      
      return [
        uuidv4(), // question_id
        "CODE_ANALYSIS_MULTIPLE_CHOICE", // question_type
        "", // short_text
        q.questionText, // question_text
        index, // question_key
        "HTML", // content_type
        0, // multimedia_count
        "", // multimedia_format
        "", // multimedia_url
        "", // thumbnail_url
        `PYTHON_CODING_ANALYSIS\n${q.difficulty.toUpperCase()}`, // tag_names
        `OPTION : ${correctOption.text}`, // c_options
        wrongOptions, // w_options
        "TEXT", // options_content_type
        q.code_data, // code_data
        "python", // code_language
        q.explanation, // explanation
        "MARKDOWN", // explanation_content_type
        q.difficulty.toUpperCase() // toughness
      ];
    });
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    
    rows.forEach(row => {
      // Escape fields that may contain commas or quotes
      const escapedRow = row.map(field => {
        if (typeof field === 'string') {
          if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`;
          }
        }
        return field;
      });
      csvContent += escapedRow.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "questions_data.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Complete",
      description: "Your Google Sheet has been downloaded successfully",
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Generate Questions</h1>
        <p className="text-slate-500 mt-2">Create custom multiple choice questions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <QuestionForm 
            onGenerateStart={handleStartGeneration} 
            questionType={questionType}
            setQuestionType={setQuestionType}
          />
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Button 
                onClick={handleStartGeneration}
                disabled={isGenerating}
                className="w-full"
              >
                Generate Sample Questions
              </Button>
              
              {generationComplete && (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center" 
                  onClick={handleDownloadSheet}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download as Google Sheet
                </Button>
              )}
            </div>
            
            <div className="mt-6">
              {isGenerating && (
                <GenerationProgress 
                  totalSteps={6} 
                  onComplete={() => setGenerationComplete(true)}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {generationComplete ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-800">Generated Questions</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadSheet}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                {questions.map((question) => (
                  <div key={question.questionId} className="relative">
                    <QuestionCard
                      questionId={question.questionId}
                      questionText={question.questionText}
                      options={question.options}
                      explanation={question.explanation}
                      difficulty={question.difficulty}
                      language={question.language}
                    />
                    <div className="absolute top-4 right-4 flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditQuestion(question.questionId)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteQuestion(question.questionId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 border h-full flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-mcq-light rounded-full mb-4">
                <FileText className="h-10 w-10 text-mcq-primary" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">No Questions Generated Yet</h2>
              <p className="text-slate-500 max-w-md">
                Fill out the form and click "Generate Questions" to create your questions. They will appear here once generated.
              </p>
              
              <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-100 w-full max-w-lg">
                <h3 className="text-base font-medium text-slate-700 mb-3">Sample Question Preview</h3>
                <div className="bg-white p-4 rounded border border-slate-200">
                  <p className="text-sm text-slate-800">What is the output of the following Python code?</p>
                  <div className="mt-2 bg-slate-50 p-2 rounded font-mono text-xs">
                    print(abs(-42))
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-slate-300 mr-2"></div>
                      <span className="text-xs text-slate-700">A) -42</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-mcq-primary bg-mcq-light mr-2"></div>
                      <span className="text-xs font-medium text-mcq-primary">B) 42</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-slate-300 mr-2"></div>
                      <span className="text-xs text-slate-700">C) Error</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-slate-300 mr-2"></div>
                      <span className="text-xs text-slate-700">D) None</span>
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

export default GenerateMCQs;
