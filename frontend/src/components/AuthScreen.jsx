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
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      backgroundImage: 'url(/election_timeline.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      {/* Light overlay to ensure the background illustration acts as a watermark and doesn't overpower the login box */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(253, 245, 235, 0.7)' }}></div>
      
      <div className="glass animate-fade-in login-card" style={{ position: 'relative', zIndex: 1, padding: '40px', maxWidth: '450px', width: '100%', textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)' }}>
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
