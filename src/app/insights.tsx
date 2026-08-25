import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useWardrobe } from '@/hooks/useWardrobe';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

export default function Insights() {
  const router = useRouter();
  const { items, fetchWardrobe, loading } = useWardrobe();
  const [userId, setUserId] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchWardrobe(user.id); 
      }
    };
    getUser();
  }, []);

  const totalItems = items.length;
  const categoryCounts = items.reduce((acc, item) => {
    const cat = item.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colorCounts = items.reduce((acc, item) => {
    const color = item.color || 'unknown';
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const COLOR_MAP: Record<string, string> = {
    'black':      '#1a1a1a',
    'white':      '#f5f5f5',
    'cream':      '#F5F5DC',
    'ivory':      '#FFFFF0',
    'navy blue':  '#001F5B',
    'dark blue':  '#00008B',
    'burgundy':   '#800020',
    'cherry red': '#DC143C',
    'gold':       '#C9AB85',
    'beige':      '#F5F0E8',
    'brown':      '#8B4513',
    'grey':       '#808080',
    'gray':       '#808080',
    'pink':       '#FFC0CB',
    'mauve':      '#9B7FA6',
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.back, { color: colors.gold }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Style Insights</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading your insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.back, { color: colors.gold }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Style Insights</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <Text style={[styles.summaryNumber, { color: colors.gold }]}>{totalItems}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>items in your wardrobe</Text>
        </View>

        {topColors.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.mauve }]}>Your color palette</Text>
            <View style={styles.colorRow}>
              {topColors.map(([color, count], i) => (
                <View key={i} style={styles.colorItem}>
                  <View style={[styles.colorDot, { backgroundColor: COLOR_MAP[color.toLowerCase()] || colors.textMuted }]} />
                  <Text style={[styles.colorName, { color: colors.textSecondary }]}>{color}</Text>
                  <Text style={[styles.colorCount, { color: colors.textMuted }]}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {topCategories.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.mauve }]}>Most worn categories</Text>
            {topCategories.map(([cat, count], i) => (
              <View key={i} style={styles.catRow}>
                <Text style={[styles.catName, { color: colors.text }]}>{cat}</Text>
                <View style={[styles.barBg, { backgroundColor: colors.goldDim }]}>
                  <View style={[styles.barFill, { width: `${(count / totalItems) * 100}%`, backgroundColor: colors.gold }]} />
                </View>
                <Text style={[styles.catCount, { color: colors.textMuted }]}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        {totalItems === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyOrnament, { color: colors.goldDim }]}>◈</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No data yet</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Add items to your wardrobe to see your style insights.</Text>
            <TouchableOpacity style={[styles.emptyBtn, { borderColor: colors.borderFocus }]} onPress={() => router.push('/wardrobe-add' as any)}>
              <Text style={[styles.emptyBtnText, { color: colors.gold }]}>Add clothes ✦</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  back: { fontSize: 22 },
  title: { fontFamily: 'CormorantGaramond_Reg', fontSize: 20 },
  scroll: { padding: 24, paddingBottom: 48 },
  summaryCard: { borderRadius: 20, padding: 32, alignItems: 'center', marginBottom: 24, borderWidth: 0.5 },
  summaryNumber: { fontFamily: 'CormorantGaramond', fontSize: 64, lineHeight: 72 },
  summaryLabel: { fontFamily: 'Raleway', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 },
  section: { borderRadius: 16, padding: 20, borderWidth: 0.5, marginBottom: 16 },
  sectionLabel: { fontFamily: 'Raleway', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorItem: { alignItems: 'center', gap: 6, minWidth: 60 },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  colorName: { fontFamily: 'Jost', fontSize: 10, textAlign: 'center', textTransform: 'capitalize' },
  colorCount: { fontFamily: 'Raleway', fontSize: 9 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  catName: { fontFamily: 'Jost', fontSize: 13, width: 90, textTransform: 'capitalize' },
  barBg: { flex: 1, height: 3, borderRadius: 2 },
  barFill: { height: 3, borderRadius: 2 },
  catCount: { fontFamily: 'Raleway', fontSize: 11, width: 20, textAlign: 'right' },
  emptyState: { alignItems: 'center', padding: 40, gap: 12 },
  emptyOrnament: { fontSize: 40 },
  emptyTitle: { fontFamily: 'CormorantGaramond_Reg', fontSize: 24 },
  emptyText: { fontFamily: 'Jost', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  emptyBtn: { borderWidth: 0.5, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 2, marginTop: 8 },
  emptyBtnText: { fontFamily: 'Raleway', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { fontFamily: 'Jost', fontSize: 16 },
});