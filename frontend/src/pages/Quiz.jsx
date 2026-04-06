import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Quiz = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(state?.quiz || null);
  const [loading, setLoading] = useState(!state?.quiz);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!quiz && id) {
      const fetchQuiz = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://ai-quiz-generator-0ilf.onrender.com/api/quiz/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const rawQuiz = response.data;
          // Frontend Normalization: Ensure lowercase keys
          const normalizedQuestions = (rawQuiz.questions || rawQuiz.Questions || []).map(q => ({
            question: q.question || q.Question || "No question text",
            options: q.options || q.Options || [],
            answer: q.answer || q.Answer || ""
          }));
          setQuiz({ ...rawQuiz, questions: normalizedQuestions });
          setTimeLeft(normalizedQuestions.length * 60);
        } catch (err) {
          console.error(err);
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    } else if (quiz && timeLeft === null) {
      setTimeLeft(quiz.questions.length * 60);
      setLoading(false);
    }
  }, [id, quiz, navigate, timeLeft]);

  const handleSubmit = useCallback(async () => {
    if (!quiz) return;
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.answer) score++;
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/quiz/submit-result', {
        quiz_id: quiz.id,
        score,
        total_questions: quiz.questions.length
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      navigate('/result', { state: { score, total: quiz.questions.length, quiz, userAnswers: answers } });
    } catch (err) {
      console.error(err);
      navigate('/result', { state: { score, total: quiz.questions.length, quiz, userAnswers: answers } });
    }
  }, [quiz, answers, navigate]);

  useEffect(() => {
    if (timeLeft === 0 && !loading && quiz) {
      handleSubmit();
      return;
    }
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, quiz, handleSubmit]);

  if (loading || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-slate-500">Preparing your quiz...</p>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
      <div className="max-w-2xl w-full" style={{ margin: '0 auto', paddingTop: '3.5rem', paddingBottom: '5rem' }}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">
              Question {currentQuestion + 1} <span className="text-slate-300 mx-1">/</span> {quiz.questions.length}
            </span>
            <div style={{ width: '140px', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                style={{ 
                  height: '100%', 
                  backgroundColor: 'var(--primary-600)',
                  boxShadow: '0 0 10px rgba(79, 70, 229, 0.4)'
                }} 
              />
            </div>
          </div>
          
          <div className={`timer-badge ${timeLeft < 60 ? 'warning' : ''}`} style={{ padding: '0.75rem 1.5rem', borderRadius: '1.25rem', fontWeight: '900', fontSize: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
            <Clock className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary-600'}`} />
            <span style={{ fontFeatureSettings: '"tnum"' }}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card shadow-2xl" 
            style={{ 
                padding: '2.5rem', 
                borderRadius: '2.5rem', 
                border: '1px solid var(--border-color)', 
                minHeight: '480px', 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: 'var(--bg-card)'
            }}
          >
            <h2 className="text-3xl font-black mb-12 leading-[1.3]" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{currentQ.question}</h2>
            
            <div className="grid grid-cols-1 gap-5 mb-12" style={{ flexGrow: 1 }}>
              {currentQ.options && currentQ.options.length > 0 ? (
                currentQ.options.map((option, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: option }))}
                      className={`option-button ${answers[currentQuestion] === option ? 'selected' : ''}`}
                      style={{ 
                          padding: '1.5rem 1.75rem', 
                          borderRadius: '1.5rem', 
                          border: '1px solid var(--border-color)',
                          backgroundColor: answers[currentQuestion] === option ? 'var(--bg-selected)' : 'transparent',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <span className="text-lg font-bold" style={{ color: answers[currentQuestion] === option ? 'var(--text-selected)' : 'var(--text-main)' }}>{option}</span>
                    <div className="radio-circle" style={{ width: '1.75rem', height: '1.75rem', border: '2px solid var(--border-color)', backgroundColor: answers[currentQuestion] === option ? 'var(--primary-600)' : 'transparent' }}>
                      {answers[currentQuestion] === option && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-10 bg-amber-50/50 rounded-3xl border border-amber-100">
                  <AlertCircle className="w-10 h-10 text-amber-500 mb-4" />
                  <p className="text-amber-900 font-bold text-lg">Format Error</p>
                  <p className="text-amber-700 text-sm font-medium">Options were not generated correctly for this question.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-10 mt-auto" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                style={{ 
                    visibility: currentQuestion === 0 ? 'hidden' : 'visible', 
                    background: 'none', 
                    border: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    cursor: 'pointer', 
                    fontWeight: '800', 
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    trackingWidest: '0.1em'
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              {currentQuestion === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="btn-primary"
                  style={{ padding: '1rem 3rem', borderRadius: '1.5rem', fontWeight: '900', fontSize: '1.125rem' }}
                >
                  <CheckCircle2 className="w-6 h-6 mr-3" />
                  <span>Submit Results</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                  className="btn-primary"
                  style={{ padding: '1rem 3rem', borderRadius: '1.5rem', fontWeight: '900', fontSize: '1.125rem' }}
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-6 h-6 ml-3" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
  );
};

export default Quiz;
