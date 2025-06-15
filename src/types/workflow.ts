
export type WorkflowStep = 'input' | 'plan' | 'code' | 'followup';

export interface CodingRequest {
  id: string;
  description: string;
  plan?: string;
  code?: string;
  output?: string;
  errors?: string[];
  status: 'pending' | 'planning' | 'coding' | 'executing' | 'completed' | 'error';
  createdAt: Date;
  debugAttempts?: number;
}

export interface MockLLMResponse {
  plan?: string;
  code?: string;
  explanation?: string;
  followUpQuestion?: string;
}
