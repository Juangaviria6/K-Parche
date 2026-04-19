import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { UNIVERSITIES, EVENTS } from '../constants/mockData';
import { EventCard } from '../components/EventCard';

export default function UniversityDetailScreen() {
  const { id } = useLocalSearchParams();
  const uni = UNIVERSITIES.find(u => u.id.toString() === id) || UNIVERSITIES[0];
  const uniEvents = EVENTS.filter(e => e.uniShort === uni.short);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[uni.color + '44', COLORS.bg]}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={[styles.iconBox, { backgroundColor: uni.color + '33', borderColor: uni.color }]}>
            <Text style={styles.iconEmoji}>🏛️</Text>
          </View>

          <Text style={styles.uniName}>{uni.name}</Text>
          <Text style={styles.uniZona}>{uni.zona}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{uni.students}</Text>
              <Text style={styles.statLabel}>Estudiantes</Text>
            </View>
            <View style={[styles.statDivider]} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: uni.color }]}>{uniEvents.length}</Text>
              <Text style={styles.statLabel}>Eventos activos</Text>
            </View>
            <View style={[styles.statDivider]} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: COLORS.green }]}>✓</Text>
              <Text style={styles.statLabel}>Aliada K'Parche</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos activos</Text>

          {uniEvents.length > 0 ? (
            uniEvents.map(e => (
              <EventCard
                key={e.id}
                event={e}
                onPress={() => router.push({ pathname: '/event-detail', params: { id: e.id } })}
              />
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>Sin eventos activos</Text>
              <Text style={styles.emptyDesc}>
                {uni.name} no tiene eventos publicados en este momento.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 40 },
  hero: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 32, alignItems: 'center' },
  backBtn: {
    position: 'absolute', top: 48, left: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconBox: {
    width: 72, height: 72, borderRadius: 20,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  iconEmoji: { fontSize: 36 },
  uniName: { fontSize: 22, fontWeight: '900', color: COLORS.text, textAlign: 'center', marginBottom: 4 },
  uniZona: { fontSize: 13, color: COLORS.muted, marginBottom: 24 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 16, paddingHorizontal: 8,
    width: '100%',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: COLORS.text, marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.muted, textAlign: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.border },
  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  emptyBox: {
    borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed',
    borderRadius: 16, padding: 32, alignItems: 'center',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  emptyDesc: { color: COLORS.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
