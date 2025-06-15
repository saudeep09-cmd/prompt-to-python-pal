import { GoogleGenerativeAI } from '@google/generative-ai';
import { MockLLMResponse } from '@/types/workflow';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = 'AIzaSyDqKO0JciI4Obgb6Eh50Ax4s1kJhCv51rE';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generatePlan(description: string): Promise<MockLLMResponse> {
    try {
      const prompt = `Create a detailed implementation plan for the following coding request:
"${description}"

Format your response as a step-by-step plan with clear sections:
## Step 1: [Title]
- [Details]

## Step 2: [Title]
- [Details]

And so on...`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const plan = response.text();

      return { plan };
    } catch (error) {
      console.error('Error generating plan:', error);
      throw error;
    }
  }

  async generateCode(description: string, plan: string): Promise<MockLLMResponse> {
    try {
      const prompt = `Based on this plan:
"${plan}"

Generate Python code that implements the following request:
"${description}"

Requirements:
- Write complete, working Python code
- Include proper error handling
- Add comments for clarity
- Make sure the code is executable
- Include a main() function if appropriate`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const code = response.text();

      return { code };
    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  }

  async debugCode(code: string, errors: string[]): Promise<MockLLMResponse> {
    try {
      const prompt = `Debug this Python code that has the following errors:
Errors: ${errors.join(', ')}

Code:
\`\`\`python
${code}
\`\`\`

Provide the corrected code with fixes for the errors:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const debuggedCode = response.text();

      return { code: debuggedCode };
    } catch (error) {
      console.error('Error debugging code:', error);
      throw error;
    }
  }

  async generateFollowUp(description: string, code: string): Promise<MockLLMResponse> {
    try {
      const explanationPrompt = `Explain this Python code in simple terms:
Original request: "${description}"

Code:
\`\`\`python
${code}
\`\`\`

Provide a clear explanation of what the code does and its key features.`;

      const questionPrompt = `Based on this coding project:
Request: "${description}"

Suggest 3-4 follow-up questions or improvements that would enhance this project. Format as a friendly, engaging message.`;

      const [explanationResult, questionResult] = await Promise.all([
        this.model.generateContent(explanationPrompt),
        this.model.generateContent(questionPrompt)
      ]);

      const explanation = (await explanationResult.response).text();
      const followUpQuestion = (await questionResult.response).text();

      return { explanation, followUpQuestion };
    } catch (error) {
      console.error('Error generating follow-up:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
