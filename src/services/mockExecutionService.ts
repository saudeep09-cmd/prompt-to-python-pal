
interface ExecutionResult {
  success: boolean;
  output?: string;
  errors?: string[];
}

class MockExecutionService {
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async executeCode(code: string): Promise<ExecutionResult> {
    await this.delay(2000); // Simulate execution time
    
    // Mock execution logic based on code content
    const hasMainFunction = code.includes('def main():');
    const hasImports = code.includes('import ');
    const hasErrorHandling = code.includes('try:') && code.includes('except');
    
    // Simulate occasional errors for demonstration
    const shouldSucceed = Math.random() > 0.3; // 70% success rate
    
    if (!shouldSucceed && !hasErrorHandling) {
      return {
        success: false,
        errors: [
          "ModuleNotFoundError: No module named 'pandas'",
          "Please ensure all required dependencies are installed.",
          "Run: pip install pandas matplotlib seaborn"
        ]
      };
    }
    
    if (!hasMainFunction) {
      return {
        success: false,
        errors: [
          "NameError: name 'main' is not defined",
          "The script should contain a main() function for execution."
        ]
      };
    }
    
    // Success case - generate realistic output
    const outputs = {
      csv: `Loading data from: sample_data.csv

==================================================
DATASET OVERVIEW
==================================================
Shape: 100 rows, 4 columns
Memory usage: 0.01 MB

Data Types and Missing Values:
Column     Data Type    Missing Values    Missing %
sales      float64      0                 0.00
profit     float64      0                 0.00
region     object       0                 0.00
product    object       0                 0.00

==================================================
NUMERICAL ANALYSIS
==================================================
           sales      profit
count  100.000000  100.000000
mean   999.234567  149.876543
std    201.345678   49.876543
min    567.891234   45.678901
25%    834.567890  115.432109
50%    998.765432  150.123456
75%   1165.432109  184.567890
max   1456.789012  267.890123

==================================================
ANALYSIS COMPLETE
==================================================
Files generated:
- analysis_report.txt
- data_analysis_report.png

Result: Task completed successfully!`,

      default: `Starting the requested task...
Step 1: Initializing...
Step 2: Processing...
Step 3: Generating results...
Result: Task completed successfully!`
    };
    
    const key = Object.keys(outputs).find(k => code.toLowerCase().includes(k)) || 'default';
    
    return {
      success: true,
      output: outputs[key as keyof typeof outputs]
    };
  }
}

export const mockExecutionService = new MockExecutionService();
