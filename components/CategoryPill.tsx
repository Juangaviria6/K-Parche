import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export const CategoryPill = ({ label, active, onPress }: Props) => {
  // Optimizamos el formateo del texto para que no se procese en cada renderizado
  const formattedLabel = useMemo(() => {
    if (!label) return '';
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  }, [label]);

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        active ? styles.activeContainer : styles.inactiveContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
      // Mejora de accesibilidad
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>
        {formattedLabel}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6, // Un poco más de aire vertical suele verse mejor
    marginRight: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  activeText: {
    color: COLORS.white,
    fontWeight: '600', // '600' suele ser más consistente entre plataformas que 'bold'
  },
  inactiveText: {
    color: COLORS.muted,
  }
});