import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Event } from '../constants/types';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { fmt } from '../constants/mockData';

interface Props {
  event: Event;
  onPress: () => void;
  horizontal?: boolean;
}

export const EventCard = ({ event, onPress, horizontal = false }: Props) => {
  if (horizontal) {
    return (
      <TouchableOpacity style={styles.hCard} onPress={onPress} activeOpacity={0.8}>
        <Image source={{ uri: event.img }} style={styles.hImage} />
        <View style={styles.hInfo}>
          <View style={[styles.badge, { backgroundColor: event.color }]}>
            <Text style={styles.badgeText}>{event.type}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
          <Text style={styles.muted} numberOfLines={1}>{event.place}</Text>
          <View style={styles.row}>
            <Text style={[styles.price, { color: event.price === 0 ? COLORS.green : COLORS.accent }]}>
              {fmt(event.price)}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color={COLORS.yellow} />
              <Text style={styles.ratingText}>{event.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: event.img }} style={styles.image} />
      
      <View style={[styles.badge, { backgroundColor: event.color }, styles.topLeft]}>
        <Text style={styles.badgeText}>{event.type}</Text>
      </View>
      
      <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.7)' }, styles.topRight]}>
        <Text style={styles.badgeText}>{event.time}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
        <Text style={styles.muted} numberOfLines={1}>{event.place}</Text>
        <Text style={styles.muted} numberOfLines={1}>👥 {event.attendees} asistentes</Text>
        <View style={[styles.row, { marginTop: 6 }]}>
          <Text style={[styles.price, { color: event.price === 0 ? COLORS.green : COLORS.accent }]}>
            {fmt(event.price)}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={COLORS.yellow} />
            <Text style={styles.ratingText}>{event.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    height: 160,
    width: '100%',
  },
  info: {
    padding: 12,
  },
  topLeft: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  topRight: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  muted: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontWeight: '800',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  hCard: {
    flexDirection: 'row',
    height: 110,
    backgroundColor: COLORS.card2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  hImage: {
    width: 110,
    height: '100%',
  },
  hInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  }
});
