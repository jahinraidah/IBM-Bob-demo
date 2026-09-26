import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth, googleProvider } from "./firebase"; // Adjust path if needed

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(false); // Temporarily forcing false

  useEffect(() => {
    console.log("AuthContext: Setting up listener...");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("AuthContext: Firebase responded! User is:", currentUser); 
        setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Auth Actions
  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
  
  const signUpWithEmail = (email, password) => 
    createUserWithEmailAndPassword(auth, email, password);
    
  const signInWithEmail = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);
    
  const logout = () => signOut(auth);

  const value = {
    user,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};