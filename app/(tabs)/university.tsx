import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { UNIVERSITIES, EVENTS, INTERU_EVENTS, fmt } from '../../constants/mockData';
import { UniCard } from '../../components/UniCard';
import { EventCard } from '../../components/EventCard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type Tab = 'unis' | 'events' | 'interu';

export default function UniversityScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('unis');

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.violet + '33', 'transparent']} style={styles.header}>
        <Text style={styles.title}>🎓 K'PARCHE Uni</Text>
        <Text style={styles.subtitle}>Todo lo que pasa en tu campus</Text>
        
        <View style={styles.tabRow}>
          {(['unis', 'events', 'interu'] as const).map(tab => (
            <TouchableOpacity 
              key={tab}
              style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'unis' ? 'Universidades' : tab === 'events' ? 'Eventos Uni' : '🔥 InterU'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'unis' && (
          <View>
            {UNIVERSITIES.map(u => <UniCard key={u.id} uni={u} />)}
          </View>
        )}

        {activeTab === 'events' && (
          <View>
            {EVENTS.filter(e => e.type === 'Universitario').map(e => (
              <EventCard key={e.id} event={e} onPress={() => router.push({ pathname: '/event-detail', params: { id: e.id }})} />
            ))}
            <TouchableOpacity style={styles.addCard}>
              <Text style={styles.addText}>¿Organizas un evento en tu U?</Text>
              <View style={styles.addBtn}>
                <Text style={styles.addBtnText}>Publicar evento universitario</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'interu' && (
          <View>
            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>¿Qué es InterU?</Text>
              <Text style={styles.bannerDesc}>Eventos donde participan múltiples universidades. ¡Conoce gente de otras facultades!</Text>
            </View>

            {INTERU_EVENTS.map(ie => (
              <View key={ie.id} style={styles.ieCard}>
                <View style={styles.ieRow}>
                  <Text style={{fontSize: 32}}>{ie.emoji}</Text>
                  <View style={{flex: 1, marginLeft: 12}}>
                    <Text style={styles.ieName}>{ie.name}</Text>
                    <Text style={[styles.iePrice, { color: ie.price === 0 ? COLORS.green : COLORS.accent }]}>{fmt(ie.price)}</Text>
                  </View>
                </View>

                <View style={styles.ieUnis}>
                  {ie.unis.map(u => {
                    const uniConf = UNIVERSITIES.find(x => x.short === u);
                    return (
                      <View key={u} style={[styles.iePill, { backgroundColor: (uniConf?.color || COLORS.border) + '22' }]}>
                        <Text style={[styles.iePillText, { color: uniConf?.color || COLORS.text }]}>{u}</Text>
                      </View>
                    );
                  })}
                </View>

                <View style={[styles.ieRow, { marginTop: 16 }]}>
                  <Text style={styles.ieAttendees}>👥 {ie.attendees} asistentes confirmados</Text>
                  <TouchableOpacity>
                    <LinearGradient colors={[COLORS.accent, COLORS.violet]} style={styles.ieBtn}>
                      <Text style={styles.ieBtnText}>Me apunto</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4, marginBottom: 20 },
  tabRow: { flexDirection: 'row', gap: 8 },
  tabPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  tabPillActive: { backgroundColor: COLORS.violet, borderColor: COLORS.violet },
  tabText: { color: COLORS.muted, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: COLORS.white },
  content: { padding: 16, paddingBottom: 100 },
  addCard: { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 16, padding: 20, alignItems: 'center', marginTop: 8 },
  addText: { color: COLORS.text, fontWeight: 'bold', marginBottom: 12 },
  addBtn: { backgroundColor: COLORS.violet, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  addBtnText: { color: COLORS.white, fontWeight: 'bold' },
  banner: { backgroundColor: COLORS.accent + '15', borderWidth: 1, borderColor: COLORS.accent + '33', borderRadius: 16, padding: 16, marginBottom: 16 },
  bannerTitle: { color: COLORS.accent, fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  bannerDesc: { color: COLORS.text, fontSize: 13, lineHeight: 20 },
  ieCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 },
  ieRow: { flexDirection: 'row', alignItems: 'center' },
  ieName: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  iePrice: { fontSize: 14, fontWeight: '800' },
  ieUnis: { flexDirection: 'row', gap: 8, marginTop: 12 },
  iePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  iePillText: { fontSize: 12, fontWeight: 'bold' },
  ieAttendees: { flex: 1, color: COLORS.muted, fontSize: 12 },
  ieBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  ieBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 13 }
});
