import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleGoogleSuccess = () => {
    navigate('/dashboard');
  };

  const handleGoogleError = (err) => {
    setError(err);
  };

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="auth-bg">
        <div className="auth-gradient" />
        <div className="auth-stars">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="auth-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            />
          ))}
        </div>
        <div className="auth-glow auth-glow-1" />
        <div className="auth-glow auth-glow-2" />
      </div>

      <div className="auth-container">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">
            <span>八字</span>
          </div>
          <span className="auth-logo-text">Bazi</span>
        </Link>

        {/* Login Card */}
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your personalized Bazi readings</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <GoogleSignInButton 
            text="signin_with"
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrapper">
                <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 6.5L10 11L17.5 6.5M4.5 3.5H15.5C16.6 3.5 17.5 4.4 17.5 5.5V14.5C17.5 15.6 16.6 16.5 15.5 16.5H4.5C3.4 16.5 2.5 15.6 2.5 14.5V5.5C2.5 4.4 3.4 3.5 4.5 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrapper">
                <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 12V14M5 8H15C16.1 8 17 8.9 17 10V16C17 17.1 16.1 18 15 18H5C3.9 18 3 17.1 3 16V10C3 8.9 3.9 8 5 8ZM7 8V6C7 4.3 8.3 3 10 3C11.7 3 13 4.3 13 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-forgot">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="auth-loading">
                  <span className="auth-loading-dot" />
                  <span className="auth-loading-dot" />
                  <span className="auth-loading-dot" />
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="auth-link">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
