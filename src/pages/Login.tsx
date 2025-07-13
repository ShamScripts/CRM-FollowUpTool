import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Building2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginWithMicrosoft } = useAuth();
  const navigate = useNavigate();

  const handleMicrosoftLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await loginWithMicrosoft();
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setError('Microsoft login failed');
      toast.error('Microsoft login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Building2 className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="mt-8 text-4xl font-bold text-foreground">
            Welcome to CRM Pro
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Sign in with your Microsoft account to continue
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border py-10 px-8 shadow-xl rounded-2xl backdrop-blur-sm"
        >
          <div className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center"
              >
                <AlertCircle className="h-5 w-5 text-destructive mr-3" />
                <span className="text-sm text-destructive font-medium">{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
                className="w-full h-14 text-base border-border hover:bg-muted/50 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png"
                      alt="Microsoft"
                      className="h-7 w-7 mr-4"
                    />
                    Sign in with Microsoft
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <a href="#" className="text-primary hover:underline font-medium">Contact support</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
