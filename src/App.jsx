import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SafetyBanner from './components/SafetyBanner';
import LoginModal from './components/LoginModal';
import OathModal from './components/OathModal';
import HomePage from './pages/HomePage';
import PostAdPage from './pages/PostAdPage';
import AdDetailsPage from './pages/AdDetailsPage';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOathModalOpen, setIsOathModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  const [searchTerm, setSearchTerm] = useState('');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handlePostAdClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      setIsOathModalOpen(true);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans" dir="rtl">
        <Header
          onLoginClick={() => setIsLoginModalOpen(true)}
          onPostAdClick={handlePostAdClick}
          onSearch={setSearchTerm}
        />
        <SafetyBanner />

        <Routes>
          <Route
            path="/"
            element={<HomePage
              onContactClick={() => setIsLoginModalOpen(true)}
              searchTerm={searchTerm}
            />}
          />
          <Route
            path="/post-ad"
            element={<PostAdPage />}
          />
          <Route
            path="/ad/:id"
            element={
              <AdDetailsPage
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setIsLoginModalOpen(true)}
              />
            }
          />
        </Routes>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <OathModal
          isOpen={isOathModalOpen}
          onClose={() => setIsOathModalOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
