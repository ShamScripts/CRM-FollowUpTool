import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Companies } from './pages/Companies';
import { Leads } from './pages/Leads';
import { FollowUps } from './pages/FollowUps';
import { ExcelSync } from './pages/ExcelSync';
import { Reports } from './pages/Reports';
import { SentimentAnalysis } from './pages/SentimentAnalysis';
import { AdminPanel } from './pages/AdminPanel';
import { NotFound } from './pages/NotFound';
// import { DatabaseInitializer } from './services/initDatabase';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        // Temporarily disable database initialization for development
        // await DatabaseInitializer.initialize();
        console.log('Database initialization skipped for development');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // In a real app, you might want to show an error message to the user
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      // DatabaseInitializer.disconnect().catch(console.error);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Initializing database...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/companies" element={
                <PrivateRoute>
                  <Layout>
                    <Companies />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/leads" element={
                <PrivateRoute>
                  <Layout>
                    <Leads />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/followups" element={
                <PrivateRoute>
                  <Layout>
                    <FollowUps />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/sync" element={
                <PrivateRoute>
                  <Layout>
                    <ExcelSync />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/reports" element={
                <PrivateRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/sentiment" element={
                <PrivateRoute>
                  <Layout>
                    <SentimentAnalysis />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute>
                  <Layout>
                    <AdminPanel />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;