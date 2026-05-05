import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { EventCard } from '../../components/EventCard';
import { router } from 'expo-router';
import { useSaved } from '../../context/SavedContext';
import { useEventsByIds } from '../../hooks/useEventsByIds';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { savedIds } = useSaved();
  const { events: savedEvents, loading } = useEventsByIds(savedIds);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>🔖 Guardados</Text>
        <Text style={styles.subtitle}>
          {savedIds.length > 0
            ? `${savedIds.length} evento${savedIds.length === 1 ? '' : 's'} guardado${savedIds.length === 1 ? '' : 's'}`
            : 'Aún no tienes guardados'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
        ) : (
          savedEvents.map(e => (
            <EventCard
              key={e.id}
              event={e}
              onPress={() => router.push({ pathname: '/event-detail', params: { id: e.id } })}
            />
          ))
        )}

        {!loading && savedIds.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🎪</Text>
            <Text style={styles.emptyTitle}>Explora y guarda más eventos</Text>
            <Text style={styles.emptyDesc}>Encuentra los mejores parches en Medellín y agrégalos a tu lista.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 16, paddingBottom: 20, backgroundColor: COLORS.surface },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  content: { padding: 16, paddingBottom: 100 },
  emptyCard: { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 16, padding: 32, alignItems: 'center', marginTop: 16 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  emptyDesc: { color: COLORS.muted, fontSize: 14, textAlign: 'center', paddingHorizontal: 20 },
});
