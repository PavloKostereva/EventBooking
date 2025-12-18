'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Мок-режим для розробки: завжди вважати користувача авторизованим
const MOCK_AUTH_MODE = true; // Змініть на false, щоб вимкнути мок-режим

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Мок-режим: встановлюємо тестового користувача
    if (MOCK_AUTH_MODE) {
      const mockUser = {
        id: 'mock-user-id-123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };
      const mockUserData = {
        id: 'mock-user-id-123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      setCurrentUser(mockUser);
      setUserData(mockUserData);
      setLoading(false);
      return;
    }

    // Звичайна логіка авторизації
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setCurrentUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
