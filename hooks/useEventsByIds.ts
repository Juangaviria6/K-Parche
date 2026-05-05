import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useEventsByIds = (ids: string[]) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ids.length) { setEvents([]); setLoading(false); return; }
    const validIds = ids.map(String).filter(id => id.length > 3);
    if (!validIds.length) { setEvents([]); setLoading(false); return; }
    setLoading(true);
    Promise.all(validIds.map(id => getDoc(doc(db, 'events', id))))
      .then(snaps => setEvents(snaps.filter(s => s.exists()).map(s => ({ id: s.id, ...s.data() }))))
      .finally(() => setLoading(false));
  }, [ids.join(',')]);

  return { events, loading };
};
