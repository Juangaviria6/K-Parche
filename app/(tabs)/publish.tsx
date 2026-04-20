import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import CryptoJS from 'crypto-js';
import { COLORS } from '../../constants/colors';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function PublishScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', place: '', type: 'Discoteca', date: '', time: '', price: '', desc: '', plan: 'basico' as 'basico' | 'destacado'
  });

  const titles = { 1: 'Información básica', 2: 'Detalles y precio', 3: 'Confirmar' };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const publishEvent = async () => {
    if (!form.name || !form.place || !form.date || !form.time) {
      Alert.alert('Error', 'Por favor llena los campos requeridos');
      return;
    }
    setLoading(true);
    try {
      let coverUrl = '';
      if (imageUri) {
        const timestamp = Math.round((new Date()).getTime() / 1000).toString();
        const apiSecret = 'famhU1aIdmGlgP6PgmweQGvQXJU';
        const apiKey = '778276968231184';
        const cloudName = 'dlouforsb';

        // Signature para subida segura (timestamp + secret)
        const strToSign = `timestamp=${timestamp}${apiSecret}`;
        const signature = CryptoJS.SHA1(strToSign).toString();

        const data = new FormData();
        data.append('file', { uri: imageUri, type: 'image/jpeg', name: 'upload.jpg' } as any);
        data.append('api_key', apiKey);
        data.append('timestamp', timestamp);
        data.append('signature', signature);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: data,
        });

        const uploadResult = await res.json();
        if (uploadResult.secure_url) {
          coverUrl = uploadResult.secure_url;
        } else {
          throw new Error('Error subiendo imagen a Cloudinary');
        }
      }

      await addDoc(collection(db, 'events'), {
        name: form.name,
        place: form.place,
        cat: form.type.toLowerCase(),
        date: form.date,
        time: form.time,
        price: Number(form.price) || 0,
        desc: form.desc,
        plan: form.plan,
        coverUrl,
        emoji: '🎈',
        color: COLORS.accent,
        latitude: 6.2442,
        longitude: -75.5812, // Centro de Medellín por defecto
        createdAt: new Date().toISOString()
      });

      Alert.alert('¡Éxito!', 'Tu evento se publicó correctamente', [
        { text: 'OK', onPress: () => {
          setForm({ name: '', place: '', type: 'Discoteca', date: '', time: '', price: '', desc: '', plan: 'basico' });
          setImageUri(null);
          setStep(1);
          router.push('/(tabs)/');
        }}
      ]);
    } catch (e: any) {
      Alert.alert('Error al publicar', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 3) {
      publishEvent();
    } else {
      setStep((step + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => setStep(step > 1 ? (step - 1) as 1 | 2 | 3 : 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
                  <>
                    <Text style={styles.uploadEmoji}>📸</Text>
                    <Text style={styles.uploadText}>Subir imagen del evento</Text>
                  </>
                )}
              </TouchableOpacity>

              <TextInput style={styles.input} placeholder="Nombre del evento" placeholderTextColor={COLORS.muted} value={form.name} onChangeText={t => setForm({...form, name: t})} />
              <TextInput style={styles.input} placeholder="Lugar / Establecimiento" placeholderTextColor={COLORS.muted} value={form.place} onChangeText={t => setForm({...form, place: t})} />

              <Text style={styles.label}>Tipo de evento</Text>
              <View style={styles.pillGrid}>
                {['Discoteca', 'Bar', 'Concierto', 'Taller', 'Gastronomia', 'Teatro', 'Integracion', 'Electronica'].map(t => (
                  <TouchableOpacity key={t} style={[styles.typePill, form.type === t && styles.typePillActive]} onPress={() => setForm({...form, type: t})}>
                    <Text style={[styles.typePillText, form.type === t && {color: COLORS.white}]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <View style={styles.row}>
                <TextInput style={[styles.input, {flex: 1}]} placeholder="Fecha (ej. 15 Mar)" placeholderTextColor={COLORS.muted} value={form.date} onChangeText={t => setForm({...form, date: t})} />
                <View style={{width: 10}} />
                <TextInput style={[styles.input, {flex: 1}]} placeholder="Hora (ej. 8PM)" placeholderTextColor={COLORS.muted} value={form.time} onChangeText={t => setForm({...form, time: t})} />
              </View>

              <TextInput style={styles.input} placeholder="Precio (0 = gratis)" keyboardType="numeric" placeholderTextColor={COLORS.muted} value={form.price} onChangeText={t => setForm({...form, price: t})} />
              <TextInput style={[styles.input, {height: 100, textAlignVertical: 'top'}]} placeholder="Descripción" multiline placeholderTextColor={COLORS.muted} value={form.desc} onChangeText={t => setForm({...form, desc: t})} />

              <Text style={styles.label}>🚀 Plan de visibilidad</Text>
              <View style={styles.row}>
                <TouchableOpacity style={[styles.planCard, form.plan === 'basico' && styles.planCardActive]} onPress={() => setForm({...form, plan: 'basico'})}>
                  <Text style={[styles.planTitle, form.plan === 'basico' && {color: COLORS.accent}]}>Básico</Text>
                  <Text style={styles.planPrice}>Gratis</Text>
                  {['Publicación estándar', 'Pin básico en mapa'].map(f => <Text key={f} style={styles.planFeat}>• {f}</Text>)}
                </TouchableOpacity>
                <View style={{width: 10}} />
                <TouchableOpacity style={[styles.planCard, form.plan === 'destacado' && styles.planCardActive]} onPress={() => setForm({...form, plan: 'destacado'})}>
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
                  {k: 'Evento', v: form.name},
                  {k: 'Lugar', v: form.place},
                  {k: 'Tipo', v: form.type},
                  {k: 'Fecha', v: `${form.date} · ${form.time}`},
                  {k: 'Precio', v: form.price === '' || form.price === '0' ? 'GRATIS' : `$${form.price}`},
                  {k: 'Plan', v: form.plan.toUpperCase()}
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
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.btnNextText}>{step === 3 ? "🚀 Publicar en K'PARCHE" : "Siguiente →"}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, backgroundColor: COLORS.surface, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 16 },
  progressRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  progressSeg: { height: 4, borderRadius: 2, flex: 1 },
  stepLabel: { color: COLORS.text, fontWeight: '600', fontSize: 13 },
  content: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  uploadArea: { height: 140, borderRadius: 16, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', backgroundColor: COLORS.card2, alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden' },
  uploadEmoji: { fontSize: 40, marginBottom: 8 },
  uploadText: { color: COLORS.muted, fontWeight: '600' },
  previewImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  input: { backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, color: COLORS.text, marginBottom: 16 },
  label: { color: COLORS.text, fontWeight: 'bold', marginBottom: 12 },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typePill: { backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  typePillActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  typePillText: { color: COLORS.text, fontSize: 13 },
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
  summaryV: { color: COLORS.white, fontWeight: 'bold' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.bg, borderTopWidth: 1, borderTopColor: COLORS.border, padding: 16, flexDirection: 'row', gap: 10 },
  btnBack: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnBackText: { color: COLORS.text, fontWeight: 'bold' },
  btnNext: { flex: 2 },
  btnNextGrad: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', height: 56 },
  btnNextText: { color: COLORS.white, fontWeight: '800' }
});
