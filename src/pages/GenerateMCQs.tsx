
import { useState } from 'react';
import QuestionForm from '@/components/QuestionForm';
import GenerationProgress from '@/components/GenerationProgress';
import QuestionCard from '@/components/QuestionCard';

const GenerateMCQs = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  
  const handleStartGeneration = () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      setGenerationComplete(true);
    }, 10000); // 10 seconds to complete all steps
  };
  
  // Sample generated questions for preview
  const generatedQuestions = [
    {
      questionId: "q123456",
      questionText: "What is the output of the following JavaScript code?\n\n```javascript\nlet x = 5;\nlet y = '5';\nconsole.log(x + y);\n```",
      options: [
        { text: "10", isCorrect: false },
        { text: "'55'", isCorrect: true },
        { text: "Error", isCorrect: false },
        { text: "undefined", isCorrect: false }
      ],
      explanation: "In JavaScript, when you add a number and a string using the + operator, the number is converted to a string and the strings are concatenated. So 5 + '5' becomes '5' + '5' which equals '55'.",
      difficulty: "medium",
      language: "JavaScript"
    },
    {
      questionId: "q123457",
      questionText: "Which of the following correctly describes JavaScript Promises?",
      options: [
        { text: "A built-in function to log messages to the console", isCorrect: false },
        { text: "An object representing the eventual completion or failure of an asynchronous operation", isCorrect: true },
        { text: "A method to convert JSON to string", isCorrect: false },
        { text: "A way to define variables with block scope", isCorrect: false }
      ],
      explanation: "A Promise is an object representing the eventual completion or failure of an asynchronous operation. Promises provide a cleaner way to handle asynchronous operations compared to callbacks.",
      difficulty: "hard",
      language: "JavaScript"
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Generate MCQs</h1>
        <p className="text-slate-500 mt-2">Create custom multiple choice questions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <QuestionForm />
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={handleStartGeneration}
                disabled={isGenerating}
                className="w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-mcq-primary hover:bg-mcq-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary disabled:opacity-70"
              >
                Generate Sample Questions
              </button>
              <button className="w-full py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary">
                Import Question Data
              </button>
              <button className="w-full py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary">
                Browse Templates
              </button>
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
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Generated Questions</h2>
              <div className="space-y-6">
                {generatedQuestions.map((question) => (
                  <QuestionCard
                    key={question.questionId}
                    questionId={question.questionId}
                    questionText={question.questionText}
                    options={question.options}
                    explanation={question.explanation}
                    difficulty={question.difficulty}
                    language={question.language}
                  />
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mcq-primary hover:bg-mcq-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary">
                  Load More Questions
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 border h-full flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-mcq-light rounded-full mb-4">
                <FileText className="h-10 w-10 text-mcq-primary" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">No Questions Generated Yet</h2>
              <p className="text-slate-500 max-w-md">
                Fill out the form and click "Generate MCQs" to create your questions. They will appear here once generated.
              </p>
              
              <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-100 w-full max-w-lg">
                <h3 className="text-base font-medium text-slate-700 mb-3">Sample Question Preview</h3>
                <div className="bg-white p-4 rounded border border-slate-200">
                  <p className="text-sm text-slate-800">What is the output of the following JavaScript code?</p>
                  <div className="mt-2 bg-slate-50 p-2 rounded font-mono text-xs">
                    console.log(typeof null);
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-slate-300 mr-2"></div>
                      <span className="text-xs text-slate-700">A) "null"</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-slate-300 mr-2"></div>
                      <span className="text-xs text-slate-700">B) "undefined"</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-mcq-primary bg-mcq-light mr-2"></div>
                      <span className="text-xs font-medium text-mcq-primary">C) "object"</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-slate-300 mr-2"></div>
                      <span className="text-xs text-slate-700">D) "string"</span>
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
