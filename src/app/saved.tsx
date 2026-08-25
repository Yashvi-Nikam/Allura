import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import OutfitCard from '@/components/OutfitCard';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

export default function Saved() {
  const router = useRouter();
  const { colors } = useTheme();

  const [tab, setTab] = useState<'all' | 'favorites' | 'upcoming'>('all');
  const [outfits, setOutfits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedOutfits();
  }, []);

  const fetchSavedOutfits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user.id)
        .eq('saved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOutfits = (data || []).map((outfit: any) => ({
        id: outfit.id,
        title: outfit.title || 'Saved Look',
        priority: outfit.priority || 'best_match',
        item_names: outfit.item_names || [],
        color_story: outfit.color_story || 'A look based on your preferences.',
        why_this_works: outfit.rationale || '',
        comfort_note: outfit.comfort_note || 'Comfort prioritized.',
        style_tags: outfit.style_tags || ['personalized'],
        visual_url: outfit.visual_url || null,
      }));

      setOutfits(formattedOutfits);
    } catch (error) {
      console.error('Error fetching saved outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={[
              styles.back,
              { color: colors.gold },
            ]}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          Saved Outfits
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View
        style={[
          styles.tabRow,
          { borderBottomColor: colors.border },
        ]}
      >
        {(['all', 'favorites', 'upcoming'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[
              styles.tab,
              tab === t && {
                borderBottomColor: colors.gold,
              },
            ]}
            onPress={() => setTab(t)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    tab === t
                      ? colors.gold
                      : colors.textMuted,
                },
              ]}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* The List */}
      <FlatList
        data={outfits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <OutfitCard outfit={item} />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text
                style={[
                  styles.emptyOrnament,
                  { color: colors.border },
                ]}
              >
                ♡
              </Text>

              <Text
                style={[
                  styles.emptyTitle,
                  { color: colors.text },
                ]}
              >
                No saved outfits yet
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  { color: colors.textMuted },
                ]}
              >
                Plan an outfit and save the looks you love.
              </Text>

              <TouchableOpacity
                style={[
                  styles.emptyBtn,
                  { borderColor: colors.border },
                ]}
                onPress={() => router.push('/context')}
              >
                <Text
                  style={[
                    styles.emptyBtnText,
                    { color: colors.gold },
                  ]}
                >
                  Plan an outfit ✦
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {/* Bottom nav */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        {[
          { label: 'Home', icon: '⌂', route: '/home' },
          { label: 'Wardrobe', icon: '◈', route: '/wardrobe' },
          { label: 'Looks', icon: '♡', route: '/saved' },
          { label: 'Profile', icon: '◇', route: '/profile' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.label}
            style={styles.navTab}
            onPress={() => router.push(tab.route as any)}
          >
            <Text
              style={[
                styles.navIcon,
                { color: colors.textMuted },
              ]}
            >
              {tab.icon}
            </Text>

            <Text
              style={[
                styles.navLabel,
                { color: colors.textMuted },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },

  back: {
    fontSize: 22,
  },

  title: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 22,
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 0.5,
    marginBottom: 24,
  },

  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: 'transparent',
    marginBottom: -0.5,
  },

  tabText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  listContent: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 100,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 12,
  },

  emptyOrnament: {
    fontSize: 40,
  },

  emptyTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 24,
  },

  emptyText: {
    fontFamily: 'Jost',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  emptyBtn: {
    marginTop: 8,
    borderWidth: 0.5,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 2,
  },

  emptyBtnText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    paddingBottom: 20,
    paddingTop: 12,
  },

  navTab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },

  navIcon: {
    fontSize: 18,
  },

  navLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});