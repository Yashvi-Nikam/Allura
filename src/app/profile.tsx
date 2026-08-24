import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Image,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/use-theme';

const MENU_ITEMS = [
  { label: 'Edit Profile',    icon: '✦', route: '/edit-profile' },
  { label: 'Style Insights',  icon: '◇', route: '/insights' },
  { label: 'Body & Style',    icon: '◈', route: '/body-style' },  // ← ADDED THIS
  { label: 'Change password', icon: '🔒', route: '/auth/reset' },
  { label: 'Privacy',         icon: '⊡', route: '/privacy' },
  { label: 'Help & Support',  icon: '?',  route: '/help' },
  { label: 'About Allura',    icon: '✦', route: '/about' },
];

export default function Profile() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();
  const [userName, setUserName] = useState('Allura User');
  const [userEmail, setUserEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserName(user.user_metadata?.display_name || user.email?.split('@')[0] || 'Allura User');
      setUserEmail(user.email || '');
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.back, { color: colors.gold }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textMuted }]}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Avatar section */}
        <View style={styles.avatarSection}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.surfaceElevated }]}>
              <Text style={[styles.avatarText, { color: colors.gold }]}>✦</Text>
            </View>
          )}
          <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
          <Text style={[styles.userEmail, { color: colors.textMuted }]}>{userEmail}</Text>
          <TouchableOpacity onPress={() => router.push('/edit-profile' as any)}>
            <Text style={[styles.editProfile, { color: colors.mauve }]}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Theme toggle */}
        <View style={[styles.themeCard, { 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }]}>
          <View style={styles.themeRow}>
            <Text style={styles.themeIcon}>{isDark ? '🌙' : '☀️'}</Text>
            <Text style={[styles.themeLabel, { color: colors.text }]}>
              {isDark ? 'Dark mode' : 'Light mode'}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: 'rgba(201,171,133,0.2)',
                true: 'rgba(201,171,133,0.4)',
              }}
              thumbColor={isDark ? '#C9AB85' : '#5A5650'}
            />
          </View>
        </View>

        {/* Menu */}
        <View style={[styles.menuCard, { 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }]}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                i < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                i < MENU_ITEMS.length - 1 && { borderBottomColor: colors.border }
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuLeft}>
                <Text style={[styles.menuIcon, { color: colors.mauve }]}>{item.icon}</Text>
                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              </View>
              <Text style={[styles.menuArrow, { color: colors.textMuted }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Log out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={[styles.logoutText, { color: colors.rose }]}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { 
        backgroundColor: colors.surface,
        borderTopColor: colors.border 
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  back: { fontSize: 22 },
  title: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { fontSize: 28 },
  userName: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 24,
  },
  userEmail: {
    fontFamily: 'Jost',
    fontSize: 12,
    marginTop: 2,
  },
  editProfile: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  themeCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    marginBottom: 16,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeIcon: { fontSize: 20 },
  themeLabel: {
    fontFamily: 'Jost_Regular',
    fontSize: 14,
    flex: 1,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 0.5,
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
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  menuLabel: {
    fontFamily: 'Jost_Regular',
    fontSize: 14,
  },
  menuArrow: {
    fontSize: 20,
  },
  logoutBtn: {
    alignItems: 'center',
    padding: 16,
  },
  logoutText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  navIcon: { fontSize: 18 },
  navLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});