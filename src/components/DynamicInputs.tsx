
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

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

const subjects = [
  'JavaScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Ruby', 'Swift', 'PHP'
];

const difficulties = ['Easy', 'Medium', 'Hard'];

const DynamicInputs = ({ inputs, setInputs }: DynamicInputsProps) => {
  const handleInputChange = (index: number, field: string, value: any) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    
    // Auto-generate topic_tag and sub_topic_tag from subject and topic
    if (field === 'subject' || field === 'topic') {
      const subject = field === 'subject' ? value : newInputs[index].subject;
      const topic = field === 'topic' ? value : newInputs[index].topic;
      
      // Generate topic_tag
      newInputs[index].topic_tag = `${subject.toUpperCase()}_CODING_ANALYSIS`;
      
      // Generate sub_topic_tag
      const formattedTopic = topic
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '');
      
      newInputs[index].sub_topic_tag = formattedTopic || 'TOPIC';
    }
    
    setInputs(newInputs);
  };
  
  const addInput = () => {
    setInputs([
      ...inputs,
      {
        subject: "Python",
        no_of_questions: 5,
        topic: "Data Types",
        difficulty_level_tag: "Medium",
        topic_tag: "PYTHON_CODING_ANALYSIS",
        sub_topic_tag: "DATA_TYPES"
      }
    ]);
  };
  
  const removeInput = (index: number) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };
  
  return (
    <div className="dynamic-inputs stagger-animate">
      {inputs.map((input, index) => (
        <div key={index} className="input-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="input-header">
            <h4 className="input-title">Input #{index + 1}</h4>
            {inputs.length > 1 && (
              <button 
                type="button" 
                className="icon-button" 
                onClick={() => removeInput(index)}
                aria-label="Remove input"
              >
                <Trash2 className="icon-small text-slate-400 hover:text-red-500" />
              </button>
            )}
          </div>
          
          <div className="input-fields">
            <div className="form-field">
              <label className="field-label">Subject</label>
              <select
                value={input.subject}
                onChange={(e) => handleInputChange(index, 'subject', e.target.value)}
                className="select-input interactive-input"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div className="form-field">
              <div className="field-header">
                <label className="field-label">Number of Questions</label>
                <span className="field-range">{input.no_of_questions}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={input.no_of_questions}
                onChange={(e) => handleInputChange(index, 'no_of_questions', parseInt(e.target.value))}
                className="range-input"
              />
              <div className="range-labels">
                <span>1</span>
                <span>20</span>
              </div>
            </div>
            
            <div className="form-field">
              <label className="field-label">Topic</label>
              <input
                type="text"
                value={input.topic}
                onChange={(e) => handleInputChange(index, 'topic', e.target.value)}
                className="text-input interactive-input"
                placeholder="Enter topic"
              />
            </div>
            
            <div className="form-field">
              <label className="field-label">Difficulty Level</label>
              <div className="radio-group">
                {difficulties.map((difficulty) => (
                  <label key={difficulty} className="radio-option">
                    <input
                      type="radio"
                      name={`difficulty-${index}`}
                      value={difficulty}
                      checked={input.difficulty_level_tag === difficulty}
                      onChange={() => handleInputChange(index, 'difficulty_level_tag', difficulty)}
                      className="radio-input"
                    />
                    <span className="radio-label">{difficulty}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        className="outline-button full-width button-hover-effect"
        onClick={addInput}
      >
        <Plus className="button-icon" />
        Add Input
      </button>
    </div>
  );
};

export default DynamicInputs;
