import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import WhyThisWorks from '@/components/WhyThisWorks';
import { useTheme } from '@/context/ThemeContext';

export default function OutfitDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const outfit = params.outfit ? JSON.parse(params.outfit as string) : null;
  const { colors } = useTheme();

  if (!outfit) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.back, { color: colors.gold }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textMuted }]}>Outfit breakdown</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Outfit name */}
        <Text style={[styles.outfitTitle, { color: colors.text }]}>{outfit.title}</Text>
        <Text style={[styles.colorStory, { color: colors.gold }]}>{outfit.color_story}</Text>

        {/* Items list */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mauve }]}>The look</Text>
          {outfit.item_names?.map((item: string, i: number) => (
            <View key={i} style={styles.itemRow}>
              <View style={[styles.dot, { backgroundColor: colors.gold }]} />
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item}</Text>
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
        <TouchableOpacity style={[styles.regenBtn, { borderColor: colors.borderFocus }]} onPress={() => router.back()}>
          <Text style={[styles.regenText, { color: colors.mauve }]}>Regenerate looks ✦</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  back: { fontSize: 22 },
  title: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  outfitTitle: {
    fontFamily: 'CormorantGaramond',
    fontSize: 32,
    marginBottom: 6,
  },
  colorStory: {
    fontFamily: 'CormorantGaramond_Italic',
    fontStyle: 'italic',
    fontSize: 14,
    marginBottom: 28,
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
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
    flexShrink: 0,
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontFamily: 'Jost_Regular',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  regenBtn: {
    marginTop: 24,
    padding: 18,
    borderWidth: 0.5,
    alignItems: 'center',
    borderRadius: 2,
  },
  regenText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});