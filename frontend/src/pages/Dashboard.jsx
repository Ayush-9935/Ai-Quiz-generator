import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, Play } from 'lucide-react';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (textContent) formData.append('text_content', textContent);
    formData.append('num_questions', numQuestions);
    formData.append('difficulty', difficulty);

    try {
      const response = await axios.post('http://localhost:8000/api/quiz/generate', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate(`/quiz/${response.data.id}`, { state: { quiz: response.data } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem', paddingLeft: '1rem', paddingRight: '1rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.025em', marginBottom: '0.5rem', color: 'var(--text-main)' }}>AI Quiz Workspace</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Draft your quiz from PDF or plain text sources below.</p>
      </div>

      {error && <div style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', borderRadius: '0.75rem', fontWeight: 700, textAlign: 'center', width: '100%', marginBottom: '1.5rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        
        {/* Top Input Row (PDF and Paste) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
          
          {/* PDF Card */}
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <Upload style={{ width: '1rem', height: '1rem', color: 'var(--primary-600)' }} />
              <h3 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, color: 'var(--text-main)' }}>PDF SOURCE</h3>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: '0.75rem', minHeight: '160px', backgroundColor: 'transparent' }}>
              <input type="file" id="file-upload" style={{ display: 'none' }} accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
              
              {file ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%' }}>
                   <span style={{ fontSize: '0.875rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', textAlign: 'center', color: 'var(--text-main)' }}>{file.name}</span>
                   <button onClick={() => setFile(null)} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', transition: 'color 0.2s', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Remove file</button>
                </div>
              ) : (
                <label htmlFor="file-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', cursor: 'pointer', height: '100%' }}>
                  <Upload style={{ width: '1.25rem', height: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-main)' }} />
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>Upload PDF</p>
                </label>
              )}
            </div>
          </div>

          {/* Text Card */}
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <FileText style={{ width: '1rem', height: '1rem', color: 'var(--primary-600)' }} />
              <h3 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, color: 'var(--text-main)' }}>PASTE CONTENT</h3>
            </div>

            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Input educational material here..."
              style={{ flex: 1, width: '100%', minHeight: '160px', outline: 'none', transition: 'all 0.2s', fontSize: '0.8125rem', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1rem', resize: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}
              disabled={!!file}
            />
          </div>
        </div>

        {/* Bottom Bar Options Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '1rem', width: '100%', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', marginTop: '0.5rem', boxSizing: 'border-box' }}>
          
          {/* Quantity Block */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>QUANTITY</label>
            <select 
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', outline: 'none', fontWeight: 900, fontSize: '0.875rem', color: 'var(--text-main)', height: '3.25rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)', padding: '0 1.25rem', appearance: 'none', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
            >
              {[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n} Questions</option>)}
            </select>
          </div>

          {/* Difficulty Block */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>DIFFICULTY</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '3.25rem', border: '1px solid transparent' }}>
              <button
                onClick={() => setDifficulty('easy')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8125rem', borderRadius: '0.5rem', transition: 'all 0.2s', height: '100%', outline: 'none', border: 'none', cursor: 'pointer', backgroundColor: difficulty === 'easy' ? 'var(--primary-50)' : 'transparent', color: difficulty === 'easy' ? 'var(--primary-600)' : 'var(--text-muted)' }}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8125rem', borderRadius: '0.5rem', transition: 'all 0.2s', height: '100%', outline: 'none', border: 'none', cursor: 'pointer', backgroundColor: difficulty === 'medium' ? 'var(--primary-50)' : 'transparent', color: difficulty === 'medium' ? 'var(--primary-600)' : 'var(--text-muted)' }}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8125rem', borderRadius: '0.5rem', transition: 'all 0.2s', height: '100%', outline: 'none', border: 'none', cursor: 'pointer', backgroundColor: difficulty === 'hard' ? 'var(--primary-50)' : 'transparent', color: difficulty === 'hard' ? 'var(--primary-600)' : 'var(--text-muted)' }}
              >
                Hard
              </button>
            </div>
          </div>

          {/* Submit Action Block */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <button
              onClick={handleGenerate}
              disabled={loading || (!file && !textContent)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s', height: '3.25rem', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: 900, color: '#ffffff', border: 'none', cursor: (loading || (!file && !textContent)) ? 'not-allowed' : 'pointer', backgroundColor: 'var(--primary-400)', opacity: (loading || (!file && !textContent)) ? 0.6 : 1, marginTop: '1.75rem', boxShadow: '0 4px 6px -1px rgba(129, 140, 248, 0.3)' }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : (
                <>
                  <Play style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', fill: 'currentColor' }} />
                  Start AI Generator
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
