import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase'; // Імпортуємо auth з вашого firebase.js
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Підписуємося на зміни стану авторизації Firebase
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Функція очищення підписки
        return unsubscribe;
    }, []);

    const value = {
        currentUser, // Об'єкт користувача (містить UID, email тощо)
        loading,
        isAuthenticated: !!currentUser // Чи авторизований користувач
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};