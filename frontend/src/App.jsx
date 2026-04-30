import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, logCustomEvent } from './firebase';
import AuthScreen from './components/AuthScreen';
import ChatInterface from './components/ChatInterface';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Don't overwrite a guest user with null if they aren't signed into Firebase
      if (currentUser || !user?.isGuest) {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleGuestLogin = () => {
    setUser({ displayName: 'Guest', email: 'guest@voterhelp.com', isGuest: true });
    logCustomEvent('login', { method: 'guest' });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div style={{
          width: 48, height: 48,
          border: '4px solid rgba(217,119,6,0.2)',
          borderTop: '4px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <AuthScreen onGuestLogin={handleGuestLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={user ? <ChatInterface user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
