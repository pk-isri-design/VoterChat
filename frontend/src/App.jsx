import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
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
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
