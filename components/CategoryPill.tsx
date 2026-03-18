import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export const CategoryPill = ({ label, active, onPress }: Props) => {
  return (
    <TouchableOpacity 
      style={[styles.container, active ? styles.activeContainer : styles.inactiveContainer]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>
        {label === 'todos' ? 'Todos' : label.charAt(0).toUpperCase() + label.slice(1)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginRight: 8,
    borderWidth: 1,
  },
  activeContainer: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  inactiveContainer: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
  },
  text: {
    fontSize: 14,
  },
  activeText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  inactiveText: {
    color: COLORS.muted,
  }
});
