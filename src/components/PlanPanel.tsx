
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodingRequest } from '@/types/workflow';
import { mockLLMService } from '@/services/mockLLMService';
import { CheckCircle, Edit, ArrowLeft, ArrowRight } from 'lucide-react';

interface PlanPanelProps {
  request: CodingRequest;
  onApprove: () => void;
  onBack: () => void;
  onEdit: (updatedRequest: CodingRequest) => void;
}

export const PlanPanel: React.FC<PlanPanelProps> = ({ 
  request, 
  onApprove, 
  onBack, 
  onEdit 
}) => {
  const [plan, setPlan] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generatePlan = async () => {
      setIsLoading(true);
      const response = await mockLLMService.generatePlan(request.description);
      setPlan(response.plan || '');
      setEditedPlan(response.plan || '');
      setIsLoading(false);
    };

    generatePlan();
  }, [request.description]);

  const handleApprove = () => {
    const updatedRequest = { ...request, plan, status: 'coding' as const };
    onEdit(updatedRequest);
    onApprove();
  };

  const handleSaveEdit = () => {
    setPlan(editedPlan);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Generating Plan...
          </h2>
          <p className="text-slate-600">
            Analyzing your request and creating a step-by-step implementation plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Implementation Plan
          </h2>
          <p className="text-slate-600">
            Review the proposed plan and approve it or make adjustments before code generation.
          </p>
        </div>

        {/* Original Request */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Your Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
              {request.description}
            </p>
          </CardContent>
        </Card>

        {/* Generated Plan */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Proposed Plan</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Plan'}
            </Button>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={editedPlan}
                  onChange={(e) => setEditedPlan(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleSaveEdit} size="sm">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEditedPlan(plan);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <pre className="bg-slate-50 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm text-slate-700 overflow-x-auto">
                {plan}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Request
          </Button>
          
          <Button onClick={handleApprove} disabled={isEditing}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve & Generate Code
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
