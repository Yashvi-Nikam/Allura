import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#13111A" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 80 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>GOOD EVENING ✦</Text>
            <Text style={styles.name}>What are we styling{'\n'}today?</Text>
          </View>
          <Text style={styles.logo}>Al</Text>
        </View>

        {/* Plan an Outfit — full width */}
        <TouchableOpacity
          style={styles.mainCard}
          onPress={() => router.push('/context')}
          activeOpacity={0.8}
        >
          <Text style={styles.mainCardIcon}>✦</Text>
          <Text style={styles.mainCardTitle}>Plan an Outfit</Text>
          <Text style={styles.mainCardSub}>For a specific occasion</Text>
        </TouchableOpacity>

        {/* Grid — 2 columns */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/wardrobe')}
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>◈</Text>
            <Text style={styles.gridTitle}>Wardrobe</Text>
            <Text style={styles.gridSub}>View & manage items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/saved')}
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>♡</Text>
            <Text style={styles.gridTitle}>Saved Outfits</Text>
            <Text style={styles.gridSub}>Your looks, anytime</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
              onPress={() => router.push('/insights' as any)} 
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>◇</Text>
            <Text style={styles.gridTitle}>Style Insights</Text>
            <Text style={styles.gridSub}>Learn about your style</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/wardrobe-add')}
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>+</Text>
            <Text style={styles.gridTitle}>Add Clothes</Text>
            <Text style={styles.gridSub}>Grow your wardrobe</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming plans */}
        <Text style={styles.sectionLabel}>UPCOMING PLANS</Text>
        <View style={styles.emptyPlans}>
          <Text style={styles.emptyText}>
            No upcoming plans yet.{'\n'}Plan an outfit to get started.
          </Text>
          <TouchableOpacity
            style={styles.planBtn}
            onPress={() => router.push('/context')}
          >
            <Text style={styles.planBtnText}>Plan now ✦</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom nav — solid background */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom || 16 }]}>
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
            <Text style={styles.navIcon}>{tab.icon}</Text>
            <Text style={styles.navLabel}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13111A',
  },
  scroll: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  greeting: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 3,
    color: '#9B7FA6',
    marginBottom: 6,
  },
  name: {
    fontFamily: 'CormorantGaramond',
    fontSize: 28,
    color: '#F0ECE4',
    lineHeight: 34,
  },
  logo: {
    fontFamily: 'DancingScript',
    fontSize: 32,
    color: '#C9AB85',
  },
  mainCard: {
    width: '100%',
    backgroundColor: '#2A2438',
    borderRadius: 16,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.25)',
    marginBottom: 12,
  },
  mainCardIcon: {
    fontSize: 22,
    color: '#C9AB85',
    marginBottom: 10,
  },
  mainCardTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 24,
    color: '#F0ECE4',
    marginBottom: 4,
  },
  mainCardSub: {
    fontFamily: 'Jost',
    fontSize: 12,
    color: '#5A5650',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: '#1E1A2E',
    borderRadius: 14,
    padding: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.1)',
  },
  gridIcon: {
    fontSize: 18,
    color: '#C9AB85',
    marginBottom: 10,
  },
  gridTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 17,
    color: '#F0ECE4',
    marginBottom: 3,
  },
  gridSub: {
    fontFamily: 'Jost',
    fontSize: 11,
    color: '#5A5650',
  },
  sectionLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 3,
    color: '#5A5650',
    marginBottom: 12,
  },
  emptyPlans: {
    backgroundColor: '#1E1A2E',
    borderRadius: 14,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.08)',
    alignItems: 'center',
    gap: 14,
  },
  emptyText: {
    fontFamily: 'Jost',
    fontSize: 13,
    color: '#5A5650',
    textAlign: 'center',
    lineHeight: 20,
  },
  planBtn: {
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.3)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  planBtnText: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    color: '#C9AB85',
    textTransform: 'uppercase',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#1E1A2E',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(201,171,133,0.15)',
    paddingTop: 12,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navIcon: {
    fontSize: 18,
    color: '#5A5650',
  },
  navLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 1,
    color: '#5A5650',
    textTransform: 'uppercase',
  },
});