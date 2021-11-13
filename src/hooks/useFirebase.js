import { useEffect, useState } from "react";
import initializeAuth from "../Firebase/Firebase.initialize";
import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, signOut, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
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

    const googleSignIn = (location, history) => {
        setIsLoading(true);
        signInWithPopup(auth, googleProvider)
        .then(res => {
            const user = res.user;
            saveUser(user.email, user.displayName, "PUT")
            setError('');
            const des = location?.state?.from || '/';
            history.replace(des);
        }).catch(e => setError(e.message))
        .finally(() => setIsLoading(false))
    }

    const registerUser = (name, email, password) => {
        setIsLoading(true)
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            setError('');
            saveUser(email, name, "POST");
            updateProfile(auth.currentUser, {
                displayName: name
            }).then(() => {
            }).catch(e => setError(e.message))
        }).catch(e => setError(e.message))
        .finally(() => setIsLoading(false))
    }

    const loginUser = (email, password, location, history) => {
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            setError('');
            const des = location?.state?.from || '/';
            history.replace(des);
        }).catch(e => setError(e.message))
        .finally(() => setIsLoading(false))
    }

    const logOut = () => {
        signOut(auth)
        .then(() => {

        }).catch(e => setError(e.message))
    }

    const saveUser = (email, displayName, method) => {
        const user = {email, displayName};
        fetch('http://localhost:4000/users', {
            method: method,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.insertedId || data.acknowledged){
                swal({
                    title: "Welcome!",
                    icon: "success",
                    button: "ok",
                  });
            }
            else {
                swal({
                    title: "Something Went Wrong!",
                    icon: "error",
                    button: "ok",
                  });
            }
        })
    } 

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if(user){
                setUser(user)
            }
            else{
                setUser({});
            }
            setIsLoading(false);
        })
    }, [auth]);

    useEffect(() => {
        if(user?.email){
            axios.get(`http://localhost:4000/users?email=${user?.email}`)
            .then(({ data }) => {
                setIsAdmin(data.admin);
            })
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
    }

}

export default useFirebase;