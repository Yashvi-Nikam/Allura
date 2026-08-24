import {
  View, Text, ScrollView,
  StyleSheet,TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ NEW
const FAQS = [
  {
    q: 'How does Allura generate outfit suggestions?',
    a: 'Allura combines your style profile, wardrobe items, and the context you provide (occasion, vibe, weather) to generate three tailored outfit options using AI.',
  },
  {
    q: 'How do I add clothes to my wardrobe?',
    a: 'Go to Wardrobe → Add Item. You can upload a photo and let Allura identify the piece, or add it manually by selecting category, color, and style.',
  },
  {
    q: 'Can I update my style preferences?',
    a: 'Yes! Go to Profile → Body & Style to edit your style preferences, comfort level, and cultural preferences anytime.',
  },
  {
    q: 'What does the anchor item feature do?',
    a: 'When planning an outfit, you can specify a piece you definitely want to wear (like your favourite heels). Allura will build the entire outfit around that item.',
  },
  {
    q: 'Why did Allura suggest something I don\'t own?',
    a: 'Allura works best with a fuller wardrobe. Add more items so the AI has more to work with. You can also regenerate outfits anytime.',
  },
  {
    q: 'How do I save an outfit?',
    a: 'On the outfit results screen, tap the ♡ Save button. Saved outfits appear in your Looks tab.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. All your data is encrypted and private. We never share or sell your information. See our Privacy Policy for full details.',
  },
];

export default function Help() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.intro}>
          We're here to help. Find answers below or reach out directly.
        </Text>

        <Text style={styles.sectionHeader}>Frequently asked questions</Text>
        {FAQS.map((faq, i) => (
          <View key={i} style={styles.faqCard}>
            <Text style={styles.question}>{faq.q}</Text>
            <Text style={styles.answer}>{faq.a}</Text>
          </View>
        ))}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactBody}>
            Reach out to us directly — we read every message.
          </Text>
          <Text style={styles.contactEmail}>yashvinikam870@gmail.com</Text>
        </View>

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
    fontSize: 17, color: 'rgba(201,171,133,0.8)',
    lineHeight: 26, marginBottom: 32,
  },
  sectionHeader: {
    fontFamily: 'Raleway', fontSize: 9,
    letterSpacing: 3, textTransform: 'uppercase',
    color: '#5A5650', marginBottom: 16,
  },
  faqCard: {
    backgroundColor: '#1E1A2E',
    borderRadius: 12, padding: 18,
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.1)',
    marginBottom: 12,
  },
  question: {
    fontFamily: 'Jost_Medium', fontSize: 14,
    color: '#F0ECE4', marginBottom: 8, lineHeight: 20,
  },
  answer: {
    fontFamily: 'Jost', fontSize: 13,
    color: '#C8C0B4', lineHeight: 20,
  },
  contactCard: {
    marginTop: 24,
    backgroundColor: '#2A2438',
    borderRadius: 16, padding: 24,
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.15)',
    alignItems: 'center', gap: 8,
  },
  contactTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 22, color: '#F0ECE4',
  },
  contactBody: {
    fontFamily: 'Jost', fontSize: 13,
    color: '#5A5650', textAlign: 'center',
  },
  contactEmail: {
    fontFamily: 'Raleway', fontSize: 12,
    letterSpacing: 1, color: '#C9AB85',
    marginTop: 4,
  },
});