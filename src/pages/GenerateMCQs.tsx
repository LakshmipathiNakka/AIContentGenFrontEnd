import { useState, useEffect } from 'react';
import { 
  FileText, Download, Edit, Trash2, ChevronDown, Copy, Check, X, AlertCircle,
  BookOpen, Code2, Brain, Settings, Plus, Minus, Save, Loader2, Sparkles, AlertTriangle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Python-specific mock questions
const mockQuestions = [
  {
    type: "Python",
    question: "What is the output of the following code?",
    code: `def process_data(data):
    result = []
    for item in data:
        if isinstance(item, list):
            result.extend(item)
        else:
            result.append(item)
    return result

data = [1, [2, 3], 4, [5, 6]]
print(process_data(data))`,
    options: [
      { id: "A", text: "[1, 2, 3, 4, 5, 6]", isCorrect: true },
      { id: "B", text: "[1, [2, 3], 4, [5, 6]]", isCorrect: false },
      { id: "C", text: "TypeError", isCorrect: false },
      { id: "D", text: "[1, 2, 3, 4]", isCorrect: false }
    ],
    explanation: "The function flattens nested lists by extending the result list with items from nested lists and appending non-list items."
  },
  {
    type: "Python",
    question: "What will be the output of this dictionary comprehension?",
    code: `numbers = [1, 2, 3, 4, 5]
squares = {x: x**2 for x in numbers if x % 2 == 0}
print(squares)`,
    options: [
      { id: "A", text: "{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}", isCorrect: false },
      { id: "B", text: "{2: 4, 4: 16}", isCorrect: true },
      { id: "C", text: "[4, 16]", isCorrect: false },
      { id: "D", text: "SyntaxError", isCorrect: false }
    ],
    explanation: "The dictionary comprehension creates key-value pairs only for even numbers, where the key is the number and the value is its square."
  },
  {
    type: "Python",
    question: "What is the result of this list slicing operation?",
    code: `numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
result = numbers[1:8:2]
print(result)`,
    options: [
      { id: "A", text: "[1, 3, 5, 7]", isCorrect: true },
      { id: "B", text: "[0, 2, 4, 6, 8]", isCorrect: false },
      { id: "C", text: "[1, 2, 3, 4, 5, 6, 7]", isCorrect: false },
      { id: "D", text: "[0, 1, 2, 3, 4, 5, 6, 7, 8]", isCorrect: false }
    ],
    explanation: "The slice [1:8:2] starts at index 1, ends before index 8, and takes every second element."
  },
  {
    type: "Python",
    question: "What will be printed by this code?",
    code: `class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        return "Some sound"

class Dog(Animal):
    def speak(self):
        return "Woof!"

dog = Dog("Buddy")
print(dog.speak())`,
    options: [
      { id: "A", text: "Some sound", isCorrect: false },
      { id: "B", text: "Woof!", isCorrect: true },
      { id: "C", text: "None", isCorrect: false },
      { id: "D", text: "Error", isCorrect: false }
    ],
    explanation: "The Dog class overrides the speak method from the Animal class, so calling speak() on a Dog instance returns 'Woof!'."
  },
  {
    type: "Python",
    question: "What is the output of this generator expression?",
    code: `numbers = (x for x in range(10) if x % 3 == 0)
print(list(numbers))`,
    options: [
      { id: "A", text: "[0, 3, 6, 9]", isCorrect: true },
      { id: "B", text: "[1, 2, 3, 4, 5, 6, 7, 8, 9]", isCorrect: false },
      { id: "C", text: "[3, 6, 9]", isCorrect: false },
      { id: "D", text: "TypeError", isCorrect: false }
    ],
    explanation: "The generator expression creates numbers from 0 to 9 that are divisible by 3."
  }
];

const generateMockQuestion = (index: number) => {
  const question = mockQuestions[index % mockQuestions.length];
  return {
    question_id: uuidv4(),
    question_type: "CODE_ANALYSIS_MULTIPLE_CHOICE",
    short_text: `${question.type} Question ${index + 1}`,
    question_text: question.question,
    question_key: index,
    content_type: "HTML",
    multimedia_count: 0,
    multimedia_format: "",
    multimedia_url: "",
    thumbnail_url: "",
    tag_names: [
      "POOL_1",
      `TOPIC_${question.type.toUpperCase()}_CODING_ANALYSIS`,
      "SUB_TOPIC_CODING_ANALYSIS",
      "DIFFICULTY_MEDIUM",
      "SOURCE_GPT",
      "IN_OFFLINE_EXAM",
      "COMPANY_UNKNOWN"
    ],
    options: question.options,
    code_data: question.code,
    code_language: "PYTHON39",
    explanation: question.explanation,
    explanation_content_type: "MARKDOWN",
    toughness: "MEDIUM"
  };
};

const SUBJECTS = [
  { value: 'C++', label: 'C++' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'C', label: 'C' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'SQL', label: 'SQL' }
];

const SUBJECT_PROMPTS = {
  'C++': 'Generate C++ questions focusing on OOP concepts, memory management, and STL.',
  'Python': 'Generate Python questions covering data structures, algorithms, and Pythonic concepts.',
  'Java': 'Generate Java questions about OOP principles, collections framework, and multithreading.',
  'C': 'Generate C questions focusing on pointers, memory management, and low-level programming.',
  'JavaScript': 'Generate JavaScript questions about ES6+ features, DOM manipulation, and async programming.',
  'SQL': 'Generate SQL questions covering database design, queries, and optimization techniques.'
};

const DIFFICULTY_COLORS = {
  Easy: 'text-green-500',
  Medium: 'text-yellow-500',
  Hard: 'text-red-500'
};

const GenerateMCQs = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('CA MCQs');
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    numQuestions: '',
    difficulty: 'Easy',
    topicTag: '',
    subtopicTag: '',
    prompt: '',
    syllabus: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [editingOption, setEditingOption] = useState<{ questionId: string; optionId: string } | null>(null);
  const [optionEditText, setOptionEditText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<boolean[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showClearAllWarning, setShowClearAllWarning] = useState(false);
  const [showClearRecentWarning, setShowClearRecentWarning] = useState(false);
  const [isPromptEditable, setIsPromptEditable] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(formData.prompt);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);




  const SUBJECT_PROMPTS = {
    'C++': ({
      subject,
      topic,
      no_of_questions,
      difficulty_level,
      syllabus
    }: {
      subject: string;
      topic: string;
      no_of_questions: string;
      difficulty_level: string;
      syllabus: string;
    }) => `
  # C++ and Data Structures & Algorithms (DSA) Recruitment Question Creation
  
  You are a C++ developer specializing in ${subject} with 20 years of experience. You need to prepare ${no_of_questions} ${difficulty_level} C++ multiple-choice and algorithm analysis questions for the recruitment of freshers on the topic of ${topic} in the DSA domain.
  
  ---
  
  ## Enhanced Content Guidelines for Developing Unique and Quality C++ Content
  
  ### **Format:**
  - All content must be written in Markdown format for readability and consistency.
  - Include proper formatting for C++ code snippets using backticks (\`) to ensure clear syntax highlighting.
  
  ### **Code Snippets:**
  - Use realistic and context-driven examples to make algorithms relatable to real-world scenarios.
  - Avoid comments within the code snippets; ensure they are self-explanatory through their structure.
  - Use meaningful variable and function names to enhance understanding and relevance.
  - Test all algorithms for correctness and edge cases to ensure accuracy.
  
  ### **Answer Format:**
  - Each question must have exactly four options, with only one correct answer.
  - Ensure incorrect options are:
    - **Plausible**: closely resemble the correct answer or contain common mistakes.
    - **Diverse**: Cover a range of plausible errors or variations to avoid predictability.
    - **Randomized**: The correct answer's position should be randomized.
  
  ### **Answer Explanation:**
  - Provide a concise, yet thorough explanation (up to 100 words).
  - Detail the role of each component, and why other options are wrong.
  
  ---
  
  ## Additional Guidelines for Unique and High-Quality Content
  
  1. **Variety and Creativity:**
     - Avoid repetition, use real-world examples.
     - Include different types: Output Prediction, Error Identification, Blank Filling, etc.
  
  2. **Problem Statement Design:**
     - Ensure problems are self-contained and practical.
  
  3. **Clarity and Precision:**
     - Clear, simple, and direct questions.
  
  4. **Difficulty Distribution:**
     - Balanced set of easy, medium, and hard questions.
  
  5. **Scalability:**
     - Modular and adaptable questions.
  
  6. **Error-Free Content:**
     - Test algorithms and proofread thoroughly.
  
  7. **Engagement:**
     - Include interactive or reasoning-based components.
  
  8. **Feedback Mechanism:**
     - Explain both correct and incorrect answers.
  
  ---
  
  ## Reference Syllabus
  
  ${syllabus}
  
  ---
  
  ## Question Styles and Difficulty Levels
  
  ### **Easy:** Basic comprehension.
  ### **Medium:** Debugging and tracing.
  ### **Hard:** Advanced optimization.
  
  ---
  
  ## Question Types:
  - Output Prediction
  - Error Identification
  - Blank Filling
  - Code Debugging
  - Time complexity
  - Space complexity
  
  ---
  
  ## JSON Format Example:
  
  \`\`\`json
  [
    {
      "question_text": "Sample text",
      "code_data": "#include <iostream> ...",
      "answer_count": 4,
      "options": {
        "Option A": "TRUE",
        "Option B": "FALSE",
        "Option C": "FALSE",
        "Option D": "FALSE"
      },
      "difficulty_level": "${difficulty_level.toUpperCase()}",
      "answer_explanation_content": "Explanation."
    }
  ]
  \`\`\`
  `
  };

  useEffect(() => {
    // Load questions from localStorage on component mount
    const savedQuestions = localStorage.getItem('generatedQuestions');
    if (savedQuestions) {
      setGeneratedQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  useEffect(() => {
    // Save questions to localStorage whenever they change
    if (generatedQuestions.length > 0) {
      localStorage.setItem('generatedQuestions', JSON.stringify(generatedQuestions));
    }
  }, [generatedQuestions]);

  useEffect(() => {
    const isValid =
      formData.subject !== '' &&
      formData.topic !== '' &&
      formData.numQuestions !== '' &&
      formData.difficulty !== '' &&
      formData.syllabus !== '';
    setIsFormValid(isValid);
  
    if (formData.subject === 'C++') {
      setFormData(prev => ({
        ...prev,
        prompt: SUBJECT_PROMPTS['C++']({
          subject: prev.subject,
          topic: prev.topic,
          no_of_questions: prev.numQuestions,
          difficulty_level: prev.difficulty,
          syllabus: prev.syllabus
        })
      }));
    }
  }, [formData.subject, formData.topic, formData.numQuestions, formData.difficulty, formData.syllabus]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === 'topic') {
      setFormData(prev => ({
        ...prev,
        topic: value,
        subtopicTag: value.toUpperCase().replace(/\s+/g, '_')
      }));
    } else if (name === 'topicTag') {
      const formatted = value.toUpperCase().replace(/\s+/g, '_');
      setFormData(prev => ({
        ...prev,
        topicTag: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  

  const handlePromptPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    setFormData(prev => ({
      ...prev,
      prompt: pastedText
    }));
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code Copied",
        description: "The code snippet has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

 const handleGenerate = () => {
  setIsGenerating(true);
  setGenerationProgress(0);
  setCurrentStep(0);
  setStepsCompleted(Array(5).fill(false));

  const numQuestions = Math.ceil(parseInt(formData.numQuestions) / 2);
  const steps = 5;
  const stepDuration = 1000;

  const interval = setInterval(() => {
    setGenerationProgress(prev => {
      const newProgress = prev + (100 / steps);
      if (newProgress >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        // Generate exactly the number of questions requested
        const newQuestions = Array(numQuestions)
          .fill(null)
          .map((_, index) => generateMockQuestion(index));
        setGeneratedQuestions(prev => [...prev, ...newQuestions]);
        return 100;
      }
      return newProgress;
    });
  }, stepDuration);

  for (let i = 0; i < steps; i++) {
    setTimeout(() => {
      setCurrentStep(i + 1);
      setStepsCompleted(prev => {
        const newSteps = [...prev];
        newSteps[i] = true;
        return newSteps;
      });
    }, i * stepDuration);
  }
};


  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingQuestion) {
      setGeneratedQuestions(prev => 
        prev.map(q => q.question_id === editingQuestion.question_id ? editingQuestion : q)
      );
      setIsEditModalOpen(false);
      setEditingQuestion(null);
      toast({
        title: "Question Updated",
        description: "The question has been successfully updated",
      });
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.question_id !== id));
    toast({
      title: "Question Deleted",
      description: "The question has been removed",
    });
  };

  const handleCopyQuestion = async (id: string) => {
    const question = generatedQuestions.find(q => q.question_id === id);
    if (question) {
      await navigator.clipboard.writeText(JSON.stringify(question, null, 2));
      setCopiedQuestionId(id);
      setTimeout(() => setCopiedQuestionId(null), 2000);
      toast({
        title: "Question Copied",
        description: "The question has been copied to clipboard",
      });
    }
  };

  const handleDownloadSheet = () => {
    // Create CSV content with all required headers
    const headers = [
      'question_id', 'question_type', 'short_text', 'question_text', 'question_key',
      'content_type', 'multimedia_count', 'multimedia_format', 'multimedia_url',
      'thumbnail_url', 'tag_names', 'c_options', 'w_options', 'options_content_type',
      'code_data', 'code_language', 'explanation', 'explanation_content_type', 'toughness'
    ];

    const csvContent = [
      headers.join(','),
      ...generatedQuestions.map(q => headers.map(h => {
        const value = q[h];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_questions.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Download Started",
      description: "Your questions have been downloaded as a CSV file",
    });
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setShowAnswers(prev => ({ ...prev, [questionId]: true }));
  };

  const getOptionColor = (questionId: string, optionId: string) => {
    if (!showAnswers[questionId]) return '';
    const question = generatedQuestions.find(q => q.question_id === questionId);
    const option = question?.options.find((o: any) => o.id === optionId);
    if (option?.isCorrect) return 'bg-green-100 dark:bg-green-900';
    if (selectedAnswers[questionId] === optionId && !option?.isCorrect) return 'bg-red-100 dark:bg-red-900';
    return '';
  };

  const handleEditOption = (questionId: string, optionId: string, text: string) => {
    setEditingOption({ questionId, optionId });
    setOptionEditText(text);
  };

  const handleSaveOption = () => {
    if (editingOption) {
      setGeneratedQuestions(prev => 
        prev.map(q => {
          if (q.question_id === editingOption.questionId) {
            return {
              ...q,
              options: q.options.map((opt: any) => 
                opt.id === editingOption.optionId 
                  ? { ...opt, text: optionEditText }
                  : opt
              )
            };
          }
          return q;
        })
      );
      setEditingOption(null);
      setOptionEditText("");
    }
  };

  const highlightCode = (code: string) => {
    const keywords = ['def', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'in', 'isinstance', 'print'];
    const builtins = ['range', 'list', 'dict', 'set', 'str', 'int', 'float', 'bool'];
    
    return code.split('\n').map((line, i) => (
      <div key={i} className="flex">
        <span className="text-slate-400 mr-4 select-none">{i + 1}</span>
        <span className="flex-1">
          {line.split(/(\s+)/).map((word, j) => {
            if (keywords.includes(word)) {
              return <span key={j} className="text-blue-500">{word}</span>;
            }
            if (builtins.includes(word)) {
              return <span key={j} className="text-purple-500">{word}</span>;
            }
            if (word.match(/^['"].*['"]$/)) {
              return <span key={j} className="text-green-500">{word}</span>;
            }
            if (word.match(/^\d+$/)) {
              return <span key={j} className="text-orange-500">{word}</span>;
            }
            return <span key={j} className="text-slate-800 dark:text-slate-200">{word}</span>;
          })}
        </span>
      </div>
    ));
  };

  const handleClearAll = () => {
    if (showClearAllWarning) {
      setGeneratedQuestions([]);
      localStorage.removeItem('generatedQuestions');
      setShowClearAllWarning(false);
      // Reset form data
      setFormData(prev => ({
        ...prev,
        numQuestions: '',
        topic: '',
        topicTag: '',
        subtopicTag: '',
        syllabus: ''
      }));
    } else {
      setShowClearAllWarning(true);
    }
  };

  const handleClearRecent = () => {
    if (showClearRecentWarning) {
      const numQuestions = parseInt(formData.numQuestions);
      setGeneratedQuestions(prev => {
        const newQuestions = prev.slice(0, -numQuestions);
        // Update localStorage
        if (newQuestions.length === 0) {
          localStorage.removeItem('generatedQuestions');
        } else {
          localStorage.setItem('generatedQuestions', JSON.stringify(newQuestions));
        }
        return newQuestions;
      });
      setShowClearRecentWarning(false);
    } else {
      setShowClearRecentWarning(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white gradient-text">
            Generate Questions
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Create custom multiple choice questions</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-4 mb-8 border-b border-slate-200 dark:border-slate-700"
      >
        {[
          { name: 'CA MCQs', icon: BookOpen },
          { name: 'General MCQs', icon: FileText },
          { name: 'Coding Questions', icon: Code2 }
        ].map((tab) => (
          <motion.button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative flex items-center space-x-2
              ${activeTab === tab.name 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.name}</span>
            {activeTab === tab.name && (
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                layoutId="tabIndicator"
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {activeTab !== 'CA MCQs' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mb-6"
          >
            <Code2 className="h-24 w-24 text-blue-500" />
          </motion.div>
          <Alert className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-md">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="ml-2">
              {activeTab} section is under development. Coming soon!
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {activeTab === 'CA MCQs' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 neon-card transition-all duration-300 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger className="neon-input">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Topic
                </label>
                <Input
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="neon-input"
                  placeholder="Enter topic"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Number of Questions
                </label>
                <Input
                  name="numQuestions"
                  type="number"
                  value={formData.numQuestions}
                  onChange={handleInputChange}
                  className="neon-input"
                  placeholder="Enter number of questions"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty
                </label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger className="neon-input">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy" className={DIFFICULTY_COLORS.Easy}>
                      Easy
                    </SelectItem>
                    <SelectItem value="Medium" className={DIFFICULTY_COLORS.Medium}>
                      Medium
                    </SelectItem>
                    <SelectItem value="Hard" className={DIFFICULTY_COLORS.Hard}>
                      Hard
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Topic Tag
                </label>
                <Input
                  name="topicTag"
                  value={formData.topicTag}
                  onChange={handleInputChange}
                  className="neon-input font-mono"
                  placeholder="TOPIC_TAG"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subtopic Tag
                </label>
                <Input
                  name="subtopicTag"
                  value={formData.subtopicTag}
                  onChange={handleInputChange}
                  className="neon-input"
                  placeholder="Subtopic tag (auto-generated)"
                  readOnly
                />
              </div>

              <div className="form-group col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus
                </label>
                <Textarea
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleInputChange}
                  className="neon-input min-h-[100px]"
                  placeholder="Enter syllabus details..."
                />
              </div>
            </div>


            <div className="mt-6">
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
    Prompt
  </label>
  <Textarea
    name="prompt"
    value={formData.prompt}
    onChange={handleInputChange}
    className="neon-input min-h-[150px]"
    readOnly
  />
  <div className="mt-2 flex space-x-2">
    <Button variant="outline" onClick={() => {
      setTempPrompt(formData.prompt);
      setIsPromptModalOpen(true);
    }}>
      Edit Prompt
    </Button>
  </div>
</div>

<Dialog open={isPromptModalOpen} onOpenChange={setIsPromptModalOpen}>
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle>Edit Prompt</DialogTitle>
    </DialogHeader>
    <Textarea
      value={tempPrompt}
      onChange={(e) => setTempPrompt(e.target.value)}
      className="h-80 font-mono"
    />
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsPromptModalOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => {
        setFormData(prev => ({ ...prev, prompt: tempPrompt }));
        setIsPromptModalOpen(false);
      }}>
        Save
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

            <Button
              onClick={handleGenerate}
              className="w-full mt-6 neon-button"
              disabled={!isFormValid || isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Questions
                </div>
              )}
            </Button>

            {isGenerating && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  {Array(5).fill(null).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: stepsCompleted[index] ? 1 : 0.8,
                        opacity: stepsCompleted[index] ? 1 : 0.5
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-2">
                        {stepsCompleted[index] ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">{index + 1}</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Step {index + 1}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <Progress value={generationProgress} className="h-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
                  {currentStep > 0 ? `Step ${currentStep} of 5: ${getStepDescription(currentStep)}` : 'Starting...'}
                </p>
              </div>
            )}
          </div>

          {generatedQuestions.length > 0 && (
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={handleClearRecent}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Recent
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}

          {/* Warning Dialogs */}
          <Dialog open={showClearAllWarning} onOpenChange={setShowClearAllWarning}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear All Questions</DialogTitle>
              </DialogHeader>
              <p className="text-slate-600 dark:text-slate-400">
                Are you sure you want to clear all questions? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4 mt-4">
                <Button variant="outline" onClick={() => setShowClearAllWarning(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showClearRecentWarning} onOpenChange={setShowClearRecentWarning}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear Recent Questions</DialogTitle>
              </DialogHeader>
              <p className="text-slate-600 dark:text-slate-400">
                Are you sure you want to clear the most recently generated questions?
              </p>
              <div className="flex justify-end space-x-4 mt-4">
                <Button variant="outline" onClick={() => setShowClearRecentWarning(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearRecent}>
                  Clear Recent
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <AnimatePresence>
            {generatedQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 neon-card"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                    Generated Questions
                  </h2>
                  <Button
                    onClick={handleDownloadSheet}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Google Sheet
                  </Button>
                </div>

                <div className="space-y-6">
                  {generatedQuestions.map((question, index) => (
                    <motion.div
                      key={question.question_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-slate-50 dark:bg-slate-700/50 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-slate-800 dark:text-white">
                              Question {index + 1}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {question.short_text}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              ID: {question.question_id}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditQuestion(question)}
                              className="hover-scale"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyQuestion(question.question_id)}
                              className="hover-scale"
                            >
                              {copiedQuestionId === question.question_id ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.question_id)}
                              className="hover-scale"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-slate-800 dark:text-slate-200">
                            {question.question_text}
                          </p>
                          {question.code_data && (
                            <div className="relative">
                              <pre className="bg-slate-100 dark:bg-slate-600 p-4 rounded-lg mt-2 overflow-x-auto">
                                <code className="language-python">
                                  {highlightCode(question.code_data)}
                                </code>
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyCode(question.code_data)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="mt-6">
                          <RadioGroup
                            value={selectedAnswers[question.question_id]}
                            onValueChange={(value) => handleAnswerSelect(question.question_id, value)}
                            className="space-y-2"
                          >
                            {question.options.map((option: any) => (
                              <motion.div
                                key={option.id}
                                className={cn(
                                  "flex items-center space-x-2 p-3 rounded-lg transition-colors",
                                  getOptionColor(question.question_id, option.id)
                                )}
                              >
                                {editingOption?.questionId === question.question_id && 
                                 editingOption?.optionId === option.id ? (
                                  <div className="flex-1 flex items-center space-x-2">
                                    <Input
                                      value={optionEditText}
                                      onChange={(e) => setOptionEditText(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={handleSaveOption}
                                      className="bg-green-500 hover:bg-green-600"
                                    >
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingOption(null)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <RadioGroupItem 
                                      value={option.id} 
                                      id={`${question.question_id}-${option.id}`} 
                                    />
                                    <Label 
                                      htmlFor={`${question.question_id}-${option.id}`} 
                                      className="cursor-pointer flex-1"
                                    >
                                      {option.text}
                                    </Label>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditOption(question.question_id, option.id, option.text)}
                                      className="opacity-100"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </motion.div>
                            ))}
                          </RadioGroup>
                        </div>

                        {showAnswers[question.question_id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 p-4 bg-slate-100 dark:bg-slate-600 rounded-lg"
                          >
                            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Explanation
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {question.explanation}
                            </p>
                          </motion.div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4 py-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Question Text
                </label>
                <Textarea
                  value={editingQuestion.question_text}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
                  className="neon-input"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Code
                </label>
                <Textarea
                  value={editingQuestion.code_data}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, code_data: e.target.value })}
                  className="neon-input font-mono"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Explanation
                </label>
                <Textarea
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className="neon-input"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const getStepDescription = (step: number): string => {
  switch (step) {
    case 1:
      return "Analyzing input parameters";
    case 2:
      return "Generating question templates";
    case 3:
      return "Creating code snippets";
    case 4:
      return "Formulating options";
    case 5:
      return "Finalizing questions";
    default:
      return "";
  }
};

export default GenerateMCQs;
