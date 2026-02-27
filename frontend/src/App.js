import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('user');
      setIsLoggingOut(false);
    }, 500);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>User Dashboard</h1>
        {user && <button onClick={handleLogout} className="logout-btn">Logout</button>}
      </header>
      <main>
        {user ? (
          <div className={`dashboard-wrapper ${isLoggingOut ? 'slide-out' : ''}`}>
            <Dashboard user={user} />
          </div>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App;
