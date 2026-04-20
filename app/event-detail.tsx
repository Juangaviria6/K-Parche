import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { EVENTS, fmt } from '../constants/mockData';
import { useSaved } from '../context/SavedContext';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const event = EVENTS.find(e => e.id.toString() === id) || EVENTS[0];
  const { isSaved, toggleSaved, isGoing, toggleGoing } = useSaved();
  const saved = isSaved(event.id);
  const going = isGoing(event.id);
  const baseAttendees = event.attendees ?? 0;
  const [localAttendees, setLocalAttendees] = React.useState(baseAttendees + (isGoing(event.id) ? 1 : 0));

  const handleGoingToggle = () => {
    const next = !going;
    setLocalAttendees(count => Math.max(0, count + (next ? 1 : -1)));
    toggleGoing(event.id);
  };

  const shareEvent = async () => {
    try {
      const price = fmt(event.price ?? 0);
      await Share.share({
        message: `🎉 ¡Te invito a ${event.name ?? 'este evento'}!\n📍 ${event.place ?? 'lugar por confirmar'}\n📅 ${event.date ?? ''} · ${event.time ?? ''}\n💰 ${price}\n\n${event.desc ?? ''}\n\n#KPARCHE`
      });
    } catch {
      // el usuario canceló o la plataforma no soporta Share
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroBox}>
          <Image source={{ uri: event.img }} style={styles.heroImg} />
          <LinearGradient
            colors={['transparent', COLORS.bg]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0, y: 1 }}
          />

          <TouchableOpacity style={[styles.navBtn, { left: 16 }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navBtn, { right: 16 }]} onPress={() => toggleSaved(event.id)}>
            <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={24} color={saved ? COLORS.yellow : COLORS.white} />
          </TouchableOpacity>

          <View style={styles.heroInfo}>
            <View style={[styles.badge, { backgroundColor: event.color }]}>
              <Text style={styles.badgeText}>{event.type}</Text>
            </View>
            <Text style={styles.title}>{event.name}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {[
            { i: 'location-outline', l: 'Lugar', v: event.place },
            { i: 'time-outline', l: 'Hora', v: event.time },
            { i: 'calendar-outline', l: 'Fecha', v: event.date },
            { i: 'people-outline', l: 'Asistentes', v: localAttendees.toString() },
            { i: 'star-outline', l: 'Rating', v: event.rating.toString() },
            { i: 'cash-outline', l: 'Precio', v: fmt(event.price) }
          ].map(item => (
            <View key={item.l} style={styles.cardInfo}>
              <Ionicons name={item.i as any} size={28} color={event.color} style={{ marginBottom: 8 }} />
              <Text style={styles.cardL}>{item.l}</Text>
              <Text style={styles.cardV}>{item.v}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.secTitle}>Sobre el evento</Text>
          <Text style={styles.desc}>{event.desc}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.secTitle}>Quién va ({localAttendees})</Text>
          <View style={styles.avatars}>
            {['🧑', '👨', '👩', '👧', '👵'].map((em, i) => (
              <View key={i} style={[styles.avatar, { marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i }]}>
                <Text style={{ fontSize: 20 }}>{em}</Text>
              </View>
            ))}
            <View style={[styles.avatar, { marginLeft: -10, backgroundColor: COLORS.accent }]}>
              <Text style={{ fontSize: 10, color: COLORS.white, fontWeight: 'bold' }}>+{Math.max(0, localAttendees - 5)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.mapPreview}>
            <Text style={{ fontSize: 40 }}>🗺️</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.cta}>
        <TouchableOpacity
          style={{ flex: 2 }}
          onPress={handleGoingToggle}
          activeOpacity={0.8}
        >
          {going ? (
            <View style={[styles.mainBtnWrapper, { backgroundColor: COLORS.green }]}>
              <Text style={styles.mainBtnTxt}>✅ ¡Confirmado! Voy</Text>
            </View>
          ) : (
            <LinearGradient colors={[COLORS.accent, COLORS.violet]} style={styles.mainBtnWrapper}>
              <Text style={styles.mainBtnTxt}>🎟️ Quiero ir</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareBtn} onPress={shareEvent}>
          <Text style={styles.shareBtnTxt}>🔗 Compartir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 120 },
  heroBox: { height: 260, position: 'relative' },
  heroImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  navBtn: { position: 'absolute', top: 48, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  heroInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  badgeText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 10 },
  cardInfo: { width: '31%', backgroundColor: COLORS.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  cardL: { fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', marginBottom: 4 },
  cardV: { fontSize: 13, color: COLORS.white, fontWeight: 'bold' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  secTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  desc: { fontSize: 14, color: COLORS.muted, lineHeight: 22 },
  avatars: { flexDirection: 'row' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.card2, borderWidth: 2, borderColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  mapPreview: { height: 100, backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  cta: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: COLORS.bg, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', gap: 12 },
  mainBtnWrapper: { borderRadius: 14, padding: 16, alignItems: 'center' },
  mainBtnTxt: { color: COLORS.white, fontWeight: '800', fontSize: 15 },
  shareBtn: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  shareBtnTxt: { color: COLORS.text, fontWeight: '600', fontSize: 14 }
});
