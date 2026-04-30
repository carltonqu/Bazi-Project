import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthModal({ isOpen, onClose, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode); // 'login' or 'signup'
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError(null);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    }
  }, [isOpen, defaultMode]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Please enter your name');
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
    }

    let result;
    if (mode === 'login') {
      result = await login(formData.email, formData.password);
    } else {
      result = await signup(formData.name, formData.email, formData.password);
    }

    setIsLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Authentication failed. Please try again.');
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Logo */}
        <div className="auth-modal-logo">
          <div className="auth-logo-icon">
            <span>八字</span>
          </div>
          <span className="auth-logo-text">Bazi</span>
        </div>

        {/* Header */}
        <div className="auth-modal-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {mode === 'login' 
              ? 'Sign in to access your personalized Bazi readings' 
              : 'Start your journey to discover your destiny'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="modal-name">Full Name</label>
              <div className="auth-input-wrapper">
                <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 10C12.21 10 14 8.21 14 6C14 3.79 12.21 2 10 2C7.79 2 6 3.79 6 6C6 8.21 7.79 10 10 10ZM10 12C7.33 12 2 13.34 2 16V18H18V16C18 13.34 12.67 12 10 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  id="modal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="modal-email">Email Address</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.5 6.5L10 11L17.5 6.5M4.5 3.5H15.5C16.6 3.5 17.5 4.4 17.5 5.5V14.5C17.5 15.6 16.6 16.5 15.5 16.5H4.5C3.4 16.5 2.5 15.6 2.5 14.5V5.5C2.5 4.4 3.4 3.5 4.5 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="email"
                id="modal-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="modal-password">Password</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 12V14M5 8H15C16.1 8 17 8.9 17 10V16C17 17.1 16.1 18 15 18H5C3.9 18 3 17.1 3 16V10C3 8.9 3.9 8 5 8ZM7 8V6C7 4.3 8.3 3 10 3C11.7 3 13 4.3 13 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="password"
                id="modal-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={mode === 'login' ? 'Enter your password' : 'Create a password (min 6 chars)'}
                required
                minLength={6}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="modal-confirm-password">Confirm Password</label>
              <div className="auth-input-wrapper">
                <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 12V14M5 8H15C16.1 8 17 8.9 17 10V16C17 17.1 16.1 18 15 18H5C3.9 18 3 17.1 3 16V10C3 8.9 3.9 8 5 8ZM7 8V6C7 4.3 8.3 3 10 3C11.7 3 13 4.3 13 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="password"
                  id="modal-confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="auth-forgot" onClick={e => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
          )}

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
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="auth-modal-footer">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button className="auth-link" onClick={switchMode}>
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
