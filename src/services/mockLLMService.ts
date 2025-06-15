
import { MockLLMResponse } from '@/types/workflow';

class MockLLMService {
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generatePlan(description: string): Promise<MockLLMResponse> {
    await this.delay(2000); // Simulate API call
    
    const plans: Record<string, string> = {
      'csv': `# Implementation Plan for CSV Data Analysis Script

## Step 1: Setup and Dependencies
- Import required libraries: pandas, matplotlib, seaborn
- Set up error handling for file operations

## Step 2: Data Loading and Validation
- Load CSV file using pandas
- Validate data integrity (check for missing values, data types)
- Display basic dataset information

## Step 3: Data Analysis
- Generate descriptive statistics
- Identify key patterns and trends
- Handle missing or anomalous data

## Step 4: Report Generation
- Create visualizations (charts, graphs)
- Generate summary statistics
- Export results to formatted report

## Step 5: Output and Cleanup
- Save processed data and visualizations
- Generate final summary report
- Clean up temporary files`,

      'scraper': `# Implementation Plan for Web Scraper

## Step 1: Setup Environment
- Import requests, BeautifulSoup, pandas
- Set up proper headers and session management
- Configure rate limiting and error handling

## Step 2: Target Analysis
- Analyze website structure
- Identify product price selectors
- Handle dynamic content and pagination

## Step 3: Data Extraction
- Implement scraping logic with proper error handling
- Extract product names, prices, and metadata
- Handle anti-scraping measures

## Step 4: Data Processing
- Clean and validate extracted data
- Structure data into organized format
- Handle price formatting and currency conversion

## Step 5: Storage and Export
- Save data to CSV/JSON format
- Implement data backup mechanisms
- Add logging for debugging`,

      'default': `# Implementation Plan

## Step 1: Requirements Analysis
- Parse the user requirements
- Identify key functionalities needed
- Determine appropriate libraries and tools

## Step 2: Core Logic Design
- Design main algorithm structure
- Plan data flow and processing steps
- Identify potential edge cases

## Step 3: Implementation
- Write core functionality
- Add error handling and validation
- Implement user interface (if needed)

## Step 4: Testing and Validation
- Test with sample data
- Validate outputs and edge cases
- Optimize performance if needed

## Step 5: Documentation and Cleanup
- Add comments and documentation
- Clean up code structure
- Prepare for deployment`
    };

    const key = Object.keys(plans).find(k => description.toLowerCase().includes(k)) || 'default';
    
    return {
      plan: plans[key]
    };
  }

