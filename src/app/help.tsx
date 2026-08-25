import {
  View, Text, ScrollView,
  StyleSheet,TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

const FAQS = [
  { q: 'How does Allura generate outfit suggestions?', a: 'Allura combines your style profile, wardrobe items, and the context you provide (occasion, vibe, weather) to generate three tailored outfit options using AI.' },
  { q: 'How do I add clothes to my wardrobe?', a: 'Go to Wardrobe → Add Item. You can upload a photo and let Allura identify the piece, or add it manually by selecting category, color, and style.' },
  { q: 'Can I update my style preferences?', a: 'Yes! Go to Profile → Body & Style to edit your style preferences, comfort level, and cultural preferences anytime.' },
  { q: 'What does the anchor item feature do?', a: 'When planning an outfit, you can specify a piece you definitely want to wear (like your favourite heels). Allura will build the entire outfit around that item.' },
  { q: 'Why did Allura suggest something I don\'t own?', a: 'Allura works best with a fuller wardrobe. Add more items so the AI has more to work with. You can also regenerate outfits anytime.' },
  { q: 'How do I save an outfit?', a: 'On the outfit results screen, tap the ♡ Save button. Saved outfits appear in your Looks tab.' },
  { q: 'Is my data safe?', a: 'Yes. All your data is encrypted and private. We never share or sell your information. See our Privacy Policy for full details.' },
];

export default function Help() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.back, { color: colors.gold }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={[styles.intro, { color: colors.gold }]}>We're here to help. Find answers below or reach out directly.</Text>

        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>Frequently asked questions</Text>
        {FAQS.map((faq, i) => (
          <View key={i} style={[styles.faqCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.question, { color: colors.text }]}>{faq.q}</Text>
            <Text style={[styles.answer, { color: colors.textSecondary }]}>{faq.a}</Text>
          </View>
        ))}

        <View style={[styles.contactCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>Still need help?</Text>
          <Text style={[styles.contactBody, { color: colors.textMuted }]}>Reach out to us directly — we read every message.</Text>
          <Text style={[styles.contactEmail, { color: colors.gold }]}>yashvinikam870@gmail.com</Text>
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
  intro: { fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic', fontSize: 17, lineHeight: 26, marginBottom: 32 },
  sectionHeader: { fontFamily: 'Raleway', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 },
  faqCard: { borderRadius: 12, padding: 18, borderWidth: 0.5, marginBottom: 12 },
  question: { fontFamily: 'Jost_Medium', fontSize: 14, marginBottom: 8, lineHeight: 20 },
  answer: { fontFamily: 'Jost', fontSize: 13, lineHeight: 20 },
  contactCard: { marginTop: 24, borderRadius: 16, padding: 24, borderWidth: 0.5, alignItems: 'center', gap: 8 },
  contactTitle: { fontFamily: 'CormorantGaramond_Reg', fontSize: 22 },
  contactBody: { fontFamily: 'Jost', fontSize: 13, textAlign: 'center' },
  contactEmail: { fontFamily: 'Raleway', fontSize: 12, letterSpacing: 1, marginTop: 4 },
});