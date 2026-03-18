import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { EVENTS } from '../../constants/mockData';
import { EventCard } from '../../components/EventCard';
import { router } from 'expo-router';

export default function SavedScreen() {
  const savedEvents = EVENTS.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔖 Guardados</Text>
        <Text style={styles.subtitle}>{savedEvents.length} eventos para ti</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {savedEvents.map(e => (
          <EventCard key={e.id} event={e} onPress={() => router.push({ pathname: '/event-detail', params: { id: e.id }})} />
        ))}

        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🎪</Text>
          <Text style={styles.emptyTitle}>Explora y guarda más eventos</Text>
          <Text style={styles.emptyDesc}>Encuentra los mejores parches en Medellín y agrégalos a tu lista.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 20, backgroundColor: COLORS.surface },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  content: { padding: 16, paddingBottom: 100 },
  emptyCard: { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 16, padding: 32, alignItems: 'center', marginTop: 16 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  emptyDesc: { color: COLORS.muted, fontSize: 14, textAlign: 'center', paddingHorizontal: 20 }
});