  async generateCode(description: string, plan: string): Promise<MockLLMResponse> {
    await this.delay(3000); // Simulate API call
    
    const codes: Record<string, string> = {
      'csv': `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

def analyze_csv_data(file_path):
    """
    Analyzes CSV data and generates a comprehensive summary report.
    """
    try:
        # Load the CSV file
        print(f"Loading data from: {file_path}")
        df = pd.read_csv(file_path)
        
        # Basic information
        print("\\n" + "="*50)
        print("DATASET OVERVIEW")
        print("="*50)
        print(f"Shape: {df.shape[0]} rows, {df.shape[1]} columns")
        print(f"Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
        
        # Data types and missing values
        print("\\nData Types and Missing Values:")
        info_df = pd.DataFrame({
            'Column': df.columns,
            'Data Type': df.dtypes,
            'Missing Values': df.isnull().sum(),
            'Missing %': (df.isnull().sum() / len(df) * 100).round(2)
        })
        print(info_df.to_string(index=False))
        
        # Numerical columns analysis
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) > 0:
            print("\\n" + "="*50)
            print("NUMERICAL ANALYSIS")
            print("="*50)
            print(df[numeric_cols].describe())
        
        # Create visualizations
        if len(numeric_cols) > 0:
            plt.figure(figsize=(15, 10))
            
            # Correlation heatmap
            if len(numeric_cols) > 1:
                plt.subplot(2, 2, 1)
                correlation_matrix = df[numeric_cols].corr()
                sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
                plt.title('Correlation Heatmap')
            
            # Distribution plots
            for i, col in enumerate(numeric_cols[:3], 2):
                plt.subplot(2, 2, i)
                df[col].hist(bins=30, alpha=0.7)
                plt.title(f'Distribution of {col}')
                plt.xlabel(col)
                plt.ylabel('Frequency')
            
            plt.tight_layout()
            plt.savefig('data_analysis_report.png', dpi=300, bbox_inches='tight')
            plt.show()
        
        # Generate summary report
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        report = f"""
DATA ANALYSIS SUMMARY REPORT
Generated on: {timestamp}

Dataset Overview:
- File: {file_path}
- Rows: {df.shape[0]:,}
- Columns: {df.shape[1]}
- Memory Usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB

Data Quality:
- Total Missing Values: {df.isnull().sum().sum():,}
- Complete Rows: {df.dropna().shape[0]:,} ({df.dropna().shape[0]/df.shape[0]*100:.1f}%)

Key Insights:
- Numerical columns: {len(numeric_cols)}
- Categorical columns: {len(df.select_dtypes(include=['object']).columns)}
- Date columns: {len(df.select_dtypes(include=['datetime']).columns)}
"""
        
        # Save report
        with open('analysis_report.txt', 'w') as f:
            f.write(report)
        
        print("\\n" + "="*50)
        print("ANALYSIS COMPLETE")
        print("="*50)
        print("Files generated:")
        print("- analysis_report.txt")
        if len(numeric_cols) > 0:
            print("- data_analysis_report.png")
        
        return df
        
    except Exception as e:
        print(f"Error analyzing data: {str(e)}")
        return None

# Example usage
if __name__ == "__main__":
    # Replace with your CSV file path
    file_path = "sample_data.csv"
    
    # Create sample data if file doesn't exist
    if not os.path.exists(file_path):
        import numpy as np
        sample_data = pd.DataFrame({
            'sales': np.random.normal(1000, 200, 100),
            'profit': np.random.normal(150, 50, 100),
            'region': np.random.choice(['North', 'South', 'East', 'West'], 100),
            'product': np.random.choice(['A', 'B', 'C'], 100)
        })
        sample_data.to_csv(file_path, index=False)
        print(f"Created sample data file: {file_path}")
    
    # Run analysis
    result = analyze_csv_data(file_path)`,

      'default': `def main():
    """
    Main function implementing the requested functionality.
    """
    print("Starting the requested task...")
    
    # TODO: Implement the specific functionality based on requirements
    # This is a template that will be customized based on the user's request
    
    try:
        # Step 1: Setup and initialization
        print("Step 1: Initializing...")
        
        # Step 2: Core processing logic
        print("Step 2: Processing...")
        
        # Step 3: Output and results
        print("Step 3: Generating results...")
        result = "Task completed successfully!"
        
        print(f"Result: {result}")
        return result
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return None

if __name__ == "__main__":
    main()`
    };

    const key = Object.keys(codes).find(k => description.toLowerCase().includes(k)) || 'default';
    
    return {
      code: codes[key]
    };
  }

  async debugCode(code: string, errors: string[]): Promise<MockLLMResponse> {
    await this.delay(2000); // Simulate API call
    
    // Simple mock debugging - add try-catch and error handling
    const debuggedCode = code.replace(
      'def main():',
      `import sys
import traceback

def main():`
    ).replace(
      'except Exception as e:',
      `except Exception as e:
        print(f"Detailed error: {str(e)}")
        traceback.print_exc()`
    );
    
    return {
      code: debuggedCode
    };
  }

  async generateFollowUp(description: string, code: string): Promise<MockLLMResponse> {
    await this.delay(1500); // Simulate API call
    
    const explanations: Record<string, string> = {
      'csv': `This Python script provides a comprehensive CSV data analysis solution. It loads your data using pandas, performs exploratory data analysis, and generates both visual and text reports.

Key features implemented:
• Automatic data type detection and missing value analysis
• Statistical summaries for numerical columns
• Correlation analysis with heatmap visualization
• Distribution plots for key metrics
• Automated report generation with timestamps

The script is designed to be robust with proper error handling and creates output files for future reference.`,

      'default': `The generated Python script successfully implements the requested functionality with a clean, modular structure.

Key components:
• Main function with clear step-by-step execution
• Comprehensive error handling for robustness
• Detailed logging and progress feedback
• Modular design for easy extension and maintenance

The code follows Python best practices and includes proper documentation for maintainability.`
    };

    const questions: Record<string, string> = {
      'csv': `Great work! Your CSV analysis script is ready to use. Here are some ideas for extending this project:

🔍 Would you like to add:
• Interactive dashboard capabilities using Plotly or Streamlit?
• Automated anomaly detection and outlier identification?
• Machine learning predictions based on the data patterns?
• Email reporting functionality to send results automatically?

What specific aspect of data analysis would you like to explore next?`,

      'default': `Excellent! Your Python script is working perfectly. Here are some ways we could enhance it further:

🚀 Potential improvements:
• Add a graphical user interface (GUI) using tkinter or PyQt?
• Implement configuration file support for customizable settings?
• Add logging and monitoring capabilities?
• Create unit tests to ensure reliability?

What additional features or improvements would be most valuable for your use case?`
    };

    const key = Object.keys(explanations).find(k => description.toLowerCase().includes(k)) || 'default';
    
    return {
      explanation: explanations[key],
      followUpQuestion: questions[key]
    };
  }
}

export const mockLLMService = new MockLLMService();
