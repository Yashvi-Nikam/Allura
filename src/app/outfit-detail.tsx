import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ NEW
import { useRouter, useLocalSearchParams } from 'expo-router';
import WhyThisWorks from '@/components/WhyThisWorks';

export default function OutfitDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const outfit = params.outfit ? JSON.parse(params.outfit as string) : null;

  if (!outfit) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Outfit breakdown</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Outfit name */}
        <Text style={styles.outfitTitle}>{outfit.title}</Text>
        <Text style={styles.colorStory}>{outfit.color_story}</Text>

        {/* Items list */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>The look</Text>
          {outfit.item_names?.map((item: string, i: number) => (
            <View key={i} style={styles.itemRow}>
              <View style={styles.dot} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Why this works */}
        <WhyThisWorks
          whyText={outfit.why_this_works}
          comfortNote={outfit.comfort_note}
          styleMatch={92}
        />

        {/* Regenerate */}
        <TouchableOpacity style={styles.regenBtn} onPress={() => router.back()}>
          <Text style={styles.regenText}>Regenerate looks ✦</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  scroll: { padding: 24, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  back: { fontSize: 22, color: '#C9AB85' },
  title: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#5A5650',
  },
  outfitTitle: {
    fontFamily: 'CormorantGaramond',
    fontSize: 32,
    color: '#F0ECE4',
    marginBottom: 6,
  },
  colorStory: {
    fontFamily: 'CormorantGaramond_Italic',
    fontStyle: 'italic',
    fontSize: 14,
    color: 'rgba(201,171,133,0.6)',
    marginBottom: 28,
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  dot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: '#C9AB85',
    flexShrink: 0,
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontFamily: 'Jost_Regular',
    fontSize: 15,
    color: '#F0ECE4',
    textTransform: 'capitalize',
  },
  regenBtn: {
    marginTop: 24,
    padding: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(155,127,166,0.3)',
    alignItems: 'center',
    borderRadius: 2,
  },
  regenText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#9B7FA6',
  },
});