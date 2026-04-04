import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, BrainCircuit } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:8000/api/auth/signup', {
        username,
        email,
        password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
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
            Create Account
          </h1>
          <p className="text-slate-500 font-medium">Join 10,000+ students mastering subjects with AI.</p>
        </div>

        {error && <div className="error-alert" style={{ borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem', fontWeight: '600' }}>{error}</div>}

        <form onSubmit={handleRegister} className="space-y-5">
           <div style={{ textAlign: 'left' }}>
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 translate-y-n1-2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="your name"
                style={{ paddingLeft: '3rem', height: '3.5rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: '500' }}
                required
              />
            </div>
          </div>

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
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Get Started'}
          </button>
        </form>

        <p className="text-sm font-semibold" style={{ marginTop: '2.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-600)', paddingLeft: '0.25rem', textDecoration: 'none' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
