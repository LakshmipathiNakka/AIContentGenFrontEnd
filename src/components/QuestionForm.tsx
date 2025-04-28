
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { FileCode, Code2, GraduationCap } from 'lucide-react';

const QuestionForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Questions Generated",
        description: `${numberOfQuestions} ${subject} questions on ${topic} have been generated.`,
      });
      
      // Reset form
      setSubject('');
      setTopic('');
      setNumberOfQuestions(5);
      setDifficulty('medium');
    }, 2000);
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
              Subject
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Code2 className="h-5 w-5 text-slate-400" />
              </div>
              <select
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="pl-10 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mcq-primary focus:border-mcq-primary sm:text-sm"
                required
              >
                <option value="" disabled>Select subject</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
              Topic
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                id="topic"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Promises, Async/Await"
                className="pl-10 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mcq-primary focus:border-mcq-primary sm:text-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-slate-700">
              Number of Questions
            </label>
            <input
              type="number"
              id="number"
              name="number"
              min="1"
              max="20"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mcq-primary focus:border-mcq-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mcq-primary focus:border-mcq-primary sm:text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
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
