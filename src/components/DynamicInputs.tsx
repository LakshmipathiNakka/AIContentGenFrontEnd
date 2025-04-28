
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

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
        subject: "",
        no_of_questions: 5,
        topic: "",
        difficulty_level_tag: "Medium",
        topic_tag: "",
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
    <div className="dynamic-inputs">
      {inputs.map((input, index) => (
        <div key={index} className="input-card">
          <div className="input-header">
            <h3 className="input-title">Input #{index + 1}</h3>
            <button 
              className="icon-button"
              onClick={() => removeInput(index)}
              disabled={inputs.length <= 1}
            >
              <Minus className="icon-small" />
            </button>
          </div>

          <div className="input-fields">
            <div className="form-field">
              <label className="field-label">Subject</label>
              <input
                type="text"
                value={input.subject}
                onChange={(e) => handleInputChange(index, 'subject', e.target.value)}
                placeholder="e.g. Python, JavaScript, Java"
                className="text-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={input.no_of_questions}
                onChange={(e) => handleInputChange(index, 'no_of_questions', parseInt(e.target.value) || 1)}
                className="number-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Topic</label>
              <input
                type="text"
                value={input.topic}
                onChange={(e) => handleInputChange(index, 'topic', e.target.value)}
                placeholder="e.g., Built-in Functions"
                className="text-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Difficulty Level</label>
              <select 
                value={input.difficulty_level_tag}
                onChange={(e) => handleInputChange(index, 'difficulty_level_tag', e.target.value)}
                className="select-input"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">Topic Tag</label>
              <input
                type="text"
                value={input.topic_tag}
                onChange={(e) => handleInputChange(index, 'topic_tag', e.target.value)}
                placeholder="e.g., PYTHON_CODING_ANALYSIS"
                className="text-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Sub Topic Tag</label>
              <input
                type="text"
                value={input.sub_topic_tag}
                onChange={(e) => handleInputChange(index, 'sub_topic_tag', e.target.value)}
                placeholder="e.g., ABS_IN_BUILT_IN_FUNCTIONS"
                className="text-input"
              />
            </div>
          </div>
        </div>
      ))}

      <button 
        className="outline-button full-width" 
        onClick={addNewInput} 
      >
        <Plus className="button-icon" />
        Add New Input
      </button>
    </div>
  );
};

export default DynamicInputs;
