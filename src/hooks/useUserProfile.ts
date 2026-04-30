import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useUserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (!ignore) {
        setUser(data.user);
        setLoading(false);
      }
    }
    getUser();
    return () => { ignore = true; };
  }, []);

  return { user, loading };
}
