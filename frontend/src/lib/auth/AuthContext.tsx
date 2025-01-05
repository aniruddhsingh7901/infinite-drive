'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
 id: string;
 email: string;
 role: 'admin' | 'user';
}

interface AuthContextType {
 user: User | null;  
 login: (email: string, password: string) => Promise<void>;
 logout: () => void;
 isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
 const [user, setUser] = useState<User | null>(null);

 const login = async (email: string, password: string) => {
   if (email === 'admin@example.com' && password === 'admin') {
     setUser({
       id: '1',
       email,
       role: 'admin'
     });
   }
 };

 const logout = () => {
   setUser(null);
 };

 const isAdmin = () => user?.role === 'admin';

 return (
   <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
     {children}
   </AuthContext.Provider>
 );
}

export function useAuth() {
 const context = useContext(AuthContext);
 if (!context) {
   throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
}