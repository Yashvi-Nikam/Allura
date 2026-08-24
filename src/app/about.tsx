import {
  View, Text, ScrollView,
  StyleSheet,  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ NEW
import { useRouter } from 'expo-router';

export default function About() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>About Allura</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.logoSection}>
          <Text style={styles.logo}>Allura</Text>
          <Text style={styles.tagline}>Don't guess your style. Know it.</Text>
          <Text style={styles.version}>Version 1.0.0 · MVP</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our mission</Text>
          <Text style={styles.sectionBody}>
            Allura was built for every woman who has ever stood in front of a full wardrobe and felt like she had nothing to wear. Who has been told to dress a certain way. Who wants to look good AND feel like herself — at the same time, every time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What makes Allura different</Text>
          <Text style={styles.sectionBody}>
            Most fashion apps show you trends. Allura learns YOU — your body, your comfort, your culture, your life. It doesn't just tell you what's fashionable. It tells you what works for you, and why.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Built with care</Text>
          <Text style={styles.sectionBody}>
            Allura is built with a deep commitment to body positivity, cultural sensitivity, and emotional safety. No comparisons. No impossible standards. Just you, your clothes, and your confidence.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The future of Allura</Text>
          <Text style={styles.sectionBody}>
            We're just getting started. Coming soon: Image Generation, AR virtual try-on, shopping integration, community style sharing, and a full 3D wardrobe visualization. Allura will grow with you.
          </Text>
        </View>

        <View style={styles.creditCard}>
          <Text style={styles.creditTitle}>✦ Dark. Elegant. Empowering.</Text>
          <Text style={styles.creditBody}>
            Made with love for every girl who deserves to feel like herself.
          </Text>
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
  logoSection: {
    alignItems: 'center', marginBottom: 40,
    paddingVertical: 32,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(201,171,133,0.1)',
  },
  logo: {
    fontFamily: 'DancingScript', fontSize: 52,
    color: '#C9AB85', marginBottom: 8,
  },
  tagline: {
    fontFamily: 'CormorantGaramond_Italic', fontStyle: 'italic',
    fontSize: 16, color: 'rgba(201,171,133,0.7)', marginBottom: 12,
  },
  version: {
    fontFamily: 'Raleway', fontSize: 9,
    letterSpacing: 2, color: '#5A5650', textTransform: 'uppercase',
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
  creditCard: {
    marginTop: 16,
    backgroundColor: '#2A2438',
    borderRadius: 16, padding: 24,
    borderWidth: 0.5, borderColor: 'rgba(201,171,133,0.15)',
    alignItems: 'center', gap: 8,
  },
  creditTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 20, color: '#C9AB85',
  },
  creditBody: {
    fontFamily: 'Jost', fontSize: 13,
    color: '#5A5650', textAlign: 'center', lineHeight: 20,
  },
});