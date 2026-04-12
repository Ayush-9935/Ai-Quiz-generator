import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, BrainCircuit } from 'lucide-react';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', email); // FastAPI OAuth2 uses 'username'
      formData.append('password', password);

      const response = await axios.post('https://ai-quiz-generator-0ilf.onrender.com/api/auth/login', formData);
      sessionStorage.setItem('token', response.data.access_token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout" style={{ background: 'var(--bg-main)' }}>
      <div className="auth-card" style={{ maxWidth: '440px', padding: '3.5rem 2.5rem', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>
        <div className="auth-brand" style={{ marginBottom: '2.5rem' }}>
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-200 mb-6 mx-auto">
            <BrainCircuit className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Welcome back
          </h1>
          <p className="text-slate-500 font-medium">Continue your learning journey with AI.</p>
        </div>

        {error && <div className="error-alert" style={{ borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem', fontWeight: '600' }}>{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div style={{ textAlign: 'left' }}>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 translate-y-n1-2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                style={{ paddingLeft: '3rem', height: '3.5rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: '500' }}
                required
              />
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 translate-y-n1-2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                style={{ paddingLeft: '3rem', height: '3.5rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: '500' }}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary" style={{ height: '3.5rem', fontSize: '1.125rem', marginTop: '1rem' }}>
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-sm font-semibold" style={{ marginTop: '2.5rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-600)', paddingLeft: '0.25rem', textDecoration: 'none' }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
