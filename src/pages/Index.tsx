
import React, { useState } from 'react';
import { RequestInput } from '@/components/RequestInput';
import { PlanPanel } from '@/components/PlanPanel';
import { CodeDisplay } from '@/components/CodeDisplay';
import { FollowUpPanel } from '@/components/FollowUpPanel';
import { LoginForm } from '@/components/LoginForm';
import { WorkflowStep, CodingRequest } from '@/types/workflow';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, logout, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('input');
  const [request, setRequest] = useState<CodingRequest | null>(null);

  const handleStepChange = (step: WorkflowStep, data?: CodingRequest) => {
    setCurrentStep(step);
    if (data) {
      setRequest(data);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with logout */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                AI Coding Assistant
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Transform your ideas into working Python code through an intelligent, 
                step-by-step workflow
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Workflow Steps Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[
                { step: 'input', label: 'Request', icon: '📝' },
                { step: 'plan', label: 'Plan', icon: '🎯' },
                { step: 'code', label: 'Code', icon: '💻' },
                { step: 'followup', label: 'Follow-up', icon: '💬' }
              ].map(({ step, label, icon }) => (
                <div
                  key={step}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    currentStep === step
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-white text-slate-600 border-2 border-slate-200'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {currentStep === 'input' && (
              <RequestInput onNext={(data) => handleStepChange('plan', data)} />
            )}
            
            {currentStep === 'plan' && request && (
              <PlanPanel 
                request={request}
                onApprove={() => handleStepChange('code')}
                onBack={() => handleStepChange('input')}
                onEdit={(updatedRequest) => setRequest(updatedRequest)}
              />
            )}
            
            {currentStep === 'code' && request && (
              <CodeDisplay 
                request={request}
                onComplete={() => handleStepChange('followup')}
                onBack={() => handleStepChange('plan')}
              />
            )}
            
            {currentStep === 'followup' && request && (
              <FollowUpPanel 
                request={request}
                onNewRequest={() => {
                  setRequest(null);
                  handleStepChange('input');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
