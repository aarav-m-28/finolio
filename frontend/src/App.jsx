import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Savings from './pages/Savings';
import Splits from './pages/Splits';
import Recurring from './pages/Recurring';
import { GlobalProvider } from './context/GlobalState';
import './App.css';

function App() {
  const [userToken, setUserToken] = useState(null);

  if (!userToken) {
    return (
      <GoogleOAuthProvider clientId="284248882784-702mchtrvie3nlse6v00h9dg8gjnv7lo.apps.googleusercontent.com">
        <div className="login-container">
          <div className="glass-panel login-card">
            <h2>WealthTracker Pro</h2>
            <p>Sign in to manage your wealth securely.</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                theme="filled_black"
                size="large"
                shape="pill"
                width={300}
                onSuccess={(res) => setUserToken(res.credential)}
                onError={() => console.log("Login Failed")}
              />
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    );
  }

  return (
    <GlobalProvider>
      <BrowserRouter>
        <Layout onLogout={() => setUserToken(null)}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/splits" element={<Splits />} />
            <Route path="/recurring" element={<Recurring />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
