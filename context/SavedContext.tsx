import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc, increment, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';

const SAVED_KEY = '@kparche_saved_events';
const GOING_KEY = '@kparche_going_events';
const POINTS_PER_EVENT = 50;

interface SavedContextType {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  goingIds: string[];
  toggleGoing: (id: string) => void;
  isGoing: (id: string) => boolean;
  points: number;
}

const SavedContext = createContext<SavedContextType>({
  savedIds: [],
  toggleSaved: () => {},
  isSaved: () => false,
  goingIds: [],
  toggleGoing: () => {},
  isGoing: () => false,
  points: 0,
});

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [goingIds, setGoingIds] = useState<string[]>([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(SAVED_KEY).then(val => {
      if (!val) return;
      const valid = (JSON.parse(val) as string[]).map(String).filter(id => id.length > 3);
      setSavedIds(valid);
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify(valid));
    });
    AsyncStorage.getItem(GOING_KEY).then(val => {
      if (!val) return;
      const valid = (JSON.parse(val) as string[]).map(String).filter(id => id.length > 3);
      setGoingIds(valid);
      AsyncStorage.setItem(GOING_KEY, JSON.stringify(valid));
    });
  }, []);

  // Carga puntos desde Firestore cuando Firebase restaura la sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) { setPoints(0); return; }
      getDoc(doc(db, 'users', user.uid)).then(snap => {
        setPoints(snap.exists() ? (snap.data()?.points ?? 0) : 0);
      });
    });
    return () => unsubscribe();
  }, []);

  const toggleSaved = (id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleGoing = (id: string) => {
    const alreadyGoing = goingIds.includes(id);
    const delta = alreadyGoing ? -POINTS_PER_EVENT : POINTS_PER_EVENT;

    setGoingIds(prev => {
      const next = alreadyGoing ? prev.filter(x => x !== id) : [...prev, id];
      AsyncStorage.setItem(GOING_KEY, JSON.stringify(next));
      return next;
    });

    setPoints(prev => Math.max(0, prev + delta));

    // Persiste puntos en Firestore
    const uid = auth.currentUser?.uid;
    if (uid) {
      const userRef = doc(db, 'users', uid);
      updateDoc(userRef, { points: increment(delta) }).catch(() => {
        setDoc(userRef, { points: Math.max(0, delta) }, { merge: true });
      });
    }
  };

  const isSaved = (id: string) => savedIds.includes(id);
  const isGoing = (id: string) => goingIds.includes(id);

  return (
    <SavedContext.Provider value={{ savedIds, toggleSaved, isSaved, goingIds, toggleGoing, isGoing, points }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
