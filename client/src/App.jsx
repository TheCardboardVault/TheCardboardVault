import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import DealGrid from './components/DealGrid';
import Login from './components/Login';
import Register from './components/Register';
import Settings from './components/Settings';

function App() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    console.log('App mounted, fetching deals...');
    fetchDeals();
  }, []);

  const fetchDeals = async (searchTerm = '') => {
    console.log('fetchDeals called with:', searchTerm);
    setLoading(true);
    try {
      // In a real app, you'd append the search term to the query
      const url = searchTerm
        ? `http://localhost:5001/api/deals?search=${encodeURIComponent(searchTerm)}`
        : 'http://localhost:5001/api/deals';

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDeals(data.deals || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthProvider>
      <div className="app">
        <Header
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          onSettingsClick={() => setShowSettings(true)}
        />
        <main>
          <Hero onSearch={fetchDeals} />
          <DealGrid deals={deals} loading={loading} />
        </main>
        <footer style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          borderTop: '1px solid var(--glass-border)',
          marginTop: 'auto'
        }}>
          <p>&copy; 2024 The Cardboard Vault. All rights reserved.</p>
        </footer>

        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        )}

        {showRegister && (
          <Register
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />
        )}

        {showSettings && (
          <Settings onClose={() => setShowSettings(false)} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
