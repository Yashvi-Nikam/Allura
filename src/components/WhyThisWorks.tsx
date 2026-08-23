import { View, Text, StyleSheet } from 'react-native';

const reasons = [
  { icon: '⚖️', key: 'silhouette', label: 'Silhouette' },
  { icon: '🎨', key: 'color',      label: 'Color' },
  { icon: '✨', key: 'occasion',   label: 'Occasion' },
  { icon: '🌤️', key: 'weather',   label: 'Weather' },
  { icon: '💛', key: 'comfort',    label: 'Comfort' },
];

interface Props {
  whyText: string;
  comfortNote: string;
  styleMatch?: number;
}

export default function WhyThisWorks({ whyText, comfortNote, styleMatch = 92 }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Why this works for you</Text>

      <View style={styles.mainReason}>
        <Text style={styles.mainText}>{whyText}</Text>
      </View>

      <View style={styles.comfortBox}>
        <Text style={styles.comfortLabel}>Comfort note</Text>
        <Text style={styles.comfortText}>{comfortNote}</Text>
      </View>

      <View style={styles.matchRow}>
        <Text style={styles.matchLabel}>Style match</Text>
        <Text style={styles.matchScore}>{styleMatch}%</Text>
      </View>
      <View style={styles.matchBarBg}>
        <View style={[styles.matchBarFill, { width: `${styleMatch}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1A2E',
    borderRadius: 20,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.15)',
  },
  heading: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 22,
    color: '#F0ECE4',
    marginBottom: 16,
  },
  mainReason: {
    marginBottom: 16,
  },
  mainText: {
    fontFamily: 'Jost',
    fontSize: 14,
    color: '#C8C0B4',
    lineHeight: 22,
  },
  comfortBox: {
    backgroundColor: 'rgba(201,171,133,0.06)',
    borderRadius: 10,
    padding: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.12)',
    marginBottom: 20,
  },
  comfortLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 6,
  },
  comfortText: {
    fontFamily: 'Jost',
    fontSize: 13,
    color: '#C8C0B4',
    lineHeight: 19,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#5A5650',
  },
  matchScore: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 20,
    color: '#C9AB85',
  },
  matchBarBg: {
    height: 2,
    backgroundColor: 'rgba(201,171,133,0.1)',
    borderRadius: 1,
  },
  matchBarFill: {
    height: 2,
    backgroundColor: '#C9AB85',
    borderRadius: 1,
  },
});