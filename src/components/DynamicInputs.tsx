
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InputData {
  subject: string;
  no_of_questions: number;
  topic: string;
  difficulty_level_tag: string;
  topic_tag: string;
  sub_topic_tag: string;
}

interface DynamicInputsProps {
  inputs: InputData[];
  setInputs: (inputs: InputData[]) => void;
}

const DynamicInputs = ({ inputs, setInputs }: DynamicInputsProps) => {
  const handleInputChange = (index: number, field: keyof InputData, value: string | number) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setInputs(newInputs);
  };

  const addNewInput = () => {
    setInputs([
      ...inputs,
      {
        subject: "Python",
        no_of_questions: 5,
        topic: "",
        difficulty_level_tag: "Medium",
        topic_tag: "PYTHON_CODING_ANALYSIS",
        sub_topic_tag: ""
      }
    ]);
  };

  const removeInput = (index: number) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  return (
    <div className="space-y-4">
      {inputs.map((input, index) => (
        <div key={index} className="p-4 border rounded-md bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Input #{index + 1}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeInput(index)}
              disabled={inputs.length <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <Select 
                value={input.subject}
                onValueChange={(value) => handleInputChange(index, 'subject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="C++">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={input.no_of_questions}
                onChange={(e) => handleInputChange(index, 'no_of_questions', parseInt(e.target.value) || 1)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
              <Input
                type="text"
                value={input.topic}
                onChange={(e) => handleInputChange(index, 'topic', e.target.value)}
                placeholder="e.g., Built-in Functions"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty Level</label>
              <Select 
                value={input.difficulty_level_tag}
                onValueChange={(value) => handleInputChange(index, 'difficulty_level_tag', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Topic Tag</label>
              <Input
                type="text"
                value={input.topic_tag}
                onChange={(e) => handleInputChange(index, 'topic_tag', e.target.value)}
                placeholder="e.g., PYTHON_CODING_ANALYSIS"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub Topic Tag</label>
              <Input
                type="text"
                value={input.sub_topic_tag}
                onChange={(e) => handleInputChange(index, 'sub_topic_tag', e.target.value)}
                placeholder="e.g., ABS_IN_BUILT_IN_FUNCTIONS"
                className="w-full"
              />
            </div>
          </div>
        </div>
      ))}

      <Button 
        variant="outline" 
        onClick={addNewInput} 
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Input
      </Button>
    </div>
  );
};

export default DynamicInputs;
