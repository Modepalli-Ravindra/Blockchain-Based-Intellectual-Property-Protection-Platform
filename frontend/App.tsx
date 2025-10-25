import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import LandingPage from './components/LandingPage';
import PublicCertificatePage from './components/PublicCertificatePage';
import { AuthContext } from './contexts/AuthContext';
import type { User, Asset } from './types';
import { ToastProvider } from './components/ToastProvider';
import { ThemeProvider } from './components/ThemeProvider';

type SharedData = {
  asset: Asset;
  owner: { name: string; email: string; };
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'landing' | 'auth'>('landing');
  const [sharedAssetData, setSharedAssetData] = useState<SharedData | null>(null);

  useEffect(() => {
    // Check for a share link in the URL hash first
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
        try {
            const encodedData = hash.substring(7);
            const decodedJson = atob(encodedData);
            const data: SharedData = JSON.parse(decodedJson);
            if (data.asset && data.owner) {
                setSharedAssetData(data);
                // Clear the hash to prevent re-triggering and clean the URL
                window.history.replaceState(null, '', ' ');
            }
        } catch (error) {
            console.error("Failed to parse share link data:", error);
            // Clear the hash if it's invalid
            window.history.replaceState(null, '', ' ');
        }
    }

    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Try to parse as a real JWT token first
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload && payload.id) {
            // This is a real JWT token from the backend
            const userData: User = {
              id: payload.id,
              name: payload.name || '',
              email: payload.email || '',
              rewards: payload.rewards || 0
            };
            setUser(userData);
          }
        } catch (jwtError) {
          // If JWT parsing fails, try the old mock token format
          try {
            const userData: User = JSON.parse(atob(token.split('.')[1]));
            if (userData && userData.id && userData.email && userData.name) {
                if (typeof userData.rewards === 'undefined') {
                    userData.rewards = 0;
                }
                setUser(userData);
            }
          } catch (mockError) {
            console.error("Failed to parse auth token:", jwtError, mockError);
            localStorage.removeItem('authToken');
          }
        }
      }
    } catch (error) {
        console.error("Failed to parse auth token:", error);
        localStorage.removeItem('authToken');
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User) => {
    if (typeof userData.rewards === 'undefined') {
        userData.rewards = 0;
    }
    // User data is already stored with the real token in localStorage by the service
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setCurrentView('landing');
  }, []);

  const addReward = useCallback((points: number) => {
    setUser(currentUser => {
        if (!currentUser) return null;

        // For real backend, we should update the user via API
        const updatedUserForState: User = {
            ...currentUser,
            rewards: (currentUser.rewards || 0) + points,
        };

        // In a real implementation, we would call an API endpoint to update rewards
        // For now, we'll just update the user state
        // Note: The actual rewards should be managed by the backend
        
        return updatedUserForState;
    });
  }, []);
  
  const updateUser = useCallback(async (details: { name: string; email: string }) => {
    // Call the real backend API to update the user
    const { updateUserProfile } = await import('./services/blockchainService');
    try {
      const updatedUser = await updateUserProfile(details);
      
      // Update the user state
      setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, ...updatedUser };
      });
      
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(new Error(error.message || 'Failed to update user profile'));
    }
  }, []);

  const authContextValue = useMemo(() => ({
    user,
    login,
    logout,
    addReward,
    updateUser,
  }), [user, login, logout, addReward, updateUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (sharedAssetData) {
        return <PublicCertificatePage data={sharedAssetData} />;
    }
    if (user) {
      return <DashboardPage />;
    }
    switch (currentView) {
      case 'auth':
        return <AuthPage onNavigateBack={() => setCurrentView('landing')} />;
      case 'landing':
      default:
        return <LandingPage onNavigateToAuth={() => setCurrentView('auth')} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthContext.Provider value={authContextValue}>
        <ToastProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
            {renderContent()}
          </div>
        </ToastProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
