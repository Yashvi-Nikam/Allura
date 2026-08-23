import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function ContextChip({ label, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    backgroundColor: 'transparent',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: 'rgba(201,171,133,0.15)',
    borderColor: 'rgba(201,171,133,0.5)',
  },
  label: {
    fontFamily: 'Jost',
    fontSize: 13,
    color: '#C8C0B4',
  },
  labelSelected: {
    color: '#C9AB85',
  },
});