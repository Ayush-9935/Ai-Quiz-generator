import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, ArrowRight, Calendar, BrainCircuit, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const History = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://ai-quiz-generator-0ilf.onrender.com/api/quiz/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setQuizzes(response.data);
      } catch (err) {
        setError('Failed to load quiz history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl" style={{ margin: '0 auto' }}>
      <div className="flex items-center gap-3 mb-8">
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
            <HistoryIcon className="w-6 h-6 text-primary-600" />
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>My Quiz History</h1>
      </div>

      {quizzes.length === 0 ? (
        <div className="card text-center py-12" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <BrainCircuit className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>No quizzes yet</h3>
          <p className="mb-6 font-semibold" style={{ color: 'var(--text-muted)' }}>Generate your first quiz to see it here!</p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block' }}>Go to Dashboard</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md-grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card group" style={{ cursor: 'default', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-extrabold text-lg line-clamp-2" style={{ color: 'var(--text-main)' }}>{quiz.title || "Subject Assesment"}</h3>
                <span className={`badge badge-${quiz.difficulty}`}>
                  {quiz.difficulty}
                </span>
              </div>
              
              <div className="flex items-center text-xs font-bold mb-6" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                <Calendar className="w-4 h-4" style={{ marginRight: '0.5rem' }} />
                <span>{new Date(quiz.created_at || Date.now()).toLocaleDateString()}</span>
                <span style={{ margin: '0 0.5rem' }}>•</span>
                <span>{quiz.questions.length} Questions</span>
              </div>

              <Link 
                to={`/quiz/${quiz.id}`} 
                state={{ quiz }}
                className="w-full btn-outline gap-2"
              >
                <span>Retake Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
