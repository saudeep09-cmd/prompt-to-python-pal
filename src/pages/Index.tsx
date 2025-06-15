
import React, { useState } from 'react';
import { RequestInput } from '@/components/RequestInput';
import { PlanPanel } from '@/components/PlanPanel';
import { CodeDisplay } from '@/components/CodeDisplay';
import { FollowUpPanel } from '@/components/FollowUpPanel';
import { LoginForm } from '@/components/LoginForm';
import { WorkflowStep, CodingRequest } from '@/types/workflow';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Zap, Brain, CheckCircle, ArrowRight, Users, Clock, Star } from 'lucide-react';

const Index = () => {
  const { user, logout, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('input');
  const [request, setRequest] = useState<CodingRequest | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const handleStepChange = (step: WorkflowStep, data?: CodingRequest) => {
    setCurrentStep(step);
    if (data) {
      setRequest(data);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowWorkflow(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGetStarted = () => {
    setShowWorkflow(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (showWorkflow) {
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
                <Button variant="ghost" onClick={() => setShowWorkflow(false)}>
                  Back to Home
                </Button>
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">CodeAI Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Transform Ideas into
              <span className="text-blue-600"> Python Code</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Our AI-powered assistant guides you through a structured workflow to create 
              professional Python applications from simple descriptions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={handleGetStarted}
              >
                Start Coding Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose CodeAI Pro?
            </h2>
            <p className="text-xl text-slate-600">
              Experience the future of code generation with our intelligent workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">AI-Powered Planning</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Advanced AI analyzes your requirements and creates detailed implementation plans
                  before writing a single line of code.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Generate production-ready Python code in minutes, not hours. 
                  Our optimized workflow saves you valuable development time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Quality Assured</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Every piece of code follows best practices and includes proper documentation,
                  error handling, and testing recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Four simple steps to transform your ideas into working code
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Describe Your Idea",
                description: "Tell us what you want to build in plain English",
                icon: "📝"
              },
              {
                step: "2", 
                title: "Review the Plan",
                description: "AI creates a detailed implementation strategy",
                icon: "🎯"
              },
              {
                step: "3",
                title: "Generate Code",
                description: "Watch as your idea becomes working Python code",
                icon: "💻"
              },
              {
                step: "4",
                title: "Iterate & Improve",
                description: "Request changes and enhancements easily",
                icon: "💬"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Projects Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5min</div>
              <div className="text-blue-100">Average Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who are already using CodeAI Pro to bring their ideas to life.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
            onClick={handleGetStarted}
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-6 w-6" />
                <span className="text-xl font-bold">CodeAI Pro</span>
              </div>
              <p className="text-slate-400">
                Transforming ideas into code with the power of AI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Help Center</li>
                <li>Community</li>
                <li>Status</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CodeAI Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
