import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { useSaved } from '../context/SavedContext';
import { useEventsByIds } from '../hooks/useEventsByIds';

export default function MyTicketsScreen() {
  const insets = useSafeAreaInsets();
  const { goingIds } = useSaved();
  const { events, loading } = useEventsByIds(goingIds);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>🎫 Mis Boletas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading && <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />}

        {!loading && events.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎟️</Text>
            <Text style={styles.emptyTitle}>Sin boletas aún</Text>
            <Text style={styles.emptyDesc}>Confirma asistencia a eventos tocando "Quiero ir" para ver tus boletas aquí.</Text>
            <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push('/(tabs)/')}>
              <Text style={styles.exploreBtnText}>Explorar eventos</Text>
            </TouchableOpacity>
          </View>
        )}

        {events.map(event => (
          <TouchableOpacity
            key={event.id}
            style={styles.ticket}
            onPress={() => router.push({ pathname: '/event-detail', params: { id: event.id } })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[event.color ?? COLORS.accent, COLORS.card]}
              style={styles.ticketTop}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <Text style={styles.ticketEmoji}>{event.emoji ?? '🎈'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.ticketName} numberOfLines={1}>{event.name}</Text>
                <Text style={styles.ticketPlace} numberOfLines={1}>📍 {event.place}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                <Text style={styles.statusText}>✅ Confirmado</Text>
              </View>
            </LinearGradient>

            <View style={styles.ticketBottom}>
              <View style={styles.ticketDivider}>
                <View style={styles.notchLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.notchRight} />
              </View>
              <View style={styles.ticketInfo}>
                <View style={styles.ticketField}>
                  <Text style={styles.fieldLabel}>FECHA</Text>
                  <Text style={styles.fieldValue}>{event.date ?? '-'}</Text>
                </View>
                <View style={styles.ticketField}>
                  <Text style={styles.fieldLabel}>HORA</Text>
                  <Text style={styles.fieldValue}>{event.time ?? '-'}</Text>
                </View>
                <View style={styles.ticketField}>
                  <Text style={styles.fieldLabel}>PRECIO</Text>
                  <Text style={[styles.fieldValue, { color: event.price === 0 ? COLORS.green : COLORS.accent }]}>
                    {event.price === 0 ? 'GRATIS' : `$${(event.price ?? 0).toLocaleString('es-CO')}`}
                  </Text>
                </View>
                <View style={styles.ticketField}>
                  <Text style={styles.fieldLabel}>PUNTOS</Text>
                  <Text style={[styles.fieldValue, { color: COLORS.yellow }]}>+50 ⭐</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptyDesc: { color: COLORS.muted, fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  exploreBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  exploreBtnText: { color: COLORS.white, fontWeight: '800' },
  ticket: { backgroundColor: COLORS.card, borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  ticketTop: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  ticketEmoji: { fontSize: 32 },
  ticketName: { color: COLORS.white, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  ticketPlace: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: COLORS.white, fontSize: 11, fontWeight: 'bold' },
  ticketBottom: { backgroundColor: COLORS.card },
  ticketDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 0 },
  notchLeft: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.bg, marginLeft: -8 },
  notchRight: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.bg, marginRight: -8 },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed' },
  ticketInfo: { flexDirection: 'row', padding: 16, justifyContent: 'space-between' },
  ticketField: { alignItems: 'center' },
  fieldLabel: { color: COLORS.muted, fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  fieldValue: { color: COLORS.text, fontSize: 13, fontWeight: '800' },
});
