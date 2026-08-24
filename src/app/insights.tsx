import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet,
  SafeAreaView, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useWardrobe } from '@/hooks/useWardrobe';
import { supabase } from '@/lib/supabase';

export default function Insights() {
  const router = useRouter();
  const { items, fetchWardrobe, loading } = useWardrobe();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchWardrobe(user.id); // ← Use real user ID, not "demo-user-001"
      }
    };
    getUser();
  }, []);

  // Calculate real stats from wardrobe
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

  const topColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Style Insights</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Style Insights</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Wardrobe summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalItems}</Text>
          <Text style={styles.summaryLabel}>items in your wardrobe</Text>
        </View>

        {/* Top colors */}
        {topColors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your color palette</Text>
            <View style={styles.colorRow}>
              {topColors.map(([color, count], i) => (
                <View key={i} style={styles.colorItem}>
                  <View style={[
                    styles.colorDot,
                    { backgroundColor: COLOR_MAP[color.toLowerCase()] || '#5A5650' }
                  ]} />
                  <Text style={styles.colorName}>{color}</Text>
                  <Text style={styles.colorCount}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Category breakdown */}
        {topCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Most worn categories</Text>
            {topCategories.map(([cat, count], i) => (
              <View key={i} style={styles.catRow}>
                <Text style={styles.catName}>{cat}</Text>
                <View style={styles.barBg}>
                  <View style={[
                    styles.barFill,
                    { width: `${(count / totalItems) * 100}%` }
                  ]} />
                </View>
                <Text style={styles.catCount}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty state */}
        {totalItems === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyOrnament}>◈</Text>
            <Text style={styles.emptyTitle}>No data yet</Text>
            <Text style={styles.emptyText}>
              Add items to your wardrobe to see your style insights.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/wardrobe-add' as any)}
            >
              <Text style={styles.emptyBtnText}>Add clothes ✦</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 24,
  },
  back: { fontSize: 22, color: '#C9AB85' },
  title: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 20, color: '#F0ECE4',
  },
  scroll: { padding: 24, paddingBottom: 48 },
  summaryCard: {
    backgroundColor: '#2A2438',
    borderRadius: 20, padding: 32,
    alignItems: 'center', marginBottom: 24,
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.15)',
  },
  summaryNumber: {
    fontFamily: 'CormorantGaramond',
    fontSize: 64, color: '#C9AB85', lineHeight: 72,
  },
  summaryLabel: {
    fontFamily: 'Raleway', fontSize: 10,
    letterSpacing: 2, textTransform: 'uppercase',
    color: '#5A5650', marginTop: 4,
  },
  section: {
    backgroundColor: '#1E1A2E',
    borderRadius: 16, padding: 20,
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.1)',
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: 'Raleway', fontSize: 9,
    letterSpacing: 2, textTransform: 'uppercase',
    color: '#9B7FA6', marginBottom: 16,
  },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorItem: { alignItems: 'center', gap: 6, minWidth: 60 },
  colorDot: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)',
  },
  colorName: {
    fontFamily: 'Jost', fontSize: 10,
    color: '#C8C0B4', textAlign: 'center',
    textTransform: 'capitalize',
  },
  colorCount: {
    fontFamily: 'Raleway', fontSize: 9,
    color: '#5A5650',
  },
  catRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 12,
  },
  catName: {
    fontFamily: 'Jost', fontSize: 13,
    color: '#F0ECE4', width: 90,
    textTransform: 'capitalize',
  },
  barBg: {
    flex: 1, height: 3,
    backgroundColor: 'rgba(201,171,133,0.1)',
    borderRadius: 2,
  },
  barFill: {
    height: 3, backgroundColor: '#C9AB85',
    borderRadius: 2,
  },
  catCount: {
    fontFamily: 'Raleway', fontSize: 11,
    color: '#5A5650', width: 20, textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center', padding: 40, gap: 12,
  },
  emptyOrnament: { fontSize: 40, color: 'rgba(201,171,133,0.2)' },
  emptyTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 24, color: '#F0ECE4',
  },
  emptyText: {
    fontFamily: 'Jost', fontSize: 14,
    color: '#5A5650', textAlign: 'center', lineHeight: 22,
  },
  emptyBtn: {
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.3)',
    paddingVertical: 12, paddingHorizontal: 28, borderRadius: 2,
    marginTop: 8,
  },
  emptyBtnText: {
    fontFamily: 'Raleway', fontSize: 10,
    letterSpacing: 2, color: '#C9AB85', textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontFamily: 'Jost',
    fontSize: 16,
    color: '#5A5650',
  },
});