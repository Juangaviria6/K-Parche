export type EventCategory = 
  'todos' | 'electronica' | 'gastronomia' | 
  'concierto' | 'arte' | 'academico' | 
  'integracion' | 'musica';

export interface Event {
  id: number;
  name: string;
  place: string;
  type: string;
  cat: EventCategory;
  price: number;
  time: string;
  date: string;
  color: string;
  emoji: string;
  desc: string;
  img: string;
  rating: number;
  attendees: number;
  latitude: number;
  longitude: number;
}

export interface University {
  id: number;
  name: string;
  short: string;
  color: string;
  events: number;
  students: string;
  zona: string;
  verified: boolean;
}

export interface InterUEvent {
  id: number;
  name: string;
  unis: string[];
  date: string;
  emoji: string;
  price: number;
  attendees: number;
}
