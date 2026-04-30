import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook che forza il login prima di accedere al sito.
 * Se l'utente non è autenticato, viene reindirizzato a /login.
 * Da usare in App.tsx per proteggere tutte le route tranne /login.
 */
export function useRequireAuth() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      const isLoggedIn = !!data.session;
      if (!isLoggedIn && location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
      setLoading(false);
    }
    checkAuth();
    // eslint-disable-next-line
  }, [location.pathname]);

  return loading;
}
