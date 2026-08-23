import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import ContextChip from '@/components/ContextChip';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STYLE_OPTIONS   = ['Casual', 'Chic', 'Streetwear', 'Minimalist', 'Ethnic', 'Bohemian', 'Romantic', 'Formal'];
const COMFORT_OPTIONS = ['Modest', 'Balanced', 'Expressive'];
const BODY_OPTIONS    = ['More coverage', 'Defined waist', 'Relaxed silhouette', 'Flowy', 'Structured'];
const CULTURE_OPTIONS = ['Indian-first', 'Western', 'Fusion', 'Occasion-based'];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep]     = useState(1);
  const [name, setName]     = useState('');
  const [styles_, setStyles] = useState<string[]>([]);
  const [comfort, setComfort] = useState('');
  const [body, setBody]     = useState<string[]>([]);
  const [culture, setCulture] = useState('');

  const toggleArray = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const saveAndContinue = async () => {
    const profile = {
      user_id: 'demo-user-001',
      display_name: name || 'Allura User',
      style_preferences:   { styles: styles_ },
      comfort_preferences: { level: comfort },
      body_preferences:    { preferences: body },
      cultural_preferences: { style: culture },
    };
    await AsyncStorage.setItem('allura_profile', JSON.stringify(profile));
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Allura</Text>
          <Text style={styles.step}>Step {step} of 4</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
        </View>

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading}>Let's create your{'\n'}style persona ✦</Text>
            <Text style={styles.sub}>This helps Allura style outfits that feel like you.</Text>

            <Text style={styles.label}>What's your name?</Text>
            <View style={styles.inputBox}>
              <Text
                style={[styles.inputText, !name && styles.placeholder]}
                onPress={() => {}}
              >
                {name || 'Your name...'}
              </Text>
            </View>

            <Text style={styles.label}>Choose your body silhouette</Text>
            <View style={styles.silouetteRow}>
              {['Petite', 'Average', 'Tall', 'Plus'].map(s => (
                <TouchableOpacity key={s} style={styles.silouetteBtn}>
                  <Text style={styles.silouetteText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading}>Your style ✦</Text>
            <Text style={styles.sub}>Pick all that feel like you.</Text>
            <View style={styles.chipsWrap}>
              {STYLE_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={styles_.includes(s)}
                  onPress={() => toggleArray(styles_, s, setStyles)}
                />
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading}>Comfort & coverage ✦</Text>
            <Text style={styles.sub}>How do you like to dress?</Text>
            <View style={styles.chipsWrap}>
              {COMFORT_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={comfort === s}
                  onPress={() => setComfort(s)}
                />
              ))}
            </View>
            <Text style={[styles.label, { marginTop: 24 }]}>Body preferences</Text>
            <View style={styles.chipsWrap}>
              {BODY_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={body.includes(s)}
                  onPress={() => toggleArray(body, s, setBody)}
                />
              ))}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading}>Your cultural vibe ✦</Text>
            <Text style={styles.sub}>Allura respects your style world.</Text>
            <View style={styles.chipsWrap}>
              {CULTURE_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={culture === s}
                  onPress={() => setCulture(s)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navRow}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setStep(s => s - 1)}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => step < 4 ? setStep(s => s + 1) : saveAndContinue()}
          >
            <Text style={styles.nextText}>
              {step < 4 ? 'Next' : 'Start styling ✦'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13111A' },
  scroll: { padding: 24, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontFamily: 'DancingScript',
    fontSize: 28,
    color: '#C9AB85',
  },
  step: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    color: '#5A5650',
    textTransform: 'uppercase',
  },
  progressBg: {
    height: 1,
    backgroundColor: 'rgba(201,171,133,0.1)',
    marginBottom: 40,
  },
  progressFill: {
    height: 1,
    backgroundColor: '#C9AB85',
  },
  stepContent: { marginBottom: 32 },
  heading: {
    fontFamily: 'CormorantGaramond',
    fontSize: 32,
    color: '#F0ECE4',
    lineHeight: 40,
    marginBottom: 8,
  },
  sub: {
    fontFamily: 'Jost',
    fontSize: 14,
    color: '#5A5650',
    marginBottom: 28,
    lineHeight: 20,
  },
  label: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 12,
  },
  inputBox: {
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.25)',
    borderRadius: 8,
    padding: 14,
    marginBottom: 24,
    backgroundColor: '#1E1A2E',
  },
  inputText: {
    fontFamily: 'Jost_Regular',
    fontSize: 15,
    color: '#F0ECE4',
  },
  placeholder: { color: '#5A5650' },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  silouetteRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  silouetteBtn: {
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.25)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#1E1A2E',
  },
  silouetteText: {
    fontFamily: 'Jost',
    fontSize: 13,
    color: '#C8C0B4',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  backBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 2,
  },
  backText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    color: '#5A5650',
    textTransform: 'uppercase',
  },
  nextBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#C9AB85',
    borderRadius: 2,
  },
  nextText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 2,
    color: '#13111A',
    textTransform: 'uppercase',
  },
});