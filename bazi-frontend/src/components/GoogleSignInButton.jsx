import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function GoogleSignInButton({ onSuccess, onError, text = 'signin_with' }) {
  const buttonRef = useRef(null);
  const { handleGoogleSignIn } = useAuth();
  const isRendered = useRef(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    // Prevent double render in React StrictMode
    if (isRendered.current) return;
    
    let clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Trim whitespace and newlines that might have been added
    if (clientId) {
      clientId = clientId.trim();
    }
    
    console.log('🔐 Google Sign-In Debug:');
    console.log('  - Raw Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Present' : 'MISSING');
    console.log('  - Trimmed Client ID:', clientId ? `${clientId.substring(0, 30)}...` : 'MISSING');
    console.log('  - Client ID length:', clientId ? clientId.length : 0);
    console.log('  - Current origin:', window.location.origin);
    console.log('  - Hostname:', window.location.hostname);
    
    if (!clientId) {
      const errorMsg = 'VITE_GOOGLE_CLIENT_ID not configured. Please check environment variables.';
      console.error('❌', errorMsg);
      setInitError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    // Validate Client ID format
    const expectedSuffix = '.apps.googleusercontent.com';
    console.log('  - Ends with correct suffix:', clientId.endsWith(expectedSuffix));
    console.log('  - Actual ending:', clientId.slice(-30));
    
    if (!clientId.endsWith(expectedSuffix)) {
      const errorMsg = `Invalid Client ID format. Should end with ${expectedSuffix}`;
      console.error('❌', errorMsg);
      console.error('   Actual value:', JSON.stringify(clientId));
      setInitError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    // Wait for Google API to load
    const initializeGoogle = () => {
      if (window.google && buttonRef.current && !isRendered.current) {
        isRendered.current = true;
        
        try {
          console.log('🔄 Initializing Google Sign-In...');
          
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            // Add error handling for initialization
            error_callback: (error) => {
              console.error('❌ Google Sign-In error callback:', error);
              const errorMsg = error?.message || 'Google Sign-In initialization failed';
              setInitError(errorMsg);
              if (onError) onError(errorMsg);
            }
          });

          console.log('✅ Google Sign-In initialized successfully');

          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'filled_black',
            size: 'large',
            width: '100%',
            text: text,
            shape: 'rectangular',
            logo_alignment: 'center',
          });
          
          console.log('✅ Google Sign-In button rendered');
        } catch (err) {
          console.error('❌ Google Sign-In initialization error:', err);
          const errorMsg = err.message || 'Failed to initialize Google Sign-In';
          setInitError(errorMsg);
          if (onError) onError(errorMsg);
        }
      }
    };

    // Check if Google API is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          initializeGoogle();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.google?.accounts?.id) {
          console.error('Google Sign-In API failed to load');
          if (onError) onError('Google Sign-In failed to load');
        }
      }, 5000);
    }

    return () => {
      // Cleanup not needed for Google button
    };
  }, [text]); // Only re-run if text prop changes

  const handleCredentialResponse = async (response) => {
    console.log('🔐 Google credential received, processing...');
    try {
      const result = await handleGoogleSignIn(response.credential);
      
      if (result.success) {
        console.log('✅ Google sign-in successful');
        if (onSuccess) onSuccess(result);
      } else {
        console.error('❌ Google sign-in failed:', result.error);
        if (onError) onError(result.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('❌ Google sign-in error:', err);
      if (onError) onError(err.message);
    }
  };

  // Show error state if initialization failed
  if (initError) {
    return (
      <div className="google-signin-error" style={{ 
        padding: '12px', 
        background: 'rgba(220, 38, 38, 0.1)', 
        border: '1px solid rgba(220, 38, 38, 0.3)',
        borderRadius: '8px',
        color: '#fca5a5',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: 600 }}>⚠️ Google Sign-In Error</div>
        <div>{initError}</div>
        <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
          Please check the browser console for more details.
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div 
        ref={buttonRef} 
        className="google-signin-button"
        style={{ width: '100%' }}
      />
      {/* Fallback manual button in case Google button doesn't render */}
      <button
        onClick={() => {
          if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt();
          } else {
            setInitError('Google Sign-In API not loaded. Please refresh the page.');
          }
        }}
        style={{
          display: 'none', // Hidden by default, shown via JS if needed
          width: '100%',
          padding: '12px 24px',
          marginTop: '12px',
          background: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
        id="google-fallback-button"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#fff" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.842 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#fff" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#fff" d="M3.964 10.71c-.18-.54-.282-1.116-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#fff" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        Sign in with Google
      </button>
    </div>
  );
}

export default GoogleSignInButton;
