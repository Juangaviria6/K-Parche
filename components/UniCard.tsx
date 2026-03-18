import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { University } from '../constants/types';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  uni: University;
}

export const UniCard = ({ uni }: Props) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={[styles.iconBox, { backgroundColor: uni.color + '22', borderColor: uni.color + '66' }]}>
        <Text style={styles.emoji}>🏛️</Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{uni.name}</Text>
        <Text style={styles.muted}>{uni.zona} · {uni.students} est.</Text>
        
        <View style={styles.tags}>
          <View style={[styles.pill, { backgroundColor: uni.color + '22' }]}>
            <Text style={[styles.pillText, { color: uni.color }]}>{uni.events} Eventos</Text>
          </View>
          {uni.verified && (
            <View style={[styles.pill, { backgroundColor: COLORS.green + '22' }]}>
              <Text style={[styles.pillText, { color: COLORS.green }]}>✓ Aliada</Text>
            </View>
          )}
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  muted: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 10,
    fontWeight: 'bold',
  }
});
