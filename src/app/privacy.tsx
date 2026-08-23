import {
  View, Text, ScrollView,
  StyleSheet, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const SECTIONS = [
  {
    title: 'What we collect',
    body: `Allura collects only what you choose to share — your name, style preferences, wardrobe items, and outfit feedback. We do not collect sensitive personal data without your explicit consent.`,
  },
  {
    title: 'How we use your data',
    body: `Your data is used exclusively to generate personalized outfit recommendations. We never use your data for advertising, and we never sell it to third parties. Ever.`,
  },
  {
    title: 'Your wardrobe photos',
    body: `Photos you upload are stored securely and are only accessible to you. They are used solely for AI-assisted clothing analysis. You can delete any photo at any time from your wardrobe.`,
  },
  {
    title: 'AI recommendations',
    body: `Outfit suggestions are generated using your profile, wardrobe, and context. All AI processing happens on secure servers. Allura does not store your conversations with the AI.`,
  },
  {
    title: 'Your rights',
    body: `You have the right to access, correct, or delete your data at any time. To delete your account and all associated data, go to Profile → Settings → Delete Account. We will process your request within 30 days.`,
  },
  {
    title: 'Data security',
    body: `All data is encrypted in transit (TLS) and at rest. We use row-level security so your data is never accessible to other users. We follow industry-standard security practices.`,
  },
  {
    title: 'Contact',
    body: `Questions about your privacy? Reach us at privacy@allura.app — we'll respond within 48 hours.`,
  },
];

export default function Privacy() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Allura is built on trust. Your style is personal — and so is your data.
        </Text>
        {SECTIONS.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}
        <Text style={styles.footer}>Last updated: August 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 24, paddingBottom: 16,
  },
  back: { fontSize: 22, color: '#C9AB85' },
  title: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 20, color: '#F0ECE4',
  },
  scroll: { padding: 24, paddingTop: 8, paddingBottom: 48 },
  intro: {
    fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic',
    fontSize: 18, color: 'rgba(201,171,133,0.8)',
    lineHeight: 28, marginBottom: 32,
  },
  section: {
    marginBottom: 28,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(201,171,133,0.15)',
    paddingLeft: 16,
  },
  sectionTitle: {
    fontFamily: 'Raleway', fontSize: 10,
    letterSpacing: 2, textTransform: 'uppercase',
    color: '#9B7FA6', marginBottom: 8,
  },
  sectionBody: {
    fontFamily: 'Jost', fontSize: 14,
    color: '#C8C0B4', lineHeight: 22,
  },
  footer: {
    fontFamily: 'Raleway', fontSize: 10,
    letterSpacing: 1, color: '#5A5650',
    textAlign: 'center', marginTop: 16,
  },
});