import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import ContextChip from '@/components/ContextChip';
import { useRecommendations } from '@/hooks/useRecommendations';
import LoadingState from '@/components/LoadingState';

const OCCASIONS  = ['Café outing', 'College', 'Date night', 'Family event', 'Office', 'Party', 'Travel', 'Wedding'];
const COMPANIONS = ['Friends', 'Family', 'Partner', 'Colleagues', 'Alone', 'Mixed'];
const ACTIVITIES = ['Mostly sitting', 'Walking around', 'Mixed', 'Travelling', 'Dancing'];
const VIBES      = ['Casual', 'Chic', 'Expressive', 'Minimal', 'Traditional', 'Romantic'];
const COMFORT    = ['Comfort first', 'Balanced', 'Style first'];
const WEATHER    = ['Sunny', 'Mild', 'Rainy', 'Cold'];

export default function Context() {
  const router = useRouter();
  const { getRecommendations, loading } = useRecommendations();

  const [occasion,   setOccasion]   = useState('');
  const [companions, setCompanions] = useState('');
  const [activity,   setActivity]   = useState('');
  const [vibe,       setVibe]       = useState('');
  const [comfort,    setComfort]    = useState('');
  const [weather,    setWeather]    = useState('Mild');
  const [anchor,     setAnchor]     = useState('');
  const [notes,      setNotes]      = useState('');

  const handleSubmit = async () => {
    try {
      const outfits = await getRecommendations({
        user_id:       'demo-user-001',
        occasion,
        location_type: occasion,
        companions,
        activity,
        vibe,
        comfort_level: comfort,
        weather:       { condition: weather.toLowerCase(), temperature: 28 },
        additional_notes: notes || anchor,
      });
      router.push({ pathname: '/result', params: { outfits: JSON.stringify(outfits) } });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <LoadingState message="Allura is curating your looks..." />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Where are you going?</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.saveText}>Style me</Text>
          </TouchableOpacity>
        </View>

        <Section label="Occasion">
          <ChipGroup options={OCCASIONS} selected={occasion} onSelect={setOccasion} />
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
            style={styles.input}
            placeholder="e.g. cherry red heels, my new bag..."
            placeholderTextColor="#5A5650"
            value={anchor}
            onChangeText={setAnchor}
          />
        </Section>

        <Section label="Anything else? (optional)">
          <TextInput
            style={[styles.input, styles.inputTall]}
            placeholder="Any other details..."
            placeholderTextColor="#5A5650"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </Section>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Show me outfits ✦</Text>
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

const ChipGroup = ({ options, selected, onSelect }: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) => (
  <View style={styles.chipsWrap}>
    {options.map(o => (
      <ContextChip key={o} label={o} selected={selected === o} onPress={() => onSelect(o)} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  scroll: { padding: 24, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  back: { fontSize: 22, color: '#C9AB85' },
  title: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 20,
    color: '#F0ECE4',
  },
  saveText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 1,
    color: '#C9AB85',
  },
  section: { marginBottom: 28 },
  sectionLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 12,
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  input: {
    backgroundColor: '#1E1A2E',
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 8,
    padding: 14,
    fontFamily: 'Jost',
    fontSize: 14,
    color: '#F0ECE4',
  },
  inputTall: { height: 80, textAlignVertical: 'top' },
  submitBtn: {
    backgroundColor: '#C9AB85',
    padding: 18,
    alignItems: 'center',
    borderRadius: 2,
    marginTop: 8,
  },
  submitText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#13111A',
  },
});