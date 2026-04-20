import { useState, useEffect, useMemo } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { EventCategory } from '../constants/types';

export const useFilteredEvents = (search: string, category: EventCategory, maxPrice: number) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'events'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(fetched);
    });

    return () => unsubscribe();
  }, []);

  return useMemo(() => {
    return events.filter(e => {
      const eName = e.name || '';
      const eCat = e.cat || 'todos';
      const ePrice = e.price || 0;

      const matchCat = category === 'todos' || eCat === category;
      const matchPrice = ePrice <= maxPrice;
      const matchSearch = eName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchPrice && matchSearch;
    });
  }, [search, category, maxPrice, events]);
};
