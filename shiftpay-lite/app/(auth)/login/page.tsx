import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

interface LoginPageProps {
  searchParams: { error?: string; callbackUrl?: string };
}

const errorMessages: Record<string, string> = {
  OAuthSignin: "Error starting sign in. Please try again.",
  OAuthCallback: "Error completing sign in. Please try again.",
  OAuthCreateAccount: "Could not create account. Please try again.",
  EmailCreateAccount: "Could not create account. Please try again.",
  Callback: "Sign in callback error. Please try again.",
  OAuthAccountNotLinked: "This email is already linked to another account.",
  default: "An error occurred. Please try again.",
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const error = searchParams?.error;
  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard";
  const errorMessage = error ? (errorMessages[error] ?? errorMessages.default) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg mb-4">
              <span className="text-white font-extrabold text-xl">CR</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your ClockRoster account</p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 mb-6 text-red-300 text-sm text-center">
              {errorMessage}
            </div>
          )}

          {/* Sign in button */}
          <GoogleSignInButton
            label="Continue with Google"
            callbackUrl={callbackUrl}
          />

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-slate-500 text-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-slate-500 text-xs">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure sign-in
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            2,000+ businesses trust us
          </span>
        </div>
      </div>
    </div>
  );
}
