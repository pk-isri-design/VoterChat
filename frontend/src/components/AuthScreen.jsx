import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';
import { ShieldCheck } from 'lucide-react';

export default function AuthScreen() {
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login Error:", err);
      setError(`Failed to sign in: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass animate-fade-in" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img src="/vote-illustration.png" alt="Voting Process" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
        </div>
        <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '10px' }}>VoterHelp</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Your intelligent, non-partisan assistant for navigating the election process globally.
        </p>

        {error && <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

        <button className="btn-primary" onClick={handleLogin} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
