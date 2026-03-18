import { useMemo } from 'react';
import { EVENTS } from '../constants/mockData';
import { EventCategory } from '../constants/types';

export const useFilteredEvents = (search: string, category: EventCategory, maxPrice: number) => {
  return useMemo(() => {
    return EVENTS.filter(e => {
      const matchCat = category === 'todos' || e.cat === category;
      const matchPrice = e.price <= maxPrice;
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchPrice && matchSearch;
    });
  }, [search, category, maxPrice]);
};
