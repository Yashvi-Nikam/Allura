import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

interface Outfit {
  id: string;
  title: string;
  priority: string;
  item_names: string[];
  color_story: string;
  why_this_works: string;
  comfort_note: string;
  style_tags: string[];
  visual_url?: string | null; // Updated to allow null
}

export default function OutfitCard({ outfit }: { outfit: Outfit }) {
  const priorityColor = {
    best_match:    '#C9AB85',
    comfort_first: '#9B7FA6',
    expressive:    '#C97A8A',
  }[outfit.priority] || '#C9AB85';

  const priorityLabel = {
    best_match:    '✦ Best Match',
    comfort_first: '✦ Comfort First',
    expressive:    '✦ Bold & Expressive',
  }[outfit.priority] || '✦ Look';

  return (
    <View style={styles.card}>
      {/* IMAGE PLACEHOLDER */}
      {outfit.visual_url ? (
        <Image source={{ uri: outfit.visual_url }} style={styles.outfitImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderIcon}>✦</Text>
          <Text style={styles.placeholderText}>Allura Outfit</Text>
        </View>
      )}

      <Text style={[styles.priority, { color: priorityColor }]}>
        {priorityLabel}
      </Text>
      <Text style={styles.title}>{outfit.title}</Text>
      <Text style={styles.colorStory}>{outfit.color_story}</Text>

      <View style={styles.divider} />

      <View style={styles.itemsList}>
        {outfit.item_names?.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={styles.dot} />
            <Text style={styles.itemName}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <Text style={styles.whyLabel}>Why this works for you</Text>
      <Text style={styles.whyText}>{outfit.why_this_works}</Text>

      <View style={styles.comfortNote}>
        <Text style={styles.comfortText}>💡 {outfit.comfort_note}</Text>
      </View>

      <View style={styles.tagsRow}>
        {outfit.style_tags?.map((tag, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1A2E',
    borderRadius: 20,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.15)',
    marginBottom: 16,
  },
  // NEW IMAGE STYLES
  outfitImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: 'rgba(201,171,133,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderIcon: {
    fontSize: 40,
    color: '#C9AB85',
    marginBottom: 8,
  },
  placeholderText: {
    fontFamily: 'Raleway',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#C9AB85',
  },
  priority: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 26,
    color: '#F0ECE4',
    marginBottom: 6,
  },
  colorStory: {
    fontFamily: 'CormorantGaramond_Italic',
    fontStyle: 'italic',
    fontSize: 13,
    color: 'rgba(201,171,133,0.6)',
    marginBottom: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(201,171,133,0.1)',
    marginVertical: 14,
  },
  itemsList: { gap: 10 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C9AB85',
  },
  itemName: {
    fontFamily: 'Jost_Regular',
    fontSize: 14,
    color: '#F0ECE4',
    textTransform: 'capitalize',
  },
  whyLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 8,
  },
  whyText: {
    fontFamily: 'Jost',
    fontSize: 13,
    color: '#C8C0B4',
    lineHeight: 20,
  },
  comfortNote: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(201,171,133,0.06)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.12)',
  },
  comfortText: {
    fontFamily: 'Jost',
    fontSize: 12,
    color: '#C8C0B4',
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
  },
  tagText: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 1,
    color: '#5A5650',
    textTransform: 'capitalize',
  },
});