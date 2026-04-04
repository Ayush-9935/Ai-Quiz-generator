import React from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { Trophy, Download, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  if (!state) {
    return <Navigate to="/" />;
  }

  const { score, total, quiz, userAnswers } = state;
  const percentage = (score / total) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Quiz Results: ${quiz.title}`, 20, 20);
    doc.setFontSize(14);
    doc.text(`Score: ${score} / ${total} (${percentage.toFixed(1)}%)`, 20, 30);
    
    const tableData = quiz.questions.map((q, idx) => [
      q.question,
      userAnswers[idx] || 'No Answer',
      q.answer
    ]);

    autoTable(doc, {
      head: [['Question', 'Your Answer', 'Correct Answer']],
      body: tableData,
      startY: 40,
    });

    doc.save(`${quiz.title.replace(/\s+/g, '_')}_result.pdf`);
  };

  return (
    <div className="max-w-3xl w-full" style={{ margin: '0 auto', paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <div className="card shadow-2xl overflow-hidden mb-8" style={{ border: 'none', borderRadius: '2rem', backgroundColor: 'var(--bg-card)' }}>
        <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '3rem 2rem', textAlign: 'center', color: 'white' }}>
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <Trophy className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black mb-2 tracking-tight" style={{ letterSpacing: '-0.04em' }}>Performance Summary</h1>
          <p className="text-indigo-100 text-sm font-semibold mb-8 opacity-90">Outstanding effort!</p>
          
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <p className="text-4xl font-black mb-1 tracking-tighter">{score}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-200">Correct</p>
            </div>
            <div style={{ width: '1px', height: '3rem', backgroundColor: 'rgba(255,255,255,0.15)' }}></div>
            <div className="text-center">
              <p className="text-4xl font-black mb-1 tracking-tighter">{total}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-200">Questions</p>
            </div>
            <div style={{ width: '1px', height: '3rem', backgroundColor: 'rgba(255,255,255,0.15)' }}></div>
            <div className="text-center">
              <p className="text-4xl font-black mb-1 tracking-tighter">{percentage.toFixed(0)}%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-200">Accuracy</p>
            </div>
          </div>
        </div>

        <div className="p-10 bg-white dark:bg-slate-900 flex flex-col md-flex-row gap-6 items-center justify-center" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={downloadPDF} 
            className="btn-outline w-full md-w-auto"
            style={{ padding: '1.25rem 2.5rem', borderRadius: '1.5rem', gap: '1rem', fontWeight: '900', fontSize: '1rem' }}
          >
            <Download className="w-6 h-6 text-primary-600" />
            <span>Download PDF Report</span>
          </button>
          <Link 
            to="/" 
            className="btn-primary w-full md-w-auto"
            style={{ padding: '1.25rem 3rem', borderRadius: '1.5rem', gap: '1rem', fontWeight: '900', fontSize: '1rem' }}
          >
            <Home className="w-6 h-6" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>In-depth Analysis</h2>
        </div>
        
        <div className="space-y-8">
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="card shadow-sm" style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-start justify-between gap-8 mb-8">
                <h3 className="text-xl font-black text-slate-800 leading-tight" style={{ color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  <span className="text-primary-600 font-black mr-3 opacity-50">{idx + 1}.</span>
                  {q.question}
                </h3>
                { (userAnswers[idx] || userAnswers[idx.toString()]) === q.answer ? (
                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                     <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                   </div>
                ) : (
                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                     <XCircle className="w-6 h-6 text-red-600" />
                   </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md-grid-cols-2 gap-5">
                <div 
                  className="p-6 rounded-2xl border-2 transition-all" 
                  style={{ 
                    backgroundColor: (userAnswers[idx] || userAnswers[idx.toString()]) === q.answer ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                    borderColor: (userAnswers[idx] || userAnswers[idx.toString()]) === q.answer ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--text-muted)' }}>Your selection</p>
                  <p className="font-black text-lg" style={{ color: (userAnswers[idx] || userAnswers[idx.toString()]) === q.answer ? '#10b981' : '#f87171' }}>
                    {userAnswers[idx] || userAnswers[idx.toString()] || 'Unanswered'}
                  </p>
                </div>

                {(userAnswers[idx] || userAnswers[idx.toString()]) !== q.answer && (
                  <div className="p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50/10" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 opacity-70" style={{ color: '#10b981' }}>Correct answer</p>
                    <p className="font-black text-lg text-emerald-700" style={{ color: '#059669' }}>{q.answer}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Result;
