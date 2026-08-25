import {
  View, Text, ScrollView,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function About() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.back, { color: colors.gold }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>About Allura</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={[styles.logoSection, { borderBottomColor: colors.border }]}>
          <Text style={[styles.logo, { color: colors.gold }]}>Allura</Text>
          <Text style={[styles.tagline, { color: colors.gold }]}>Don't guess your style. Know it.</Text>
          <Text style={[styles.version, { color: colors.textMuted }]}>Version 1.0.0 · MVP</Text>
        </View>

        <View style={[styles.section, { borderLeftColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mauve }]}>Our mission</Text>
          <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>Allura was built for every woman who has ever stood in front of a full wardrobe and felt like she had nothing to wear. Who has been told to dress a certain way. Who wants to look good AND feel like herself — at the same time, every time.</Text>
        </View>

        <View style={[styles.section, { borderLeftColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mauve }]}>What makes Allura different</Text>
          <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>Most fashion apps show you trends. Allura learns YOU — your body, your comfort, your culture, your life. It doesn't just tell you what's fashionable. It tells you what works for you, and why.</Text>
        </View>

        <View style={[styles.section, { borderLeftColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mauve }]}>Built with care</Text>
          <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>Allura is built with a deep commitment to body positivity, cultural sensitivity, and emotional safety. No comparisons. No impossible standards. Just you, your clothes, and your confidence.</Text>
        </View>

        <View style={[styles.section, { borderLeftColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mauve }]}>The future of Allura</Text>
          <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>We're just getting started. Coming soon: Image Generation, AR virtual try-on, shopping integration, community style sharing, and a full 3D wardrobe visualization. Allura will grow with you.</Text>
        </View>

        <View style={[styles.creditCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <Text style={[styles.creditTitle, { color: colors.gold }]}>✦ Dark. Elegant. Empowering.</Text>
          <Text style={[styles.creditBody, { color: colors.textMuted }]}>Made with love for every girl who deserves to feel like herself.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16 },
  back: { fontSize: 22 },
  title: { fontFamily: 'CormorantGaramond_Reg', fontSize: 20 },
  scroll: { padding: 24, paddingTop: 8, paddingBottom: 48 },
  logoSection: { alignItems: 'center', marginBottom: 40, paddingVertical: 32, borderBottomWidth: 0.5 },
  logo: { fontFamily: 'DancingScript', fontSize: 52, marginBottom: 8 },
  tagline: { fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic', fontSize: 16, marginBottom: 12 },
  version: { fontFamily: 'Raleway', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' },
  section: { marginBottom: 28, borderLeftWidth: 1, paddingLeft: 16 },
  sectionTitle: { fontFamily: 'Raleway', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  sectionBody: { fontFamily: 'Jost', fontSize: 14, lineHeight: 22 },
  creditCard: { marginTop: 16, borderRadius: 16, padding: 24, borderWidth: 0.5, alignItems: 'center', gap: 8 },
  creditTitle: { fontFamily: 'CormorantGaramond_Reg', fontSize: 20 },
  creditBody: { fontFamily: 'Jost', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});