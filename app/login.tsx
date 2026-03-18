import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

type Mode = 'user' | 'uni' | 'org';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('user');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.logoLogo}>📍 K'PARCHE</Text>
          <Text style={styles.logoSubtitle}>A DÓNDE VAMOS HOY</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.segment}>
            <TouchableOpacity 
              style={[styles.tab, mode === 'user' && styles.activeTab]}
              onPress={() => setMode('user')}
            >
              <Text style={[styles.tabText, mode === 'user' && styles.activeTabText]}>👤 Usuario</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, mode === 'uni' && styles.activeTab]}
              onPress={() => setMode('uni')}
            >
              <Text style={[styles.tabText, mode === 'uni' && styles.activeTabText]}>🎓 Estudiante</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, mode === 'org' && styles.activeTab]}
              onPress={() => setMode('org')}
            >
              <Text style={[styles.tabText, mode === 'org' && styles.activeTabText]}>🏢 Organizador</Text>
            </TouchableOpacity>
          </View>

          {mode === 'uni' && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>Ingresa con tu correo institucional (.edu.co) para acceder a InterU y beneficios.</Text>
            </View>
          )}

          <TextInput 
            style={styles.input}
            placeholder={mode === 'uni' ? "Correo institucional" : "Correo electrónico"}
            placeholderTextColor={COLORS.muted}
          />
          <TextInput 
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={COLORS.muted}
            secureTextEntry={mode !== 'uni'}
          />

          <TouchableOpacity onPress={() => router.replace('/(tabs)')} activeOpacity={0.8}>
            <LinearGradient
              colors={[COLORS.accent, COLORS.violet]}
              style={styles.btn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.btnText}>ENTRAR A K'PARCHE 🚀</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerBox}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryText}>🔵 Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryText}>⚫ Apple</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.registerLink}>
            <Text style={styles.registerText}>¿No tienes cuenta? Regístrate gratis</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoLogo: { fontSize: 38, fontWeight: '900', color: COLORS.text, fontFamily: 'serif' },
  logoSubtitle: { fontSize: 12, color: COLORS.muted, letterSpacing: 2, marginTop: 4 },
  card: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  segment: { flexDirection: 'row', backgroundColor: COLORS.card2, borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: COLORS.accent },
  tabText: { color: COLORS.muted, fontSize: 12, fontWeight: '700' },
  activeTabText: { color: COLORS.white },
  banner: { backgroundColor: COLORS.green + '22', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: COLORS.green + '55' },
  bannerText: { color: COLORS.green, fontSize: 12, textAlign: 'center', fontWeight: '600' },
  input: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, color: COLORS.text, padding: 16, marginBottom: 16, fontSize: 14 },
  btn: { borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  dividerBox: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.muted, marginHorizontal: 12, fontSize: 12 },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  btnSecondary: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, alignItems: 'center' },
  btnSecondaryText: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  registerLink: { alignItems: 'center' },
  registerText: { color: COLORS.accent, fontSize: 14, fontWeight: '600' }
});
