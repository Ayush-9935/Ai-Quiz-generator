# AI Quiz Generator

An AI-powered full-stack application that generates multiple-choice quizzes from PDF files or text input using OpenAI's GPT models.

## Project Structure

- `backend/`: FastAPI application
- `frontend/`: React application with Vite and Tailwind CSS

## Prerequisites

- Python 3.9+
- Node.js 16+
- MongoDB (Running locally or on Atlas)
- OpenAI API Key

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure environment variables in `.env`:
    ```env
    MONGODB_URL=mongodb://localhost:27017
    DATABASE_NAME=quiz_generator
    SECRET_KEY=yoursecretkey
    OPENAI_API_KEY=your_openai_api_key
    ```
5.  Start the backend server:
    ```bash
    uvicorn app.main:app --reload
    ```

### 2. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Features

- [x] PDF Upload and Text Extraction
- [x] AI-Powered MCQ Generation (OpenAI)
- [x] Timed Quiz Interface
- [x] Score Calculation and Result Visualization
- [x] Quiz History Tracking
- [x] PDF Export of Results
- [x] Dark Mode UI
