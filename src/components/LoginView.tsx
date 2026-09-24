import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, Key, CheckCircle2, ArrowRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Логинди жазыңыз');
      return;
    }
    const success = login(username, password);
    if (!success) {
      setError('Логин же сыр сөз туура эмес');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl relative z-10 text-slate-900">
        {/* Top Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-emerald-500/20 mb-4">
            🏭
          </div>
          <h1 className="text-2xl font-black tracking-wider uppercase text-slate-900">
            КИРҮҮ
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Тигүү цехтеринин карыз жана төлөм системасы
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Login Input matching [ admin ] */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Логин:
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Input matching [ ******** ] */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Сыр сөз:
            </label>
            <div className="relative">
              <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Quick Demo Hint */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Демо логин: <strong className="text-emerald-700 font-mono">admin</strong></span>
            <span>Сыр сөз: <strong className="text-emerald-700 font-mono">123456</strong></span>
          </div>

          {/* Submit button matching wireframe [ КИРҮҮ ] */}
          <div className="pt-2">
            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm uppercase tracking-widest transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>[ КИРҮҮ ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-4">
          <p className="text-[11px] text-slate-400">
            Бардык маалыматтар браузериңизде коопсуз сакталат
          </p>
        </div>
      </div>
    </div>
  );
};
