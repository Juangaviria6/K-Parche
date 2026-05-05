import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const FAQ = [
  { q: '¿Cómo gano puntos?',               a: 'Ganas 50 puntos cada vez que confirmas asistencia a un evento tocando el botón "Quiero ir" en el detalle del evento.' },
  { q: '¿Los puntos vencen?',               a: 'No, tus puntos no vencen. Se acumulan indefinidamente mientras uses K\'Parche.' },
  { q: '¿Cómo publico un evento?',          a: 'Ve a la pestaña "Publicar" (ícono ➕), completa el formulario en 3 pasos: información básica, detalles y confirmación.' },
  { q: '¿Puedo editar un evento publicado?', a: 'Actualmente los eventos no se pueden editar después de publicados. Próximamente habilitaremos esta función.' },
  { q: '¿Cómo guardo un evento?',           a: 'En el detalle de cualquier evento, toca el ícono 🔖 en la esquina superior derecha para guardar o quitar de guardados.' },
  { q: '¿Cómo canjeo mis beneficios?',      a: 'Muestra tu pantalla de perfil con el nivel alcanzado en el establecimiento aliado para hacer válido el beneficio.' },
];

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => setOpenIdx(prev => prev === idx ? null : idx);

  const contactEmail = () => {
    Linking.openURL('mailto:soporte@kparche.co?subject=Soporte K\'Parche').catch(() =>
      Alert.alert('Error', 'No se pudo abrir el cliente de correo.')
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>💬 Soporte</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Contact */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>¿Necesitas ayuda?</Text>
          <Text style={styles.contactDesc}>Nuestro equipo responde en menos de 24 horas.</Text>
          <TouchableOpacity style={styles.emailBtn} onPress={contactEmail}>
            <Ionicons name="mail-outline" size={18} color={COLORS.white} />
            <Text style={styles.emailBtnText}>soporte@kparche.co</Text>
          </TouchableOpacity>
        </View>

        {/* Quick links */}
        <View style={styles.card}>
          {[
            { icon: 'bug-outline',       label: 'Reportar un error',     action: contactEmail },
            { icon: 'star-outline',      label: 'Calificar la app',      action: () => Alert.alert('Próximamente', 'Esta función estará disponible en la versión de producción.') },
            { icon: 'document-outline',  label: 'Términos y condiciones', action: () => Alert.alert('Próximamente', 'Disponible próximamente.') },
            { icon: 'shield-outline',    label: 'Política de privacidad', action: () => Alert.alert('Próximamente', 'Disponible próximamente.') },
          ].map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.linkRow, idx === 3 && { borderBottomWidth: 0 }]}
              onPress={item.action}
            >
              <View style={styles.linkIcon}>
                <Ionicons name={item.icon as any} size={20} color={COLORS.white} />
              </View>
              <Text style={styles.linkLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
        <View style={styles.card}>
          {FAQ.map((item, idx) => (
            <View key={idx} style={[styles.faqItem, idx === FAQ.length - 1 && { borderBottomWidth: 0 }]}>
              <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleFaq(idx)}>
                <Text style={styles.faqQ}>{item.q}</Text>
                <Ionicons name={openIdx === idx ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.muted} />
              </TouchableOpacity>
              {openIdx === idx && (
                <Text style={styles.faqA}>{item.a}</Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.version}>K'Parche v1.0.0 · Medellín, Colombia</Text>
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
  contactCard: { backgroundColor: COLORS.accent + '18', borderWidth: 1, borderColor: COLORS.accent + '44', borderRadius: 20, padding: 20, marginBottom: 16 },
  contactTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  contactDesc: { color: COLORS.muted, fontSize: 14, marginBottom: 16 },
  emailBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.accent, borderRadius: 12, padding: 12, alignSelf: 'flex-start' },
  emailBtnText: { color: COLORS.white, fontWeight: '700' },
  card: { backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: 16 },
  linkRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12 },
  linkIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.card2, alignItems: 'center', justifyContent: 'center' },
  linkLabel: { flex: 1, color: COLORS.text, fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  faqQuestion: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8 },
  faqQ: { flex: 1, color: COLORS.text, fontSize: 14, fontWeight: '600' },
  faqA: { paddingHorizontal: 16, paddingBottom: 16, color: COLORS.muted, fontSize: 13, lineHeight: 20 },
  version: { textAlign: 'center', color: COLORS.muted, fontSize: 12, marginTop: 8 },
});
