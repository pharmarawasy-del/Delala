import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import InstallPrompt from './components/InstallPrompt';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOathModalOpen, setIsOathModalOpen] = useState(false);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [profileSetupUserId, setProfileSetupUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Set up global callback for profile setup trigger
    window.triggerProfileSetup = (userId) => {
      setProfileSetupUserId(userId);
      setIsProfileSetupOpen(true);
    };

    // Check active session and set up listener
    const initializeAuth = async () => {
      // Safety timeout to ensure we don't get stuck on loading
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 3000);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // We might want to avoid re-fetching if we already have the user, 
        // but for now, ensuring we have the profile is safer.
        await fetchProfile(session.user);
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



  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <span className="text-7xl font-black text-[#115ea3] tracking-tighter" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            دلالة
          </span>
          <Loader2 className="w-8 h-8 text-[#115ea3] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans pb-24" dir="rtl">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header
                  user={user}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                  onPostAdClick={handlePostAdClick}
                  onSearch={setSearchTerm}
                />
                <SafetyBanner />
                <HomePage
                  onContactClick={() => setIsLoginModalOpen(true)}
                  searchTerm={searchTerm}
                />
                <Footer />
              </>
            }
          />
          <Route
            path="/post-ad"
            element={
              <>
                <Header
                  user={user}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                  onPostAdClick={handlePostAdClick}
                  onSearch={setSearchTerm}
                />
                {user ? <PostAdPage /> : <Navigate to="/" replace />}
                <Footer />
              </>
            }
          />
          <Route
            path="/ad/:id"
            element={
              <>
                <Header
                  user={user}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                  onPostAdClick={handlePostAdClick}
                  onSearch={setSearchTerm}
                />
                <AdDetailsPage
                  isLoggedIn={!!user}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                />
                <Footer />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Header
                  user={user}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                  onPostAdClick={handlePostAdClick}
                  onSearch={setSearchTerm}
                />
                {user ? <ProfilePage /> : <Navigate to="/" replace />}
                <Footer />
              </>
            }
          />
          <Route
            path="/my-ads"
            element={
              <>
                <Header
                  user={user}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                  onPostAdClick={handlePostAdClick}
                  onSearch={setSearchTerm}
                />
                {user ? <MyAds /> : <Navigate to="/" replace />}
                <Footer />
              </>
            }
          />
          <Route
            path="/terms"
            element={
              <>
                <Header
                  user={user}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                  onPostAdClick={handlePostAdClick}
                  onSearch={setSearchTerm}
                />
                <TermsPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Header
                  user={user}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                  onPostAdClick={handlePostAdClick}
                  onSearch={setSearchTerm}
                />
                <ContactPage />
                <Footer />
              </>
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute user={user}>
                <AdminDashboard user={user} />
              </AdminRoute>
            }
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

        <InstallPrompt />
      </div>
    </BrowserRouter>
  );
}

export default App;
