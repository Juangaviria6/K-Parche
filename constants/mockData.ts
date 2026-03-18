import { Event, University, InterUEvent } from './types';

export const fmt = (price: number): string =>
  price === 0 ? 'GRATIS' : `$${price.toLocaleString('es-CO')}`;

export const EVENTS: Event[] = [
  {
    id: 1, name: "Noche Electrónica", place: "Vintrash · El Poblado",
    type: "Discoteca", cat: "electronica", price: 30000, time: "10PM",
    date: "2026-02-28", color: "#FF3060", emoji: "🎧",
    desc: "La noche electrónica más icónica de El Poblado con DJ invitado internacional. Música house, techno y más de 500 personas en pista.",
    img: "https://images.unsplash.com/photo-1571266028243-d220c6a7a6b4?w=600&q=80",
    rating: 4.8, attendees: 320,
    latitude: 6.2086, longitude: -75.5659
  },
  {
    id: 2, name: "Mercado del Río Fest", place: "Mercado del Río · Suramericana",
    type: "Feria", cat: "gastronomia", price: 0, time: "12PM",
    date: "2026-02-28", color: "#FFCC00", emoji: "🍜",
    desc: "El festival gastronómico más grande de Medellín. Más de 50 restaurantes locales, música en vivo y cerveza artesanal. Entrada gratuita.",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    rating: 4.5, attendees: 850,
    latitude: 6.2442, longitude: -75.5812
  },
  {
    id: 3, name: "Hackathon UNAL Medellín", place: "U. Nacional · Robledo",
    type: "Universitario", cat: "academico", price: 0, time: "8AM",
    date: "2026-02-28", color: "#00D68F", emoji: "💻",
    desc: "48 horas para crear soluciones tecnológicas con impacto social en Antioquia. Premios hasta $5 millones. Abierto a todas las universidades del Área Metro.",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
    rating: 4.9, attendees: 200,
    latitude: 6.2672, longitude: -75.5874
  },
  {
    id: 4, name: "Rock en el Teatro", place: "Teatro Pablo Tobón Uribe · Centro",
    type: "Concierto", cat: "concierto", price: 45000, time: "7PM",
    date: "2026-02-28", color: "#7C3AED", emoji: "🎸",
    desc: "Cinco bandas emergentes paisas en una noche épica de rock e indie alternativo en el histórico Teatro Pablo Tobón Uribe del centro de Medellín.",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    rating: 4.7, attendees: 180,
    latitude: 6.2518, longitude: -75.5636
  },
  {
    id: 5, name: "Integración EAFIT vs UPB", place: "Campus EAFIT · El Poblado",
    type: "Universitario", cat: "integracion", price: 15000, time: "4PM",
    date: "2026-03-01", color: "#FF3060", emoji: "🏆",
    desc: "El clásico universitario de Medellín. Deportes, música en vivo, stands de comida típica antioqueña y mucho parche.",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    rating: 4.6, attendees: 600,
    latitude: 6.2006, longitude: -75.5781
  },
  {
    id: 6, name: "Arte Urbano · Comuna 13", place: "Casa Kolacho · Comuna 13",
    type: "Taller", cat: "arte", price: 25000, time: "3PM",
    date: "2026-02-28", color: "#00C8FF", emoji: "🎨",
    desc: "Aprende técnicas de grafiti y arte urbano con artistas de la icónica Comuna 13. Materiales incluidos.",
    img: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
    rating: 4.4, attendees: 30,
    latitude: 6.2476, longitude: -75.6028
  },
  {
    id: 7, name: "Festival Tango Medellín", place: "Parque de El Poblado · Envigado",
    type: "Concierto", cat: "musica", price: 0, time: "6PM",
    date: "2026-03-01", color: "#FFCC00", emoji: "💃",
    desc: "Medellín, capital mundial del tango. Orquestas en vivo, concurso de baile y gastronomía. Evento gratuito.",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    rating: 4.7, attendees: 400,
    latitude: 6.2076, longitude: -75.5701
  }
];

export const UNIVERSITIES: University[] = [
  { id: 1, name: "U. Nacional Medellín", short: "UNAL", color: "#00D68F", events: 4, students: "35,000", zona: "Robledo", verified: true },
  { id: 2, name: "EAFIT", short: "EAFIT", color: "#FF3060", events: 5, students: "15,000", zona: "El Poblado", verified: true },
  { id: 3, name: "U. de Antioquia", short: "UDEA", color: "#7C3AED", events: 6, students: "45,000", zona: "Ciudad Universitaria", verified: true },
  { id: 4, name: "UPB Medellín", short: "UPB", color: "#FFCC00", events: 3, students: "20,000", zona: "Laureles", verified: true },
  { id: 5, name: "ITM", short: "ITM", color: "#00C8FF", events: 2, students: "28,000", zona: "Fraternidad", verified: true },
  { id: 6, name: "Politécnico Colombiano", short: "POLI", color: "#FF8C00", events: 2, students: "22,000", zona: "Bello", verified: true }
];

export const INTERU_EVENTS: InterUEvent[] = [
  { id: 1, name: "Festival Inter-U Medellín 2026", unis: ["EAFIT", "UDEA", "UPB"], date: "Mar 5", emoji: "🎪", price: 20000, attendees: 1200 },
  { id: 2, name: "Copa Universitaria Antioquia", unis: ["UNAL", "EAFIT", "ITM"], date: "Mar 8", emoji: "⚽", price: 0, attendees: 800 },
  { id: 3, name: "Hackathon Área Metro", unis: ["UNAL", "UDEA", "POLI"], date: "Mar 12", emoji: "💻", price: 0, attendees: 450 },
  { id: 4, name: "Noche Cultural Paisa", unis: ["UPB", "EAFIT", "UDEA"], date: "Mar 15", emoji: "🎭", price: 15000, attendees: 600 }
];
