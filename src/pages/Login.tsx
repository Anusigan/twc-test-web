import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, loginSchema, type LoginData, isAuthenticated } from '../services/auth';
import { Mail, Lock, Info } from 'lucide-react';
import { isMockingEnabled, getMockCredentials } from '../mocks/mockAuth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/contacts');
    }
  }, [navigate]);

  // For easy login in mock mode
  const useMockCredentials = () => {
    if (isMockingEnabled) {
      const credentials = getMockCredentials();
      setFormData({
        email: credentials.email,
        password: credentials.password
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const validatedData = loginSchema.parse(formData);
      await login(validatedData);
      navigate('/contacts');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#083F46] flex relative overflow-hidden">
      {/* Main background shape */}
      <div className="absolute w-full h-full">
        <div className="absolute -left-[30%] -top-[20%] w-[150%] aspect-square rounded-full bg-[#072F35] transform rotate-12"></div>
      </div>
      
      {/* Cover image - positioned to the right side */}
      <div className="absolute right-0 top-0 h-full">
        <img 
          src="/assets/images/cover.png" 
          alt=""
          className="h-full w-auto object-contain opacity-100"
          onError={(e) => {
            // Fallback if image doesn't load
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Logo - top left corner */}
      <div className="absolute top-8 left-8 z-20">
        <img 
          src="/assets/images/twc.png" 
          alt="Logo" 
          className="h-12"
          onError={(e) => {
            // Fallback if image doesn't load
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      
      <div className="container mx-auto px-8 py-16 z-10 flex flex-col justify-center">
        <div className="max-w-md">
          <div className="mb-16">
            <h1 className="text-white text-5xl font-bold mb-2">Hi there,</h1>
            <p className="text-white text-3xl font-light leading-tight">Welcome to our</p>
            <p className="text-white text-3xl font-light leading-tight">contacts portal</p>
          </div>

          {isMockingEnabled && (
            <div className="mb-6 p-3 bg-blue-100 border border-blue-200 text-blue-800 rounded-lg flex items-start">
              <Info className="mr-2 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="font-medium">Mock Mode Active</p>
                <p className="text-sm">Use test email: {getMockCredentials().email}</p>
                <p className="text-sm">Or with password: {getMockCredentials().password}</p>
                <button 
                  onClick={useMockCredentials}
                  className="text-blue-600 underline text-sm mt-1"
                >
                  Fill with test credentials
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#083F46]" size={20} />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-14 pr-5 py-3 rounded-[50px] border-none focus:ring-2 focus:ring-white outline-none transition-all bg-white text-[#083F46] text-xl"
                placeholder="e-mail"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#083F46]" size={20} />
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-14 pr-5 py-3 rounded-[50px] border-none focus:ring-2 focus:ring-white outline-none transition-all bg-white text-[#083F46] text-xl"
                placeholder="password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center pt-8">
              <button
                type="submit"
                className="px-10 py-2 rounded-[50px] border border-white text-white text-xl hover:bg-white hover:bg-opacity-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'login'}
              </button>
              
              <span className="text-white text-xl ml-4">
                or <Link to="/register" className="underline ml-1">Click here to Register</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;