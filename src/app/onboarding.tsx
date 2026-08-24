import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView,
  TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import ContextChip from '@/components/ContextChip';
import { supabase } from '@/lib/supabase';

const STYLE_OPTIONS   = ['Casual', 'Chic', 'Streetwear', 'Minimalist', 'Ethnic', 'Bohemian', 'Romantic', 'Formal'];
const COMFORT_OPTIONS = ['Modest', 'Balanced', 'Expressive'];
const BODY_OPTIONS    = ['More coverage', 'Defined waist', 'Relaxed silhouette', 'Flowy', 'Structured'];
const CULTURE_OPTIONS = ['Indian-first', 'Western', 'Fusion', 'Occasion-based'];
const SILHOUETTES     = ['Petite', 'Average', 'Tall', 'Plus'];

export default function Onboarding() {
  const router = useRouter();
  const [step,       setStep]      = useState(1);
  const [name,       setName]      = useState('');
  const [silhouette, setSilhouette] = useState('');
  const [styles_,    setStyles]    = useState<string[]>([]);
  const [comfort,    setComfort]   = useState('');
  const [body,       setBody]      = useState<string[]>([]);
  const [culture,    setCulture]   = useState('');
  const [saving,     setSaving]    = useState(false);

  const toggleArray = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const saveAndContinue = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'Please log in first');
        router.replace('/auth');
        return;
      }

      // Prepare profile data matching your schema
      const profileData = {
        id: user.id,
        user_id: user.id,
        display_name: name || user.email?.split('@')[0] || 'Allura User',
        style_preferences: {
          styles: styles_,
          silhouette: silhouette,
        },
        comfort_preferences: {
          level: comfort,
        },
        body_preferences: {
          preferences: body,
          silhouette: silhouette,
        },
        cultural_preferences: {
          style: culture,
        },
        updated_at: new Date().toISOString(),
      };

      // Upsert to profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      // Update user metadata with display name
      await supabase.auth.updateUser({
        data: { display_name: profileData.display_name }
      });

      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
      console.error('Onboarding error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Allura</Text>
          <Text style={styles.stepCount}>Step {step} of 4</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
        </View>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading}>Let's create your{'\n'}style persona ✦</Text>
            <Text style={styles.sub}>
              This helps Allura style outfits that feel like you.
            </Text>

            <Text style={styles.fieldLabel}>What's your name?</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name..."
              placeholderTextColor="#5A5650"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="done"
            />

            <Text style={styles.fieldLabel}>Choose your body silhouette</Text>
            <View style={styles.silouetteRow}>
              {SILHOUETTES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.silouetteBtn,
                    silhouette === s && styles.silouetteBtnActive,
                  ]}
                  onPress={() => setSilhouette(s)}
                  activeOpacity={0.75}
                >
                  <Text style={[
                    styles.silouetteText,
                    silhouette === s && styles.silouetteTextActive,
                  ]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── STEP 2 ── */}
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

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading}>Comfort & coverage ✦</Text>
            <Text style={styles.sub}>How do you like to dress?</Text>

            <Text style={styles.fieldLabel}>Comfort level</Text>
            <View style={styles.chipsWrap}>
              {COMFORT_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={comfort === s}
                  onPress={() => setComfort(s)}
                />
              ))}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 24 }]}>
              Body preferences
            </Text>
            <Text style={styles.fieldHint}>
              These help Allura suggest styles that suit YOUR preferences.
            </Text>
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

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.heading}>Your cultural vibe ✦</Text>
            <Text style={styles.sub}>
              Allura respects your style world — Indian, Western, or anywhere in between.
            </Text>
            <View style={styles.chipsWrap}>
              {CULTURE_OPTIONS.map(s => (
                <ContextChip
                  key={s} label={s}
                  selected={culture === s}
                  onPress={() => setCulture(s)}
                />
              ))}
            </View>

            {/* Summary preview */}
            {name ? (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Looking good, {name}! ✦</Text>
                {styles_.length > 0 && (
                  <Text style={styles.summaryLine}>
                    Style: {styles_.join(', ')}
                  </Text>
                )}
                {comfort ? (
                  <Text style={styles.summaryLine}>Comfort: {comfort}</Text>
                ) : null}
                {silhouette ? (
                  <Text style={styles.summaryLine}>Silhouette: {silhouette}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        )}

        {/* ── Navigation buttons ── */}
        <View style={styles.navRow}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setStep(s => s - 1)}
              activeOpacity={0.75}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, step === 1 && { flex: 1 }]}
            onPress={() => step < 4 ? setStep(s => s + 1) : saveAndContinue()}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Text style={styles.nextText}>
              {saving ? 'Saving...' : step < 4 ? 'Next →' : 'Start styling ✦'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13111A',
  },
  scroll: {
    padding: 24,
    paddingBottom: 48,
  },
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
  stepCount: {
    fontFamily: 'Raleway',
    fontSize: 10,
    letterSpacing: 2,
    color: '#5A5650',
    textTransform: 'uppercase',
  },
  progressBg: {
    height: 1,
    backgroundColor: 'rgba(201,171,133,0.1)',
    marginBottom: 40,
    borderRadius: 1,
  },
  progressFill: {
    height: 1,
    backgroundColor: '#C9AB85',
    borderRadius: 1,
  },
  stepContent: {
    marginBottom: 32,
  },
  heading: {
    fontFamily: 'CormorantGaramond',
    fontSize: 34,
    color: '#F0ECE4',
    lineHeight: 42,
    marginBottom: 8,
  },
  sub: {
    fontFamily: 'Jost',
    fontSize: 14,
    color: '#5A5650',
    marginBottom: 32,
    lineHeight: 22,
  },
  fieldLabel: {
    fontFamily: 'Raleway',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#9B7FA6',
    marginBottom: 12,
  },
  fieldHint: {
    fontFamily: 'Jost',
    fontSize: 12,
    color: '#5A5650',
    marginBottom: 12,
    lineHeight: 18,
  },
  input: {
    backgroundColor: '#1E1A2E',
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.25)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 28,
    fontFamily: 'Jost_Regular',
    fontSize: 15,
    color: '#F0ECE4',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  silouetteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  silouetteBtn: {
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1E1A2E',
  },
  silouetteBtnActive: {
    backgroundColor: 'rgba(201,171,133,0.15)',
    borderColor: '#C9AB85',
  },
  silouetteText: {
    fontFamily: 'Jost_Regular',
    fontSize: 13,
    color: '#C8C0B4',
  },
  silouetteTextActive: {
    color: '#C9AB85',
  },
  summaryCard: {
    marginTop: 32,
    backgroundColor: '#1E1A2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.15)',
    gap: 8,
  },
  summaryTitle: {
    fontFamily: 'CormorantGaramond_Reg',
    fontSize: 20,
    color: '#C9AB85',
    marginBottom: 4,
  },
  summaryLine: {
    fontFamily: 'Jost',
    fontSize: 13,
    color: '#C8C0B4',
    lineHeight: 20,
    textTransform: 'capitalize',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  backBtn: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(201,171,133,0.2)',
    borderRadius: 2,
  },
  backText: {
    fontFamily: 'Raleway',
    fontSize: 11,
    letterSpacing: 1,
    color: '#5A5650',
    textTransform: 'uppercase',
  },
  nextBtn: {
    paddingVertical: 15,
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