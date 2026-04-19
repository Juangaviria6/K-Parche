import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_KEY = '@kparche_saved_events';
const GOING_KEY = '@kparche_going_events';

interface SavedContextType {
  savedIds: number[];
  toggleSaved: (id: number) => void;
  isSaved: (id: number) => boolean;
  goingIds: number[];
  toggleGoing: (id: number) => void;
  isGoing: (id: number) => boolean;
}

const SavedContext = createContext<SavedContextType>({
  savedIds: [],
  toggleSaved: () => {},
  isSaved: () => false,
  goingIds: [],
  toggleGoing: () => {},
  isGoing: () => false,
});

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [goingIds, setGoingIds] = useState<number[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(SAVED_KEY).then(val => {
      if (val) setSavedIds(JSON.parse(val));
    });
    AsyncStorage.getItem(GOING_KEY).then(val => {
      if (val) setGoingIds(JSON.parse(val));
    });
  }, []);

  const toggleSaved = (id: number) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleGoing = (id: number) => {
    setGoingIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      AsyncStorage.setItem(GOING_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (id: number) => savedIds.includes(id);
  const isGoing = (id: number) => goingIds.includes(id);

  return (
    <SavedContext.Provider value={{ savedIds, toggleSaved, isSaved, goingIds, toggleGoing, isGoing }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
