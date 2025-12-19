'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { AuthContextType, User } from '../../types';

interface AuthContextProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const MOCK_AUTH_MODE = true;

export const AuthProvider = ({ children }: AuthContextProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (MOCK_AUTH_MODE) {
      const mockUser: User = {
        id: 'mock-user-id-123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };
      const mockUserData: User = {
        id: 'mock-user-id-123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      setCurrentUser(mockUser);
      setUserData(mockUserData);
      setLoading(false);
      return;
    }

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUser(session?.user as User ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUserData(data as User | null);
      } else {
        setUserData(null);
      }

      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setCurrentUser(session?.user as User ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUserData(data as User | null);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

