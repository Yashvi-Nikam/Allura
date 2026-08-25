import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ContextChip from '@/components/ContextChip';
import { useRecommendations } from '@/hooks/useRecommendations';
import LoadingState from '@/components/LoadingState';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

const OCCASIONS = ['Café outing', 'College', 'Date night', 'Family event', 'Office', 'Party', 'Travel', 'Wedding'];
const LOCATIONS = ['Indoor', 'Outdoor', 'Both'];
const COMPANIONS = ['Friends', 'Family', 'Partner', 'Colleagues', 'Alone', 'Mixed'];
const ACTIVITIES = ['Mostly sitting', 'Walking around', 'Mixed', 'Travelling', 'Dancing'];
const VIBES = ['Casual', 'Chic', 'Expressive', 'Minimal', 'Traditional', 'Romantic'];
const COMFORT = ['Comfort first', 'Balanced', 'Style first'];
const WEATHER = ['Sunny', 'Mild', 'Rainy', 'Cold'];

type RecommendationMode = 'wardrobe' | 'scratch' | 'blend';

const RECOMMENDATION_MODES: { value: RecommendationMode; title: string; description: string; }[] = [
  { value: 'wardrobe', title: 'From my wardrobe', description: 'Build looks using pieces you already own.' },
  { value: 'scratch', title: 'Create from scratch', description: 'Create the complete look independently of your wardrobe.' },
  { value: 'blend', title: 'Blend both', description: 'Use your wardrobe where it works and suggest new pieces where useful.' },
];

export default function Context() {
  const router = useRouter();
  const { colors } = useTheme();
  const { getRecommendations, loading } = useRecommendations();

  const [occasion, setOccasion] = useState('');
  const [locationType, setLocationType] = useState('');
  const [companions, setCompanions] = useState('');
  const [activity, setActivity] = useState('');
  const [vibe, setVibe] = useState('');
  const [comfort, setComfort] = useState('');
  const [weather, setWeather] = useState('Mild');
  const [recommendationMode, setRecommendationMode] = useState<RecommendationMode>('wardrobe');
  const [anchor, setAnchor] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Could not get current user:', userError);
        Alert.alert('Something went wrong', 'We could not identify your account.');
        return;
      }
      if (!user) {
        Alert.alert('Not signed in', 'Please sign in before getting outfit recommendations.');
        return;
      }
      if (!occasion || !locationType || !companions || !activity || !vibe || !comfort || !weather) {
        Alert.alert('Almost there', 'Please select an option for each required section.');
        return;
      }
      const additionalNotes = [anchor ? `Build around: ${anchor}` : '', notes ? `Additional notes: ${notes}` : ''].filter(Boolean).join('. ');
      const outfits = await getRecommendations({
        user_id: user.id,
        recommendation_mode: recommendationMode,
        occasion,
        location_type: locationType,
        companions,
        activity,
        vibe,
        comfort_level: comfort,
        weather: { condition: weather.toLowerCase(), temperature: 28 },
        additional_notes: additionalNotes || undefined,
      });
      router.push({ pathname: '/result', params: { outfits: JSON.stringify(outfits) } });
    } catch (error: any) {
      console.error('Recommendation request failed:', error);
      Alert.alert('Could not create your looks', error?.response?.data?.error || error?.message || 'Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return <LoadingState message={recommendationMode === 'scratch' ? 'Allura is creating your looks...' : recommendationMode === 'blend' ? 'Allura is blending your wardrobe with new ideas...' : 'Allura is curating your looks...'} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.back, { color: colors.gold }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Where are you going?</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles.saveText, { color: colors.gold }]}>Style me</Text>
          </TouchableOpacity>
        </View>

        <Section label="How should Allura style you?">
          <View style={styles.modeContainer}>
            {RECOMMENDATION_MODES.map((mode) => {
              const selected = recommendationMode === mode.value;
              return (
                <TouchableOpacity
                  key={mode.value}
                  style={[styles.modeCard, { borderColor: colors.border }, selected && { backgroundColor: colors.goldDim, borderColor: colors.gold }]}
                  onPress={() => setRecommendationMode(mode.value)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.modeTitle, { color: colors.textSecondary }, selected && { color: colors.gold }]}>{mode.title}</Text>
                  <Text style={[styles.modeDescription, { color: colors.textMuted }]}>{mode.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section label="Occasion">
          <ChipGroup options={OCCASIONS} selected={occasion} onSelect={setOccasion} />
        </Section>
        <Section label="Where will you be?">
          <ChipGroup options={LOCATIONS} selected={locationType} onSelect={setLocationType} />
        </Section>
        <Section label="Who are you with?">
          <ChipGroup options={COMPANIONS} selected={companions} onSelect={setCompanions} />
        </Section>
        <Section label="Activity level">
          <ChipGroup options={ACTIVITIES} selected={activity} onSelect={setActivity} />
        </Section>
        <Section label="Vibe">
          <ChipGroup options={VIBES} selected={vibe} onSelect={setVibe} />
        </Section>
        <Section label="Comfort priority">
          <ChipGroup options={COMFORT} selected={comfort} onSelect={setComfort} />
        </Section>
        <Section label="Weather">
          <ChipGroup options={WEATHER} selected={weather} onSelect={setWeather} />
        </Section>

        <Section label="Anything you want to build around? (optional)">
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="e.g. cherry red heels, my new bag..."
            placeholderTextColor={colors.textMuted}
            value={anchor}
            onChangeText={setAnchor}
          />
        </Section>

        <Section label="Anything else? (optional)">
          <TextInput
            style={[styles.input, styles.inputTall, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Any other details..."
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </Section>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.gold }]} onPress={handleSubmit} disabled={loading}>
          <Text style={[styles.submitText, { color: colors.background }]}>Show me outfits ✦</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionLabel}>{label}</Text>
    {children}
  </View>
);

const ChipGroup = ({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (value: string) => void }) => (
  <View style={styles.chipsWrap}>
    {options.map((option) => (
      <ContextChip key={option} label={option} selected={selected === option} onPress={() => onSelect(option)} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  back: { fontSize: 22 },
  title: { fontFamily: 'CormorantGaramond_Reg', fontSize: 20 },
  saveText: { fontFamily: 'Raleway', fontSize: 11, letterSpacing: 1 },
  section: { marginBottom: 28 },
  sectionLabel: { fontFamily: 'Raleway', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  modeContainer: { gap: 10 },
  modeCard: { padding: 16, borderWidth: 0.5, borderRadius: 8 },
  modeTitle: { fontFamily: 'Raleway', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 },
  modeDescription: { fontFamily: 'Jost', fontSize: 13 },
  input: { borderWidth: 0.5, borderRadius: 8, padding: 14, fontFamily: 'Jost', fontSize: 14 },
  inputTall: { height: 80, textAlignVertical: 'top' },
  submitBtn: { padding: 18, alignItems: 'center', borderRadius: 2, marginTop: 8 },
  submitText: { fontFamily: 'Raleway', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' },
});