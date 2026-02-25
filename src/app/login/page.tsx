'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/shared/lib/i18n';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (tab === 0) {
        await signIn(email, password);
        router.push('/expenses');
      } else {
        if (password !== confirmPassword) {
          setError(t('login.passwordsMismatch'));
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError(t('login.passwordTooShort'));
          setLoading(false);
          return;
        }
        await signUp(email, password);
        setSuccess(t('login.accountCreated'));
        setTab(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[var(--color-primary)] border-2 border-[var(--color-primary)] inline-flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_var(--color-border)] mb-4">
            💰
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-1 tracking-tight font-[var(--font-brand)] uppercase">
            <span className="animate-blink-char">อ</span>
            <span className="text-[var(--color-primary)]">อม</span>
            เก่ง
          </h1>
          <p className="text-[var(--color-text-secondary)] font-medium">
            {t('app.tagline')}
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[6px_6px_0px_0px_var(--color-primary)] p-8">
          {/* Tabs */}
          <div className="flex border-2 border-[var(--color-border)] mb-6">
             <button
                type="button"
                onClick={() => { setTab(0); setError(null); setSuccess(null); }}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                   tab === 0 
                   ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]' 
                   : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
                }`}
             >
               {t('login.logIn')}
             </button>
             <button
                type="button"
                onClick={() => { setTab(1); setError(null); setSuccess(null); }}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider transition-all border-l-2 border-[var(--color-border)] ${
                   tab === 1 
                   ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]' 
                   : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
                }`}
             >
               {t('login.signUp')}
             </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)] flex items-start gap-3 text-[var(--color-accent)] text-sm font-medium animate-fade-in">
              <X size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] flex items-start gap-3 text-[var(--color-primary)] text-sm font-medium animate-fade-in">
              <Check size={18} className="mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1.5 ml-1">{t('login.email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="brutal-input w-full px-4 py-3"
                placeholder="you@example.com"
              />
            </div>

            <div>
               <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1.5 ml-1">{t('login.password')}</label>
               <div className="relative">
                 <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="brutal-input w-full px-4 py-3 pr-12"
                    placeholder="••••••••"
                 />
                 <button 
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] p-1 transition-colors"
                 >
                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
               </div>
            </div>

            {tab === 1 && (
               <div className="animate-fade-in">
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1.5 ml-1">{t('login.confirmPassword')}</label>
                  <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="brutal-input w-full px-4 py-3"
                      placeholder="••••••••"
                  />
               </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="brutal-btn w-full py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> 
                  {t('login.pleaseWait')}
                </>
              ) : tab === 0 ? t('login.logIn') : t('login.createAccount')}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs font-semibold text-[var(--color-text-muted)] mt-6">
          {t('app.footer')}
        </p>
      </div>
    </div>
  );
}
