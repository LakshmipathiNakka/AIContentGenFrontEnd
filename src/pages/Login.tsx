import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://ravik00111110.pythonanywhere.com/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error((await response.json()).detail || 'Authentication failed');
      const data = await response.json();

      Cookies.set('access_token', data.access, { expires: 1 / 48 });
      Cookies.set('refresh_token', data.refresh, { expires: 7 });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);

      toast({ title: 'Login successful!', description: 'Welcome to MCQ Generator' });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Authentication failed',
        description: error instanceof Error ? error.message : 'Invalid credentials. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f0f2e] overflow-hidden">
      
      <div className="absolute w-[40rem] h-[40rem] bg-purple-500 rounded-full opacity-20 blur-[100px] pointer-events-none" style={{ left: cursorPosition.x - 300, top: cursorPosition.y - 300 }}></div>
      <div className="absolute w-72 h-72 bg-purple-400 rounded-full blur-2xl opacity-30 animate-bounce -top-24 -left-24"></div>
      <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-2xl opacity-30 animate-ping -bottom-32 -right-32"></div>
        
      <div className="relative z-10 w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
        <img
          src="https://framerusercontent.com/images/V5OZU3PKHm1TIkvU3NqCJsEtoV8.png"
          alt="NxtWave Logo"
          className="w-20 h-15 mb-3"
        />
        
        <h1 className="text-3xl font-bold text-white mb-2 ">Tech Content Generator</h1>
          <p className="text-white/70">Login to your account</p>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="flex items-center gap-2 text-white/80">
              <Mail className="w-4 h-4" /> Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-3 mt-1 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="flex items-center gap-2 text-white/80">
              <Lock className="w-4 h-4" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 mt-1 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;