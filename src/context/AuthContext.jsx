import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get initial session
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) console.error("Error fetching session:", error);

            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // 2. Listen for auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession);
                setUser(newSession?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        session,
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
