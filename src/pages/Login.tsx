import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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
  
  // Track cursor position for interactive glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {

      const baseUrl = 'https://ravik00111110.pythonanywhere.com/api/auth/login/';

     const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
        }),
     });

      
        
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Authentication failed');
      }
      

      const data = await response.json();

      
      console.log("Login response:", data);
// Assume your backend returns { access_token: "..." }
Cookies.set('access_token', data.access, { expires: 30 });     // Short-lived token
Cookies.set('refresh_token', data.refresh, { expires: 30 });  // Long-lived token

      console.log("🔑 Access Token:", Cookies.get('access_token'));
      console.log("🔑 Refresh Token:", Cookies.get('refresh_token'));
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      
      toast({
        title: "Login successful!",
        description: "Welcome to MCQ Generator",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
 
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Animated Background with code symbols */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-white"
        ></div>
        
        {/* Interactive spotlight that follows cursor */}
        <div 
          className="absolute w-[40rem] h-[40rem] rounded-full pointer-events-none opacity-10 bg-blue-500"
          style={{
            left: cursorPosition.x - 300,
            top: cursorPosition.y - 300,
            filter: 'blur(100px)',
            transition: 'left 0.2s, top 0.2s',
          }}
        ></div>
        
        {/* Animated code symbols */}
        <div className="code-symbols">
          {['{ }', '< >', ';', '( )', '[ ]', '/*', '*/', '===', '//', '++'].map((symbol, index) => (
            <span 
              key={index}
              className="absolute text-slate-700 opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 2 + 1}rem`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 15 + 20}s`,
                textShadow: '0 0 10px rgba(15, 23, 42, 0.3)'
              }}
            >
              {symbol}
            </span>
          ))}
        </div>
      </div>
      
      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-xl backdrop-blur-lg bg-white/80 border border-slate-200 animate-fade-in shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1 animate-pulse-slow">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              MCQ Generator
            </span>
          </h1>
          <p className="text-slate-600 animate-fade-in-delay">Login to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="username" className="neon-label">
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Username</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="neon-input"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="neon-label">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neon-input"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="neon-button w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
