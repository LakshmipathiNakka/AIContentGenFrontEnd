
# Question Generator

## Overview
This application is a dynamic question generator designed for educators, trainers, and content creators to easily create multiple choice questions (MCQs) and coding-related assessment questions. The application supports generating different types of questions including general MCQs, coding analysis questions, and technical coding questions with customizable parameters.

## Features

### Question Generation
- **Multiple Question Types**: Generate general MCQs, coding analysis questions, or coding questions
- **Customizable Parameters**: Set subject, number of questions, difficulty level, and topics
- **Dynamic Input Fields**: Add multiple question sets with different parameters in a single generation
- **Prompt Preview and Editing**: Review and edit the prompt that will be sent to the AI before generation

### Dashboard
- **Usage Statistics**: Track number of questions generated, subjects covered, and other metrics
- **Recent Activity**: View history of generation and editing actions
- **Distribution Analysis**: Visualize breakdown of questions by language and difficulty level

### Settings
- **API Configuration**: Configure API keys, endpoints, and model parameters
- **Model Parameters**: Adjust generation settings like max tokens and temperature
- **Export Settings**: Choose between different export formats (JSON, CSV, ZIP)
- **Appearance Settings**: Customize theme, colors, and font sizes

### Question Management
- **Edit Questions**: Modify generated questions to fine-tune them
- **Delete Questions**: Remove unwanted questions from generated sets
- **Export to Google Sheets**: Download questions in a format compatible with Google Sheets

## Technology Stack
- **Frontend**: React with TypeScript
- **Styling**: Custom CSS with animations and transitions
- **State Management**: React Hooks for local state
- **Routing**: React Router for navigation
- **HTTP Client**: Fetch API for backend communication

## Architecture

### Frontend Components
- **NavBar**: Navigation component with responsive design
- **Dashboard**: Main landing page with statistics and activity tracking
- **GenerateQuestions**: Core functionality for generating questions
- **Settings**: Configuration page for app customization
- **DynamicInputs**: Reusable component for adding/removing input fields
- **AnimatedTextarea**: Text area with typing animation effect
- **GenerationProgress**: Progress indicator for question generation
- **QuestionCard**: Display component for generated questions

### Backend Integration
The application connects to a backend service that processes question generation requests using AI models. The backend handles:

1. Processing input parameters from the frontend
2. Formatting prompts for the AI model
3. Processing AI responses into structured question formats
4. Returning formatted questions to the frontend

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- NPM or Yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/question-generator.git
cd question-generator
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Generating Questions
1. Navigate to "Generate Questions" page
2. Select question type (General MCQs, Coding Analysis MCQs, Coding Questions)
3. Enter subject, number of questions, topic, difficulty level, and tags
4. Click "Generate Prompt" to preview the AI prompt
5. Click "Generate Questions" to create questions
6. Once generated, view, edit, or download the questions

### Customizing Settings
1. Navigate to "Settings" page
2. Configure API connection details
3. Adjust model parameters to control question generation
4. Choose export format preferences
5. Customize application appearance

## Future Enhancements
- **User Authentication**: Multi-user support with personal question libraries
- **Question Templates**: Save and reuse common question templates
- **Batch Processing**: Schedule and process large question generation tasks
- **Advanced Analytics**: Deeper insights into question quality and performance
- **Export Formats**: Additional export options including PDF and LMS-compatible formats

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- OpenAI for providing the AI models used in question generation
- React team for the frontend library
- All contributors who have helped improve this application
