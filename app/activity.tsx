import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useSaved } from '../context/SavedContext';
import { useEventsByIds } from '../hooks/useEventsByIds';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const { goingIds, savedIds, points } = useSaved();
  const { events: goingEvents } = useEventsByIds(goingIds);
  const { events: savedEvents } = useEventsByIds(savedIds);

  const stats = [
    { icon: '🎪', label: 'Eventos confirmados', value: goingIds.length },
    { icon: '🔖', label: 'Eventos guardados',   value: savedIds.length },
    { icon: '⭐', label: 'Puntos acumulados',   value: points },
    { icon: '🎟️', label: 'Puntos por evento',   value: 50 },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>📊 Mi Actividad</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Going events */}
        {goingEvents.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>✅ Eventos confirmados</Text>
            {goingEvents.map(e => (
              <TouchableOpacity
                key={e.id}
                style={styles.eventRow}
                onPress={() => router.push({ pathname: '/event-detail', params: { id: e.id } })}
              >
                <View style={[styles.eventEmoji, { backgroundColor: (e.color ?? COLORS.accent) + '22' }]}>
                  <Text style={{ fontSize: 20 }}>{e.emoji ?? '🎈'}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName} numberOfLines={1}>{e.name}</Text>
                  <Text style={styles.eventSub} numberOfLines={1}>📍 {e.place} · {e.date}</Text>
                </View>
                <View style={styles.pointsChip}>
                  <Text style={styles.pointsChipText}>+50 ⭐</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Saved events */}
        {savedEvents.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>🔖 Eventos guardados</Text>
            {savedEvents.map(e => (
              <TouchableOpacity
                key={e.id}
                style={styles.eventRow}
                onPress={() => router.push({ pathname: '/event-detail', params: { id: e.id } })}
              >
                <View style={[styles.eventEmoji, { backgroundColor: (e.color ?? COLORS.accent) + '22' }]}>
                  <Text style={{ fontSize: 20 }}>{e.emoji ?? '🎈'}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName} numberOfLines={1}>{e.name}</Text>
                  <Text style={styles.eventSub} numberOfLines={1}>📍 {e.place} · {e.date}</Text>
                </View>
                <Ionicons name="bookmark" size={16} color={COLORS.accent} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {goingIds.length === 0 && savedIds.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>Sin actividad aún</Text>
            <Text style={styles.emptyDesc}>Explora eventos, guárdalos y confirma asistencia para ver tu historial aquí.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 16, paddingBottom: 20, backgroundColor: COLORS.surface, flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  content: { padding: 16, paddingBottom: 100 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '900', color: COLORS.white, marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', textAlign: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  eventEmoji: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  eventInfo: { flex: 1 },
  eventName: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  eventSub: { color: COLORS.muted, fontSize: 11 },
  pointsChip: { backgroundColor: COLORS.yellow + '22', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pointsChipText: { color: COLORS.yellow, fontSize: 11, fontWeight: 'bold' },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptyDesc: { color: COLORS.muted, fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
