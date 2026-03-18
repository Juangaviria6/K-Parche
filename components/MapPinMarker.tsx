import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Event } from '../constants/types';
import { COLORS } from '../constants/colors';

interface Props {
  event: Event;
  selected: boolean;
}

export const MapPinMarker = ({ event, selected }: Props) => {
  return (
    <View style={[styles.container, selected && { transform: [{ scale: 1.2 }] }]}>
      <View style={[
        styles.bubble, 
        { 
          backgroundColor: selected ? event.color : COLORS.card2,
          borderColor: event.color 
        }
      ]}>
        <Text style={styles.emoji}>{event.emoji}</Text>
        {selected && (
          <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
        )}
      </View>
      <View style={[styles.arrow, { borderTopColor: selected ? event.color : COLORS.card2 }]} />
      <View style={[styles.anchor, { backgroundColor: event.color, shadowColor: event.color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emoji: {
    fontSize: 14,
  },
  name: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '700',
    maxWidth: 80,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  anchor: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  }
});
