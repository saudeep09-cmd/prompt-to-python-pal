
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CodingRequest } from '@/types/workflow';
import { Lightbulb, Send } from 'lucide-react';

interface RequestInputProps {
  onNext: (request: CodingRequest) => void;
}

export const RequestInput: React.FC<RequestInputProps> = ({ onNext }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const exampleRequests = [
    "Create a Python script that analyzes CSV data and generates a summary report",
    "Build a web scraper that extracts product prices from an e-commerce site",
    "Write a script that converts JSON data to Excel format with charts",
    "Create a password generator with customizable complexity rules"
  ];

  const handleSubmit = async () => {
    if (!description.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request: CodingRequest = {
      id: Date.now().toString(),
      description: description.trim(),
      status: 'planning',
      createdAt: new Date()
    };
    
    setIsLoading(false);
    onNext(request);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            What would you like to build?
          </h2>
          <p className="text-slate-600">
            Describe your Python coding task in natural language. 
            Be as specific as possible about what you want the script to do.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="request" className="text-sm font-medium text-slate-700">
              Your Request
            </Label>
            <Textarea
              id="request"
              placeholder="e.g., Create a Python script that reads a CSV file, filters data based on certain conditions, and generates a visualization..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!description.trim() || isLoading}
            className="w-full h-12 text-base font-medium"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing Request...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Plan
              </>
            )}
          </Button>

          {/* Example Requests */}
          <div className="mt-8">
            <div className="flex items-center mb-4">
              <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-slate-700">Example Requests</span>
            </div>
            <div className="grid gap-2">
              {exampleRequests.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setDescription(example)}
                  className="text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm text-slate-600 hover:text-blue-700"
                  disabled={isLoading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
