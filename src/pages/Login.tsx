import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Printer3DAnimation from '../components/ui/Printer3DAnimation';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthRedirect();

  // Se già loggato, redirect automatico
  useEffect(() => {
    if (user) navigate('/user');
  }, [user, navigate]);

  // Focus automatico su email all'apertura
  useEffect(() => {
    if (showReset || !isRegister) {
      emailRef.current?.focus();
    }
  }, [showReset, isRegister]);

  const validateEmail = (email) => /.+@.+\..+/.test(email);
  const validatePassword = (pw) => pw.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateEmail(email)) {
      setError('Inserisci una email valida.');
      emailRef.current?.focus();
      return;
    }
    if (!validatePassword(password)) {
      setError('La password deve essere di almeno 6 caratteri.');
      passwordRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        // REGISTRAZIONE
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setIsRegister(false);
        setSuccess('Registrazione completata! Controlla la tua email per confermare.');
      } else {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (!data.session) throw new Error('Login fallito.');
        if (remember) {
          localStorage.setItem('supabase-persist-session', 'true');
        } else {
          localStorage.removeItem('supabase-persist-session');
        }
        setSuccess('Login effettuato! Reindirizzamento...');
        setTimeout(() => navigate('/user'), 800);
      }
    } catch (err) {
      setError(err.message || 'Errore di autenticazione');
    } finally {
      setLoading(false);
    }
  };

  // Funzione recupero password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetSent(false);
    if (!validateEmail(email)) {
      setError('Inserisci una email valida per il recupero.');
      emailRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setResetSent(true);
      setSuccess('Email di recupero inviata! Controlla la tua casella di posta.');
    } catch (err) {
      setError(err.message || 'Errore durante il recupero password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      <Printer3DAnimation />
      <div className="bg-dark-surface rounded-xl shadow-lg p-8 w-full max-w-md border border-white/10 mt-4" aria-live="polite">
        <h1 className="text-3xl font-bold text-center mb-6 text-neon-orange">
          {isRegister ? 'Registrati' : showReset ? 'Recupera password' : 'Accedi'}
        </h1>
        {loading && (
          <div className="flex justify-center items-center mb-4" aria-busy="true" aria-label="Caricamento">
            <svg className="animate-spin h-6 w-6 text-neon-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="ml-2 text-neon-orange">Attendi...</span>
          </div>
        )}
        {!showReset ? (
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on" aria-label={isRegister ? 'Registrazione' : 'Login'}>
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                ref={emailRef}
                type="email"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!error && !validateEmail(email)}
              />
            </div>
            {!isRegister && (
              <div>
                <label className="block text-gray-200 mb-1" htmlFor="password">Password</label>
                <input
                  id="password"
                  ref={passwordRef}
                  type="password"
                  className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-invalid={!!error && !validatePassword(password)}
                />
              </div>
            )}
            {isRegister && (
              <div>
                <label className="block text-gray-200 mb-1" htmlFor="password">Password</label>
                <input
                  id="password"
                  ref={passwordRef}
                  type="password"
                  className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  aria-invalid={!!error && !validatePassword(password)}
                />
              </div>
            )}
            {!isRegister && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="mr-2 accent-neon-orange"
                  />
                  <label htmlFor="remember" className="text-gray-300">Ricorda accesso</label>
                </div>
                <button
                  type="button"
                  className="text-xs text-neon-orange hover:underline ml-2"
                  onClick={() => { setShowReset(true); setError(''); setSuccess(''); }}
                >
                  Password dimenticata?
                </button>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center text-red-500 text-sm text-center gap-2 mt-2" role="alert">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center justify-center text-green-500 text-sm text-center gap-2 mt-2" role="status">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                <span>{success}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-neon-orange text-black font-bold rounded hover:bg-neon-fire transition-colors disabled:opacity-60 focus:ring-2 focus:ring-neon-orange focus:ring-offset-2"
              disabled={loading}
              aria-busy={loading}
            >
              {isRegister ? 'Registrati' : 'Accedi'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6" aria-label="Recupero password">
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                ref={emailRef}
                type="email"
                className="w-full px-4 py-2 rounded bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-neon-orange"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!error && !validateEmail(email)}
              />
            </div>
            {error && (
              <div className="flex items-center justify-center text-red-500 text-sm text-center gap-2 mt-2" role="alert">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center justify-center text-green-500 text-sm text-center gap-2 mt-2" role="status">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                <span>{success}</span>
              </div>
            )}
            {resetSent && <div className="text-green-400 text-xs text-center">Se non trovi l'email controlla anche nello spam.</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-neon-orange text-black font-bold rounded hover:bg-neon-fire transition-colors disabled:opacity-60 focus:ring-2 focus:ring-neon-orange focus:ring-offset-2"
              disabled={loading}
              aria-busy={loading}
            >
              Invia link di recupero
            </button>
            <button
              type="button"
              className="w-full mt-2 text-neon-orange hover:underline"
              onClick={() => { setShowReset(false); setError(''); setSuccess(''); setResetSent(false); }}
            >
              Torna al login
            </button>
          </form>
        )}
        <div className="text-center mt-4">
          <button
            className="text-neon-orange hover:underline"
            onClick={() => { setIsRegister(r => !r); setError(''); setSuccess(''); setShowReset(false); setResetSent(false); }}
            aria-label={isRegister ? 'Passa al login' : 'Passa alla registrazione'}
          >
            {isRegister ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
          </button>
        </div>
      </div>
    </section>
  );
}
