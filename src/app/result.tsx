import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import OutfitCard from '@/components/OutfitCard';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useTheme } from '@/context/ThemeContext';

export default function Results() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { saveOutfit } = useRecommendations();
  const { colors } = useTheme();

  const [saved, setSaved] = useState<string[]>([]);

  const outfits = params.outfits ? JSON.parse(params.outfits as string) : [];
  const [current, setCurrent] = useState(0);
  const outfit = outfits[current];

  const handleSave = async () => {
    if (!outfit?.id) return;

    await saveOutfit(outfit.id, {
      title: outfit.title,
      item_names: outfit.item_names,
      color_story: outfit.color_story,
      why_this_works: outfit.why_this_works,
      comfort_note: outfit.comfort_note,
      style_tags: outfit.style_tags,
    });

    setSaved(prev => [...prev, outfit.id]);
  };

  if (!outfit) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.empty}>
          <Text
            style={[
              styles.emptyText,
              { color: colors.textMuted },
            ]}
          >
            No outfits found. Try again!
          </Text>

          <TouchableOpacity onPress={() => router.back()}>
            <Text
              style={[
                styles.back,
                { color: colors.gold },
              ]}
            >
              ← Go back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text
              style={[
                styles.backArrow,
                { color: colors.gold },
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.counter,
              { color: colors.textMuted },
            ]}
          >
            Look {current + 1} of {outfits.length}
          </Text>

          <TouchableOpacity onPress={() => router.push('/home')}>
            <Text
              style={[
                styles.doneText,
                { color: colors.gold },
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation arrows */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              {
                borderColor: colors.border,
              },
              current === 0 && styles.navBtnDisabled,
            ]}
            onPress={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <Text
              style={[
                styles.navArrow,
                { color: colors.gold },
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>

          <View style={styles.dotsRow}>
            {outfits.map((_: any, i: number) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === current
                        ? colors.gold
                        : colors.border,
                  },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.navBtn,
              {
                borderColor: colors.border,
              },
              current === outfits.length - 1 &&
                styles.navBtnDisabled,
            ]}
            onPress={() =>
              setCurrent(c =>
                Math.min(outfits.length - 1, c + 1)
              )
            }
            disabled={current === outfits.length - 1}
          >
            <Text
              style={[
                styles.navArrow,
                { color: colors.gold },
              ]}
            >
              →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Outfit card */}
        <OutfitCard outfit={outfit} />

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.rejectBtn,
              {
                borderColor: colors.rose,
              },
            ]}
            onPress={() =>
              setCurrent(c =>
                Math.min(outfits.length - 1, c + 1)
              )
            }
          >
            <Text
              style={[
                styles.rejectText,
                { color: colors.rose },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.saveBtn,
              {
                borderColor: colors.gold,
              },
              saved.includes(outfit.id) && {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.gold,
              },
            ]}
            onPress={handleSave}
          >
            <Text
              style={[
                styles.saveBtnText,
                { color: colors.gold },
              ]}
            >
              {saved.includes(outfit.id)
                ? '♡ Saved'
                : '♡ Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextBtn,
              {
                borderColor: colors.gold,
              },
            ]}
            onPress={() =>
              setCurrent(c =>
                Math.min(outfits.length - 1, c + 1)
              )
            }
          >
            <Text
              style={[
                styles.nextText,
                { color: colors.gold },
              ]}
            >
              →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Why this works link */}
        <TouchableOpacity
          style={[
            styles.whyBtn,
            {
              borderColor: colors.border,
            },
          ]}
          onPress={() =>
            router.push({
              pathname: '/outfit-detail',
              params: {
                outfit: JSON.stringify(outfit),
              },
            })
          }
        >
          <Text
            style={[
              styles.whyBtnText,
              { color: colors.mauve },
            ]}
          >
            Why this works for me →
          </Text>
        </TouchableOpacity>

        {/* Style tags */}
        <View style={styles.tagsRow}>
          {outfit.style_tags?.map(
            (tag: string, i: number) => (
              <View
                key={i}
                style={[
                  styles.tag,
                  {
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: colors.textMuted },
                  ]}
                >
                  {tag}
                </Text>
              </View>
            )
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    padding: 24,
    paddingBottom: 48,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },

  emptyText: {
    fontFamily: 'Jost',
    fontSize: 14,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  backArrow: {
    fontSize: 22,
  },

  counter: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  doneText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 1,
  },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  navBtn: {
    padding: 12,
    borderWidth: 0.5,
    borderRadius: 2,
  },

  navBtnDisabled: {
    opacity: 0.3,
  },

  navArrow: {
    fontSize: 16,
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
    marginBottom: 16,
  },

  rejectBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rejectText: {
    fontSize: 18,
  },

  saveBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderWidth: 0.5,
    borderRadius: 2,
  },

  saveBtnText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  nextBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextText: {
    fontSize: 18,
  },

  whyBtn: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 0.5,
    borderRadius: 8,
    marginBottom: 16,
  },

  whyBtnText: {
    fontFamily: 'CormorantGaramond_Italic',
    fontStyle: 'italic',
    fontSize: 15,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 0.5,
  },

  tagText: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'capitalize',
  },

  back: {
    fontFamily: 'Raleway',
    fontSize: 13,
  },
});