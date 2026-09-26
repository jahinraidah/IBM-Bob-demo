// src/Login.jsx
import { useState } from "react";
import { useAuth } from "./AuthContext";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login/Signup
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
 

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
     
    } catch (error) {
      alert(error.message); // Show Firebase errors (e.g., wrong password)
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h1>Welcome to Contracty</h1>
      <button 
        onClick={handleGoogle}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      >
        Sign in with Google
      </button>

      <p style={{ textAlign: "center" }}>— or —</p>

      <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={{ padding: "10px" }}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <p 
        onClick={() => setIsSignUp(!isSignUp)} 
        style={{ cursor: "pointer", color: "blue", textAlign: "center", marginTop: "15px" }}
      >
        {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
      </p>
    </div>
  );
}