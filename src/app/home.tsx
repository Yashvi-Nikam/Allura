import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 80 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.mauve }]}>GOOD EVENING ✦</Text>
            <Text style={[styles.name, { color: colors.text }]}>What are we styling{'\n'}today?</Text>
          </View>
          <Text style={[styles.logo, { color: colors.gold }]}>Allura</Text>
        </View>

        {/* Plan an Outfit — full width */}
        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderFocus }]}
          onPress={() => router.push('/context')}
          activeOpacity={0.8}
        >
          <Text style={[styles.mainCardIcon, { color: colors.gold }]}>✦</Text>
          <Text style={[styles.mainCardTitle, { color: colors.text }]}>Plan an Outfit</Text>
          <Text style={[styles.mainCardSub, { color: colors.textMuted }]}>For a specific occasion</Text>
        </TouchableOpacity>

        {/* Grid — 2 columns */}
        <View style={styles.grid}>
          {[
            { icon: '◈', title: 'Wardrobe',      sub: 'View & manage items',    route: '/wardrobe' },
            { icon: '♡', title: 'Saved Outfits', sub: 'Your looks, anytime',    route: '/saved' },
            { icon: '◇', title: 'Style Insights', sub: 'Learn about your style', route: '/insights' },
            { icon: '+', title: 'Add Clothes',    sub: 'Grow your wardrobe',     route: '/wardrobe-add' },
          ].map(card => (
            <TouchableOpacity
              key={card.title}
              style={[styles.gridCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(card.route as any)}
              activeOpacity={0.8}
            >
              <Text style={[styles.gridIcon, { color: colors.gold }]}>{card.icon}</Text>
              <Text style={[styles.gridTitle, { color: colors.text }]}>{card.title}</Text>
              <Text style={[styles.gridSub, { color: colors.textMuted }]}>{card.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming plans */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>UPCOMING PLANS</Text>
        <View style={[styles.emptyPlans, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No upcoming plans yet.{'\n'}Plan an outfit to get started.
          </Text>
          <TouchableOpacity
            style={[styles.planBtn, { borderColor: colors.borderFocus }]}
            onPress={() => router.push('/context')}
          >
            <Text style={[styles.planBtnText, { color: colors.gold }]}>Plan now ✦</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        paddingBottom: insets.bottom || 16,
      }]}>
        {[
          { label: 'Home',     icon: '⌂', route: '/home' },
          { label: 'Wardrobe', icon: '◈', route: '/wardrobe' },
          { label: 'Looks',    icon: '♡', route: '/saved' },
          { label: 'Profile',  icon: '◇', route: '/profile' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.label}
            style={styles.navTab}
            onPress={() => router.push(tab.route as any)}
          >
            <Text style={[styles.navIcon, { color: colors.textMuted }]}>{tab.icon}</Text>
            <Text style={[styles.navLabel, { color: colors.textMuted }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  headerLeft: { flex: 1, marginRight: 12 },
  greeting: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: 6,
  },
  name: {
    fontFamily: 'CormorantGaramond',
    fontSize: 28,
    lineHeight: 34,
  },
  logo: {
    fontFamily: 'DancingScript',
    fontSize: 28,
    paddingTop: 4,
  },
  mainCard: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    borderWidth: 0.5,
    marginBottom: 12,
  },
  mainCardIcon: { fontSize: 22, marginBottom: 10 },
  mainCardTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 24, marginBottom: 4,
  },
  mainCardSub: { fontFamily: 'Jost', fontSize: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  gridCard: {
    width: CARD_WIDTH,
    borderRadius: 14,
    padding: 18,
    borderWidth: 0.5,
  },
  gridIcon: { fontSize: 18, marginBottom: 10 },
  gridTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 17, marginBottom: 3,
  },
  gridSub: { fontFamily: 'Jost', fontSize: 11 },
  sectionLabel: {
    fontFamily: 'Raleway',
    fontSize: 9, letterSpacing: 3, marginBottom: 12,
  },
  emptyPlans: {
    borderRadius: 14, padding: 24,
    borderWidth: 0.5, alignItems: 'center', gap: 14,
  },
  emptyText: {
    fontFamily: 'Jost', fontSize: 13,
    textAlign: 'center', lineHeight: 20,
  },
  planBtn: {
    borderWidth: 0.5, paddingVertical: 10,
    paddingHorizontal: 24, borderRadius: 2,
  },
  planBtnText: {
    fontFamily: 'Raleway', fontSize: 10,
    letterSpacing: 2, textTransform: 'uppercase',
  },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', borderTopWidth: 0.5, paddingTop: 12,
  },
  navTab: { flex: 1, alignItems: 'center', gap: 4 },
  navIcon: { fontSize: 18 },
  navLabel: {
    fontFamily: 'Raleway', fontSize: 9,
    letterSpacing: 1, textTransform: 'uppercase',
  },
});