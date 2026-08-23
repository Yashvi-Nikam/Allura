import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening ✦</Text>
            <Text style={styles.name}>What are we styling today?</Text>
          </View>
          <Text style={styles.logo}>Allura</Text>
        </View>

        {/* Main actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardLarge]}
            onPress={() => router.push('/context')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>✦</Text>
            <Text style={styles.actionTitle}>Plan an Outfit</Text>
            <Text style={styles.actionSub}>For a specific occasion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/wardrobe')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>◈</Text>
            <Text style={styles.actionTitle}>Wardrobe</Text>
            <Text style={styles.actionSub}>View & manage items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/saved')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>♡</Text>
            <Text style={styles.actionTitle}>Saved Outfits</Text>
            <Text style={styles.actionSub}>Your looks, anytime</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>◇</Text>
            <Text style={styles.actionTitle}>Style Insights</Text>
            <Text style={styles.actionSub}>Learn about your style</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming plans */}
        <Text style={styles.sectionLabel}>Upcoming plans</Text>
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

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  scroll: { padding: 24, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    color: '#9B7FA6',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'CormorantGaramond',
    fontSize: 24,
    color: '#F0ECE4',
  },
  logo: {
    fontFamily: 'DancingScript',
    fontSize: 28,
    color: '#C9AB85',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#1E1A2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.12)',
  },
  actionCardLarge: {
    width: '100%',
    backgroundColor: '#2A2438',
    borderColor: 'rgba(201,171,133,0.2)',
  },
  actionIcon: {
    fontSize: 20,
    color: '#C9AB85',
    marginBottom: 12,
  },
  actionTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 18,
    color: '#F0ECE4',
    marginBottom: 4,
  },
  actionSub: {
    fontFamily: 'Jost',
    fontSize: 11,
    color: '#5A5650',
  },
  sectionLabel: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#5A5650',
    marginBottom: 16,
  },
  emptyPlans: {
    backgroundColor: '#1E1A2E',
    borderRadius: 16,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.08)',
    alignItems: 'center',
    gap: 16,
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
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    backgroundColor: '#1E1A2E',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(201,171,133,0.1)',
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