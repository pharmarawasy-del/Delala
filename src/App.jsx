import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import Header from './components/Header';
import SafetyBanner from './components/SafetyBanner';
import LoginModal from './components/LoginModal';
import OathModal from './components/OathModal';
import ProfileSetupModal from './components/ProfileSetupModal';
import HomePage from './pages/HomePage';
import PostAdPage from './pages/PostAdPage';
import AdDetailsPage from './pages/AdDetailsPage';
import ProfilePage from './pages/ProfilePage';
import MyAds from './pages/MyAds';
import Footer from './components/Footer';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOathModalOpen, setIsOathModalOpen] = useState(false);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [profileSetupUserId, setProfileSetupUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Set up global callback for profile setup trigger
    window.triggerProfileSetup = (userId) => {
      setProfileSetupUserId(userId);
      setIsProfileSetupOpen(true);
    };

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      delete window.triggerProfileSetup;
    };
  }, []);

  const fetchProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setUser({ ...authUser, ...data });
      } else {
        // If no profile exists, user object is just authUser
        setUser(authUser);
        // Trigger profile setup if we have a user but no profile
        if (window.triggerProfileSetup) {
          window.triggerProfileSetup(authUser.id);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(authUser);
    }
  };

  const handleProfileSetupComplete = async () => {
    setIsProfileSetupOpen(false);
    // Refresh user data
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      fetchProfile(authUser);
    }
  };

  const handlePostAdClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      setIsOathModalOpen(true);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans" dir="rtl">
        <Header
          user={user}
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
            element={user ? <PostAdPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/ad/:id"
            element={
              <AdDetailsPage
                isLoggedIn={!!user}
                onLoginClick={() => setIsLoginModalOpen(true)}
              />
            }
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/my-ads"
            element={user ? <MyAds /> : <Navigate to="/" replace />}
          />
        </Routes>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />

        <OathModal
          isOpen={isOathModalOpen}
          onClose={() => setIsOathModalOpen(false)}
        />

        <ProfileSetupModal
          isOpen={isProfileSetupOpen}
          userId={profileSetupUserId}
          onComplete={handleProfileSetupComplete}
        />

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
