import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { useSaved } from '../context/SavedContext';

const BENEFITS = [
  { pts: 0,   icon: '🎟️', title: 'Acceso a K\'Parche',         desc: 'Explora eventos gratuitos y de pago en toda el Área Metro.',                  color: COLORS.green },
  { pts: 100, icon: '☕',  title: 'Café gratis en aliados',      desc: 'Canjea un café en bares y cafeterías aliadas de K\'Parche.',                  color: '#FFCC00' },
  { pts: 200, icon: '🏷️', title: '10% descuento en entradas',   desc: 'Aplica en eventos seleccionados con el código KPARCHE10.',                    color: COLORS.accent },
  { pts: 300, icon: '📌', title: 'Pin VIP en el mapa',           desc: 'Tu ubicación y eventos publicados se destacan con un pin especial.',          color: COLORS.violet },
  { pts: 400, icon: '🎪', title: 'Acceso anticipado',            desc: 'Conoce los eventos antes que nadie y reserva tu lugar con prioridad.',        color: '#00C8FF' },
  { pts: 500, icon: '👑', title: 'Membresía Embajador',          desc: '20% descuento en todos los eventos, pin animado y badge exclusivo en perfil.', color: '#FFD700' },
];

export default function BenefitsScreen() {
  const insets = useSafeAreaInsets();
  const { points } = useSaved();

  const MAX = 500;
  const progressPct = Math.min(1, points / MAX);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>🎁 Beneficios</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Points summary */}
        <LinearGradient colors={[COLORS.violet, COLORS.accent]} style={styles.pointsCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.pLabel}>Tus puntos actuales</Text>
          <Text style={styles.pNum}>{points} ⭐</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${progressPct * 100}%` }]} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={styles.pSub}>0</Text>
            <Text style={styles.pSub}>500 pts (nivel máximo)</Text>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Tus recompensas</Text>

        {BENEFITS.map((b) => {
          const unlocked = points >= b.pts;
          return (
            <View key={b.pts} style={[styles.benefitCard, !unlocked && styles.benefitLocked]}>
              <View style={[styles.iconBox, { backgroundColor: unlocked ? b.color + '22' : COLORS.card2, borderColor: unlocked ? b.color + '55' : COLORS.border }]}>
                <Text style={styles.benefitIcon}>{unlocked ? b.icon : '🔒'}</Text>
              </View>
              <View style={styles.benefitInfo}>
                <View style={styles.benefitRow}>
                  <Text style={[styles.benefitTitle, !unlocked && { color: COLORS.muted }]}>{b.title}</Text>
                  <View style={[styles.ptsBadge, { backgroundColor: unlocked ? b.color + '22' : COLORS.card2 }]}>
                    <Text style={[styles.ptsBadgeText, { color: unlocked ? b.color : COLORS.muted }]}>
                      {b.pts === 0 ? 'Gratis' : `${b.pts} pts`}
                    </Text>
                  </View>
                </View>
                <Text style={styles.benefitDesc} numberOfLines={2}>{b.desc}</Text>
                {unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Ionicons name="checkmark-circle" size={12} color={COLORS.green} />
                    <Text style={styles.unlockedText}>Desbloqueado</Text>
                  </View>
                )}
                {!unlocked && (
                  <Text style={styles.lockedHint}>Necesitas {b.pts - points} puntos más</Text>
                )}
              </View>
            </View>
          );
        })}

        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.muted} />
          <Text style={styles.hintText}>Gana 50 puntos por cada evento al que confirmes asistencia con "Quiero ir".</Text>
        </View>
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
  pointsCard: { borderRadius: 20, padding: 20, marginBottom: 24 },
  pLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  pNum: { fontSize: 36, fontWeight: '900', color: COLORS.white, marginBottom: 12 },
  pSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  barBg: { backgroundColor: 'rgba(255,255,255,0.2)', height: 8, borderRadius: 8 },
  barFill: { backgroundColor: COLORS.white, height: 8, borderRadius: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  benefitCard: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, gap: 12 },
  benefitLocked: { opacity: 0.6 },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  benefitIcon: { fontSize: 24 },
  benefitInfo: { flex: 1 },
  benefitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  benefitTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700', flex: 1 },
  ptsBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  ptsBadgeText: { fontSize: 11, fontWeight: 'bold' },
  benefitDesc: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginBottom: 4 },
  unlockedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  unlockedText: { color: COLORS.green, fontSize: 11, fontWeight: '700' },
  lockedHint: { color: COLORS.muted, fontSize: 11 },
  hint: { flexDirection: 'row', gap: 8, backgroundColor: COLORS.card, borderRadius: 12, padding: 12, marginTop: 8, borderWidth: 1, borderColor: COLORS.border },
  hintText: { color: COLORS.muted, fontSize: 12, flex: 1, lineHeight: 18 },
});
