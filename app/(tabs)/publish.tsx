import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Image, Alert, ActivityIndicator, Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import CryptoJS from 'crypto-js';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

// ─── Date Picker ─────────────────────────────────────────────────────────────
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const SHORT_MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function DatePickerModal({ visible, onClose, onSelect }: { visible: boolean; onClose: () => void; onSelect: (date: string, iso: string) => void }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<number | null>(null);

  const days = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const todayDay = today.getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelected(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelected(null);
  };

  const confirm = () => {
    if (!selected) return;
    const d = new Date(year, month, selected);
    const display = `${selected} ${SHORT_MONTHS[month]} ${year}`;
    const iso = d.toISOString().split('T')[0];
    onSelect(display, iso);
    onClose();
  };

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({length: days}, (_, i) => i + 1)];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={dp.overlay}>
        <View style={dp.sheet}>
          <View style={dp.header}>
            <TouchableOpacity onPress={prevMonth}><Ionicons name="chevron-back" size={22} color={COLORS.text} /></TouchableOpacity>
            <Text style={dp.monthTitle}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth}><Ionicons name="chevron-forward" size={22} color={COLORS.text} /></TouchableOpacity>
          </View>

          <View style={dp.weekRow}>
            {['D','L','M','X','J','V','S'].map(d => (
              <Text key={d} style={dp.weekDay}>{d}</Text>
            ))}
          </View>

          <View style={dp.grid}>
            {cells.map((day, i) => {
              const isPast = isCurrentMonth && day !== null && day < todayDay;
              const isSelected = day === selected;
              return (
                <TouchableOpacity
                  key={i}
                  style={[dp.cell, isSelected && dp.cellSelected, (!day || isPast) && dp.cellDisabled]}
                  onPress={() => day && !isPast && setSelected(day)}
                  disabled={!day || isPast}
                >
                  <Text style={[dp.cellText, isSelected && dp.cellTextSelected, isPast && dp.cellTextDisabled]}>
                    {day ?? ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[dp.confirmBtn, !selected && { opacity: 0.4 }]}
            onPress={confirm}
            disabled={!selected}
          >
            <Text style={dp.confirmText}>Confirmar fecha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const dp = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  monthTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', color: COLORS.muted, fontSize: 12, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100/7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  cellSelected: { backgroundColor: COLORS.accent },
  cellDisabled: { opacity: 0.3 },
  cellText: { color: COLORS.text, fontSize: 14 },
  cellTextSelected: { color: COLORS.white, fontWeight: 'bold' },
  cellTextDisabled: { color: COLORS.muted },
  confirmBtn: { backgroundColor: COLORS.accent, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
  confirmText: { color: COLORS.white, fontWeight: '800', fontSize: 15 },
});

// ─── Time Picker ─────────────────────────────────────────────────────────────
const TIME_SECTIONS = [
  { label: '☀️  Mañana',    slots: ['8AM','9AM','10AM','11AM'] },
  { label: '🌅  Tarde',     slots: ['12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM'] },
  { label: '🌙  Noche',     slots: ['8PM','9PM','10PM','11PM'] },
  { label: '✨  Madrugada', slots: ['12AM','1AM','2AM'] },
];

function TimePickerModal({ visible, onClose, onSelect, current }: { visible: boolean; onClose: () => void; onSelect: (t: string) => void; current: string }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={dp.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={tp.sheet}>
          <View style={tp.handle} />

          <View style={tp.titleRow}>
            <Text style={tp.title}>¿A qué hora empieza?</Text>
            {!!current && (
              <View style={tp.currentBadge}>
                <Text style={tp.currentBadgeText}>{current}</Text>
              </View>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {TIME_SECTIONS.map(section => (
              <View key={section.label} style={{ marginBottom: 20 }}>
                <Text style={tp.sectionLabel}>{section.label}</Text>
                <View style={tp.grid}>
                  {section.slots.map(slot => {
                    const active = slot === current;
                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[tp.pill, active && tp.pillActive]}
                        onPress={() => { onSelect(slot); onClose(); }}
                        activeOpacity={0.75}
                      >
                        <Text style={[tp.pillText, active && tp.pillTextActive]}>{slot}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const tp = StyleSheet.create({
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 8, maxHeight: '75%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  currentBadge: { backgroundColor: COLORS.accent + '22', borderWidth: 1, borderColor: COLORS.accent + '66', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  currentBadgeText: { color: COLORS.accent, fontWeight: '800', fontSize: 13 },
  sectionLabel: { color: COLORS.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12, minWidth: 72, alignItems: 'center' },
  pillActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  pillText: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  pillTextActive: { color: COLORS.white, fontWeight: '800' },
});

// ─── Location Picker ──────────────────────────────────────────────────────────
const MEDELLIN = { latitude: 6.2442, longitude: -75.5812 };

function LocationPickerModal({ visible, onClose, onSelect, coords }: {
  visible: boolean; onClose: () => void;
  onSelect: (lat: number, lng: number) => void;
  coords: { latitude: number; longitude: number };
}) {
  const [pin, setPin] = useState(coords);

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{ ...MEDELLIN, latitudeDelta: 0.06, longitudeDelta: 0.06 }}
          onPress={e => setPin(e.nativeEvent.coordinate)}
        >
          <Marker coordinate={pin} />
        </MapView>

        <View style={lp.bar}>
          <Text style={lp.hint}>Toca el mapa para ubicar el evento</Text>
          <View style={lp.btns}>
            <TouchableOpacity style={lp.cancel} onPress={onClose}>
              <Text style={{ color: COLORS.muted, fontWeight: '600' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={lp.confirm} onPress={() => { onSelect(pin.latitude, pin.longitude); onClose(); }}>
              <Text style={{ color: COLORS.white, fontWeight: '800' }}>Confirmar ubicación</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const lp = StyleSheet.create({
  bar: { backgroundColor: COLORS.surface, padding: 16, paddingBottom: 32 },
  hint: { color: COLORS.muted, fontSize: 13, textAlign: 'center', marginBottom: 12 },
  btns: { flexDirection: 'row', gap: 10 },
  cancel: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, alignItems: 'center' },
  confirm: { flex: 2, backgroundColor: COLORS.accent, borderRadius: 12, padding: 14, alignItems: 'center' },
});

// ─── Emoji mapping ────────────────────────────────────────────────────────────
const TYPE_EMOJIS: Record<string, string> = {
  'Discoteca': '🎧',
  'Bar': '🍺',
  'Concierto': '🎸',
  'Taller': '🛠️',
  'Gastronomia': '🍜',
  'Teatro': '🎭',
  'Integracion': '🏆',
  'Electronica': '🎛️',
};

const EMOJI_OPTIONS = [
  '🎧','🎸','🍺','🍜','🎭','🏆','🎛️','💃','🎨','🎤',
  '🪩','🎺','🎻','🥁','🎮','⚽','🏄','🧘','🍕','🍣',
  '🎪','🎡','🌟','🔥','🎉','🎊','🎵','🎶','🍻','🥂',
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PublishScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [form, setForm] = useState({
    name: '', place: '', type: 'Discoteca',
    date: '', dateISO: '',
    time: '',
    price: '', desc: '',
    plan: 'basico' as 'basico' | 'destacado',
    emoji: TYPE_EMOJIS['Discoteca'],
    latitude: MEDELLIN.latitude,
    longitude: MEDELLIN.longitude,
  });

  const titles = { 1: 'Información básica', 2: 'Detalles y precio', 3: 'Confirmar' };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const publishEvent = async () => {
    if (!form.name || !form.place || !form.date || !form.time) {
      Alert.alert('Error', 'Por favor llena los campos requeridos');
      return;
    }
    setLoading(true);
    try {
      let imgUrl = '';
      if (imageUri) {
        const timestamp = Math.round(Date.now() / 1000).toString();
        const apiSecret = 'famhU1aIdmGlgP6PgmweQGvQXJU';
        const signature = CryptoJS.SHA1(`timestamp=${timestamp}${apiSecret}`).toString();
        const data = new FormData();
        data.append('file', { uri: imageUri, type: 'image/jpeg', name: 'upload.jpg' } as any);
        data.append('api_key', '778276968231184');
        data.append('timestamp', timestamp);
        data.append('signature', signature);
        const res = await fetch('https://api.cloudinary.com/v1_1/dlouforsb/image/upload', { method: 'POST', body: data });
        const uploadResult = await res.json();
        if (!uploadResult.secure_url) throw new Error('Error subiendo imagen');
        imgUrl = uploadResult.secure_url;
      }

      await addDoc(collection(db, 'events'), {
        name: form.name,
        place: form.place,
        type: form.type,
        cat: form.type.toLowerCase(),
        date: form.date,
        dateISO: form.dateISO,
        time: form.time,
        price: Number(form.price) || 0,
        desc: form.desc,
        plan: form.plan,
        img: imgUrl,
        emoji: form.emoji,
        color: COLORS.accent,
        latitude: form.latitude,
        longitude: form.longitude,
        rating: 0,
        attendees: 0,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('¡Éxito!', 'Tu evento se publicó correctamente', [{
        text: 'OK', onPress: () => {
          setForm({ name: '', place: '', type: 'Discoteca', date: '', dateISO: '', time: '', price: '', desc: '', plan: 'basico', emoji: TYPE_EMOJIS['Discoteca'], latitude: MEDELLIN.latitude, longitude: MEDELLIN.longitude });
          setImageUri(null);
          setStep(1);
          router.push('/(tabs)/');
        }
      }]);
    } catch (e: any) {
      Alert.alert('Error al publicar', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => step === 3 ? publishEvent() : setStep((step + 1) as 1 | 2 | 3);
  const handleBack = () => setStep(step > 1 ? (step - 1) as 1 | 2 | 3 : 1);

  const locationSet = form.latitude !== MEDELLIN.latitude || form.longitude !== MEDELLIN.longitude;

  return (
    <View style={styles.container}>
      <DatePickerModal
        visible={showDate}
        onClose={() => setShowDate(false)}
        onSelect={(date, iso) => setForm({ ...form, date, dateISO: iso })}
      />
      <TimePickerModal
        visible={showTime}
        onClose={() => setShowTime(false)}
        onSelect={time => setForm({ ...form, time })}
        current={form.time}
      />
      <LocationPickerModal
        visible={showLocation}
        onClose={() => setShowLocation(false)}
        onSelect={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
        coords={{ latitude: form.latitude, longitude: form.longitude }}
      />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>➕ Publicar Evento</Text>
        <View style={styles.progressRow}>
          {[1, 2, 3].map(s => (
            <View key={s} style={[styles.progressSeg, { backgroundColor: s <= step ? COLORS.accent : COLORS.border }]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>Paso {step} de 3 — {titles[step]}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {step === 1 && (
            <View>
              <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImg} />
                ) : (
                  <><Text style={styles.uploadEmoji}>📸</Text><Text style={styles.uploadText}>Subir imagen del evento</Text></>
                )}
              </TouchableOpacity>

              <TextInput style={styles.input} placeholder="Nombre del evento" placeholderTextColor={COLORS.muted} value={form.name} onChangeText={t => setForm({ ...form, name: t })} />
              <TextInput style={styles.input} placeholder="Lugar / Establecimiento" placeholderTextColor={COLORS.muted} value={form.place} onChangeText={t => setForm({ ...form, place: t })} />

              <Text style={styles.label}>Tipo de evento</Text>
              <View style={styles.pillGrid}>
                {['Discoteca', 'Bar', 'Concierto', 'Taller', 'Gastronomia', 'Teatro', 'Integracion', 'Electronica'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typePill, form.type === t && styles.typePillActive]} onPress={() => setForm({ ...form, type: t, emoji: TYPE_EMOJIS[t] ?? form.emoji })}>
                    <Text style={[styles.typePillText, form.type === t && { color: COLORS.white }]}>{TYPE_EMOJIS[t]} {t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { marginTop: 16 }]}>Emoji en el mapa</Text>
              <View style={styles.emojiPreviewRow}>
                <View style={styles.emojiPreviewBadge}>
                  <Text style={styles.emojiPreviewText}>{form.emoji}</Text>
                </View>
                <Text style={styles.emojiPreviewHint}>Así aparecerá tu evento en el mapa</Text>
              </View>
              <View style={styles.emojiGrid}>
                {EMOJI_OPTIONS.map(e => (
                  <TouchableOpacity key={e} style={[styles.emojiCell, form.emoji === e && styles.emojiCellActive]} onPress={() => setForm({ ...form, emoji: e })}>
                    <Text style={styles.emojiCellText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              {/* Date picker */}
              <Text style={styles.label}>📅 Fecha</Text>
              <TouchableOpacity style={[styles.pickerBtn, form.date && styles.pickerBtnFilled]} onPress={() => setShowDate(true)}>
                <Ionicons name="calendar-outline" size={18} color={form.date ? COLORS.text : COLORS.muted} />
                <Text style={[styles.pickerBtnText, form.date && { color: COLORS.text }]}>
                  {form.date || 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>

              {/* Time picker */}
              <Text style={[styles.label, { marginTop: 4 }]}>🕐 Hora</Text>
              <TouchableOpacity style={[styles.pickerBtn, form.time && styles.pickerBtnFilled]} onPress={() => setShowTime(true)}>
                <Ionicons name="time-outline" size={18} color={form.time ? COLORS.text : COLORS.muted} />
                <Text style={[styles.pickerBtnText, form.time && { color: COLORS.text }]}>
                  {form.time || 'Seleccionar hora'}
                </Text>
              </TouchableOpacity>

              <TextInput style={[styles.input, { marginTop: 16 }]} placeholder="Precio (0 = gratis)" keyboardType="numeric" placeholderTextColor={COLORS.muted} value={form.price} onChangeText={t => setForm({ ...form, price: t })} />
              <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Descripción" multiline placeholderTextColor={COLORS.muted} value={form.desc} onChangeText={t => setForm({ ...form, desc: t })} />

              {/* Location picker */}
              <Text style={styles.label}>📍 Ubicación en el mapa</Text>
              <TouchableOpacity style={[styles.pickerBtn, locationSet && styles.pickerBtnFilled]} onPress={() => setShowLocation(true)}>
                <Ionicons name="location-outline" size={18} color={locationSet ? COLORS.accent : COLORS.muted} />
                <Text style={[styles.pickerBtnText, locationSet && { color: COLORS.text }]}>
                  {locationSet ? `${form.latitude.toFixed(4)}, ${form.longitude.toFixed(4)}` : 'Seleccionar en el mapa'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>🚀 Plan de visibilidad</Text>
              <View style={styles.row}>
                <TouchableOpacity style={[styles.planCard, form.plan === 'basico' && styles.planCardActive]} onPress={() => setForm({ ...form, plan: 'basico' })}>
                  <Text style={[styles.planTitle, form.plan === 'basico' && { color: COLORS.accent }]}>Básico</Text>
                  <Text style={styles.planPrice}>Gratis</Text>
                  {['Publicación estándar', 'Pin básico en mapa'].map(f => <Text key={f} style={styles.planFeat}>• {f}</Text>)}
                </TouchableOpacity>
                <View style={{ width: 10 }} />
                <TouchableOpacity style={[styles.planCard, form.plan === 'destacado' && styles.planCardActive]} onPress={() => setForm({ ...form, plan: 'destacado' })}>
                  <Text style={[styles.planTitle, form.plan === 'destacado' && { color: COLORS.accent }]}>Destacado</Text>
                  <Text style={styles.planPrice}>$49.900</Text>
                  {['Pin especial animado', 'Notificaciones push'].map(f => <Text key={f} style={styles.planFeat}>• {f}</Text>)}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmEmoji}>🎉</Text>
              <Text style={styles.confirmTitle}>¡Todo listo para publicar!</Text>
              <Text style={styles.confirmSub}>Revisa la información antes de continuar.</Text>
              <View style={styles.summaryCard}>
                {[
                  { k: 'Evento', v: form.name },
                  { k: 'Lugar', v: form.place },
                  { k: 'Tipo', v: form.type },
                  { k: 'Fecha', v: `${form.date} · ${form.time}` },
                  { k: 'Precio', v: !form.price || form.price === '0' ? 'GRATIS' : `$${form.price}` },
                  { k: 'Ubicación', v: locationSet ? 'Personalizada ✓' : 'Centro Medellín' },
                  { k: 'Plan', v: form.plan.toUpperCase() },
                ].map(item => (
                  <View key={item.k} style={styles.summaryRow}>
                    <Text style={styles.summaryK}>{item.k}</Text>
                    <Text style={styles.summaryV}>{item.v}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        {step > 1 && (
          <TouchableOpacity style={styles.btnBack} onPress={handleBack} disabled={loading}>
            <Text style={styles.btnBackText}>← Atrás</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btnNext} onPress={handleNext} disabled={loading}>
          <LinearGradient colors={[COLORS.accent, COLORS.violet]} style={styles.btnNextGrad}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : (
              <Text style={styles.btnNextText}>{step === 3 ? "🚀 Publicar en K'PARCHE" : 'Siguiente →'}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 20, backgroundColor: COLORS.surface, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 16 },
  progressRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  progressSeg: { height: 4, borderRadius: 2, flex: 1 },
  stepLabel: { color: COLORS.text, fontWeight: '600', fontSize: 13 },
  content: { padding: 16, paddingBottom: 120 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  uploadArea: { height: 140, borderRadius: 16, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', backgroundColor: COLORS.card2, alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden' },
  uploadEmoji: { fontSize: 40, marginBottom: 8 },
  uploadText: { color: COLORS.muted, fontWeight: '600' },
  previewImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  input: { backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, color: COLORS.text, marginBottom: 16 },
  label: { color: COLORS.text, fontWeight: 'bold', marginBottom: 10 },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typePill: { backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  typePillActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  typePillText: { color: COLORS.text, fontSize: 13 },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, marginBottom: 16 },
  pickerBtnFilled: { borderColor: COLORS.accent },
  pickerBtnText: { color: COLORS.muted, fontSize: 14 },
  row: { flexDirection: 'row', marginBottom: 16 },
  planCard: { flex: 1, backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 14 },
  planCardActive: { borderColor: COLORS.accent, borderWidth: 2 },
  planTitle: { fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  planPrice: { fontSize: 16, fontWeight: '900', color: COLORS.text, marginBottom: 12 },
  planFeat: { color: COLORS.muted, fontSize: 11, marginBottom: 4 },
  confirmBox: { alignItems: 'center', paddingVertical: 20 },
  confirmEmoji: { fontSize: 64, marginBottom: 16 },
  confirmTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  confirmSub: { color: COLORS.muted, textAlign: 'center', marginBottom: 24 },
  summaryCard: { width: '100%', backgroundColor: COLORS.card2, borderRadius: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  summaryK: { color: COLORS.muted },
  summaryV: { color: COLORS.white, fontWeight: 'bold', flex: 1, textAlign: 'right' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.bg, borderTopWidth: 1, borderTopColor: COLORS.border, padding: 16, flexDirection: 'row', gap: 10 },
  btnBack: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnBackText: { color: COLORS.text, fontWeight: 'bold' },
  btnNext: { flex: 2 },
  btnNextGrad: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', height: 56 },
  btnNextText: { color: COLORS.white, fontWeight: '800' },
  emojiPreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  emojiPreviewBadge: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.card2, borderWidth: 2, borderColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  emojiPreviewText: { fontSize: 26 },
  emojiPreviewHint: { color: COLORS.muted, fontSize: 12, flex: 1 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiCell: { width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  emojiCellActive: { borderColor: COLORS.accent, borderWidth: 2, backgroundColor: COLORS.accent + '22' },
  emojiCellText: { fontSize: 22 },
});
