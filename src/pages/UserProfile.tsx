import React from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';

export default function UserProfile() {
  const { user, loading } = useUserProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="text-center py-8">Caricamento...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center py-12">
        <h2 className="text-2xl font-bold mb-4">Area Utente</h2>
        <p className="mb-4">Non sei autenticato.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-neon-orange text-black rounded font-bold hover:bg-neon-fire transition-colors"
        >
          Accedi
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-12">
      <h2 className="text-2xl font-bold mb-4">Benvenuto, {user.email}</h2>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-neon-orange text-black rounded font-bold hover:bg-neon-fire transition-colors"
      >
        Esci dall'account
      </button>
    </div>
  );
}
