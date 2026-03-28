import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { mapStyle } from '../../constants/mapStyle'; // Let's simplify without external complex mapStyle for now
import { CategoryPill } from '../../components/CategoryPill';
import { EventCard } from '../../components/EventCard';
import { MapPinMarker } from '../../components/MapPinMarker';
import { EventCategory } from '../../constants/types';
import { useFilteredEvents } from '../../hooks/useFilteredEvents';


const EventMapMarker = ({ event, selected, onSelect }: any) => {
  const [tracksView, setTracksView] = useState(true);
  const lastPress = useRef(0);

  useEffect(() => {
    setTracksView(true);
    const timeout = setTimeout(() => {
      setTracksView(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [selected]);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastPress.current < 400) {
      router.push({ pathname: '/event-detail', params: { id: event.id } });
    } else {
      onSelect(event.id);
    }
    lastPress.current = now;
  };

  return (
    <Marker
      coordinate={{ latitude: event.latitude, longitude: event.longitude }}
      onPress={handlePress}
      tracksViewChanges={tracksView}
      anchor={{ x: 0.5, y: 1 }}
    >
      <MapPinMarker event={event} selected={selected} />
    </Marker>
  );
};

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('todos');
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100000);

  const filteredEvents = useFilteredEvents(search, selectedCategory, maxPrice);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar eventos en Medellín..."
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity 
            style={[styles.filterBtn, showFilter && { backgroundColor: COLORS.accent }]}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Text>⚙️</Text>
          </TouchableOpacity>
        </View>

        {showFilter && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterLabel}>💰 Precio máximo: $`{maxPrice.toLocaleString('es-CO')}</Text>
            <View style={styles.pricePills}>
              {[ {l: 'Todos', v: 1000000}, {l: 'GRATIS', v: 0}, {l: '$25k', v: 25000}, {l: '$50k', v: 50000}].map(p => (
                <TouchableOpacity 
                  key={p.l} 
                  style={[styles.pricePill, maxPrice === p.v && { backgroundColor: COLORS.accent }]}
                  onPress={() => setMaxPrice(p.v)}
                >
                  <Text style={styles.pricePillText}>{p.l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.catScrollBox}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {(['todos', 'electronica', 'gastronomia', 'concierto', 'arte', 'academico', 'integracion', 'musica'] as EventCategory[]).map(cat => (
              <CategoryPill 
                key={cat} 
                label={cat} 
                active={selectedCategory === cat} 
                onPress={() => setSelectedCategory(cat)} 
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.2442,
          longitude: -75.5812,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
        showsUserLocation
      >
        {filteredEvents.map(event => (
          <EventMapMarker
            key={event.id}
            event={event}
            selected={selectedPin === event.id}
            onSelect={(id: number) => setSelectedPin(id)}
          />
        ))}
      </MapView>

      <View style={styles.mapBadge}>
        <Text style={styles.mapBadgeText}>📍 Medellín · Área Metro · {filteredEvents.length} eventos</Text>
      </View>

      <View style={styles.bottomStrip}>
        <LinearGradient
          colors={['transparent', COLORS.bg]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.bottomContent}>
          <Text style={styles.stripTitle}>🎉 {filteredEvents.length} eventos hoy</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filteredEvents}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 14 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.miniCard}
                onPress={() => router.push({ pathname: '/event-detail', params: { id: item.id } })}
              >
                <View style={styles.miniRow}>
                  <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                  <View style={[styles.miniTime, { backgroundColor: item.color }]}>
                    <Text style={styles.miniTimeText}>{item.time}</Text>
                  </View>
                </View>
                <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.miniPlace} numberOfLines={1}>{item.place}</Text>
                <Text style={[styles.miniPrice, { color: item.price === 0 ? COLORS.green : COLORS.accent }]}>
                  {item.price === 0 ? 'GRATIS' : `$${item.price.toLocaleString('es-CO')}`}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { backgroundColor: COLORS.surface, paddingTop: 40, paddingBottom: 10 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  searchInput: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 16, color: COLORS.text, height: 48 },
  filterBtn: { width: 48, height: 48, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  filterPanel: { paddingHorizontal: 16, marginBottom: 12 },
  filterLabel: { color: COLORS.text, fontSize: 13, marginBottom: 8, fontWeight: '600' },
  pricePills: { flexDirection: 'row', gap: 8 },
  pricePill: { backgroundColor: COLORS.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  pricePillText: { color: COLORS.text, fontSize: 12, fontWeight: 'bold' },
  catScrollBox: { paddingBottom: 4 },
  catScroll: { paddingHorizontal: 16 },
  map: { flex: 1 },
  mapBadge: { position: 'absolute', bottom: 180, left: 12, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  mapBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  bottomStrip: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 },
  bottomContent: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
  stripTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginLeft: 14, marginBottom: 10, backgroundColor: COLORS.bg, alignSelf: 'flex-start', paddingHorizontal: 8, borderRadius: 4 },
  miniCard: { width: 150, backgroundColor: COLORS.card2, borderRadius: 14, padding: 10, borderWidth: 1, borderColor: COLORS.border, marginRight: 10 },
  miniRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  miniTime: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  miniTimeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  miniName: { color: COLORS.text, fontSize: 12, fontWeight: '700', marginBottom: 2 },
  miniPlace: { color: COLORS.muted, fontSize: 10, marginBottom: 6 },
  miniPrice: { fontSize: 12, fontWeight: '800' }
});
