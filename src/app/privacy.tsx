import {
  View, Text, ScrollView,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const SECTIONS = [
  { title: 'What we collect', body: `Allura collects only what you choose to share — your name, style preferences, wardrobe items, and outfit feedback. We do not collect sensitive personal data without your explicit consent.` },
  { title: 'How we use your data', body: `Your data is used exclusively to generate personalized outfit recommendations. We never use your data for advertising, and we never sell it to third parties. Ever.` },
  { title: 'Your wardrobe photos', body: `Photos you upload are stored securely and are only accessible to you. They are used solely for AI-assisted clothing analysis. You can delete any photo at any time from your wardrobe.` },
  { title: 'AI recommendations', body: `Outfit suggestions are generated using your profile, wardrobe, and context. All AI processing happens on secure servers. Allura does not store your conversations with the AI.` },
  { title: 'Your rights', body: `You have the right to access, correct, or delete your data at any time. To delete your account and all associated data, go to Profile → Settings → Delete Account. We will process your request within 30 days.` },
  { title: 'Data security', body: `All data is encrypted in transit (TLS) and at rest. We use row-level security so your data is never accessible to other users. We follow industry-standard security practices.` },
  { title: 'Contact', body: `Questions about your privacy? Reach us at privacy@allura.app — we'll respond within 48 hours.` },
];

export default function Privacy() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.back, { color: colors.gold }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.intro, { color: colors.gold }]}>Allura is built on trust. Your style is personal — and so is your data.</Text>
        {SECTIONS.map((s, i) => (
          <View key={i} style={[styles.section, { borderLeftColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.mauve }]}>{s.title}</Text>
            <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>{s.body}</Text>
          </View>
        ))}
        <Text style={[styles.footer, { color: colors.textMuted }]}>Last updated: August 2026</Text>
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
  intro: { fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic', fontSize: 18, lineHeight: 28, marginBottom: 32 },
  section: { marginBottom: 28, borderLeftWidth: 1, paddingLeft: 16 },
  sectionTitle: { fontFamily: 'Raleway', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  sectionBody: { fontFamily: 'Jost', fontSize: 14, lineHeight: 22 },
  footer: { fontFamily: 'Raleway', fontSize: 10, letterSpacing: 1, textAlign: 'center', marginTop: 16 },
});