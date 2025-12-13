import { useEffect, useState } from "react";
import initializeAuth from "../Firebase/Firebase.initialize";
import { 
    GoogleAuthProvider, 
    getAuth, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut, 
    createUserWithEmailAndPassword, 
    updateProfile, 
    signInWithEmailAndPassword 
} from "firebase/auth";
import swal from "sweetalert";
import axios from "axios";

initializeAuth();

const useFirebase = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    // Google Sign In
    const googleSignIn = (location, history) => {
        setIsLoading(true);
        setError('');
        signInWithPopup(auth, googleProvider)
        .then(res => {
            const user = res.user;
            saveUser(user.email, user.displayName, "PUT");
            swal({
                title: "Welcome!",
                text: "Successfully signed in with Google",
                icon: "success",
                button: "OK",
            });
            const des = location?.state?.from || '/';
            history.replace(des);
        })
        .catch(e => {
            console.error('Google Sign In Error:', e);
            setError(e.message);
            swal({
                title: "Sign In Failed!",
                text: e.message || "Failed to sign in with Google",
                icon: "error",
                button: "OK",
            });
        })
        .finally(() => setIsLoading(false));
    }

    // Register User with Email/Password
    const registerUser = (name, email, password, history) => {
        setIsLoading(true);
        setError('');
        
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            // Update user profile with name
            return updateProfile(userCredential.user, {
                displayName: name
            }).then(() => {
                // Save user to database
                saveUser(email, name, "POST");
                
                // Manually update the user state with display name
                setUser({
                    ...userCredential.user,
                    displayName: name
                });

                swal({
                    title: "Registration Successful!",
                    text: "Welcome to BikeZone",
                    icon: "success",
                    button: "OK",
                });

                // Redirect to home or dashboard
                if (history) {
                    history.push('/');
                }

                return userCredential.user;
            });
        })
        .catch(e => {
            console.error('Registration Error:', e);
            let errorMessage = "Registration failed. Please try again.";
            
            if (e.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered. Please login instead.";
            } else if (e.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Use at least 6 characters.";
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address.";
            }
            
            setError(errorMessage);
            swal({
                title: "Registration Failed!",
                text: errorMessage,
                icon: "error",
                button: "OK",
            });
        })
        .finally(() => setIsLoading(false));
    }

    // Login User with Email/Password
    const loginUser = (email, password, location, history) => {
        setIsLoading(true);
        setError('');
        
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            setError('');
            swal({
                title: "Welcome Back!",
                text: "Successfully logged in",
                icon: "success",
                button: "OK",
            });
            const des = location?.state?.from || '/';
            history.replace(des);
        })
        .catch(e => {
            console.error('Login Error:', e);
            let errorMessage = "Login failed. Please check your credentials.";
            
            if (e.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email. Please sign up first.";
            } else if (e.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password. Please try again.";
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address.";
            } else if (e.code === 'auth/user-disabled') {
                errorMessage = "This account has been disabled.";
            }
            
            setError(errorMessage);
            swal({
                title: "Login Failed!",
                text: errorMessage,
                icon: "error",
                button: "OK",
            });
        })
        .finally(() => setIsLoading(false));
    }

    // Logout
    const logOut = () => {
        setIsLoading(true);
        signOut(auth)
        .then(() => {
            setUser({});
            setIsAdmin(false);
            swal({
                title: "Logged Out!",
                text: "You have been logged out successfully",
                icon: "success",
                button: "OK",
            });
        })
        .catch(e => {
            console.error('Logout Error:', e);
            setError(e.message);
        })
        .finally(() => setIsLoading(false));
    }

    // Save user to database
    const saveUser = (email, displayName, method) => {
        const user = { email, displayName };
        
        fetch('https://bikezone-server.onrender.com/users', {
            method: method,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            console.log('User saved to database:', data);
        })
        .catch(error => {
            console.error('Error saving user to database:', error);
        });
    } 

    // Monitor auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                console.log('User logged in:', firebaseUser.email);
                setUser(firebaseUser);
            } else {
                console.log('No user logged in');
                setUser({});
                setIsAdmin(false);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []); // CHANGED: Removed [auth] dependency

    // Check if user is admin
    useEffect(() => {
        if (user?.email) {
            console.log('Checking admin status for:', user.email);
            axios.get(`https://bikezone-server.onrender.com/users?email=${user.email}`)
            .then(({ data }) => {
                console.log('Admin status:', data.admin);
                setIsAdmin(data.admin || false);
            })
            .catch(error => {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            });
        } else {
            setIsAdmin(false);
        }
    }, [user?.email]);

    return {
        user, 
        error, 
        isLoading,
        isAdmin,
        googleSignIn,
        registerUser,
        loginUser,
        logOut
    };
}

export default useFirebase;