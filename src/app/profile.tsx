import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

const MENU_ITEMS = [
  { label: 'Preferences',   icon: '◇' },
  { label: 'Body & Style',  icon: '◈' },
  { label: 'Privacy',       icon: '⊡' },
  { label: 'Help & Support', icon: '?' },
  { label: 'About Allura',  icon: '✦' },
];

export default function Profile() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>✦</Text>
          </View>
          <Text style={styles.userName}>Allura User</Text>
          <TouchableOpacity>
            <Text style={styles.editProfile}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Style insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Your Style Insights</Text>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Style Balance</Text>
            <Text style={styles.insightValue}>Expressive · Classic</Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Top Colors</Text>
            <View style={styles.colorDots}>
              {['#8B1A1A', '#1A1A2E', '#C9AB85', '#F5F5DC', '#9B7FA6'].map((c, i) => (
                <View key={i} style={[styles.colorDot, { backgroundColor: c }]} />
              ))}
            </View>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Most worn</Text>
            <Text style={styles.insightValue}>Tops · Bottoms · Dresses</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                i < MENU_ITEMS.length - 1 && styles.menuItemBorder
              ]}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Log out */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

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
    alignItems: 'center',
    marginBottom: 32,
  },
  back: { fontSize: 22, color: '#C9AB85' },
  title: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#5A5650',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  avatar: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2438',
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { fontSize: 28, color: '#C9AB85' },
  userName: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 24,
    color: '#F0ECE4',
  },
  editProfile: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 1,
    color: '#9B7FA6',
    textTransform: 'uppercase',
  },
  insightsCard: {
    backgroundColor: '#1E1A2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.12)',
    marginBottom: 16,
    gap: 14,
  },
  insightsTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 18,
    color: '#F0ECE4',
    marginBottom: 4,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#5A5650',
  },
  insightValue: {
    fontFamily: 'Jost',
    fontSize: 12,
    color: '#C8C0B4',
  },
  colorDots: { flexDirection: 'row', gap: 6 },
  colorDot: {
    width: 16, height: 16,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  menuCard: {
    backgroundColor: '#1E1A2E',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.12)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  menuItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcon: { fontSize: 16, color: '#9B7FA6', width: 20, textAlign: 'center' },
  menuLabel: {
    fontFamily: 'Jost_Regular',
    fontSize: 14,
    color: '#F0ECE4',
  },
  menuArrow: { fontSize: 20, color: '#5A5650' },
  logoutBtn: {
    alignItems: 'center',
    padding: 16,
  },
  logoutText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    color: '#C97A8A',
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
  navTab: { flex: 1, alignItems: 'center', gap: 4 },
  navIcon: { fontSize: 18, color: '#5A5650' },
  navLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 1,
    color: '#5A5650',
    textTransform: 'uppercase',
  },
});