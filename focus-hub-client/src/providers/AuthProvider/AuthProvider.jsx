import app from "../../services/firebase/firebase.config";
import { createUserWithEmailAndPassword, sendEmailVerification, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleProvider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    };

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    };

    const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData)
    };

    const googleLogin = () => {
        return signInWithPopup(auth, googleProvider)
    }

    const logout = async () => {
        // console.log("logout function called");

        try {
            await signOut(auth)
                .then(() => {
                    setUser(null)
                    // console.log('logout', user)
                })
            // console.log("firebase logout successful");
        } catch (error) {
            console.log("logout error", error);
        }
    };

    const emailVerification = () => {
        return sendEmailVerification(auth.currentUser)
    };

    const resetPassword =(email) => {
        return sendPasswordResetEmail(auth, email)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false)
            // setUser(currentUser)
            console.log(currentUser)
            // console.log('token', currentUser?.accessToken)
            // console.log(currentUser)
        })
        return () => {
            unsubscribe()
        }

    }, [])

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        logout,
        updateUser,
        googleLogin,
        emailVerification,
        resetPassword
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;