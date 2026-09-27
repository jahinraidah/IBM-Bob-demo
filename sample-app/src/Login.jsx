import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const handleGoogle = async () => {
    try { await signInWithGoogle() }
    catch (e) { console.error("Google sign-in error:", e) }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) await signUpWithEmail(email, password);
      else          await signInWithEmail(email, password);
    } catch (e) { alert(e.message) }
  };

  return (
    <div className="cg-login-bg">
      <div className="cg-login-card">
        {/* Logo */}
        <div className="cg-login-logo">
          <span className="cg-logo-icon">⚖</span>
          <span className="cg-wordmark">Contracty</span>
        </div>

        <h2 className="cg-login-title">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h2>
        <p className="cg-login-sub">
          {isSignUp
            ? "Start analysing contracts for free."
            : "Sign in to access your contract history."}
        </p>

        {/* Google */}
        <button className="cg-login-google" onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#FBBC05" d="M24 44c5.2 0 9.8-1.8 13.4-4.7l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.2 0-9.5-3.3-11.2-7.9l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
            <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.2 5.2C41.5 36.2 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          Continue with Google
        </button>

        <div className="cg-login-divider"><span>or</span></div>

        {/* Email form */}
        <form onSubmit={handleEmail} className="cg-login-form">
          <input
            className="cg-login-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="cg-login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="cg-analyze-btn" style={{ marginTop: 0 }}>
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="cg-login-toggle" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Need an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}
