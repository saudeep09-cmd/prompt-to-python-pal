
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodingRequest } from '@/types/workflow';
import { mockLLMService } from '@/services/mockLLMService';
import { mockExecutionService } from '@/services/mockExecutionService';
import { ArrowLeft, ArrowRight, Play, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

interface CodeDisplayProps {
  request: CodingRequest;
  onComplete: () => void;
  onBack: () => void;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ 
  request, 
  onComplete, 
  onBack 
}) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugAttempts, setDebugAttempts] = useState(0);
  const [executionStatus, setExecutionStatus] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    generateCode();
  }, []);

  const generateCode = async () => {
    setIsGenerating(true);
    const response = await mockLLMService.generateCode(request.description, request.plan || '');
    setCode(response.code || '');
    setIsGenerating(false);
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setExecutionStatus('pending');
    
    const result = await mockExecutionService.executeCode(code);
    
    if (result.success) {
      setOutput(result.output || '');
      setErrors([]);
      setExecutionStatus('success');
    } else {
      setErrors(result.errors || []);
      setExecutionStatus('error');
      setOutput('');
    }
    
    setIsExecuting(false);
  };

  const debugCode = async () => {
    if (debugAttempts >= 3) return;
    
    setIsDebugging(true);
    setDebugAttempts(prev => prev + 1);
    
    const debugResponse = await mockLLMService.debugCode(code, errors);
    setCode(debugResponse.code || code);
    
    setIsDebugging(false);
    
    // Auto-execute after debugging
    setTimeout(() => {
      executeCode();
    }, 1000);
  };

  const handleComplete = () => {
    if (executionStatus === 'success') {
      onComplete();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Generated Code
          </h2>
          <p className="text-slate-600">
            Review the generated Python code and execute it to test the implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Code Panel */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Python Code</CardTitle>
              <div className="flex space-x-2">
                {!isGenerating && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={executeCode}
                    disabled={isExecuting || isDebugging}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isExecuting ? 'Running...' : 'Execute'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600">Generating code...</p>
                  </div>
                </div>
              ) : (
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono h-64 overflow-y-auto">
                  {code}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Output/Error Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                {executionStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
                {executionStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600 mr-2" />}
                Execution Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isExecuting ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600">Executing code...</p>
                  </div>
                </div>
              ) : executionStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 h-64 overflow-y-auto">
                  <h4 className="font-medium text-green-800 mb-2">Output:</h4>
                  <pre className="text-green-700 text-sm whitespace-pre-wrap">{output}</pre>
                </div>
              ) : executionStatus === 'error' ? (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                    {errors.map((error, index) => (
                      <pre key={index} className="text-red-700 text-sm whitespace-pre-wrap mb-2">
                        {error}
                      </pre>
                    ))}
                  </div>
                  
                  {debugAttempts < 3 && (
                    <Button
                      variant="outline"
                      onClick={debugCode}
                      disabled={isDebugging}
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {isDebugging ? 'Debugging...' : `Auto-Debug (${debugAttempts}/3 attempts)`}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  Click "Execute" to run the code
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Debug Log */}
        {debugAttempts > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Debug Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  Debug attempts: {debugAttempts}/3
                  {debugAttempts >= 3 && " - Maximum debug attempts reached. Manual review may be needed."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plan
          </Button>
          
          <Button 
            onClick={handleComplete}
            disabled={executionStatus !== 'success'}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete & Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
