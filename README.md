# AI Quiz Generator

An intelligent quiz generation platform that leverages AI to create dynamic quizzes from PDF documents. Users can authenticate, generate quizzes, track their progress, and view detailed results with downloadable reports.

## 🌟 Features

- **AI-Powered Quiz Generation** - Automatically generate quizzes from PDF documents using OpenAI and LangChain
- **User Authentication** - Secure JWT-based authentication with password hashing
- **Quiz Management** - Create, take, and manage multiple quizzes
- **Progress Tracking** - View quiz history and performance analytics
- **Result Reports** - Generate and download PDF reports of quiz results
- **Responsive Design** - Modern, animated UI built with React and Framer Motion
- **Real-time Feedback** - Instant quiz evaluation and detailed results

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library
- **jsPDF** - PDF generation
- **date-fns** - Date utilities

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database with Motor for async operations
- **OpenAI API** - AI model for quiz generation
- **LangChain** - LLM integration and prompt management
- **PyJWT** - JWT authentication
- **Passlib + Argon2** - Secure password hashing
- **PyPDF2** - PDF processing
- **Pydantic** - Data validation

## 📋 Prerequisites

Before you begin, ensure you have:
- Python 3.8+
- Node.js 16+
- MongoDB instance (local or cloud)
- OpenAI API key

## 🚀 Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
