
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodingRequest } from '@/types/workflow';
import { mockLLMService } from '@/services/mockLLMService';
import { RefreshCw, MessageCircle } from 'lucide-react';

interface FollowUpPanelProps {
  request: CodingRequest;
  onNewRequest: () => void;
}

export const FollowUpPanel: React.FC<FollowUpPanelProps> = ({ 
  request, 
  onNewRequest 
}) => {
  const [explanation, setExplanation] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateFollowUp = async () => {
      setIsLoading(true);
      const response = await mockLLMService.generateFollowUp(request.description, request.code || '');
      setExplanation(response.explanation || '');
      setFollowUpQuestion(response.followUpQuestion || '');
      setIsLoading(false);
    };

    generateFollowUp();
  }, [request]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Generating Summary...
          </h2>
          <p className="text-slate-600">
            Creating explanation and follow-up questions for your project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            🎉 Success! Your code is ready
          </h2>
          <p className="text-slate-600">
            Here's a summary of what was created and some ideas for next steps.
          </p>
        </div>

        {/* Code Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Code Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 whitespace-pre-wrap">
                {explanation}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-slate-700 font-medium mb-3">
                {followUpQuestion}
              </p>
              <Textarea
                placeholder="Share your thoughts or describe what you'd like to explore next..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onNewRequest}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New Request
          </Button>
          
          <Button 
            variant="outline"
            disabled={!userResponse.trim()}
            className="flex-1 sm:flex-none"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Continue Conversation
          </Button>
        </div>

        {/* Project History (Mock) */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Session Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-sm text-green-700">Script Generated</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{request.debugAttempts || 0}</div>
                <div className="text-sm text-blue-700">Debug Attempts</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((Date.now() - request.createdAt.getTime()) / 1000)}s
                </div>
                <div className="text-sm text-purple-700">Total Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
