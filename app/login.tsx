import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

type Mode = 'user' | 'uni' | 'org';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('user');
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) return Alert.alert('Error', 'Ingresa correo y contraseña');
    if (!isLoginView && !name) return Alert.alert('Error', 'Ingresa tu nombre completo');
    
    setLoading(true);
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logoLogo}>📍 K'PARCHE</Text>
          <Text style={styles.logoSubtitle}>A DÓNDE VAMOS HOY</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.segment}>
            <TouchableOpacity style={[styles.tab, mode === 'user' && styles.activeTab]} onPress={() => setMode('user')}>
              <Text style={[styles.tabText, mode === 'user' && styles.activeTabText]}>👤 Usuario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, mode === 'uni' && styles.activeTab]} onPress={() => setMode('uni')}>
              <Text style={[styles.tabText, mode === 'uni' && styles.activeTabText]}>🎓 Estudiante</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, mode === 'org' && styles.activeTab]} onPress={() => setMode('org')}>
              <Text style={[styles.tabText, mode === 'org' && styles.activeTabText]}>🏢 Org</Text>
            </TouchableOpacity>
          </View>

          {mode === 'uni' && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>Ingresa tu correo institucional (.edu.co).</Text>
            </View>
          )}

          {!isLoginView && (
            <TextInput 
              style={styles.input}
              placeholder='Nombre completo'
              placeholderTextColor={COLORS.muted}
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput 
            style={styles.input}
            placeholder='Correo electrónico'
            placeholderTextColor={COLORS.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
            keyboardType='email-address'
          />
          <TextInput 
            style={styles.input}
            placeholder='Contraseña'
            placeholderTextColor={COLORS.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={handleAuth} activeOpacity={0.8} disabled={loading}>
            <LinearGradient colors={[COLORS.accent, COLORS.violet]} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.btnText}>{loading ? 'Cargando...' : isLoginView ? "ENTRAR A K'PARCHE 🚀" : "CREAR CUENTA 🚀"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerBox}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.registerLink} onPress={() => setIsLoginView(!isLoginView)} disabled={loading}>
            <Text style={styles.registerText}>{isLoginView ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya tienes cuenta? Inicia sesión'}</Text>
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
  registerLink: { alignItems: 'center' },
  registerText: { color: COLORS.accent, fontSize: 14, fontWeight: '600' }
});
