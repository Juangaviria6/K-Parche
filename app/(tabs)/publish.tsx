import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

export default function PublishScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    name: '', place: '', type: '', date: '', time: '', price: '', desc: '', plan: 'basico' as 'basico' | 'destacado'
  });

  const titles = { 1: 'Información básica', 2: 'Detalles y precio', 3: 'Confirmar' };

  const handleNext = () => setStep(step < 3 ? (step + 1) as 1 | 2 | 3 : 1);
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
              <View style={styles.uploadArea}>
                <Text style={styles.uploadEmoji}>📸</Text>
                <Text style={styles.uploadText}>Subir imagen del evento</Text>
              </View>

              <TextInput style={styles.input} placeholder="Nombre del evento" placeholderTextColor={COLORS.muted} />
              <TextInput style={styles.input} placeholder="Lugar / Establecimiento" placeholderTextColor={COLORS.muted} />

              <Text style={styles.label}>Tipo de evento</Text>
              <View style={styles.pillGrid}>
                {['Discoteca', 'Bar', 'Concierto', 'Taller', 'Feria', 'Teatro', 'Universitario', 'Deportes'].map(t => (
                  <TouchableOpacity key={t} style={styles.typePill}>
                    <Text style={styles.typePillText}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <View style={styles.row}>
                <TextInput style={[styles.input, {flex: 1}]} placeholder="Fecha" placeholderTextColor={COLORS.muted} />
                <View style={{width: 10}} />
                <TextInput style={[styles.input, {flex: 1}]} placeholder="Hora" placeholderTextColor={COLORS.muted} />
              </View>

              <TextInput style={styles.input} placeholder="Precio (0 = gratis)" keyboardType="numeric" placeholderTextColor={COLORS.muted} />
              <TextInput style={[styles.input, {height: 100, textAlignVertical: 'top'}]} placeholder="Descripción" multiline placeholderTextColor={COLORS.muted} />

              <Text style={styles.label}>🚀 Plan de visibilidad</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.planCard}>
                  <Text style={styles.planTitle}>Básico</Text>
                  <Text style={styles.planPrice}>Gratis</Text>
                  {['Publicación estándar', 'Pin básico en mapa'].map(f => <Text key={f} style={styles.planFeat}>• {f}</Text>)}
                </TouchableOpacity>
                <View style={{width: 10}} />
                <TouchableOpacity style={[styles.planCard, styles.planCardActive]}>
                  <Text style={[styles.planTitle, { color: COLORS.accent }]}>Destacado</Text>
                  <Text style={styles.planPrice}>$49.900/sem</Text>
                  {['Pin especial animado', 'Notificaciones push', 'Estadísticas completas'].map(f => <Text key={f} style={styles.planFeat}>• {f}</Text>)}
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
                  {k: 'Evento', v: 'Noche de Jazz'},
                  {k: 'Lugar', v: 'El Poblado'},
                  {k: 'Tipo', v: 'Concierto'},
                  {k: 'Fecha', v: '15 Mar · 8PM'},
                  {k: 'Precio', v: '$49.900/sem'},
                  {k: 'Plan', v: 'Destacado'}
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
          <TouchableOpacity style={styles.btnBack} onPress={handleBack}>
            <Text style={styles.btnBackText}>← Atrás</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
          <LinearGradient colors={[COLORS.accent, COLORS.violet]} style={styles.btnNextGrad}>
            <Text style={styles.btnNextText}>{step === 3 ? "🚀 Publicar en K'PARCHE" : "Siguiente →"}</Text>
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
  uploadArea: { height: 140, borderRadius: 16, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', backgroundColor: COLORS.card2, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  uploadEmoji: { fontSize: 40, marginBottom: 8 },
  uploadText: { color: COLORS.muted, fontWeight: '600' },
  input: { backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, color: COLORS.text, marginBottom: 16 },
  label: { color: COLORS.text, fontWeight: 'bold', marginBottom: 12 },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typePill: { backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
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
  btnNextGrad: { borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  btnNextText: { color: COLORS.white, fontWeight: '800' }
});
