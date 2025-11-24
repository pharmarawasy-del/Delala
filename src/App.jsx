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

import ErrorBoundary from './components/ErrorBoundary';
import ProfileSetupPage from './pages/ProfileSetupPage';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOathModalOpen, setIsOathModalOpen] = useState(false);
  // We can keep the modal state for backward compatibility or other triggers, 
  // but we'll primarily use the page for initial setup.
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

    let mounted = true;

    // FAIL-SAFE: Force app to load after 3 seconds even if Auth hangs
    const authTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth check timed out, forcing app load...');
        setLoading(false);
      }
    }, 3000);

    async function initializeAuth() {
      try {
        // 1. Check active session immediately
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // If we have a session, fetch the full profile
          await fetchProfile(session.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        clearTimeout(authTimeout);
        // 2. ONLY set loading to false after the initial check is done
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // 3. Set up listener for future changes (sign in, sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Only fetch profile if we don't already have the user data or if it's a different user
        await fetchProfile(session.user);

        // CRITICAL: Handle redirection based on profile existence
        // We do this check inside fetchProfile or here. 
        // Since fetchProfile updates state, we can rely on the route protection or do explicit redirect.
        // However, explicit redirect in onAuthStateChange can be tricky with React Router outside components.
        // We'll rely on the UI to show the right page based on user state.
      } else {
        setUser(null);
      }
      // Ensure loading is false if auth state changes (e.g. after logout)
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
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
        // We will let the router redirect to /profile-setup if needed
        // or trigger the modal if we are on a page that allows it.
        // For now, we'll rely on the /profile-setup route logic.
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
    <ErrorBoundary>
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

            {/* NEW: Profile Setup Page Route */}
            <Route
              path="/profile-setup"
              element={
                user ? (
                  <ProfileSetupPage
                    user={user}
                    onComplete={handleProfileSetupComplete}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
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
    </ErrorBoundary>
  );
}

export default App;
