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
import { getAuthHeaders } from '@/utils/auth'; 
import { fetchPromptFromAPI } from "@/utils/api"; // adjust path if needed
import Cookies from 'js-cookie';


const SUBJECTS = [
  { value: 'C++', label: 'C++' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'C', label: 'C' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'SQL', label: 'SQL' }
];

const SUBJECT_PROMPT_MAP = {
  "C++": "ca_mcq_cpp",
  "Python": "ca_mcq_python",
  "Java": "ca_mcq_java",
  "C": "ca_mcq_c",
  "JavaScript": "ca_mcq_javascript",
  "SQL": "ca_mcq_sql"
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
  const [stepsCompleted, setStepsCompleted] = useState<boolean[]>([false, false, false, false, false]);
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
  const [isFormValid, setIsFormValid] = useState(false);
  const [showClearAllWarning, setShowClearAllWarning] = useState(false);
  const [showClearRecentWarning, setShowClearRecentWarning] = useState(false);
  const [isPromptEditable, setIsPromptEditable] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(formData.prompt);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

 




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
    // Validate if all required fields are filled
    const isValid =
      formData.subject !== '' &&
      formData.topic !== '' &&
      formData.numQuestions !== '' &&
      formData.difficulty !== '' &&
      formData.syllabus !== '';
      
    setIsFormValid(isValid);  // Update the form validity state
  
    // Proceed with loading the prompt only if the form is valid
    if (isValid) {
      const loadPrompt = async () => {
        if (formData.subject) {
          // Get the corresponding prompt key based on selected subject
          const promptKey = SUBJECT_PROMPT_MAP[formData.subject];
          
          if (promptKey) {
            try {
              const rawPrompt = await fetchPromptFromAPI(promptKey);
              console.log("Fetched Prompt for", formData.subject, ":", rawPrompt);
  
              if (rawPrompt) {
                // Replace placeholders with formData values
                const filledPrompt = rawPrompt
                  .replace(/{{subject}}/gi, formData.subject) 
                  .replace(/{{no_of_questions}}/gi, formData.numQuestions)
                  .replace(/{{difficulty_level}}/gi, formData.difficulty)
                  .replace(/{{topic}}/gi, formData.topic)
                  .replace(/{{syllabus}}/gi, formData.syllabus);
  
                // Update formData with the filled prompt
                setFormData(prev => ({
                  ...prev,
                  prompt: filledPrompt
                }));
              }
            } catch (err) {
              console.error("Error fetching prompt:", err);
            }
          }
        }
      };
  
      loadPrompt();
    }
  
  }, [formData.subject, formData.numQuestions, formData.difficulty, formData.topic, formData.syllabus]); 
  


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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



  const getDifficultyCounts = () => {
    const counts = { EASY: 0, MEDIUM: 0, HARD: 0, TOTAL: generatedQuestions.length };
    
    // Loop through the generated questions to count difficulty levels
    generatedQuestions.forEach((q) => {
      // Ensure difficulty is in the correct format (string or mapped)
      const level = (q.difficulty_level?.toUpperCase());
      
      if (level && counts.hasOwnProperty(level)) {
        counts[level]++;
      }
    });

    return counts;
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

  const jwt_Token = Cookies.get('access_token');
  console.log("here JWT Token:", jwt_Token);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);  // Reset the progress
    try {
      const headers = await getAuthHeaders();
      const response = await fetch("https://ravik00111110.pythonanywhere.com/api/content-gen/generate/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          prompt: formData.prompt,
          difficulty: formData.difficulty.toLowerCase(),
          question_type: "MCQ",
          topic: formData.subject.toUpperCase(),
          subtopic: formData.topic.toUpperCase(),
          number_of_question: formData.numQuestions
        })
      });
  
      const data = await response.json();
      console.log("📦 Response status:", response.status);
      console.log("📨 Raw response data:", data);


    
  
      if (!response.ok) {
        throw new Error(data.detail || "Unauthorized request.");
      }
  
      if (!data.message) {
        throw new Error("Missing 'message' in API response");
      }
  
      const jsonStart = data.message.indexOf("[");
      const jsonEnd = data.message.lastIndexOf("]") + 1;
      const jsonString = data.message.slice(jsonStart, jsonEnd);
  
      // Map difficulty levels here
      const parsedQuestions = JSON.parse(jsonString).map((q, index) => {
        const optionsArray = Object.entries(q.options).map(([text, correctness], i) => ({
          id: String.fromCharCode(65 + i),
          text,
          isCorrect: correctness === "TRUE"
        }));
  
        // Map the difficulty level (assuming it is numeric)
        const difficultyLevel = (q.difficulty_level);  // Map numeric value to string
  
        return {
          ...q,
          question_id: uuidv4(),
          question_type: "CODE_ANALYSIS_MULTIPLE_CHOICE",
          short_text: `${formData.subject} Question ${index + 1}`,
          question_key: index,
          content_type: "HTML",
          tag_names: [
            "POOL_1",
            `TOPIC_${formData.topic.toUpperCase().replace(/\s+/g, "_")}_CODING_ANALYSIS`,
            `SUB_TOPIC_CODING_ANALYSIS`,
            `DIFFICULTY_${formData.difficulty.toUpperCase()}`,
            "SOURCE_GPT",
            "IN_OFFLINE_EXAM",
            "COMPANY_UNKNOWN"
          ],
          code_data: q.code_data,
          code_language: formData.subject.toUpperCase(),
          explanation: q.answer_explanation_content,
          explanation_content_type: "MARKDOWN",
          toughness: formData.difficulty.toUpperCase(),
          options: optionsArray,
          difficulty_level: difficultyLevel,  // Set mapped difficulty level
        };
      });
  
      setGeneratedQuestions(prev => [...prev, ...parsedQuestions]);
    } catch (err) {
      console.error("❌ Generation error:", err);
      toast({
        title: "Generation Failed",
        description: err instanceof Error ? err.message : "Unknown error.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
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


// Update this state in your steps progress as per API response
const updateStepProgress = (step: number) => {
  setStepsCompleted(prev => {
    const updated = [...prev];
    updated[step] = true;
    return updated;
  });
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
  className={`neon-input min-h-[150px] ${!isFormValid ? 'opacity-50 ' : ''}`}
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
      className="w-full neon-button"
      disabled={!isFormValid || isGenerating}
    >
      {isGenerating ? (
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Loader2 className="h-6 w-6 text-blue-500" />
          </motion.div>
          <span className="ml-2">Generating...</span>
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
          {stepsCompleted.map((completed, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: completed ? 1 : 0.8,
                opacity: completed ? 1 : 0.5 
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-2">
                {completed ? (
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
                            <div>
                              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                                Generated Questions
                              </h2>
                              <div className="mt-1 space-x-2 text-sm">
                                {(() => {
                                  const { EASY, MEDIUM, HARD, TOTAL } = getDifficultyCounts();
                                  return (
                                    <>
                                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                        Easy: {EASY}
                                      </span>
                                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        Medium: {MEDIUM}
                                      </span>
                                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                                        Hard: {HARD}
                                      </span>

                                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded">
                                          Total: {TOTAL}
                                      </span>

                                    </>
                                  );
                                })()}
                              </div>
                            </div>

                              <Button
                                onClick={handleDownloadSheet}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download Google Sheet
                              </Button>
                            </div>


                            <div className="space-y-6">
  {generatedQuestions.map((question, index) => {
    console.log("Question Difficulty Level: ", question.difficulty_level); // Debugging line
    
    return (
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

              {/* Difficulty Level Display */}
              {question.difficulty_level && (
                <span
                  className="inline-block px-2 py-0.5 mt-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor:
                      question.difficulty_level === "EASY"
                        ? "#d1fae5" // green bg
                        : question.difficulty_level === "MEDIUM"
                        ? "#fef3c7" // yellow bg
                        : "#fee2e2", // red bg
                    color:
                      question.difficulty_level === "EASY"
                        ? "#065f46" // green text
                        : question.difficulty_level === "MEDIUM"
                        ? "#92400e" // yellow text
                        : "#991b1b" // red text
                  }}
                >
                  {question.difficulty_level} {/* Display the difficulty */}
                </span>
              )}

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
    );
  })}
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
