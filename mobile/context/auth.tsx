import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type Role = 'HEADMASTER' | 'TEACHER' | 'PARENT';

interface User {
  id: string;
  role: Role;
  name: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const Storage = {
  async getItemAsync(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof sessionStorage !== 'undefined') {
          return sessionStorage.getItem(key);
        }
        return null;
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error('SecureStore load error:', error);
      return null;
    }
  },
  async setItemAsync(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(key, value);
        }
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error('SecureStore save error:', error);
    }
  },
  async deleteItemAsync(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem(key);
        }
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('SecureStore delete error:', error);
    }
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuthInfo() {
      try {
        const storedToken = await Storage.getItemAsync('token');
        const storedUser = await Storage.getItemAsync('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to parse auth data', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAuthInfo();
  }, []);

  const signIn = async (newToken: string, newUser: User) => {
    await Storage.setItemAsync('token', newToken);
    await Storage.setItemAsync('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const signOut = async () => {
    await Storage.deleteItemAsync('token');
    await Storage.deleteItemAsync('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      signIn, 
      signOut, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
