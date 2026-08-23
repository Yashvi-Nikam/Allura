import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import OutfitCard from '@/components/OutfitCard';
import { useRecommendations } from '@/hooks/useRecommendations';

export default function Results() {
  const router  = useRouter();
  const params  = useLocalSearchParams();
  const { saveOutfit } = useRecommendations();
  const [saved, setSaved] = useState<string[]>([]);

  const outfits = params.outfits ? JSON.parse(params.outfits as string) : [];
  const [current, setCurrent] = useState(0);
  const outfit = outfits[current];

  const handleSave = async () => {
    if (!outfit?.id) return;
    await saveOutfit(outfit.id);
    setSaved(prev => [...prev, outfit.id]);
  };

  if (!outfit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No outfits found. Try again!</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.counter}>Look {current + 1} of {outfits.length}</Text>
          <TouchableOpacity onPress={() => router.push('/home')}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation arrows */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, current === 0 && styles.navBtnDisabled]}
            onPress={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <Text style={styles.navArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.dotsRow}>
            {outfits.map((_: any, i: number) => (
              <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.navBtn, current === outfits.length - 1 && styles.navBtnDisabled]}
            onPress={() => setCurrent(c => Math.min(outfits.length - 1, c + 1))}
            disabled={current === outfits.length - 1}
          >
            <Text style={styles.navArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Outfit card */}
        <OutfitCard outfit={outfit} />

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => setCurrent(c => Math.min(outfits.length - 1, c + 1))}
          >
            <Text style={styles.rejectText}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, saved.includes(outfit.id) && styles.saveBtnSaved]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>
              {saved.includes(outfit.id) ? '♡ Saved' : '♡ Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => setCurrent(c => Math.min(outfits.length - 1, c + 1))}
          >
            <Text style={styles.nextText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Why this works link */}
        <TouchableOpacity
          style={styles.whyBtn}
          onPress={() => router.push({
            pathname: '/outfit-detail',
            params: { outfit: JSON.stringify(outfit) }
          })}
        >
          <Text style={styles.whyBtnText}>Why this works for me →</Text>
        </TouchableOpacity>

        {/* Style tags */}
        <View style={styles.tagsRow}>
          {outfit.style_tags?.map((tag: string, i: number) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  scroll: { padding: 24, paddingBottom: 48 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { fontFamily: 'Jost', fontSize: 14, color: '#5A5650' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backArrow: { fontSize: 22, color: '#C9AB85' },
  counter: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    color: '#5A5650',
    textTransform: 'uppercase',
  },
  doneText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 1,
    color: '#C9AB85',
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
    borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 2,
  },
  navBtnDisabled: { opacity: 0.3 },
  navArrow: { fontSize: 16, color: '#C9AB85' },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(201,171,133,0.2)',
  },
  dotActive: { backgroundColor: '#C9AB85' },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  rejectBtn: {
    width: 52, height: 52,
    borderRadius: 26,
    borderWidth: 0.5,
    borderColor: 'rgba(240,153,123,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectText: { fontSize: 18, color: '#F0997B' },
  saveBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.4)',
    borderRadius: 2,
  },
  saveBtnSaved: {
    backgroundColor: 'rgba(201,171,133,0.15)',
    borderColor: '#C9AB85',
  },
  saveBtnText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    color: '#C9AB85',
    textTransform: 'uppercase',
  },
  nextBtn: {
    width: 52, height: 52,
    borderRadius: 26,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { fontSize: 18, color: '#C9AB85' },
  whyBtn: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(155,127,166,0.2)',
    borderRadius: 8,
    marginBottom: 16,
  },
  whyBtnText: {
    fontFamily: 'CormorantGaramond_Italic',
    fontStyle: 'italic',
    fontSize: 15,
    color: '#9B7FA6',
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.15)',
  },
  tagText: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 1,
    color: '#5A5650',
    textTransform: 'capitalize',
  },
  back: { fontFamily: 'Raleway', fontSize: 13, color: '#C9AB85' },
});