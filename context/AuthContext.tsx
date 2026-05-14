import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export type UserRole = 'user' | 'uni' | 'org';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  roleLoaded: boolean;
  initializing: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'user',
  roleLoaded: false,
  initializing: true,
  refreshUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setUser(usr);
      if (usr) {
        const snap = await getDoc(doc(db, 'users', usr.uid));
        setRole((snap.data()?.role as UserRole) ?? 'user');
      } else {
        setRole('user');
      }
      setRoleLoaded(true);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  const refreshUser = () => {
    if (auth.currentUser) {
      setUser(Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, roleLoaded, initializing, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
