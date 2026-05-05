import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';

const NOTIF_KEY = '@kparche_notifications';

const NOTIFICATION_ITEMS = [
  { key: 'new_events',    icon: '🎉', title: 'Nuevos eventos',       desc: 'Cuando se publique un evento en tu zona' },
  { key: 'going_remind',  icon: '⏰', title: 'Recordatorios',        desc: '2 horas antes de eventos confirmados' },
  { key: 'points',        icon: '⭐', title: 'Puntos ganados',        desc: 'Al confirmar asistencia a un evento' },
  { key: 'benefits',      icon: '🎁', title: 'Nuevos beneficios',     desc: 'Cuando desbloqueas una recompensa' },
  { key: 'uni_events',    icon: '🎓', title: 'Eventos universitarios', desc: 'Eventos de tu universidad aliada' },
  { key: 'promotions',    icon: '🏷️', title: 'Promociones',           desc: 'Descuentos y ofertas especiales' },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    new_events: true, going_remind: true, points: true,
    benefits: true, uni_events: false, promotions: false,
  });

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY).then(val => {
      if (val) setPrefs(JSON.parse(val));
    });
  }, []);

  const toggle = (key: string) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(next));
      return next;
    });
  };

  const enabledCount = Object.values(prefs).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>🔔 Notificaciones</Text>
          <Text style={styles.subtitle}>{enabledCount} de {NOTIFICATION_ITEMS.length} activas</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {NOTIFICATION_ITEMS.map((item, idx) => (
            <View key={item.key} style={[styles.row, idx === NOTIFICATION_ITEMS.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.iconBox}>
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
              </View>
              <Switch
                value={prefs[item.key] ?? false}
                onValueChange={() => toggle(item.key)}
                trackColor={{ false: COLORS.border, true: COLORS.accent + '88' }}
                thumbColor={prefs[item.key] ? COLORS.accent : COLORS.muted}
              />
            </View>
          ))}
        </View>

        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.muted} />
          <Text style={styles.hintText}>
            Las notificaciones push requieren un build nativo. Estas preferencias se guardan localmente y se aplicarán cuando estén disponibles.
          </Text>
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
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  content: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.card2, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  itemTitle: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  itemDesc: { color: COLORS.muted, fontSize: 12 },
  hint: { flexDirection: 'row', gap: 8, backgroundColor: COLORS.card, borderRadius: 12, padding: 12, marginTop: 16, borderWidth: 1, borderColor: COLORS.border },
  hintText: { color: COLORS.muted, fontSize: 12, flex: 1, lineHeight: 18 },
});
