import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import CryptoJS from 'crypto-js';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { useSaved } from '../../context/SavedContext';
import { useEventsByIds } from '../../hooks/useEventsByIds';
import { EventCard } from '../../components/EventCard';
import { router } from 'expo-router';

const CLOUD_NAME = 'dlouforsb';
const API_KEY = '778276968231184';
const API_SECRET = 'famhU1aIdmGlgP6PgmweQGvQXJU';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useAuth();
  const { goingIds, savedIds, points } = useSaved();
  const { events: goingEvents } = useEventsByIds(goingIds);

  const MAX_POINTS = 500;
  const levels = [
    { min: 0,   max: 99,  label: 'Nuevo Parche',       icon: '🌱' },
    { min: 100, max: 299, label: 'Parche Regular',      icon: '⭐' },
    { min: 300, max: 499, label: 'Parche VIP',          icon: '🔥' },
    { min: 500, max: Infinity, label: 'Embajador K\'Parche', icon: '👑' },
  ];
  const level = levels.find(l => points >= l.min && points <= l.max) ?? levels[0];
  const nextLevelPoints = level.max === Infinity ? MAX_POINTS : level.max + 1;
  const progressPct = Math.min(1, points / MAX_POINTS);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setNewName(user?.displayName || '');
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setImageUri(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (uri: string): Promise<string> => {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const strToSign = `timestamp=${timestamp}${API_SECRET}`;
    const signature = CryptoJS.SHA1(strToSign).toString();

    const data = new FormData();
    data.append('file', { uri, type: 'image/jpeg', name: 'avatar.jpg' } as any);
    data.append('api_key', API_KEY);
    data.append('timestamp', timestamp);
    data.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });
    const uploadResult = await res.json();
    if (!uploadResult.secure_url) throw new Error('Error subiendo imagen a Cloudinary');
    return uploadResult.secure_url;
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      let photoURL: string | null = auth.currentUser.photoURL;
      if (imageUri) {
        photoURL = await uploadToCloudinary(imageUri);
      }
      await updateProfile(auth.currentUser, {
        displayName: newName.trim() || auth.currentUser.displayName,
        photoURL,
      });
      refreshUser();
      setEditing(false);
      setImageUri(null);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const avatarSource = imageUri || user?.photoURL;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <LinearGradient colors={[COLORS.accent + '33', 'transparent']} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.avatarBox}
          onPress={editing ? pickImage : undefined}
          activeOpacity={editing ? 0.7 : 1}
        >
          <LinearGradient colors={[COLORS.accent, COLORS.violet]} style={styles.avatar}>
            {avatarSource ? (
              <Image source={{ uri: avatarSource }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarEmoji}>🧑</Text>
            )}
          </LinearGradient>
          {editing && (
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={20} color={COLORS.white} />
            </View>
          )}
        </TouchableOpacity>

        {editing ? (
          <TextInput
            style={styles.nameInput}
            value={newName}
            onChangeText={setNewName}
            placeholder="Tu nombre"
            placeholderTextColor={COLORS.muted}
            autoFocus
          />
        ) : (
          <Text style={styles.name}>{user?.displayName || 'Usuario Parche'}</Text>
        )}

        <Text style={styles.email}>{user?.email}</Text>

        {editing ? (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} disabled={saving}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
              <Ionicons name="pencil" size={13} color={COLORS.white} />
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🎓 Estudiante Verificado — EAFIT</Text>
            </View>
          </>
        )}
      </LinearGradient>

      <View style={styles.statsGrid}>
        {[
          { i: '🎪', v: String(goingEvents.length), l: 'Asistidos' },
          { i: '⭐', v: String(points), l: 'Puntos U' },
          { i: '🔖', v: String(savedIds.length), l: 'Guardados' },
          { i: level.icon, v: level.label.split(' ')[0], l: 'Nivel' }
        ].map(s => (
          <View key={s.l} style={styles.statCard}>
            <Text style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</Text>
            <Text style={styles.statV}>{s.v}</Text>
            <Text style={styles.statL}>{s.l}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>🎟️ Mis Planes · {goingEvents.length}</Text>
        {goingEvents.length > 0 ? (
          goingEvents.map(e => (
            <EventCard key={e.id} event={e} horizontal onPress={() => router.push({ pathname: '/event-detail', params: { id: String(e.id) } })} />
          ))
        ) : (
          <View style={styles.emptyPlans}>
            <Text style={styles.emptyPlansText}>Explora eventos y confirma tu asistencia tocando "Quiero ir"</Text>
          </View>
        )}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <LinearGradient
          colors={[COLORS.violet, COLORS.accent]}
          style={styles.pointsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={styles.pLabel}>Puntos U acumulados</Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '800' }}>{level.icon} {level.label}</Text>
          </View>
          <Text style={styles.pNum}>{points} ⭐</Text>
          <Text style={styles.pSub}>
            {level.max === Infinity
              ? '¡Nivel máximo alcanzado! Eres Embajador K\'Parche 👑'
              : `${nextLevelPoints - points} puntos para el siguiente nivel`}
          </Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${progressPct * 100}%` }]} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={styles.pSub}>0</Text>
            <Text style={styles.pSub}>500</Text>
          </View>
          <Text style={[styles.pSub, { marginTop: 8 }]}>+50 pts por cada evento al que confirmes asistencia</Text>
        </LinearGradient>

        <View style={styles.menu}>
          {[
            { i: 'ticket',        n: 'Mis boletas',    s: `${goingIds.length} evento${goingIds.length === 1 ? '' : 's'} confirmado${goingIds.length === 1 ? '' : 's'}`, route: '/my-tickets' },
            { i: 'gift',          n: 'Beneficios',     s: `${points} puntos disponibles`,  route: '/benefits' },
            { i: 'bar-chart',     n: 'Mi actividad',   s: 'Ver historial completo',         route: '/activity' },
            { i: 'notifications', n: 'Notificaciones', s: 'Personalizadas por zona',        route: '/notifications' },
            { i: 'chatbubble',    n: 'Soporte',        s: 'Ayuda 24/7',                     route: '/support' },
            { i: 'log-out',       n: 'Cerrar sesión',  s: '',                               route: null, danger: true },
          ].map((m, idx) => (
            <TouchableOpacity
              key={m.n}
              style={[styles.menuItem, idx === 5 && { borderBottomWidth: 0 }]}
              onPress={() => m.danger ? handleLogout() : router.push(m.route as any)}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={m.i as any} size={20} color={m.danger ? COLORS.accent : COLORS.white} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={[styles.menuName, m.danger && { color: COLORS.accent }]}>{m.n}</Text>
                {!!m.s && <Text style={styles.menuSub}>{m.s}</Text>}
              </View>
              {!m.danger && <Ionicons name="chevron-forward" size={22} color={COLORS.muted} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: 'center', paddingBottom: 24, paddingHorizontal: 16 },
  avatarBox: { shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 20, marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: 90, height: 90, borderRadius: 45 },
  avatarEmoji: { fontSize: 40 },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.accent, borderRadius: 14, width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.bg },
  nameInput: { fontSize: 20, fontWeight: '700', color: COLORS.text, borderBottomWidth: 1.5, borderBottomColor: COLORS.accent, paddingVertical: 4, paddingHorizontal: 8, marginBottom: 4, minWidth: 180, textAlign: 'center' },
  name: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  email: { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.accent + '33', borderWidth: 1, borderColor: COLORS.accent + '66', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 12 },
  editBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  editActions: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  cancelBtnText: { color: COLORS.muted, fontWeight: '600' },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.accent, minWidth: 80, alignItems: 'center' },
  saveBtnText: { color: COLORS.white, fontWeight: '700' },
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
  menuSub: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  emptyPlans: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  emptyPlansText: { color: COLORS.muted, fontSize: 13, textAlign: 'center' },
});
