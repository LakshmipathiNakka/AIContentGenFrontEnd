
# MCQ Generator Application

A cutting-edge web application for generating and managing custom multiple choice questions (MCQs) with a focus on programming and technical subjects.

## Features

- **Dynamic Question Generation**: Create custom MCQs for various programming languages and topics.
- **Multiple Question Types**: Support for General MCQs, Coding Analysis MCQs, and Coding Questions.
- **AI-Powered**: Leverages AI to generate intelligent questions based on your parameters.
- **Customizable Parameters**: Control question count, difficulty level, topics, and more.
- **Interactive Dashboard**: Visualize your question library and usage statistics.
- **Export Functionality**: Export questions to Google Sheets format with all metadata included.
- **Responsive Design**: Seamless experience across all devices with animated transitions.
- **User Authentication**: Secure login system to protect your content.

## Technical Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Component Library**: shadcn/ui components
- **State Management**: React Context API and React Query
- **Routing**: React Router
- **Animations**: Custom CSS animations and transitions
- **Icons**: Lucide React icons

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/             # Basic UI components (from shadcn/ui)
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and shared code
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── GenerateQuestions.tsx
│   ├── Settings.tsx
│   └── Login.tsx
├── App.tsx             # Main application component
├── index.css           # Global styles
└── main.tsx            # Entry point
```

## Getting Started

### Prerequisites

- Node.js v18+ and npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mcq-generator.git
cd mcq-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Authentication

For demo purposes, use:
- Username: `Saiteja`
- Password: `Saiteja@2025`

## Usage

1. **Login**: Use the provided credentials to access the application.
2. **Dashboard**: View statistics about your generated questions.
3. **Generate Questions**: 
   - Select question type (General MCQs, Coding Analysis MCQs, Coding Questions)
   - Configure parameters for question generation
   - Generate a customized set of questions
   - Preview and edit generated questions
   - Export to Google Sheets format
4. **Settings**: Configure application settings and preferences.

## API Integration

The application is designed to integrate with a backend API for question generation and management. The API endpoints are configurable in the settings page.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to the shadcn/ui team for providing excellent components
- Tailwind CSS for the utility-first CSS framework
- React team for the wonderful frontend library

---


