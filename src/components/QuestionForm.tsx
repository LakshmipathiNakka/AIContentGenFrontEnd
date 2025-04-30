import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionFormProps {
  onSubmit: (formData: {
    topic: string;
    difficulty: string;
    count: number;
    additionalContext: string;
  }) => void;
  isLoading: boolean;
}

const QuestionForm = ({ onSubmit, isLoading }: QuestionFormProps) => {
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'medium',
    count: 5,
    additionalContext: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'count' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      difficulty: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Questions</CardTitle>
        <CardDescription>
          Fill in the details below to generate multiple choice questions.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="Enter the topic for questions"
              value={formData.topic}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={handleSelectChange}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="count">Number of Questions</Label>
              <Input
                id="count"
                name="count"
                type="number"
                min="1"
                max="20"
                value={formData.count}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalContext">Additional Context (Optional)</Label>
            <Textarea
              id="additionalContext"
              name="additionalContext"
              placeholder="Add any additional context or specific requirements"
              value={formData.additionalContext}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Questions'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuestionForm; 