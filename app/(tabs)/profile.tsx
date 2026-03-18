import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <LinearGradient colors={[COLORS.accent + '33', 'transparent']} style={styles.header}>
        <View style={styles.avatarBox}>
          <LinearGradient colors={[COLORS.accent, COLORS.violet]} style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧑</Text>
          </LinearGradient>
        </View>

        <Text style={styles.name}>Santiago Restrepo</Text>
        <Text style={styles.email}>santiago@eafit.edu.co</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>🎓 Estudiante Verificado — EAFIT</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsGrid}>
        {[ 
          { i: '🎪', v: '12', l: 'Asistidos' },
          { i: '⭐', v: '340', l: 'Puntos U' },
          { i: '🔖', v: '8', l: 'Guardados' },
          { i: '🏆', v: '5', l: 'Logros' }
        ].map(s => (
          <View key={s.l} style={styles.statCard}>
            <Text style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</Text>
            <Text style={styles.statV}>{s.v}</Text>
            <Text style={styles.statL}>{s.l}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <LinearGradient 
          colors={[COLORS.violet, COLORS.accent]} 
          style={styles.pointsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.pLabel}>Puntos U acumulados</Text>
          <Text style={styles.pNum}>340 ⭐</Text>
          <Text style={styles.pSub}>160 puntos más para tu próximo beneficio exclusivo</Text>
          
          <View style={styles.barBg}>
            <View style={styles.barFill} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={styles.pSub}>0</Text>
            <Text style={styles.pSub}>500</Text>
          </View>
        </LinearGradient>

        <View style={styles.menu}>
          {[ 
            { i: 'ticket', n: 'Mis boletas', s: '2 eventos próximos' },
            { i: 'gift', n: 'Beneficios', s: '3 descuentos disponibles' },
            { i: 'bar-chart', n: 'Mi actividad', s: 'Ver historial completo' },
            { i: 'notifications', n: 'Notificaciones', s: 'Personalizadas por zona' },
            { i: 'lock-closed', n: 'Privacidad', s: '' },
            { i: 'chatbubble', n: 'Soporte', s: 'Ayuda 24/7' },
            { i: 'log-out', n: 'Cerrar sesión', s: '', d: true }
          ].map((m, idx) => (
            <TouchableOpacity key={m.n} style={[styles.menuItem, idx === 6 && { borderBottomWidth: 0 }]}>
              <View style={styles.menuIcon}>
                <Ionicons name={m.i as any} size={20} color={m.d ? COLORS.accent : COLORS.white} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={[styles.menuName, m.d && { color: COLORS.accent }]}>{m.n}</Text>
                {!!m.s && <Text style={styles.menuSub}>{m.s}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={22} color={COLORS.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingTop: 60, alignItems: 'center', paddingBottom: 24, paddingHorizontal: 16 },
  avatarBox: { shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 20, marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 40 },
  name: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  email: { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
  badge: { backgroundColor: COLORS.green + '22', borderWidth: 1, borderColor: COLORS.green + '44', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText: { color: COLORS.green, fontSize: 12, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  statV: { fontSize: 24, fontWeight: '900', color: COLORS.white, marginBottom: 4 },
  statL: { fontSize: 11, color: COLORS.muted, textTransform: 'uppercase' },
  pointsCard: { borderRadius: 20, padding: 24, marginBottom: 16 },
  pLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  pNum: { fontSize: 42, fontWeight: '900', color: COLORS.white, marginBottom: 12 },
  pSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  barBg: { backgroundColor: 'rgba(255,255,255,0.2)', height: 8, borderRadius: 8, marginTop: 16 },
  barFill: { backgroundColor: COLORS.white, height: 8, borderRadius: 8, width: '68%' },
  menu: { backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 14 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.card2, alignItems: 'center', justifyContent: 'center' },
  menuInfo: { flex: 1 },
  menuName: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  menuSub: { color: COLORS.muted, fontSize: 11, marginTop: 2 }
});
