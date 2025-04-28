
import { useState } from 'react';
import { Search, Tag, Filter, Download, FilePlus } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';

const QuestionBank = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  const languages = ['JavaScript', 'Python', 'Java', 'C#', 'C++'];
  const difficulties = ['easy', 'medium', 'hard'];
  
  // Sample questions for the question bank
  const questions = [
    {
      id: "q123456",
      text: "What is the output of the following JavaScript code?\n\n```javascript\nlet x = 5;\nlet y = '5';\nconsole.log(x + y);\n```",
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
      id: "q123457",
      text: "Which of the following correctly describes JavaScript Promises?",
      options: [
        { text: "A built-in function to log messages to the console", isCorrect: false },
        { text: "An object representing the eventual completion or failure of an asynchronous operation", isCorrect: true },
        { text: "A method to convert JSON to string", isCorrect: false },
        { text: "A way to define variables with block scope", isCorrect: false }
      ],
      explanation: "A Promise is an object representing the eventual completion or failure of an asynchronous operation. Promises provide a cleaner way to handle asynchronous operations compared to callbacks.",
      difficulty: "hard",
      language: "JavaScript"
    },
    {
      id: "q123458",
      text: "What does the following Python code print?\n\n```python\nnumbers = [1, 2, 3, 4, 5]\nprint(numbers[1:4])\n```",
      options: [
        { text: "[1, 2, 3, 4]", isCorrect: false },
        { text: "[2, 3, 4]", isCorrect: true },
        { text: "[1, 2, 3]", isCorrect: false },
        { text: "[2, 3, 4, 5]", isCorrect: false }
      ],
      explanation: "In Python, list slicing is done with [start:end] notation where start is inclusive but end is exclusive. So numbers[1:4] gives elements at indices 1, 2, and 3, which are 2, 3, and 4.",
      difficulty: "easy",
      language: "Python"
    },
    {
      id: "q123459",
      text: "In Java, what is the purpose of the 'final' keyword when applied to a variable?",
      options: [
        { text: "It makes the variable's value changeable only once", isCorrect: false },
        { text: "It restricts the variable from being accessed outside its class", isCorrect: false },
        { text: "It makes the variable's value unchangeable after initialization", isCorrect: true },
        { text: "It allows the variable to be used in multiple threads", isCorrect: false }
      ],
      explanation: "In Java, the 'final' keyword when applied to a variable makes it a constant, meaning its value cannot be changed after initialization.",
      difficulty: "medium",
      language: "Java"
    }
  ];
  
  // Filter questions based on search and filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = searchQuery === '' || 
      question.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      question.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = selectedLanguage === null || 
      question.language === selectedLanguage;
    
    const matchesDifficulty = selectedDifficulty === null || 
      question.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesLanguage && matchesDifficulty;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Question Bank</h1>
          <p className="text-slate-500 mt-2">View and manage your collection of questions</p>
        </div>
        <div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mcq-primary hover:bg-mcq-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary">
            <FilePlus className="mr-2 h-4 w-4" />
            Create Question
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="pl-10 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mcq-primary focus:border-mcq-primary sm:text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-slate-400" />
            <div className="flex flex-wrap gap-2">
              {languages.map(language => (
                <button
                  key={language}
                  onClick={() => setSelectedLanguage(selectedLanguage === language ? null : language)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedLanguage === language 
                      ? 'bg-mcq-primary text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <div className="flex flex-wrap gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedDifficulty === difficulty
                      ? difficulty === 'easy' ? 'bg-green-500 text-white' :
                        difficulty === 'medium' ? 'bg-amber-500 text-white' :
                        'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center border-t pt-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-700">{filteredQuestions.length}</span> of <span className="font-medium text-slate-700">{questions.length}</span> questions
          </p>
          
          <button className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mcq-primary">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      
      <div>
        {filteredQuestions.length > 0 ? (
          <div className="space-y-6">
            {filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                questionId={question.id}
                questionText={question.text}
                options={question.options}
                explanation={question.explanation}
                difficulty={question.difficulty}
                language={question.language}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <Search className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-lg font-medium text-slate-900">No questions found</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
